import express from 'express';
import { toggleFavorite, getFavorites } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/favorites/:propertyId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

export default router;
