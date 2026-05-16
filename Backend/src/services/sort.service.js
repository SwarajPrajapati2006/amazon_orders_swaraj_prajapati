const Order = require("../models/order.model");

const numericSort = async (field, order, page, limit) => {
  const skip = (page - 1) * limit;
  const numField = field + "Num";

  const [data, total] = await Promise.all([
    Order.aggregate([
      { $addFields: { [numField]: { $toDouble: `$${field}` } } },
      { $sort: { [numField]: order } },
      { $skip: skip },
      { $limit: limit },
      { $project: { [numField]: 0 } }
    ]),
    Order.countDocuments({})
  ]);

  return { data, total };
};

const stringSort = async (sortObj, page, limit) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Order.find({}).sort(sortObj).skip(skip).limit(limit).lean(),
    Order.countDocuments({})
  ]);
  return { data, total };
};

class SortService {
  async getHighestValue(page, limit) {
    return await numericSort("TotalAmount", -1, page, limit);
  }

  async getLowestValue(page, limit) {
    return await numericSort("TotalAmount", 1, page, limit);
  }

  async getLatest(page, limit) {
    return await stringSort({ OrderDate: -1 }, page, limit);
  }

  async getOldest(page, limit) {
    return await stringSort({ OrderDate: 1 }, page, limit);
  }

  async getMostItems(page, limit) {
    return await numericSort("Quantity", -1, page, limit);
  }

  async getLeastItems(page, limit) {
    return await numericSort("Quantity", 1, page, limit);
  }

  async getDiscountSort(page, limit) {
    return await numericSort("Discount", -1, page, limit);
  }
}

module.exports = new SortService();
