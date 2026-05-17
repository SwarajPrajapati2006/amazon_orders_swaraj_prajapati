const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shipping.controller");

// Tracking
router.get("/tracking/:orderId", shippingController.trackShipment);

// Status updates
router.patch("/update-status/:orderId", shippingController.updateStatus);

// Order lists by status
router.get("/pending", shippingController.getPendingShipments);
router.get("/delivered", shippingController.getDeliveredShipments);
router.get("/returned", shippingController.getReturnedShipments);

// Label generation
router.post("/create-label", shippingController.createLabel);

// Estimates and Carriers
router.get("/estimate/:orderId", shippingController.getDeliveryEstimate);
router.get("/carriers", shippingController.getCarriers);

// Address and Rescheduling
router.patch("/change-address/:orderId", shippingController.updateAddress);
router.post("/reschedule/:orderId", shippingController.rescheduleDelivery);

module.exports = router;
