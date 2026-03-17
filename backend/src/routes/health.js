import { Router } from 'express';
import { healthCheckController } from '../controllers/healthController.js';

const router = Router();

router.get('/', healthCheckController);

export default router;
