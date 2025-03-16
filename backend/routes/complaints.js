import express from 'express';
import admin from '../config/firebase-admin.js';
import multer from 'multer';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const db = admin.firestore();

// Enhanced file upload configuration
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  }
});

// Validation middleware for complaints
const validateComplaint = [
  body('title').trim()
    .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('location').trim()
    .notEmpty().withMessage('Location is required')
];



router.get('/all', async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Ensure `page` and `limit` are integers
    const currentPage = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (currentPage <= 0 || pageSize <= 0) {
      return res.status(400).json({ error: 'Page and limit must be positive integers.' });
    }
    
    // const authHeader = req.headers.authorization;
    // const token = authHeader.split('Bearer ')[1];
    // console.log("Sending token "+token);
    // Base query for complaints
    let query = db.collection('complaints');

    // Add a filter for `status` if provided
    if (status) {
      query = query.where('status', '==', status);
    }

    // Validate and apply sorting
    const allowedOrders = ['asc', 'desc'];
    if (!allowedOrders.includes(order.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid sort order. Use "asc" or "desc".' });
    }

    query = query.orderBy(sortBy, order.toLowerCase());

    // Get total document count
    const totalDocsSnapshot = await query.get();
    const totalDocs = totalDocsSnapshot.size;
    const totalPages = Math.ceil(totalDocs / pageSize);

    // Pagination using Firestore's `startAfter`
    const complaints = [];
    let snapshot;

    if (currentPage > 1) {
      // Get the starting document for the current page
      const previousSnapshot = await query.limit((currentPage - 1) * pageSize).get();
      const lastVisible = previousSnapshot.docs[previousSnapshot.docs.length - 1];

      if (!lastVisible) {
        return res.status(400).json({ error: 'Invalid page number.' });
      }

      // Start the next query after the last document of the previous page
      snapshot = await query.startAfter(lastVisible).limit(pageSize).get();
    } else {
      snapshot = await query.limit(pageSize).get();
    }

    snapshot.forEach((doc) => {
      complaints.push({ id: doc.id, ...doc.data() });
    });

    // Send the response
    res.json({
      complaints,
      pagination: {
        currentPage,
        totalPages,
        totalComplaints: totalDocs,
        hasMore: currentPage < totalPages,
      },
    });
  } catch (error) {
    

    // Handle Firestore index error
    if (error.code === 9 && error.details.includes('The query requires an index.')) {
      return res.status(500).json({
        error: 'The query requires an index. Please create the required index in Firestore.',
        indexLink: error.details.match(/https?:\/\/[^\s]+/)[0], // Extract index link
      });
    }

    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});


// router.post('/', async (req, res) => {
//   try {
//     const { status, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', userId } = req.query;

//     // Ensure `page` and `limit` are integers
//     const currentPage = parseInt(page, 10);
//     const pageSize = parseInt(limit, 10);

//     if (currentPage <= 0 || pageSize <= 0) {
//       return res.status(400).json({ error: 'Page and limit must be positive integers.' });
//     }

//     let query = db.collection('complaints');

//     // Add filters for `status` and `userId` if provided
//     if (status) {
//       query = query.where('status', '==', status);
//     }
//     if (userId) {
//       query = query.where('userId', '==', userId);
//     }

//     // Validate and apply sorting
//     const allowedOrders = ['asc', 'desc'];
//     if (!allowedOrders.includes(order.toLowerCase())) {
//       return res.status(400).json({ error: 'Invalid sort order. Use "asc" or "desc".' });
//     }

//     query = query.orderBy(sortBy, order.toLowerCase());

//     // Get total document count
//     const totalDocsSnapshot = await query.get();
//     const totalDocs = totalDocsSnapshot.size;
//     const totalPages = Math.ceil(totalDocs / pageSize);

//     // Pagination using Firestore's `startAfter`
//     const complaints = [];
//     let snapshot;

//     if (currentPage > 1) {
//       const previousSnapshot = await query.limit((currentPage - 1) * pageSize).get();
//       const lastVisible = previousSnapshot.docs[previousSnapshot.docs.length - 1];

//       if (!lastVisible) {
//         return res.status(400).json({ error: 'Invalid page number.' });
//       }

//       snapshot = await query.startAfter(lastVisible).limit(pageSize).get();
//     } else {
//       snapshot = await query.limit(pageSize).get();
//     }

//     snapshot.forEach((doc) => {
//       complaints.push({ id: doc.id, ...doc.data() });
//     });

//     res.json({
//       complaints,
//       pagination: {
//         currentPage,
//         totalPages,
//         totalComplaints: totalDocs,
//         hasMore: currentPage < totalPages,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching complaints:', error);

