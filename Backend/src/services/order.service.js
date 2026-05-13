const Order = require("../models/order.model");

class OrderService {
  async getAllOrders(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Order.find().skip(skip).limit(limit).lean(),
      Order.countDocuments(),
    ]);
    const totalPages = Math.ceil(total / limit);
    return { data, page, limit, total, totalPages };
  }

  async getOrderById(orderId) {
    return await Order.findOne({ OrderID: orderId }).lean();
  }

  async createOrder(orderData) {
    const order = new Order(orderData);
    return await order.save();
  }

  async updateOrder(orderId, orderData) {
    const { _id, OrderID, ...updateData } = orderData; // Prevent changing ID fields accidentally
    return await Order.findOneAndReplace(
      { OrderID: orderId },
      { ...updateData, OrderID: orderId },
      { new: true, runValidators: true }
    );
  }

  async patchOrder(orderId, orderData) {
    return await Order.findOneAndUpdate(
      { OrderID: orderId },
      { $set: orderData },
      { new: true }
    );
  }

  async deleteOrder(orderId) {
    return await Order.findOneAndDelete({ OrderID: orderId });
  }

  async checkExists(orderId) {
    const order = await Order.findOne({ OrderID: orderId }, { _id: 1 }).lean();
    return !!order;
  }

  async getOrderSummary(orderId) {
    return await Order.findOne(
      { OrderID: orderId },
      { OrderID: 1, CustomerName: 1, ProductName: 1, TotalAmount: 1, OrderStatus: 1 }
    ).lean();
  }

  async getOrderItems(orderId) {
    return await Order.findOne(
      { OrderID: orderId },
      { ProductID: 1, ProductName: 1, Category: 1, Brand: 1, Quantity: 1, UnitPrice: 1, Discount: 1 }
    ).lean();
  }

  async getOrderHistory(orderId) {
    const order = await Order.findOne({ OrderID: orderId }, { statusHistory: 1 }).lean();
    return order ? order.statusHistory : null;
  }

  async getOrderInvoice(orderId) {
    return await Order.findOne(
      { OrderID: orderId },
      {
        OrderID: 1,
        CustomerName: 1,
        ProductName: 1,
        Quantity: 1,
        UnitPrice: 1,
        Discount: 1,
        Tax: 1,
        ShippingCost: 1,
        TotalAmount: 1,
        PaymentMethod: 1,
      }
    ).lean();
  }

  async archiveOrder(orderId) {
    return await Order.findOneAndUpdate(
      { OrderID: orderId },
      { $set: { isArchived: true } },
      { new: true }
    );
  }

  async restoreOrder(orderId) {
    return await Order.findOneAndUpdate(
      { OrderID: orderId },
      { $set: { isArchived: false } },
      { new: true }
    );
  }

  async cancelOrder(orderId) {
    return await Order.findOneAndUpdate(
      { OrderID: orderId },
      {
        $set: { OrderStatus: "Cancelled" },
        $push: { statusHistory: { status: "Cancelled", changedAt: new Date() } },
      },
      { new: true }
    );
  }

  async duplicateOrder(orderId) {
    const originalOrder = await Order.findOne({ OrderID: orderId }).lean();
    if (!originalOrder) return null;

    const { _id, ...orderData } = originalOrder;
    orderData.OrderID = `${originalOrder.OrderID}-COPY-${Date.now()}`;
    
    const newOrder = new Order(orderData);
    return await newOrder.save();
  }
}

module.exports = new OrderService();
