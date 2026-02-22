import express from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { HelpRequestController } from './help.controller';
import {
  createHelpRequestSchema,
  updateHelpRequestSchema,
} from './help.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/', HelpRequestController.getAllHelpRequests);
router.post(
  '/',
  fileUploadHandler(),
  auth(USER_ROLES.USER),
  validateRequest(createHelpRequestSchema),
  HelpRequestController.createHelpRequest,
);
router.get('/:id', HelpRequestController.getHelpRequestById);
router.patch(
  '/:id',
  fileUploadHandler(),
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  validateRequest(updateHelpRequestSchema),
  HelpRequestController.updateHelpRequest,
);
router.delete('/:id', HelpRequestController.deleteHelpRequestById);

export const HelpRouter = router;