//     if (error.code === 9 && error.details.includes('The query requires an index.')) {
//       return res.status(500).json({
//         error: 'The query requires an index. Please create the required index in Firestore.',
//         indexLink: error.details.match(/https?:\/\/[^\s]+/)[0],
//       });
//     }

//     res.status(500).json({ error: 'Failed to fetch complaints' });
//   }
// });


router.post('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Ensure `page` and `limit` are integers
    const currentPage = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (currentPage <= 0 || pageSize <= 0) {
      return res.status(400).json({ error: 'Page and limit must be positive integers.' });
    }

    let query = db.collection('complaints').where('userId', '==', userId);

    // Validate and apply sorting
    const allowedOrders = ['asc', 'desc'];
    if (!allowedOrders.includes(order.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid sort order. Use "asc" or "desc".' });
    }

    query = query.orderBy(sortBy, order.toLowerCase());

    // Get total document count
    const totalDocsSnapshot = await query.get();
    const totalDocs = totalDocsSnapshot.size;
    const totalPages = Math.ceil(totalDocs / pageSize);

    // Pagination using Firestore's `startAfter`
    const complaints = [];
    let snapshot;

    if (currentPage > 1) {
      const previousSnapshot = await query.limit((currentPage - 1) * pageSize).get();
      const lastVisible = previousSnapshot.docs[previousSnapshot.docs.length - 1];

      if (!lastVisible) {
        return res.status(400).json({ error: 'Invalid page number.' });
      }

      snapshot = await query.startAfter(lastVisible).limit(pageSize).get();
    } else {
      snapshot = await query.limit(pageSize).get();
    }

    snapshot.forEach((doc) => {
      complaints.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      complaints,
      pagination: {
        currentPage,
        totalPages,
        totalComplaints: totalDocs,
        hasMore: currentPage < totalPages,
      },
    });
  } catch (error) {
    

    if (error.code === 9 && error.details.includes('The query requires an index.')) {
      return res.status(500).json({
        error: 'The query requires an index. Please create the required index in Firestore.',
        indexLink: error.details.match(/https?:\/\/[^\s]+/)[0],
      });
    }

    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});





// // Enhanced create complaint endpoint
router.post('/comp', upload.single('evidence'), validateComplaint, async (req, res) => {

  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let evidenceData = null;
    
    if (req.file) {
      const base64Data = req.file.buffer.toString('base64');
      evidenceData = {
        data: base64Data,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
        size: req.file.size
      };
    }
    
    const complaint = {
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      location: req.body.location.trim(),
      evidenceData,
      status: 'pending',
      userId: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      category: req.body.category || 'general',
      priority: req.body.priority || 'medium',
      assignedTo: null,
      comments: []
    };
    
    const docRef = await db.collection('complaints').add(complaint);
    
    // Create activity log
    await db.collection('activityLogs').add({
      action: 'create',
      complaintId: docRef.id,
      userId: req.user.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `Complaint "${complaint.title}" created`
    });

    res.status(201).json({ id: docRef.id, ...complaint });
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to create complaint' });
  }
});


// Enhanced update complaint endpoint
router.patch('/:id', validateComplaint, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const complaintRef = db.collection('complaints').doc(id);
    const complaint = await complaintRef.get();
    
    if (!complaint.exists) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    if (complaint.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized to update this complaint' });
    }
    
    const updatedData = {
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await complaintRef.update(updatedData);
    
    // Create activity log
    await db.collection('activityLogs').add({
      action: 'update',
      complaintId: id,
      userId: req.user.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `Complaint "${updates.title || complaint.data().title}" updated`
    });
    
    res.json({ message: 'Complaint updated successfully' });
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

// Enhanced delete complaint endpoint
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const complaintRef = db.collection('complaints').doc(id);
    const complaint = await complaintRef.get();
    
    if (!complaint.exists) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    if (complaint.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'Not authorized to delete this complaint' });
    }
    
    // Create activity log before deletion
    await db.collection('activityLogs').add({
      action: 'delete',
      complaintId: id,
      userId: req.user.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `Complaint "${complaint.data().title}" deleted`
    });

    await complaintRef.delete();
    
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
});

// Add comment to complaint
router.post('/:id/comments', [
  body('content').trim()
    .isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { content } = req.body;
    
    const complaintRef = db.collection('complaints').doc(id);
    const complaint = await complaintRef.get();
    
    if (!complaint.exists) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    const comment = {
      content: content.trim(),
      userId: req.user.uid,
      userName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await complaintRef.update({
      comments: admin.firestore.FieldValue.arrayUnion(comment),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

export default router;