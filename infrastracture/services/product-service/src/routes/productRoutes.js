import { Router } from 'express';
import { health } from '../controllers/product.controllers.js'
import  asyncHandler   from '../utils/asyncHandler.js';

const router = Router();

router.get('/health', asyncHandler(health));

export default router;