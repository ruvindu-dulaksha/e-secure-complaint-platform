import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import { fileTypeFromBuffer } from 'file-type';
import admin from '../config/firebase-admin.js'; // ✅ Ensure Firebase Admin is correctly imported

/* -------------------------------------------------------------------------- */
/*                          🚀 Rate Limiting Configuration                      */
/* -------------------------------------------------------------------------- */

// ✅ Limits login attempts to prevent brute force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // ✅ Skips counting successful requests
});

// ✅ General rate limiter for all API requests
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

/* -------------------------------------------------------------------------- */
/*                       🚀 Security Headers Configuration                      */
/* -------------------------------------------------------------------------- */
export const securityHeaders = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }),
  xss(),
];

/* -------------------------------------------------------------------------- */
/*                   🚀 Enhanced File Upload Validation Middleware              */
/* -------------------------------------------------------------------------- */
export const fileUploadConfig = {
  limits: {
    fileSize: 5 * 1024 * 1024, // ✅ 5MB file size limit
  },
  fileFilter: async (req, file, cb) => {
    try {
      const buffer = file.buffer;
      const fileType = await fileTypeFromBuffer(buffer);

      // ✅ Allowed MIME types
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!fileType || !allowedTypes.includes(fileType.mime)) {
        return cb(new Error('Invalid file type'), false);
      }

      // ✅ Additional security checks for file integrity
      const magicNumbers = {
        'image/jpeg': [0xff, 0xd8, 0xff],
        'image/png': [0x89, 0x50, 0x4e, 0x47],
        'image/gif': [0x47, 0x49, 0x46],
        'application/pdf': [0x25, 0x50, 0x44, 0x46],
      };

      const fileHeader = Array.from(buffer.slice(0, 4));
      const isValidHeader = Object.values(magicNumbers).some((header) =>
        header.every((byte, index) => byte === fileHeader[index])
      );

      if (!isValidHeader) {
        return cb(new Error('Invalid file content'), false);
      }

      cb(null, true);
    } catch (error) {
      cb(error, false);
    }
  },
};

/* -------------------------------------------------------------------------- */
/*               🚀 Role-Based Authorization Middleware (Fixed)                 */
/* -------------------------------------------------------------------------- */
export const checkRole = (role) => async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    // ✅ Verify token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!decodedToken.role) {
      return res.status(403).json({ message: 'No role assigned to user' });
    }

    if (decodedToken.role !== role) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    
    res.status(401).json({ message: 'Token verification failed', error: error.message });
  }
};
