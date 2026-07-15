import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import {
    validationRegisterMiddleware,
    validationLoginMiddleware,
    validateEmailMiddleware,
    validateResetPasswordMiddleware,
    validateRefreshTokenMiddleware,
    validateVerifyEmailMiddleware,
    authenticateUser
} from '../middleware/auth.middleware.js';
import {
    health,
    createUserController,
    loginUserController,
    logoutController,
    refreshTokenController,
    forgotPasswordController,
    resetPasswordController,
    verifyEmailController,
    profileController
} from '../controllers/auth.controllers.js';

const router = Router();

router.get('/health', asyncHandler(health));
router.post('/register', validationRegisterMiddleware, asyncHandler(createUserController));
router.post('/login', validationLoginMiddleware, asyncHandler(loginUserController));
router.post('/logout', validateRefreshTokenMiddleware, asyncHandler(logoutController));
router.post('/refresh-token', validateRefreshTokenMiddleware, asyncHandler(refreshTokenController));
router.post('/forgot-password', validateEmailMiddleware, asyncHandler(forgotPasswordController));
router.post('/reset-password', validateResetPasswordMiddleware, asyncHandler(resetPasswordController));
router.post('/verify-email', validateVerifyEmailMiddleware, asyncHandler(verifyEmailController));
router.get('/profile', authenticateUser, asyncHandler(profileController));

export default router;
