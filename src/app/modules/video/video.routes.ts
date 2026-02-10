import express from 'express';
import { VideoController } from './video.controller';

const router = express.Router();

router.post('/', VideoController.createVideo);

export const VideoRouter = router;
