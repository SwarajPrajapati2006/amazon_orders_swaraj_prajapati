const filterService = require("../services/filter.service");

class FilterController {
  async filterStatus(req, res) {
    try {
      const { type, page = 1, limit = 10 } = req.query;
      if (!type) {
        return res.status(400).json({ success: false, message: "Query param type is required" });
      }
      const result = await filterService.filterByStatus(type, parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: `Orders with status ${type} retrieved`,
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterPayment(req, res) {
    try {
      const { method, page = 1, limit = 10 } = req.query;
      if (!method) {
        return res.status(400).json({ success: false, message: "Query param method is required" });
      }
      const result = await filterService.filterByField("PaymentMethod", method, parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: `Orders with payment method ${method} retrieved`,
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterCategory(req, res) {
    try {
      const { name, page = 1, limit = 10 } = req.query;
      if (!name) {
        return res.status(400).json({ success: false, message: "Query param name is required" });
      }
      const result = await filterService.filterByField("Category", name, parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: `Orders in category ${name} retrieved`,
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterBrand(req, res) {
    try {
      const { name, page = 1, limit = 10 } = req.query;
      if (!name) {
        return res.status(400).json({ success: false, message: "Query param name is required" });
      }
      const result = await filterService.filterByField("Brand", name, parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: `Orders for brand ${name} retrieved`,
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterPrice(req, res) {
    try {
      const { min, max, page = 1, limit = 10 } = req.query;
      const result = await filterService.filterByPrice(
        min ? parseFloat(min) : undefined,
        max ? parseFloat(max) : undefined,
        parseInt(page),
        parseInt(limit)
      );
      res.status(200).json({
        success: true,
        message: "Orders within price range retrieved",
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterDate(req, res) {
    try {
      const { start, end, page = 1, limit = 10 } = req.query;
      const result = await filterService.filterByDate(start, end, parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: "Orders within date range retrieved",
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterCountry(req, res) {
    try {
      const { name, page = 1, limit = 10 } = req.query;
      if (!name) {
        return res.status(400).json({ success: false, message: "Query param name is required" });
      }
      const result = await filterService.filterByField("Country", name, parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: `Orders in country ${name} retrieved`,
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterState(req, res) {
    try {
      const { name, page = 1, limit = 10 } = req.query;
      if (!name) {
        return res.status(400).json({ success: false, message: "Query param name is required" });
      }
      const result = await filterService.filterByField("State", name, parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: `Orders in state ${name} retrieved`,
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterCity(req, res) {
    try {
      const { name, page = 1, limit = 10 } = req.query;
      if (!name) {
        return res.status(400).json({ success: false, message: "Query param name is required" });
      }
      const result = await filterService.filterByField("City", name, parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: `Orders in city ${name} retrieved`,
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterHighValue(req, res) {
    try {
      const { amount = 1000, page = 1, limit = 10 } = req.query;
      const result = await filterService.filterHighValue(parseFloat(amount), parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: `High-value orders (>= ${amount}) retrieved`,
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterDiscounted(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await filterService.filterDiscounted(parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: "Discounted orders retrieved",
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterCancelled(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await filterService.filterByStatus("Cancelled", parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: "Cancelled orders retrieved",
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterRefunded(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await filterService.filterByStatus("Refunded", parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: "Refunded orders retrieved",
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterShipped(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await filterService.filterByStatus("Shipped", parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: "Shipped orders retrieved",
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }

  async filterDelivered(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await filterService.filterByStatus("Delivered", parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: "Delivered orders retrieved",
        ...result,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Filter failed", error: error.message });
    }
  }
}

module.exports = new FilterController();
