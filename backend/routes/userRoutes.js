import express from 'express';
import { authUser, registerUser, getUsers, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/:id').delete(protect, admin, deleteUser);

export default router;
