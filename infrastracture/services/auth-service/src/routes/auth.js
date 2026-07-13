import { Router } from 'express';
import { health } from '../controllers/auth.controllers.js'
import  aysncHandler  from '../utils/asyncHandler.js';

const router = Router();

router.get('/health', aysncHandler(health));

export default router;