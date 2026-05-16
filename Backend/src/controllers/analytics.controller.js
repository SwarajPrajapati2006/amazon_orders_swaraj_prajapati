const analyticsService = require("../services/analytics.service");

class AnalyticsController {
  async getTotalRevenue(req, res) {
    try {
      const data = await analyticsService.getTotalRevenue();
      return res.status(200).json({
        success: true,
        message: "Total revenue calculated",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error calculating total revenue",
        error: error.message,
      });
    }
  }

  async getMonthlyRevenue(req, res) {
    try {
      const data = await analyticsService.getMonthlyRevenue();
      return res.status(200).json({
        success: true,
        message: "Monthly revenue fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching monthly revenue",
        error: error.message,
      });
    }
  }

  async getYearlyRevenue(req, res) {
    try {
      const data = await analyticsService.getYearlyRevenue();
      return res.status(200).json({
        success: true,
        message: "Yearly revenue fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching yearly revenue",
        error: error.message,
      });
    }
  }

  async getAverageOrderValue(req, res) {
    try {
      const data = await analyticsService.getAverageOrderValue();
      return res.status(200).json({
        success: true,
        message: "Average order value calculated",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error calculating average order value",
        error: error.message,
      });
    }
  }

  async getOrderCountBreakdown(req, res) {
    try {
      const data = await analyticsService.getOrderCountBreakdown();
      return res.status(200).json({
        success: true,
        message: "Order counts fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching order counts",
        error: error.message,
      });
    }
  }

  async getCancelledOrdersAnalytics(req, res) {
    try {
      const data = await analyticsService.getCancelledOrdersAnalytics();
      return res.status(200).json({
        success: true,
        message: "Cancelled order analytics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching cancelled order analytics",
        error: error.message,
      });
    }
  }

  async getRefundedOrdersAnalytics(req, res) {
    try {
      const data = await analyticsService.getRefundedOrdersAnalytics();
      return res.status(200).json({
        success: true,
        message: "Refunded order analytics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching refunded order analytics",
        error: error.message,
      });
    }
  }

  async getTopCustomers(req, res) {
    try {
      const data = await analyticsService.getTopCustomers();
      return res.status(200).json({
        success: true,
        message: "Top customers fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching top customers",
        error: error.message,
      });
    }
  }

  async getTopSellingProducts(req, res) {
    try {
      const data = await analyticsService.getTopSellingProducts();
      return res.status(200).json({
        success: true,
        message: "Top selling products fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching top selling products",
        error: error.message,
      });
    }
  }

  async getLowSellingProducts(req, res) {
    try {
      const data = await analyticsService.getLowSellingProducts();
      return res.status(200).json({
        success: true,
        message: "Low selling products fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching low selling products",
        error: error.message,
      });
    }
  }

  async getTopCategories(req, res) {
    try {
      const data = await analyticsService.getTopCategories();
      return res.status(200).json({
        success: true,
        message: "Top categories fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching top categories",
        error: error.message,
      });
    }
  }

  async getPaymentDistribution(req, res) {
    try {
      const data = await analyticsService.getPaymentDistribution();
      return res.status(200).json({
        success: true,
        message: "Payment distribution fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching payment distribution",
        error: error.message,
      });
    }
  }

  async getTopCities(req, res) {
    try {
      const data = await analyticsService.getTopCities();
      return res.status(200).json({
        success: true,
        message: "Top cities fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching top cities",
        error: error.message,
      });
    }
  }

  async getReturnRateAnalytics(req, res) {
    try {
      const data = await analyticsService.getReturnRateAnalytics();
      return res.status(200).json({
        success: true,
        message: "Return rate analytics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching return rate analytics",
        error: error.message,
      });
    }
  }

  async getDiscountUsageAnalytics(req, res) {
    try {
      const data = await analyticsService.getDiscountUsageAnalytics();
      return res.status(200).json({
        success: true,
        message: "Discount usage analytics fetched",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching discount usage analytics",
        error: error.message,
      });
    }
  }
}

module.exports = new AnalyticsController();
