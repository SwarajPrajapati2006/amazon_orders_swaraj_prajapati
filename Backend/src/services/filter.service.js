const Order = require("../models/order.model");

const paginate = (query, page, limit) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit).lean();
};

const filterByStatus = async (status, page, limit) => {
  const skip = (page - 1) * limit;
  const query = { OrderStatus: new RegExp(`^${status}$`, "i") };
  const [data, total] = await Promise.all([
    Order.find(query).skip(skip).limit(limit).lean(),
    Order.countDocuments(query)
  ]);
  return { data, total };
};

class FilterService {
  async filterByStatus(status, page, limit) {
    return await filterByStatus(status, page, limit);
  }

  async filterByField(field, value, page, limit) {
    const skip = (page - 1) * limit;
    const query = { [field]: new RegExp(value, "i") };
    const [data, total] = await Promise.all([
      Order.find(query).skip(skip).limit(limit).lean(),
      Order.countDocuments(query)
    ]);
    return { data, total };
  }

  async filterByPrice(min, max, page, limit) {
    const skip = (page - 1) * limit;
    const conditions = [];
    if (min !== undefined) {
      conditions.push({ $gte: [{ $toDouble: "$TotalAmount" }, min] });
    }
    if (max !== undefined) {
      conditions.push({ $lte: [{ $toDouble: "$TotalAmount" }, max] });
    }

    const query = { $expr: { $and: conditions } };
    const [data, total] = await Promise.all([
      Order.find(query).skip(skip).limit(limit).lean(),
      Order.countDocuments(query)
    ]);
    return { data, total };
  }

  async filterByDate(start, end, page, limit) {
    const skip = (page - 1) * limit;
    const query = { OrderDate: {} };
    if (start) query.OrderDate.$gte = start;
    if (end) query.OrderDate.$lte = end;

    const [data, total] = await Promise.all([
      Order.find(query).skip(skip).limit(limit).lean(),
      Order.countDocuments(query)
    ]);
    return { data, total };
  }

  async filterHighValue(amount, page, limit) {
    const skip = (page - 1) * limit;
    const query = {
      $expr: { $gte: [{ $toDouble: "$TotalAmount" }, amount] }
    };
    const [data, total] = await Promise.all([
      Order.find(query).skip(skip).limit(limit).lean(),
      Order.countDocuments(query)
    ]);
    return { data, total };
  }

  async filterDiscounted(page, limit) {
    const skip = (page - 1) * limit;
    const query = {
      $expr: { $gt: [{ $toDouble: "$Discount" }, 0] }
    };
    const [data, total] = await Promise.all([
      Order.find(query).skip(skip).limit(limit).lean(),
      Order.countDocuments(query)
    ]);
    return { data, total };
  }
}

module.exports = new FilterService();
