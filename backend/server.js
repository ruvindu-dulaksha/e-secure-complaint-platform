import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import { securityHeaders, generalLimiter, authLimiter } from './middleware/security.js';
import admin from './config/firebase-admin.js';
import complaintsRouter from './routes/complaints.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/users.js';
import resetRouter from './routes/reset.js';

dotenv.config(); // ✅ Load environment variables

const app = express();

/* -------------------------------------------------------------------------- */
/*                        ✅ Global Security Middleware                        */
/* -------------------------------------------------------------------------- */
app.use(securityHeaders);
app.use(compression());
app.use(cookieParser(process.env.COOKIE_SECRET));

/* -------------------------------------------------------------------------- */
/*                        ✅ CORS Configuration (Fixed)                        */
/* -------------------------------------------------------------------------- */
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // ✅ Allow cookies & auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // ✅ Apply CORS Middleware
app.options('*', cors(corsOptions)); // ✅ Explicitly Handle OPTIONS Requests

/* -------------------------------------------------------------------------- */
/*                     ✅ Body Parser with Enhanced Security                    */
/* -------------------------------------------------------------------------- */
app.use(express.json({ 
  limit: process.env.MAX_FILE_SIZE || '5mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));

/* -------------------------------------------------------------------------- */
/*                     ✅ Apply Rate Limiters (Fixed Order)                    */
/* -------------------------------------------------------------------------- */
app.use(generalLimiter);
app.use('/api/auth', authLimiter);

/* -------------------------------------------------------------------------- */
/*                     ✅ Authentication Middleware (Fixed)                    */
/* -------------------------------------------------------------------------- */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (Date.now() >= decodedToken.exp * 1000) {
      return res.status(401).json({ error: 'Token expired' });
    }

    

    const userProfile = await admin.firestore()
      .collection('profiles')
      .doc(decodedToken.uid)
      .get();

    if (!userProfile.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    req.user = {
      ...decodedToken,
      profile: userProfile.data(),
    };
    next();
  } catch (error) {
    
    res.status(401).json({ error: 'Authentication failed' });
  }
};

/* -------------------------------------------------------------------------- */
/*                           ✅ Test Route (Debugging)                          */
/* -------------------------------------------------------------------------- */
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

/* -------------------------------------------------------------------------- */
/*                           ✅ API Route Handlers                             */
/* -------------------------------------------------------------------------- */
app.use('/api/auth', authRouter);
app.use('/api/complaints', authenticateUser, complaintsRouter);
app.use('/api/users', authenticateUser, userRouter);
app.use('/api/reset', resetRouter);


/* -------------------------------------------------------------------------- */
/*                       ✅ Enhanced Error Handling Middleware                  */
/* -------------------------------------------------------------------------- */
app.use((err, req, res, next) => {
  

  let statusCode = 500;
  let errorResponse = { error: 'Internal Server Error', message: 'Something went wrong' };

  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse = { error: 'Validation Error', message: err.message };
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorResponse = { error: 'Unauthorized', message: 'Invalid token or no token provided' };
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    errorResponse = { error: 'File Size Error', message: 'File size exceeds limit' };
  } else if (err.message === 'Not allowed by CORS') {
    statusCode = 403;
    errorResponse = { error: 'CORS Error', message: 'Origin not allowed' };
  } else if (process.env.NODE_ENV !== 'production') {
    errorResponse.message = err.message;
  }

  res.status(statusCode).json(errorResponse);
});

/* -------------------------------------------------------------------------- */
/*                           ✅ Server Initialization                          */
/* -------------------------------------------------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌎 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
