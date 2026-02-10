import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { VideoController } from './video.controller';
import { createVideoSchema, updateVideoSchema } from './video.validation';

const router = express.Router();

router.get('/', VideoController.getVideos);
router.post(
  '/',
  fileUploadHandler(),
  auth(USER_ROLES.ADMIN),
  validateRequest(createVideoSchema),
  VideoController.createVideo,
);
router.patch(
  '/:id',
  fileUploadHandler(),
  auth(USER_ROLES.ADMIN),
  validateRequest(updateVideoSchema),
  VideoController.updateVideo,
);

router.delete('/:id', VideoController.deleteVideo);

export const VideoRouter = router;
