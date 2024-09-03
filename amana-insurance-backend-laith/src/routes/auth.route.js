import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import loginLimiter from '../middleware/LoginLimiter.js';
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.post('/login', loginLimiter, AuthController.login);
router.use(verifyJWT)
router.get('/refresh',AuthController.refresh)
router.get('/logout', AuthController.logout);

export default router;