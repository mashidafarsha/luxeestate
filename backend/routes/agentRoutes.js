import express from 'express';
import { 
  createProperty, 
  getMyProperties, 
  updateProperty, 
  deleteProperty 
} from '../controllers/propertyController.js';
import { protect, agent } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected and require Agent role
router.use(protect);
router.use(agent);

router.route('/properties')
  .post(createProperty);

router.route('/my-properties')
  .get(getMyProperties);

router.route('/properties/:id')
  .put(updateProperty)
  .delete(deleteProperty);

export default router;
