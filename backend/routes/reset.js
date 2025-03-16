import express from 'express';
import admin from '../config/firebase-admin.js';

const router = express.Router();
const db = admin.firestore();

import nodemailer from "nodemailer";

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// netsh advfirewall firewall add rule name="Allow Gmail SMTP" dir=out action=allow protocol=TCP localport=587
// telnet smtp.gmail.com 587



// Function to send email
 const sendResetEmail = async (email, resetLink) => {
   await transporter.sendMail({
    from: '"Your App Name" <your-email@gmail.com>',
     to: email,
     subject: "Password Reset Request",
     text: `Click the link to reset your password: ${resetLink}`,
     html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
   });
 };


router.post("/reset-password", async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      // Generate password reset link
      const resetLink = await admin.auth().generatePasswordResetLink(email);
  
      // TODO: Send the reset link via email (use Nodemailer or any email service)
      

      const mailOptions = {
        from: '"Your App Name" <your-email@gmail.com>',
        to: email,
        subject: "Password Reset Request",
        text: `Click the link to reset your password: ${resetLink}`,
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      }

      const resetres = await transporter.sendMail(mailOptions);

     
  
      return res.status(200).json({ message: "Password reset email sent", resetLink });
    } catch (error) {
      
      return res.status(500).json({ message: "Failed to send password reset email", error });
    }
  });
  

  export default router;