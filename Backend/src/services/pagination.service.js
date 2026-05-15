const Order = require("../models/order.model");

const buildPaginationMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page < Math.ceil(total / limit),
  hasPrevPage: page > 1
});

class PaginationService {
  async getPagedOrders(queryObj, page, limit, skip) {
    const [data, total] = await Promise.all([
      Order.find(queryObj).skip(skip).limit(limit).lean(),
      Order.countDocuments(queryObj)
    ]);
    const meta = buildPaginationMeta(page, limit, total);
    return { data, ...meta };
  }

  async getInfiniteOrders(page) {
    const limit = 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Order.find().skip(skip).limit(limit).lean(),
      Order.countDocuments()
    ]);
    
    const hasMore = skip + data.length < total;
    const nextPage = hasMore ? page + 1 : null;
    
    return { data, nextPage, hasMore, total };
  }

  async getRecentOrders(page, limit, skip) {
    const [data, total] = await Promise.all([
      Order.find().sort({ OrderDate: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments()
    ]);
    const meta = buildPaginationMeta(page, limit, total);
    return { data, ...meta };
  }

  async getByStatus(status, page, limit, skip) {
    const query = { OrderStatus: new RegExp(`^${status}$`, "i") };
    const [data, total] = await Promise.all([
      Order.find(query).skip(skip).limit(limit).lean(),
      Order.countDocuments(query)
    ]);
    const meta = buildPaginationMeta(page, limit, total);
    return { data, ...meta };
  }

  async getByCustomer(customerId, page, limit, skip) {
    const query = { CustomerID: customerId };
    const [data, total] = await Promise.all([
      Order.find(query).skip(skip).limit(limit).lean(),
      Order.countDocuments(query)
    ]);
    if (total === 0) return null;
    const meta = buildPaginationMeta(page, limit, total);
    return { data, ...meta };
  }

  async getByProduct(productId, page, limit, skip) {
    const query = { ProductID: productId };
    const [data, total] = await Promise.all([
      Order.find(query).skip(skip).limit(limit).lean(),
      Order.countDocuments(query)
    ]);
    if (total === 0) return null;
    const meta = buildPaginationMeta(page, limit, total);
    return { data, ...meta };
  }
}

module.exports = new PaginationService();
