const Order = require("../models/order.model");

// REUSABLE AGGREGATION HELPERS
// Convert string field to double in aggregation
const toDouble = (field) => ({ $toDouble: `$${field}` });

// Extract year-month from OrderDate string
const extractMonth = () => ({ $substr: ["$OrderDate", 0, 7] });

// Extract year from OrderDate string  
const extractYear = () => ({ $substr: ["$OrderDate", 0, 4] });

// Round to 2 decimal places
const round2 = (expr) => ({ $round: [expr, 2] });

class AnalyticsService {
  /**
   * Calculate total revenue across all orders
   */
  async getTotalRevenue() {
    try {
      const result = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: toDouble("TotalAmount") },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            totalRevenue: round2("$totalRevenue"),
            totalOrders: 1,
            averageOrderValue: round2({
              $divide: ["$totalRevenue", "$totalOrders"],
            }),
          },
        },
      ]);

      return result[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Group orders by month (YYYY-MM) and sum TotalAmount per month
   */
  async getMonthlyRevenue() {
    try {
      return await Order.aggregate([
        {
          $group: {
            _id: extractMonth(),
            totalRevenue: { $sum: toDouble("TotalAmount") },
            orderCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            totalRevenue: round2("$totalRevenue"),
            orderCount: 1,
          },
        },
        { $sort: { month: 1 } },
      ]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Group orders by year and sum TotalAmount per year
   */
  async getYearlyRevenue() {
    try {
      return await Order.aggregate([
        {
          $group: {
            _id: extractYear(),
            totalRevenue: { $sum: toDouble("TotalAmount") },
            orderCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id",
            totalRevenue: round2("$totalRevenue"),
            orderCount: 1,
          },
        },
        { $sort: { year: 1 } },
      ]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Calculate average TotalAmount across all orders
   */
  async getAverageOrderValue() {
    try {
      const result = await Order.aggregate([
        {
          $group: {
            _id: null,
            averageOrderValue: { $avg: toDouble("TotalAmount") },
            minOrderValue: { $min: toDouble("TotalAmount") },
            maxOrderValue: { $max: toDouble("TotalAmount") },
          },
        },
        {
          $project: {
            _id: 0,
            averageOrderValue: round2("$averageOrderValue"),
            minOrderValue: round2("$minOrderValue"),
            maxOrderValue: round2("$maxOrderValue"),
          },
        },
      ]);

      return result[0] || { averageOrderValue: 0, minOrderValue: 0, maxOrderValue: 0 };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Return total orders count broken down by OrderStatus
   */
  async getOrderCountBreakdown() {
    try {
      const [totalCount, breakdown] = await Promise.all([
        Order.countDocuments(),
        Order.aggregate([
          {
            $group: {
              _id: "$OrderStatus",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              status: "$_id",
              count: 1,
            },
          },
        ]),
      ]);

      return {
        total: totalCount,
        breakdown,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Analytics specifically for cancelled orders
   */
  async getCancelledOrdersAnalytics() {
    try {
      const totalOrders = await Order.countDocuments();
      const results = await Order.aggregate([
        {
          $facet: {
            cancelledStats: [
              { $match: { OrderStatus: "Cancelled" } },
              {
                $group: {
                  _id: null,
                  totalCancelled: { $sum: 1 },
                  totalRevenueLost: { $sum: toDouble("TotalAmount") },
                },
              },
            ],
            topCategories: [
              { $match: { OrderStatus: "Cancelled" } },
              {
                $group: {
                  _id: "$Category",
                  count: { $sum: 1 },
                },
              },
              { $sort: { count: -1 } },
              { $limit: 5 },
              {
                $project: {
                  _id: 0,
                  category: "$_id",
                  count: 1,
                },
              },
            ],
          },
        },
      ]);

      const stats = results[0].cancelledStats[0] || { totalCancelled: 0, totalRevenueLost: 0 };
      const cancellationRate = totalOrders > 0 ? (stats.totalCancelled / totalOrders) * 100 : 0;

      return {
        totalCancelled: stats.totalCancelled,
        cancellationRate: parseFloat(cancellationRate.toFixed(2)),
        totalRevenueLost: parseFloat(stats.totalRevenueLost.toFixed(2)),
        topCancelledCategories: results[0].topCategories,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Analytics specifically for refunded orders
   */
  async getRefundedOrdersAnalytics() {
    try {
      const totalOrders = await Order.countDocuments();
      const results = await Order.aggregate([
        {
          $facet: {
            refundedStats: [
              { $match: { OrderStatus: "Refunded" } },
              {
                $group: {
                  _id: null,
                  totalRefunded: { $sum: 1 },
                  totalRefundedAmount: { $sum: toDouble("TotalAmount") },
                },
              },
            ],
            topProducts: [
              { $match: { OrderStatus: "Refunded" } },
              {
                $group: {
                  _id: "$ProductName",
                  count: { $sum: 1 },
                },
              },
              { $sort: { count: -1 } },
              { $limit: 5 },
              {
                $project: {
                  _id: 0,
                  productName: "$_id",
                  count: 1,
                },
              },
            ],
          },
        },
      ]);

      const stats = results[0].refundedStats[0] || { totalRefunded: 0, totalRefundedAmount: 0 };
      const refundRate = totalOrders > 0 ? (stats.totalRefunded / totalOrders) * 100 : 0;

      return {
        totalRefunded: stats.totalRefunded,
        refundRate: parseFloat(refundRate.toFixed(2)),
        totalRefundedAmount: parseFloat(stats.totalRefundedAmount.toFixed(2)),
        topRefundedProducts: results[0].topProducts,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Top 10 customers by total spend
   */
  async getTopCustomers() {
    try {
      return await Order.aggregate([
        {
          $group: {
            _id: "$CustomerID",
            customerName: { $first: "$CustomerName" },
            totalSpend: { $sum: toDouble("TotalAmount") },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { totalSpend: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            customerID: "$_id",
            customerName: 1,
            totalSpend: round2("$totalSpend"),
            orderCount: 1,
          },
        },
      ]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Top 10 products by total quantity sold
   */
  async getTopSellingProducts() {
    try {
      return await Order.aggregate([
        {
          $group: {
            _id: "$ProductID",
            productName: { $first: "$ProductName" },
            category: { $first: "$Category" },
            brand: { $first: "$Brand" },
            totalQuantitySold: { $sum: toDouble("Quantity") },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            productID: "$_id",
            productName: 1,
            category: 1,
            brand: 1,
            totalQuantitySold: 1,
            orderCount: 1,
          },
        },
      ]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bottom 10 products by total quantity sold
   */
  async getLowSellingProducts() {
    try {
      return await Order.aggregate([
        {
          $group: {
            _id: "$ProductID",
            productName: { $first: "$ProductName" },
            category: { $first: "$Category" },
            brand: { $first: "$Brand" },
            totalQuantitySold: { $sum: toDouble("Quantity") },
            orderCount: { $sum: 1 },
          },
        },
        { $match: { totalQuantitySold: { $gt: 0 } } },
        { $sort: { totalQuantitySold: 1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            productID: "$_id",
            productName: 1,
            category: 1,
            brand: 1,
            totalQuantitySold: 1,
            orderCount: 1,
          },
        },
      ]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Top categories by total revenue
   */
  async getTopCategories() {
    try {
      return await Order.aggregate([
        {
          $group: {
            _id: "$Category",
            totalRevenue: { $sum: toDouble("TotalAmount") },
            orderCount: { $sum: 1 },
            totalItemsSold: { $sum: toDouble("Quantity") },
          },
        },
        { $sort: { totalRevenue: -1 } },
        {
          $project: {
            _id: 0,
            category: "$_id",
            totalRevenue: round2("$totalRevenue"),
            orderCount: 1,
            totalItemsSold: 1,
          },
        },
      ]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Distribution of payment methods across all orders
   */
  async getPaymentDistribution() {
    try {
      const totalOrders = await Order.countDocuments();
      const distribution = await Order.aggregate([
        {
          $group: {
            _id: "$PaymentMethod",
            orderCount: { $sum: 1 },
            totalAmount: { $sum: toDouble("TotalAmount") },
          },
        },
        { $sort: { orderCount: -1 } },
        {
          $project: {
            _id: 0,
            paymentMethod: "$_id",
            orderCount: 1,
            totalAmount: round2("$totalAmount"),
            percentage: round2({
              $multiply: [{ $divide: ["$orderCount", totalOrders] }, 100],
            }),
          },
        },
      ]);

      return distribution;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Top 10 cities by total revenue
   */
  async getTopCities() {
    try {
      return await Order.aggregate([
        {
          $group: {
            _id: {
              city: "$City",
              state: "$State",
              country: "$Country",
            },
            totalRevenue: { $sum: toDouble("TotalAmount") },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            city: "$_id.city",
            state: "$_id.state",
            country: "$_id.country",
            totalRevenue: round2("$totalRevenue"),
            orderCount: 1,
          },
        },
      ]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Overall return/refund rate analytics
   */
  async getReturnRateAnalytics() {
    try {
      const totalOrders = await Order.countDocuments();
      const results = await Order.aggregate([
        {
          $facet: {
            returnStats: [
              { $match: { OrderStatus: { $in: ["Refunded", "Returned"] } } },
              {
                $group: {
                  _id: null,
                  totalReturned: { $sum: 1 },
                },
              },
            ],
            returnsByMonth: [
              { $match: { OrderStatus: { $in: ["Refunded", "Returned"] } } },
              {
                $group: {
                  _id: extractMonth(),
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
              {
                $project: {
                  _id: 0,
                  month: "$_id",
                  count: 1,
                },
              },
            ],
            topCategories: [
              { $match: { OrderStatus: { $in: ["Refunded", "Returned"] } } },
              {
                $group: {
                  _id: "$Category",
                  count: { $sum: 1 },
                },
              },
              { $sort: { count: -1 } },
              { $limit: 5 },
              {
                $project: {
                  _id: 0,
                  category: "$_id",
                  count: 1,
                },
              },
            ],
          },
        },
      ]);

      const totalReturned = results[0].returnStats[0]?.totalReturned || 0;
      const returnRate = totalOrders > 0 ? (totalReturned / totalOrders) * 100 : 0;

      return {
        totalOrders,
        totalReturned,
        returnRate: parseFloat(returnRate.toFixed(2)),
        returnsByMonth: results[0].returnsByMonth,
        topReturnedCategories: results[0].topCategories,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Discount usage analytics across all orders
   */
  async getDiscountUsageAnalytics() {
    try {
      const totalOrders = await Order.countDocuments();
      const results = await Order.aggregate([
        {
          $facet: {
            discountStats: [
              {
                $project: {
                  hasDiscount: { $gt: [toDouble("Discount"), 0] },
                  discountValue: toDouble("Discount"),
                  category: "$Category",
                },
              },
              {
                $group: {
                  _id: null,
                  totalOrdersWithDiscount: { $sum: { $cond: ["$hasDiscount", 1, 0] } },
                  totalDiscountGiven: { $sum: "$discountValue" },
                  avgDiscountIfApplied: {
                    $avg: { $cond: ["$hasDiscount", "$discountValue", "$$REMOVE"] },
                  },
                },
              },
            ],
            topCategories: [
              {
                $group: {
                  _id: "$Category",
                  totalDiscount: { $sum: toDouble("Discount") },
                },
              },
              { $sort: { totalDiscount: -1 } },
              { $limit: 5 },
              {
                $project: {
                  _id: 0,
                  category: "$_id",
                  totalDiscount: round2("$totalDiscount"),
                },
              },
            ],
          },
        },
      ]);

      const stats = results[0].discountStats[0] || {
        totalOrdersWithDiscount: 0,
        totalDiscountGiven: 0,
        avgDiscountIfApplied: 0,
      };

      const usageRate = totalOrders > 0 ? (stats.totalOrdersWithDiscount / totalOrders) * 100 : 0;

      return {
        totalOrdersWithDiscount: stats.totalOrdersWithDiscount,
        totalOrdersWithoutDiscount: totalOrders - stats.totalOrdersWithDiscount,
        discountUsageRate: parseFloat(usageRate.toFixed(2)),
        totalDiscountGiven: parseFloat(stats.totalDiscountGiven.toFixed(2)),
        averageDiscount: parseFloat((stats.avgDiscountIfApplied || 0).toFixed(2)),
        topDiscountedCategories: results[0].topCategories,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
