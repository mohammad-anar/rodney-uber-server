import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import {
  getMultipleFilesPath,
  getSingleFilePath,
} from '../../../shared/getFilePath';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';
import { HelpRequestServices } from './help.services';
import sendResponse from '../../../shared/sendResponse';

const createHelpRequest = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const documents = getMultipleFilesPath(req.files, 'doc') as
    | string[]
    | undefined;

  const supportingDocument = documents
    ? documents.map(doc => `http://${config.ip_address}:${config.port}${doc}`)
    : [];

  const result = await HelpRequestServices.createHelpRequest({
    ...payload,
    supportingDocument,
  });

  sendResponse(res, {
    success: true,
    message: 'Help request uploaded successfully',
    statusCode: 201,
    data: result,
  });
});

//
const getAllHelpRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await HelpRequestServices.getAllHelpRequests();

  sendResponse(res, {
    success: true,
    message: 'Help requests retrieved successfully',
    statusCode: 200,
    data: result,
  });
});
const getHelpRequestById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await HelpRequestServices.getHelpRequestById(id as string);

  sendResponse(res, {
    success: true,
    message: 'Help request retrieved successfully',
    statusCode: 200,
    data: result,
  });
});

const updateHelpRequest = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { id } = req.params;
  const documents = getMultipleFilesPath(req.files, 'doc') as
    | string[]
    | undefined;

  const updatePayload: any = {};

  if (documents) {
    const supportingDocument = documents
      ? documents.map(doc => `http://${config.ip_address}:${config.port}${doc}`)
      : [];

    updatePayload.supportingDocument = supportingDocument;
  }

  const result = await HelpRequestServices.updateHelpRequest(id as string, {
    ...payload,
    ...updatePayload,
  });

  sendResponse(res, {
    success: true,
    message: 'Help request updated successfully',
    statusCode: 200,
    data: result,
  });
});

const deleteHelpRequestById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await HelpRequestServices.deleteHelpRequest(id as string);

    sendResponse(res, {
      success: true,
      message: 'Help request deleted successfully',
      statusCode: 200,
      data: result,
    });
  },
);

export const HelpRequestController = {
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestById,
  updateHelpRequest,
  deleteHelpRequestById,
};
