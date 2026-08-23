import express from 'express';
const router = express.Router();
import { createPayment, sepayWebhook, getPaymentStatus } from '../controllers/paymentController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { verifySepaySignature } from '../middleware/sepayAuthMiddleware.js';

router.post('/create', optionalProtect, createPayment);
router.post('/sepay/webhook', verifySepaySignature, sepayWebhook);
router.get('/:paymentCode/status', getPaymentStatus);

export default router;
