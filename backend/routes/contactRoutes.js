import express from 'express';
import { submitContact, getContacts, getContactById, updateContactStatus, replyContact } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitContact)
  .get(protect, admin, getContacts);

router.route('/:id')
  .get(protect, admin, getContactById)
  .put(protect, admin, updateContactStatus);

router.route('/:id/reply')
  .post(protect, admin, replyContact);

export default router;
