import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { generateOrderId } from '../../../util/generateOrderId';
import QueryBuilder from '../../builder/QueryBuilder';
import { IQueryParams } from '../category/category.interfaces';
import { IOrder } from './order.interfaces';
import { Order } from './order.model';
import { Notification } from '../notifications/notification.model';

const createOrder = async (payload: IOrder) => {
  const orderId = await generateOrderId();
  const order = await Order.create({ ...payload, orderId });

  const notification = await Notification.create({
    user: order?.user?.phone,
    title: 'New Order',
    type: 'ORDER',
    message: `New order #${order.orderId} placed`,
    data: {
      orderId: order._id,
    },
  });
  if ((global as any).io) {
    (global as any).io.emit('new-order', notification);
  }

  return order;
};
// get all orders
const getAllOrders = async (query: IQueryParams) => {
  const modelQuery = Order.find();

  const qb = new QueryBuilder(modelQuery, query);

  qb.search(['orderId', 'user.phone']).filter().sort().paginate().fields();

  const orders = await qb.modelQuery.populate('user', 'name phone').populate({
    path: 'productId',
    select:
      'title description category price image availability createdAt updatedAt',
  });

  const paginationInfo = await qb.getPaginationInfo();

  const ordersMapped = orders.map(order => {
    const obj = order.toObject() as any;
    obj.product = obj.productId;
    delete obj.productId;
    return obj;
  });

  return { meta: paginationInfo, data: ordersMapped };
};
// get order by id
const getOrderById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid order ID');
  }
  const order = await Order.findById(id).populate('productId');
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const obj = order.toObject() as any;
  obj.product = obj.productId;
  delete obj.productId;

  return obj;
};
// update order
const updateOrder = async (id: string, payload: Partial<IOrder>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid order ID');
  }
  const updatedOrder = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedOrder) {
    throw new ApiError(404, 'Order not found');
  }

  return updatedOrder;
};
// delete order
const deleteOrder = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid order ID');
  }

  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  return order;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
