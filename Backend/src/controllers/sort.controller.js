const sortService = require("../services/sort.service");

const buildPaginationMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page < Math.ceil(total / limit),
  hasPrevPage: page > 1
});

class SortController {
  async getHighestValue(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 10);
      const { data, total } = await sortService.getHighestValue(page, limit);
      res.status(200).json({
        success: true,
        message: "Orders sorted by highest value",
        data,
        ...buildPaginationMeta(page, limit, total)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error sorting by highest value", error: error.message });
    }
  }

  async getLowestValue(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 10);
      const { data, total } = await sortService.getLowestValue(page, limit);
      res.status(200).json({
        success: true,
        message: "Orders sorted by lowest value",
        data,
        ...buildPaginationMeta(page, limit, total)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error sorting by lowest value", error: error.message });
    }
  }

  async getLatest(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 10);
      const { data, total } = await sortService.getLatest(page, limit);
      res.status(200).json({
        success: true,
        message: "Orders sorted by latest date",
        data,
        ...buildPaginationMeta(page, limit, total)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error sorting by latest date", error: error.message });
    }
  }

  async getOldest(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 10);
      const { data, total } = await sortService.getOldest(page, limit);
      res.status(200).json({
        success: true,
        message: "Orders sorted by oldest date",
        data,
        ...buildPaginationMeta(page, limit, total)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error sorting by oldest date", error: error.message });
    }
  }

  async getMostItems(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 10);
      const { data, total } = await sortService.getMostItems(page, limit);
      res.status(200).json({
        success: true,
        message: "Orders sorted by most items",
        data,
        ...buildPaginationMeta(page, limit, total)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error sorting by most items", error: error.message });
    }
  }

  async getLeastItems(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 10);
      const { data, total } = await sortService.getLeastItems(page, limit);
      res.status(200).json({
        success: true,
        message: "Orders sorted by least items",
        data,
        ...buildPaginationMeta(page, limit, total)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error sorting by least items", error: error.message });
    }
  }

  async getDiscountSort(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 10);
      const { data, total } = await sortService.getDiscountSort(page, limit);
      res.status(200).json({
        success: true,
        message: "Orders sorted by discount",
        data,
        ...buildPaginationMeta(page, limit, total)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error sorting by discount", error: error.message });
    }
  }
}

module.exports = new SortController();
