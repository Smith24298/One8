import { Router } from 'express';
import { health } from '../controllers/order.controllers.js'

const router = Router();

router.get('/health', health);

export default router;