import QueryBuilder from '../../builder/QueryBuilder';
import { IQueryParams } from '../category/category.interfaces';
import { Notification } from './notification.model';

const getAllNotifications = async (query: IQueryParams) => {
  const modelQuery = Notification.find();
  const qb = new QueryBuilder(modelQuery, query);

  qb.sort().paginate();

  const notifications = await qb.modelQuery;

  const paginationInfo = await qb.getPaginationInfo();

  return { meta: paginationInfo, data: notifications };
};

export const NotificationService = { getAllNotifications };
