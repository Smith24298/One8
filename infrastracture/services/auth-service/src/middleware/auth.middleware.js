import { HTTP_STATUS } from '../config/constant.js';
import ApiResponse from '../utils/ApiResponse.js';
import { verifyToken } from '../services/jwt.js';

export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        sucess: false,
        statusCode,
        message
    });
}

export const validationRegisterMiddleware = (req, res, next) => {
    const { email, password, full_name, role } = req.body;
    if (!email || !password || !full_name || !role) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Missing required fields'));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Invalid email format'));
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Password must be at least 8 characters long and contain at least one letter and one number'));
    }
    const validRoles = ['admin', 'customer', 'seller'];
    if (!validRoles.includes(role)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Invalid role'));
    }
    next();
}

export const validationLoginMiddleware = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Missing required fields'));
    }
    next();
}

export const validateEmailMiddleware = (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Invalid email format'));
    }
    next();
}

export const validateResetPasswordMiddleware = (req, res, next) => {
    const { token, password } = req.body;
    if (!token) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Reset token is required'));
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Password must be at least 8 characters long and contain at least one letter and one number'));
    }
    next();
}

export const validateRefreshTokenMiddleware = (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Refresh token is required'));
    }
    next();
}

export const validateVerifyEmailMiddleware = (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, 'Verification token is required'));
    }
    next();
}

export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, 'Access token required'));
    }
    const accessToken = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(accessToken);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired access token'));
    }
}

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(HTTP_STATUS.FORBIDDEN).json(new ApiResponse(HTTP_STATUS.FORBIDDEN, 'Insufficient permissions'));
        }
        next();
    }
}
