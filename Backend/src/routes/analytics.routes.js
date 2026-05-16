const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");

// Revenue analytics
router.get("/revenue/total", analyticsController.getTotalRevenue);
router.get("/revenue/monthly", analyticsController.getMonthlyRevenue);
router.get("/revenue/yearly", analyticsController.getYearlyRevenue);

// Order analytics
router.get("/orders/average-value", analyticsController.getAverageOrderValue);
router.get("/orders/count", analyticsController.getOrderCountBreakdown);
router.get("/orders/cancelled", analyticsController.getCancelledOrdersAnalytics);
router.get("/orders/refunded", analyticsController.getRefundedOrdersAnalytics);

// Customer analytics
router.get("/customers/top", analyticsController.getTopCustomers);

// Product analytics
router.get("/products/top-selling", analyticsController.getTopSellingProducts);
router.get("/products/low-selling", analyticsController.getLowSellingProducts);

// Category analytics
router.get("/categories/top", analyticsController.getTopCategories);

// Payment analytics
router.get("/payments/distribution", analyticsController.getPaymentDistribution);

// Location analytics
router.get("/locations/top-cities", analyticsController.getTopCities);

// Return analytics
router.get("/returns/rate", analyticsController.getReturnRateAnalytics);

// Discount analytics
router.get("/discounts/usage", analyticsController.getDiscountUsageAnalytics);

module.exports = router;
