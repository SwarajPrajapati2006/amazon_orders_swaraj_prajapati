const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    OrderID: { type: String, required: true, unique: true },
    OrderDate: { type: String },
    CustomerID: { type: String },
    CustomerName: { type: String },
    ProductID: { type: String },
    ProductName: { type: String },
    Category: { type: String },
    Brand: { type: String },
    Quantity: { type: String },
    UnitPrice: { type: String },
    Discount: { type: String },
    Tax: { type: String },
    ShippingCost: { type: String },
    TotalAmount: { type: String },
    PaymentMethod: { type: String },
    OrderStatus: { type: String },
    City: { type: String },
    State: { type: String },
    Country: { type: String },
    SellerID: { type: String },
    isArchived: { type: Boolean, default: false },
    statusHistory: { type: Array, default: [] },
  },
  {
    collection: "amazonOrders",
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
