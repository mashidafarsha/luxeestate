import express from 'express';
import { getAgentInbox, getMessageHistory } from '../controllers/messageController.js';
import { protect, agent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/agent/inbox', protect, agent, getAgentInbox);
router.get('/:propertyId/:buyerId', protect, getMessageHistory);

export default router;
