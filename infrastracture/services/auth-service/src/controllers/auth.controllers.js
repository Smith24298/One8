import { HTTP_STATUS } from '../config/constant.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
    createUser,
    getUserByEmail,
    getUserById,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
    deleteUserRefreshTokens,
    savePasswordResetToken,
    getPasswordResetToken,
    markPasswordResetTokenUsed,
    updatePassword,
    saveEmailVerificationToken,
    getEmailVerificationToken,
    markEmailVerificationTokenUsed,
    verifyUserEmail,
    hashToken
} from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../services/jwt.js';
import { sendMail } from '../services/resend.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import pool from '../config/db.js';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export function health(req, res) {
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Auth Service is healthy'));
}

export const createUserController = async (req, res) => {
    const { email, password, full_name, role } = req.body;
    const client = await pool.connect();
    try {
        client.query('BEGIN');
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Email already registered'));
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await createUser({ email, password_hash: passwordHash, full_name, role },client);

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await saveEmailVerificationToken(user.id, verificationToken, expiresAt,client);
        await sendMail(email, 'Verify your email', verificationToken, 'verification');
        await client.query('COMMIT');
        const { password_hash, ...userData } = user;
        res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, 'User created successfully. Please verify your email.', userData));
    } catch (err) {
        await client.query('ROLLBACK');
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error creating user'));
    }finally {
        client.release();
    }
}

export const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password'));
        }


        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password'));
        }
        if (!user.email_verified) {
            return res.status(HTTP_STATUS.FORBIDDEN).json(new ApiResponse(HTTP_STATUS.FORBIDDEN, 'Please verify your email before logging in'));
        }
        const accessToken = generateToken({ id: user.id, email: user.email, role: user.role });

        const refreshToken = crypto.randomBytes(32).toString('hex');
        const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        await saveRefreshToken(user.id, refreshToken, refreshExpiresAt);
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Login successful', {
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }
        }));
    } catch (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error logging in'));
    }
}

export const logoutController = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        await deleteRefreshToken(refreshToken);
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Logout successful'));
    } catch (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error logging out'));
    }
}

export const refreshTokenController = async (req, res) => {
    const { refreshToken } = req.body;
    const client = await pool.connect();
    try {
        const storedToken = await findRefreshToken(refreshToken);
        if (!storedToken) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired refresh token'));
        }

        const user = await getUserById(storedToken.user_id);
        if (!user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, 'User not found'));
        }

        const accessToken = generateToken({ id: user.id, email: user.email, role: user.role });
        await client.query('BEGIN');
        await deleteRefreshToken(refreshToken,client);

        const newRefreshToken = crypto.randomBytes(32).toString('hex');
        const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        await saveRefreshToken(user.id, newRefreshToken, refreshExpiresAt,client);
        await client.query('COMMIT');
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Token refreshed', {
            accessToken,
            refreshToken: newRefreshToken
        }));
    } catch (err) {
        await client.query('ROLLBACK');
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error refreshing token'));
    } finally {
        client.release();
    }
}

export const forgotPasswordController = async (req, res) => {
    const client = await pool.connect();
    try {
        const { email } = req.body;
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'If the email exists, a reset link has been sent'));
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await client.query('BEGIN');
        await savePasswordResetToken(user.id, resetToken, expiresAt,client);
        await sendMail(email, 'Password Reset Request', resetToken, 'reset');
        await client.query('COMMIT');

        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'If the email exists, a reset link has been sent'));
    } catch (err) {
        await client.query('ROLLBACK');
        console.log(err);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error processing request'));
    } finally {
        client.release();
    }
}

export const resetPasswordController = async (req, res) => {
    const client = await pool.connect();
    try {
        const { token, password } = req.body;

        const tokenRecord = await getPasswordResetToken(token);
        if (!tokenRecord) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset token'));
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await client.query('BEGIN');
        await updatePassword(tokenRecord.email, passwordHash);
        await markPasswordResetTokenUsed(token);
        await deleteUserRefreshTokens(tokenRecord.user_id);
        await client.query('COMMIT');

        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Password reset successful'));
    } catch (err) {
        await client.query('ROLLBACK');
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error resetting password'));
    } finally {
        client.release();
    }
}

export const verifyEmailController = async (req, res) => {
    const client = await pool.connect();
    try {
        const { token } = req.body;

        const tokenRecord = await getEmailVerificationToken(token);
        if (!tokenRecord) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired verification token'));
        }
        await client.query('BEGIN');
        await verifyUserEmail(tokenRecord.user_id, client);
        await markEmailVerificationTokenUsed(token, client);
        await client.query('COMMIT');

        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Email verified successfully'));
    } catch (err) {
        await client.query('ROLLBACK');

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error verifying email'));
    }finally{
        client.release();
    }
}

export const profileController = async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(new ApiResponse(HTTP_STATUS.NOT_FOUND, 'User not found'));
        }
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Profile fetched', user));
    } catch (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Error fetching profile'));
    }
}
