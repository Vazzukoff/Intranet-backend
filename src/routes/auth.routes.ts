import { Router } from 'express';
import { logout } from '../services/auth.service';
import { registerUser, loginUser } from '../controllers/auth.controller'

const router = Router();

router.post('/register', registerUser);
router.post("/login", loginUser);
router.post('/logout', logout)

export default router;