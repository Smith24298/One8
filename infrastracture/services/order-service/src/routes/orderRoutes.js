import { Router } from 'express';
import { health } from '../controllers/order.controllers.js'
import  asyncHandler  from '../utils/asyncHandler.js';

const router = Router();

router.get('/health', asyncHandler(health));

export default router;