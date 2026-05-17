const Order = require("../models/order.model");

// SHARED HELPERS
const assignCarrier = (paymentMethod) => {
  const map = {
    "UPI": "BlueDart",
    "Debit Card": "FedEx",
    "Credit Card": "DHL",
    "Net Banking": "DTDC",
    "COD": "India Post",
    "Wallet": "Delhivery"
  };
  return map[paymentMethod] || "ShipRocket";
};

const estimateDelivery = (orderDate, days = 7) => {
  const date = new Date(orderDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

const VALID_STATUSES = [
  "Pending", "Shipped", "Out for Delivery",
  "Delivered", "Returned", "Cancelled"
];

const DELIVERY_DAYS = {
  "BlueDart": 3, "FedEx": 5, "DHL": 4,
  "DTDC": 6, "India Post": 10, "Delhivery": 4, "ShipRocket": 7
};

const CATEGORY_ADJUSTMENT = {
  "Electronics": 1, "Books": 0, "Clothing": 2, "Furniture": 5, "Food": -1
};

class ShippingService {
  /**
   * Track a shipment by OrderID
   */
  async trackShipment(orderId) {
    try {
      const order = await Order.findOne({ OrderID: orderId }).lean();
      if (!order) return null;

      const carrier = assignCarrier(order.PaymentMethod);
      const estimatedDelivery = estimateDelivery(order.OrderDate, 7);
      
      const lastStatusUpdate = order.statusHistory && order.statusHistory.length > 0
        ? order.statusHistory[order.statusHistory.length - 1].changedAt
        : order.OrderDate;

      return {
        trackingID: "TRK-" + order.OrderID,
        orderID: order.OrderID,
        currentStatus: order.OrderStatus,
        carrier,
        estimatedDelivery,
        shippingAddress: {
          city: order.City,
          state: order.State,
          country: order.Country
        },
        customerName: order.CustomerName,
        productName: order.ProductName,
        statusHistory: order.statusHistory || [],
        lastUpdated: lastStatusUpdate
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update the shipping/order status for a given OrderID
   */
  async updateStatus(orderId, newStatus) {
    try {
      if (!VALID_STATUSES.includes(newStatus)) {
        throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
      }

      const order = await Order.findOne({ OrderID: orderId });
      if (!order) return null;

      const previousStatus = order.OrderStatus;
      
      const updatedOrder = await Order.findOneAndUpdate(
        { OrderID: orderId },
        {
          $set: { OrderStatus: newStatus },
          $push: { statusHistory: { status: newStatus, changedAt: new Date() } }
        },
        { new: true }
      );

      return {
        orderID: updatedOrder.OrderID,
        previousStatus,
        newStatus: updatedOrder.OrderStatus,
        updatedAt: new Date().toISOString(),
        statusHistory: updatedOrder.statusHistory
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch paginated orders by status
   */
  async getOrdersByStatus(statusQuery, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [orders, total] = await Promise.all([
        Order.find(statusQuery)
          .select("OrderID CustomerName ProductName City State Country OrderDate ShippingCost OrderStatus SellerID")
          .skip(skip)
          .limit(limit)
          .lean(),
        Order.countDocuments(statusQuery)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        orders,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate a simulated shipping label
   */
  async createLabel(orderId, labelType = "standard") {
    try {
      const order = await Order.findOne({ OrderID: orderId });
      if (!order) return null;

      const carrier = assignCarrier(order.PaymentMethod);
      const labelID = "LBL-" + order.OrderID + "-" + Date.now();
      const barcode = "BAR" + Math.random().toString(36).substring(2, 10).toUpperCase();

      await Order.findOneAndUpdate(
        { OrderID: orderId },
        { $push: { statusHistory: { status: "Label Created", changedAt: new Date() } } }
      );

      return {
        labelID,
        barcode,
        carrier,
        labelType,
        shipFrom: { name: "Amazon Warehouse", city: "Mumbai", state: "MH", country: "India" },
        shipTo: { name: order.CustomerName, city: order.City, state: order.State, country: order.Country },
        package: { productName: order.ProductName, quantity: order.Quantity, weight: "0.5 kg" },
        generatedAt: new Date().toISOString(),
        status: "Label Created"
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Estimate delivery date based on carrier and category
   */
  async getDeliveryEstimate(orderId) {
    try {
      const order = await Order.findOne({ OrderID: orderId }).lean();
      if (!order) return null;

      const carrier = assignCarrier(order.PaymentMethod);
      const baseDays = DELIVERY_DAYS[carrier] || 7;
      const adjustment = CATEGORY_ADJUSTMENT[order.Category] || 0;
      const totalDays = baseDays + adjustment;
      const estimatedDate = estimateDelivery(order.OrderDate, totalDays);

      const earliestDate = estimateDelivery(order.OrderDate, totalDays - 1);
      const latestDate = estimateDelivery(order.OrderDate, totalDays + 1);

      return {
        orderID: order.OrderID,
        carrier,
        category: order.Category,
        baseDays,
        adjustment,
        totalEstimatedDays: totalDays,
        orderDate: order.OrderDate,
        estimatedDelivery: estimatedDate,
        deliveryWindow: {
          earliest: earliestDate,
          latest: latestDate
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Static carrier information
   */
  getCarriers() {
    const carriers = [
      {
        name: "BlueDart",
        code: "BD",
        deliveryDays: 3,
        supportedPayments: ["UPI"],
        trackingPrefix: "BD",
        rating: 4.5,
        costRange: "₹40 - ₹120"
      },
      {
        name: "FedEx",
        code: "FX",
        deliveryDays: 5,
        supportedPayments: ["Debit Card"],
        trackingPrefix: "FX",
        rating: 4.2,
        costRange: "₹60 - ₹200"
      },
      {
        name: "DHL",
        code: "DH",
        deliveryDays: 4,
        supportedPayments: ["Credit Card"],
        trackingPrefix: "DH",
        rating: 4.4,
        costRange: "₹80 - ₹250"
      },
      {
        name: "DTDC",
        code: "DT",
        deliveryDays: 6,
        supportedPayments: ["Net Banking"],
        trackingPrefix: "DT",
        rating: 3.9,
        costRange: "₹30 - ₹100"
      },
      {
        name: "India Post",
        code: "IP",
        deliveryDays: 10,
        supportedPayments: ["COD"],
        trackingPrefix: "IP",
        rating: 3.5,
        costRange: "₹15 - ₹60"
      },
      {
        name: "Delhivery",
        code: "DV",
        deliveryDays: 4,
        supportedPayments: ["Wallet"],
        trackingPrefix: "DV",
        rating: 4.1,
        costRange: "₹35 - ₹110"
      },
      {
        name: "ShipRocket",
        code: "SR",
        deliveryDays: 7,
        supportedPayments: ["All"],
        trackingPrefix: "SR",
        rating: 4.0,
        costRange: "₹25 - ₹150"
      }
    ];
    
    return {
      totalCarriers: carriers.length,
      carriers
    };
  }

  /**
   * Update shipping address
   */
  async updateAddress(orderId, addressData) {
    try {
      const order = await Order.findOne({ OrderID: orderId });
      if (!order) return null;

      if (order.OrderStatus === "Delivered" || order.OrderStatus === "Cancelled") {
        throw new Error("Cannot change address for Delivered or Cancelled orders");
      }

      const previousAddress = { city: order.City, state: order.State, country: order.Country };
      
      const updateSet = {};
      if (addressData.city) updateSet.City = addressData.city;
      if (addressData.state) updateSet.State = addressData.state;
      if (addressData.country) updateSet.Country = addressData.country;

      const updatedOrder = await Order.findOneAndUpdate(
        { OrderID: orderId },
        {
          $set: updateSet,
          $push: { statusHistory: { status: "Address Updated", changedAt: new Date() } }
        },
        { new: true }
      );

      return {
        orderID: updatedOrder.OrderID,
        previousAddress,
        newAddress: { city: updatedOrder.City, state: updatedOrder.State, country: updatedOrder.Country },
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reschedule delivery
   */
  async rescheduleDelivery(orderId, newDeliveryDate, reason) {
    try {
      const order = await Order.findOne({ OrderID: orderId }).lean();
      if (!order) return null;

      if (order.OrderStatus !== "Pending" && order.OrderStatus !== "Shipped") {
        throw new Error("Reschedule only allowed for Pending or Shipped orders");
      }

      await Order.findOneAndUpdate(
        { OrderID: orderId },
        {
          $push: {
            statusHistory: {
              status: "Rescheduled",
              changedAt: new Date(),
              newDeliveryDate: newDeliveryDate,
              reason: reason || "No reason provided"
            }
          }
        }
      );

      return {
        orderID: order.OrderID,
        previousEstimate: estimateDelivery(order.OrderDate, 7),
        newDeliveryDate,
        reason: reason || "No reason provided",
        status: "Rescheduled",
        rescheduledAt: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ShippingService();
