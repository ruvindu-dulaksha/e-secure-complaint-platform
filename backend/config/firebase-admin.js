import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseApp = null;

async function initializeFirebaseAdmin() {
  if (firebaseApp) return firebaseApp;

  try {
    let serviceAccount;

    try {
      const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
      const serviceAccountJson = await readFile(serviceAccountPath, 'utf8');
      serviceAccount = JSON.parse(serviceAccountJson);
      console.log('✅ Successfully loaded service account from file');
    } catch {
      console.log('✅ Using environment variables for Firebase credentials');
      serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      };
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    console.log('✅ Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }
}

// Ensure Firebase is initialized before exporting
await initializeFirebaseAdmin();
export default admin;
