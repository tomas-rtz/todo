import express from 'express';
import { mainController } from '../controllers/MainController';

const router = express.Router();

// / => GET
router.get('/', mainController.getIndex);

export { router as mainRoutes };
