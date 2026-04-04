import express from 'express';
import { searchProperties, getProperties } from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow authenticated users to search and view properties
router.post('/search', protect, searchProperties);
router.get('/', protect, getProperties);

export default router;
