const paginationService = require("../services/pagination.service");

const extractPagination = (query, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

class PaginationController {
  async getPaged(req, res) {
    try {
      const { page, limit, skip } = extractPagination(req.query);
      const queryObj = {};
      
      if (req.query.status) queryObj.OrderStatus = new RegExp(req.query.status, "i");
      if (req.query.category) queryObj.Category = new RegExp(req.query.category, "i");
      if (req.query.brand) queryObj.Brand = new RegExp(req.query.brand, "i");
      if (req.query.country) queryObj.Country = new RegExp(req.query.country, "i");
      if (req.query.city) queryObj.City = new RegExp(req.query.city, "i");
      if (req.query.state) queryObj.State = new RegExp(req.query.state, "i");

      const result = await paginationService.getPagedOrders(queryObj, page, limit, skip);
      res.status(200).json({
        success: true,
        message: "Paged orders fetched successfully",
        ...result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching paged orders", error: error.message });
    }
  }

  async getInfinite(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const result = await paginationService.getInfiniteOrders(page);
      res.status(200).json({
        success: true,
        message: "Infinite scroll orders fetched successfully",
        ...result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching infinite orders", error: error.message });
    }
  }

  async getRecent(req, res) {
    try {
      const { page, limit, skip } = extractPagination(req.query, 5);
      const result = await paginationService.getRecentOrders(page, limit, skip);
      res.status(200).json({
        success: true,
        message: "Recent orders fetched successfully",
        ...result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching recent orders", error: error.message });
    }
  }

  async getCancelled(req, res) {
    try {
      const { page, limit, skip } = extractPagination(req.query);
      const result = await paginationService.getByStatus("Cancelled", page, limit, skip);
      res.status(200).json({
        success: true,
        message: "Cancelled orders fetched successfully",
        ...result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching cancelled orders", error: error.message });
    }
  }

  async getRefunded(req, res) {
    try {
      const { page, limit, skip } = extractPagination(req.query);
      const result = await paginationService.getByStatus("Refunded", page, limit, skip);
      res.status(200).json({
        success: true,
        message: "Refunded orders fetched successfully",
        ...result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching refunded orders", error: error.message });
    }
  }

  async getByCustomer(req, res) {
    try {
      const { page, limit, skip } = extractPagination(req.query);
      const result = await paginationService.getByCustomer(req.params.customerId, page, limit, skip);
      if (!result) {
        return res.status(404).json({ success: false, message: "No orders found for this customer" });
      }
      res.status(200).json({
        success: true,
        message: "Customer orders fetched successfully",
        ...result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching customer orders", error: error.message });
    }
  }

  async getByProduct(req, res) {
    try {
      const { page, limit, skip } = extractPagination(req.query);
      const result = await paginationService.getByProduct(req.params.productId, page, limit, skip);
      if (!result) {
        return res.status(404).json({ success: false, message: "No orders found for this product" });
      }
      res.status(200).json({
        success: true,
        message: "Product orders fetched successfully",
        ...result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching product orders", error: error.message });
    }
  }
}

module.exports = new PaginationController();
