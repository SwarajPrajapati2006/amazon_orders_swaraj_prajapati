const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// Base: /api/v1/orders

router.get("/", orderController.getAllOrders);
router.post("/", orderController.createOrder);

router.get("/:orderId", orderController.getOrderById);
router.put("/:orderId", orderController.updateOrder);
router.patch("/:orderId", orderController.patchOrder);
router.delete("/:orderId", orderController.deleteOrder);

router.get("/:orderId/exists", orderController.checkExists);
router.get("/:orderId/summary", orderController.getOrderSummary);
router.get("/:orderId/items", orderController.getOrderItems);
router.get("/:orderId/history", orderController.getOrderHistory);
router.get("/:orderId/invoice", orderController.getOrderInvoice);

router.patch("/:orderId/archive", orderController.archiveOrder);
router.patch("/:orderId/restore", orderController.restoreOrder);
router.post("/:orderId/cancel", orderController.cancelOrder);
router.post("/:orderId/duplicate", orderController.duplicateOrder);

module.exports = router;
