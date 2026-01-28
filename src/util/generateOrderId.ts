import { Order } from '../app/modules/order/order.model';

export const generateOrderId = async (): Promise<string> => {
  const lastOrder = await Order.findOne({})
    .sort({ createdAt: -1 })
    .select('orderId')
    .lean();

  let newIdNumber = 1;

  if (lastOrder && lastOrder.orderId) {
    const lastNumber = parseInt(lastOrder.orderId.replace('#ORD-', ''), 10);
    newIdNumber = lastNumber + 1;
  }

  const formattedId = `#ORD-${newIdNumber.toString().padStart(4, '0')}`;
  return formattedId;
};
