import express from 'express';
import admin from '../config/firebase-admin.js';

const router = express.Router();
const db = admin.firestore();

// Get all users (admin only)
// router.get('/', adminAuth, async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });



router.get('/',  async (req, res) => {
  try {

    
    // Query the Firestore collection 'profiles' where the role is 'manager'
    const query = db.collection('profiles').where('role', '==', 'manager');

    // Fetch the matching documents
    const snapshot = await query.get();

    // Check if no documents are found
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No managers found.' });
    }

    // Prepare an array to store the profiles
    const managers = [];
    snapshot.forEach(doc => {
      managers.push({ id: doc.id, ...doc.data() });
    });

    // Respond with the list of managers
    res.json({
      managers
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




router.post('/delete', async (req, res) => {
  try {
    // Get the user ID from the request body
    const { id } = req.body;

    // Delete the user profile
    await db.collection('profiles').doc(id).delete();

    // Respond with a success message
    res.json({ message: 'User profile deleted successfully.' });
  } catch (error) {
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Update user role (admin only)
// router.patch('/:id/role', adminAuth, async (req, res) => {
//   try {
//     const { role } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { role, updatedAt: Date.now() },
//       { new: true }
//     ).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// export default router;

router.post("/gettinguserid", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ uid: decodedToken.uid });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;