import express from 'express';
import { NotificationController } from './notification.controller';

const router = express.Router();

router.get('/', NotificationController.getAllNotifications);

export const NotificationRouter = router;
