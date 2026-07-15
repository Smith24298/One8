import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../config/constant.js';
import ApiResponse from '../utils/ApiResponse.js';
import env from '../config/env.js';

export const generateToken = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
}

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        return decoded;
    } catch (err) {
        throw new ApiResponse(HTTP_STATUS.UNAUTHORIZED, 'Invalid token');
    }
}