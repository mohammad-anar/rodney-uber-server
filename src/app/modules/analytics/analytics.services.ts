import { User } from '../user/user.model';
import { Coupon } from '../coupon/coupon.model';
import { CouponUsage } from '../couponUsage/couponUsage.model';

export const getDashboardAnalytics = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Start & End of current year
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

  const [
    totalUsers,
    totalCouponUsage,
    totalCoupons,
    activeCoupons,
    expiredCoupons,
    monthlyUsageRaw,
  ] = await Promise.all([
    User.countDocuments(),

    CouponUsage.countDocuments(),

    Coupon.countDocuments(),

    Coupon.countDocuments({
      isActive: true,
      expiredAt: { $gt: now },
    }),

    Coupon.countDocuments({
      $or: [{ isActive: false }, { expiredAt: { $lte: now } }],
    }),

    // Current year monthly aggregation
    CouponUsage.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          totalUsage: { $sum: 1 },
        },
      },
    ]),
  ]);

  const usageMap: Record<number, number> = {};

  monthlyUsageRaw.forEach(item => {
    usageMap[item._id.month] = item.totalUsage;
  });

  const videoUsagePerMonth = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;

    return {
      year: currentYear,
      month,
      totalUsage: usageMap[month] || 0,
    };
  });

  const activePercentage =
    totalCoupons > 0 ? (activeCoupons / totalCoupons) * 100 : 0;

  const expiredPercentage =
    totalCoupons > 0 ? (expiredCoupons / totalCoupons) * 100 : 0;

  return {
    users: {
      total: totalUsers,
    },

    coupons: {
      total: totalCoupons,
      active: activeCoupons,
      expired: expiredCoupons,
      activePercentage: Number(activePercentage.toFixed(2)),
      expiredPercentage: Number(expiredPercentage.toFixed(2)),
    },

    couponUsage: {
      total: totalCouponUsage,
      videoUsagePerMonth,
    },
  };
};

export const AnalyticsService = { getDashboardAnalytics };
