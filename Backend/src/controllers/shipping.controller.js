const shippingService = require("../services/shipping.service");

class ShippingController {
  async trackShipment(req, res) {
    try {
      const { orderId } = req.params;
      const data = await shippingService.trackShipment(orderId);
      if (!data) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Shipment tracked successfully",
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const data = await shippingService.updateStatus(orderId, status);
      if (!data) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.status(200).json({
        success: true,
        message: `Shipping status updated to ${status}`,
        data
      });
    } catch (error) {
      const status = error.message.includes("Invalid status") ? 400 : 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  async getPendingShipments(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const data = await shippingService.getOrdersByStatus({ OrderStatus: /^pending$/i }, page, limit);
      return res.status(200).json({
        success: true,
        message: "Pending shipments fetched",
        ...data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getDeliveredShipments(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const data = await shippingService.getOrdersByStatus({ OrderStatus: /^delivered$/i }, page, limit);
      return res.status(200).json({
        success: true,
        message: "Delivered shipments fetched",
        ...data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getReturnedShipments(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const query = { OrderStatus: { $in: [/^refunded$/i, /^returned$/i] } };
      const data = await shippingService.getOrdersByStatus(query, page, limit);
      return res.status(200).json({
        success: true,
        message: "Returned shipments fetched",
        ...data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createLabel(req, res) {
    try {
      const { orderID, labelType = "standard" } = req.body;
      const data = await shippingService.createLabel(orderID, labelType);
      if (!data) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Shipping label created successfully",
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getDeliveryEstimate(req, res) {
    try {
      const { orderId } = req.params;
      const data = await shippingService.getDeliveryEstimate(orderId);
      if (!data) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Delivery estimate calculated",
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCarriers(req, res) {
    try {
      const data = shippingService.getCarriers();
      return res.status(200).json({
        success: true,
        message: "Carriers fetched successfully",
        data
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateAddress(req, res) {
    try {
      const { orderId } = req.params;
      const { city, state, country } = req.body;
      if (!city && !state && !country) {
        return res.status(400).json({
          success: false,
          message: "At least one address field required: city, state, country"
        });
      }
      const data = await shippingService.updateAddress(orderId, { city, state, country });
      if (!data) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Shipping address updated successfully",
        data
      });
    } catch (error) {
      const status = error.message.includes("Cannot change address") ? 400 : 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  async rescheduleDelivery(req, res) {
    try {
      const { orderId } = req.params;
      const { newDeliveryDate, reason } = req.body;
      
      if (!newDeliveryDate) {
        return res.status(400).json({ success: false, message: "newDeliveryDate is required" });
      }
      
      if (new Date(newDeliveryDate) < new Date()) {
        return res.status(400).json({ success: false, message: "Delivery date must be in the future" });
      }

      const data = await shippingService.rescheduleDelivery(orderId, newDeliveryDate, reason);
      if (!data) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Delivery rescheduled successfully",
        data
      });
    } catch (error) {
      const status = error.message.includes("Reschedule only allowed") ? 400 : 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ShippingController();
