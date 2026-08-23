import express from 'express';
const router = express.Router();
import { addOrderItems, getOrderById, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js';

router.route('/')
  .post(optionalProtect, addOrderItems)
  .get(protect, admin, getOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;
