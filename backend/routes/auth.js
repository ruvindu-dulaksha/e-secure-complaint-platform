import express from 'express';
import { body, validationResult } from 'express-validator';
import admin from '../config/firebase-admin.js';
import sanitizeHtml from 'sanitize-html';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// ✅ Rate limiter for authentication (prevents brute force attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// ✅ Nodemailer Transporter (Uses environment variables)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Generate OTP function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Store OTPs temporarily (Use Redis for production)
const otpStore = new Map();

/* -------------------------------------------------------------------------- */
/*                          🚀 Signup Route (Register)                         */
/* -------------------------------------------------------------------------- */
router.post('/signup', [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').isLength({ min: 16 }).withMessage('Password must be at least 16 characters long'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;
    const sanitizedEmail = sanitizeHtml(email.toLowerCase());
    const sanitizedFirstName = sanitizeHtml(firstName);
    const sanitizedLastName = sanitizeHtml(lastName);

    // ✅ Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: sanitizedEmail,
      password,
      displayName: `${sanitizedFirstName} ${sanitizedLastName}`,
    });

    // ✅ Create user profile in Firestore
    const userProfileRef = admin.firestore().collection('profiles').doc(userRecord.uid);
    await userProfileRef.set({
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      email: sanitizedEmail,
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: 'User successfully registered',
      user: {
        id: userRecord.uid,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        email: sanitizedEmail,
        role: 'user',
      },
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Failed to register user', details: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                      🚀 Login Route (Send OTP via Email)                    */
/* -------------------------------------------------------------------------- */
router.post('/login', authLimiter, [
  body('email').trim().isEmail().normalizeEmail(),
  body('password').isLength({ min: 16 }).withMessage('Password must be at least 16 characters long'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const sanitizedEmail = sanitizeHtml(email.toLowerCase());
    
    // ✅ Authenticate with Firebase Authentication REST API
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    const { localId } = response.data;
    const userRecord = await admin.auth().getUserByEmail(sanitizedEmail);
    const token = await admin.auth().createCustomToken(userRecord.uid);

    // ✅ Generate and store OTP (expires in 10 minutes)
    const otp = generateOTP();
    otpStore.set(sanitizedEmail, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    // ✅ Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: sanitizedEmail,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
    });

    res.json({ message: 'OTP sent to email, please verify', email: sanitizedEmail });
  } catch (error) {
    
    res.status(401).json({ message: 'Invalid credentials', details: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                    🚀 Verify OTP Route (Complete Login)                     */
/* -------------------------------------------------------------------------- */
router.post('/verify-otp', [
  body('email').trim().isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, password } = req.body;
    const sanitizedEmail = sanitizeHtml(email.toLowerCase());

   // ✅ Retrieve and validate OTP
const storedOTP = otpStore.get(sanitizedEmail);
if (!storedOTP || storedOTP.otp !== otp || Date.now() > storedOTP.expiresAt) {
  return res.status(400).json({ message: 'Invalid or expired OTP' });
}

// ✅ Remove OTP from store after verification
otpStore.delete(sanitizedEmail);

// ✅ Get user data from Firebase Authentication
const userRecord = await admin.auth().getUserByEmail(sanitizedEmail);
const customToken = await admin.auth().createCustomToken(userRecord.uid);

// Exchange the custom token for an ID token
const idTokenResponse = await axios.post(
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_API_KEY}`,
  { token: customToken, returnSecureToken: true }
);

const idToken = idTokenResponse.data.idToken;

// ✅ Retrieve additional user profile details from Firestore
const userProfileRef = admin.firestore().collection('profiles').doc(userRecord.uid);
const userDoc = await userProfileRef.get();
const userData = userDoc.data();

// ✅ Store token securely in HTTP-only cookies
res.cookie('token', idToken, { // ✅ Correct variable name
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// ✅ Return response with token and user details
res.json({
  message: 'OTP verified, login successful',
  token: idToken, // ✅ Return ID token instead
  user: {
    id: userRecord.uid,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: sanitizedEmail,
    role: userData.role,
  },
});

  } catch (error) {
    
    res.status(500).json({ message: 'Failed to verify OTP', details: error.message });
  }
});


router.post('/verify', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Missing token' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userProfileRef = admin.firestore().collection('profiles').doc(decodedToken.uid);
    const userDoc = await userProfileRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({ user: userDoc.data() });
  } catch (error) {
    
    res.status(500).json({ error: 'Token verification failed' });
  }
});

//create manager route
router.post('/auth/create-manager', [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').isLength({ min: 16 }).withMessage('Password must be at least 16 characters long'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
], async (req, res) => {


  
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract and sanitize inputs
    const { email, password, firstName, lastName } = req.body;
    const sanitizedEmail = sanitizeHtml(email.toLowerCase());
    const sanitizedFirstName = sanitizeHtml(firstName);
    const sanitizedLastName = sanitizeHtml(lastName);

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: sanitizedEmail,
      password,
      displayName: `${sanitizedFirstName} ${sanitizedLastName}`,
    });

    // Assign custom claims (role = manager)
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'manager' });

    // Save user profile in Firestore
    const userProfileRef = admin.firestore().collection('profiles').doc(userRecord.uid);
    await userProfileRef.set({
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      email: sanitizedEmail,
      role: 'manager',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Respond with success
    res.status(201).json({
      message: 'Manager successfully created',
      user: {
        id: userRecord.uid,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        email: sanitizedEmail,
        role: 'manager',
      },
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Failed to create manager', details: error.message });
  }
});





export default router;
