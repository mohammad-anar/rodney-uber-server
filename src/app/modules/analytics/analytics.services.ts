import { Order } from '../order/order.model';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';

const getAnalytics = async () => {
  // Get the current date and the previous month's date range
  const currentDate = new Date();
  const currentMonthStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const currentMonthEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  const previousMonthStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1,
  );
  const previousMonthEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0,
  );

  // Get current month data
  const totalUsersCurrentMonth = await User.countDocuments({
    createdAt: { $gte: currentMonthStartDate, $lte: currentMonthEndDate },
  });
  const totalOrdersCurrentMonth = await Order.countDocuments({
    createdAt: { $gte: currentMonthStartDate, $lte: currentMonthEndDate },
  });
  const totalProductsCurrentMonth = await Product.countDocuments({
    createdAt: { $gte: currentMonthStartDate, $lte: currentMonthEndDate },
  });

  // Get previous month data
  const totalUsersPreviousMonth = await User.countDocuments({
    createdAt: { $gte: previousMonthStartDate, $lte: previousMonthEndDate },
  });
  const totalOrdersPreviousMonth = await Order.countDocuments({
    createdAt: { $gte: previousMonthStartDate, $lte: previousMonthEndDate },
  });
  const totalProductsPreviousMonth = await Product.countDocuments({
    createdAt: { $gte: previousMonthStartDate, $lte: previousMonthEndDate },
  });

  // Calculate the percentage change from previous month to current month
  const productChangePercentage =
    totalProductsPreviousMonth > 0
      ? ((totalProductsCurrentMonth - totalProductsPreviousMonth) /
          totalProductsPreviousMonth) *
        100
      : totalProductsCurrentMonth > 0
        ? 100
        : 0;

  const orderChangePercentage =
    totalOrdersPreviousMonth > 0
      ? ((totalOrdersCurrentMonth - totalOrdersPreviousMonth) /
          totalOrdersPreviousMonth) *
        100
      : totalOrdersCurrentMonth > 0
        ? 100
        : 0;

  const userChangePercentage =
    totalUsersPreviousMonth > 0
      ? ((totalUsersCurrentMonth - totalUsersPreviousMonth) /
          totalUsersPreviousMonth) *
        100
      : totalUsersCurrentMonth > 0
        ? 100
        : 0;

  // Get total (all-time) users, orders, and products
  const totalUsersAllTime = await User.countDocuments();
  const totalOrdersAllTime = await Order.countDocuments();
  const totalProductsAllTime = await Product.countDocuments();

  // Get pending orders for today
  const todayStartDate = new Date();
  todayStartDate.setHours(0, 0, 0, 0); // Start of today
  const todayEndDate = new Date();
  todayEndDate.setHours(23, 59, 59, 999); // End of today

  const pendingOrdersToday = await Order.countDocuments({
    status: 'PENDING',
    createdAt: { $gte: todayStartDate, $lte: todayEndDate },
  });

  // Get pending orders for yesterday
  const yesterdayStartDate = new Date();
  yesterdayStartDate.setDate(yesterdayStartDate.getDate() - 1);
  yesterdayStartDate.setHours(0, 0, 0, 0); // Start of yesterday
  const yesterdayEndDate = new Date();
  yesterdayEndDate.setDate(yesterdayEndDate.getDate() - 1);
  yesterdayEndDate.setHours(23, 59, 59, 999); // End of yesterday

  const pendingOrdersYesterday = await Order.countDocuments({
    status: 'PENDING',
    createdAt: { $gte: yesterdayStartDate, $lte: yesterdayEndDate },
  });

  // Calculate the percentage change in pending orders from yesterday to today
  const pendingOrdersChangePercentage =
    pendingOrdersYesterday > 0
      ? ((pendingOrdersToday - pendingOrdersYesterday) /
          pendingOrdersYesterday) *
        100
      : pendingOrdersToday > 0
        ? 100
        : 0;

  return {
    totalUsers: totalUsersAllTime,
    totalOrders: totalOrdersAllTime,
    totalProducts: totalProductsAllTime,
    pendingOrdersChangePercentage: pendingOrdersChangePercentage.toFixed(2),
    totalUsersCurrentMonth,
    totalOrdersCurrentMonth,
    totalProductsCurrentMonth,
    totalUsersPreviousMonth,
    totalOrdersPreviousMonth,
    totalProductsPreviousMonth,
    productChangePercentage: productChangePercentage.toFixed(2),
    orderChangePercentage: orderChangePercentage.toFixed(2),
    userChangePercentage: userChangePercentage.toFixed(2),
    totalPendingOrdersToday: pendingOrdersToday,
    totalPendingOrdersYesterday: pendingOrdersYesterday,
  };
};

export const AnalyticsServices = { getAnalytics };
