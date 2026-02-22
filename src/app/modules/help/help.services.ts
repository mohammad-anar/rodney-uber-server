import unlinkFile, { extractPathFromUrl } from '../../../shared/unlinkFile';
import { IQueryParams } from '../../../types/pagination';
import QueryBuilder from '../../builder/QueryBuilder';
import { IHelpRequest } from './help.interfaces';
import { HelpRequest } from './help.model';

const createHelpRequest = async (payload: IHelpRequest) => {
  const result = await HelpRequest.create(payload);
  return result;
};
const getAllHelpRequests = async (query: IQueryParams) => {
  const modelQuery = HelpRequest.find();

  const qb = new QueryBuilder(modelQuery, query);
  qb.search(['fullName', 'email']).sort().filter().paginate().fields();
  const result = await qb.modelQuery;
  const pagination = await qb.getPaginationInfo();
  return { meta: pagination, data: result };
};
const getHelpRequestById = async (id: string) => {
  const result = await HelpRequest.findById(id);
  return result;
};
const updateHelpRequest = async (
  id: string,
  payload: Partial<IHelpRequest>,
) => {
  const existingHelpRequest = await HelpRequest.findById(id);

  if (
    existingHelpRequest?.supportingDocument &&
    existingHelpRequest.supportingDocument.length > 0
  ) {
    existingHelpRequest?.supportingDocument.forEach(url => {
      unlinkFile(extractPathFromUrl(url));
    });
  }

  const result = await HelpRequest.findByIdAndUpdate(id, payload);
  return result;
};
const deleteHelpRequest = async (id: string) => {
  const existingHelpRequest = await HelpRequest.findById(id);

  if (
    existingHelpRequest?.supportingDocument &&
    existingHelpRequest.supportingDocument.length > 0
  ) {
    existingHelpRequest?.supportingDocument.forEach(url => {
      unlinkFile(extractPathFromUrl(url));
    });
  }

  const result = await HelpRequest.findByIdAndDelete(id);
  return result;
};

export const HelpRequestServices = {
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestById,
  updateHelpRequest,
  deleteHelpRequest,
};
