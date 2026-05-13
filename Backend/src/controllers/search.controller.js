const searchService = require("../services/search.service");

class SearchController {
  async searchAll(req, res) {
    try {
      const { q, page, limit } = req.query;
      const result = await searchService.searchAll(q, parseInt(page), parseInt(limit));
      res.status(200).json({
        success: true,
        message: "Search results retrieved",
        ...result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Search failed", error: error.message });
    }
  }

  async searchCustomer(req, res) {
    try {
      const { q, page, limit } = req.query;
      const projection = { OrderID: 1, CustomerName: 1, CustomerID: 1, OrderStatus: 1 };
      const result = await searchService.searchByField("CustomerName", q, parseInt(page), parseInt(limit), projection);
      res.status(200).json({ success: true, message: "Customer search results", ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Customer search failed", error: error.message });
    }
  }

  async searchProduct(req, res) {
    try {
      const { q, page, limit } = req.query;
      const projection = { OrderID: 1, ProductName: 1, Brand: 1, Category: 1, TotalAmount: 1, OrderStatus: 1 };
      const result = await searchService.searchByField("ProductName", q, parseInt(page), parseInt(limit), projection);
      res.status(200).json({ success: true, message: "Product search results", ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Product search failed", error: error.message });
    }
  }

  async searchCategory(req, res) {
    try {
      const { q, page, limit } = req.query;
      const projection = { OrderID: 1, Category: 1, ProductName: 1, Brand: 1 };
      const result = await searchService.searchByField("Category", q, parseInt(page), parseInt(limit), projection);
      res.status(200).json({ success: true, message: "Category search results", ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Category search failed", error: error.message });
    }
  }

  async searchBrand(req, res) {
    try {
      const { q, page, limit } = req.query;
      const projection = { OrderID: 1, Brand: 1, ProductName: 1, Category: 1, OrderStatus: 1 };
      const result = await searchService.searchByField("Brand", q, parseInt(page), parseInt(limit), projection);
      res.status(200).json({ success: true, message: "Brand search results", ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Brand search failed", error: error.message });
    }
  }

  async searchStatus(req, res) {
    try {
      const { q, page, limit } = req.query;
      const projection = { OrderID: 1, OrderStatus: 1, CustomerName: 1, ProductName: 1 };
      const result = await searchService.searchByField("OrderStatus", q, parseInt(page), parseInt(limit), projection);
      res.status(200).json({ success: true, message: "Status search results", ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Status search failed", error: error.message });
    }
  }

  async searchPayment(req, res) {
    try {
      const { q, page, limit } = req.query;
      const projection = { OrderID: 1, PaymentMethod: 1, TotalAmount: 1, CustomerName: 1 };
      const result = await searchService.searchByField("PaymentMethod", q, parseInt(page), parseInt(limit), projection);
      res.status(200).json({ success: true, message: "Payment search results", ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Payment search failed", error: error.message });
    }
  }

  async searchLocation(req, res) {
    try {
      const { q, page, limit } = req.query;
      const projection = { OrderID: 1, City: 1, State: 1, Country: 1, CustomerName: 1 };
      const result = await searchService.searchLocation(q, parseInt(page), parseInt(limit), projection);
      res.status(200).json({ success: true, message: "Location search results", ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Location search failed", error: error.message });
    }
  }

  async searchDate(req, res) {
    try {
      const { q, page, limit } = req.query;
      const projection = { OrderID: 1, OrderDate: 1, CustomerName: 1, ProductName: 1 };
      const result = await searchService.searchDate(q, parseInt(page), parseInt(limit), projection);
      res.status(200).json({ success: true, message: "Date search results", ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Date search failed", error: error.message });
    }
  }

  async searchTracking(req, res) {
    try {
      const { q, page, limit } = req.query;
      const projection = { OrderID: 1, OrderStatus: 1, CustomerName: 1, ProductName: 1, OrderDate: 1 };
      const result = await searchService.searchByField("OrderID", q, parseInt(page), parseInt(limit), projection);
      res.status(200).json({ success: true, message: "Tracking search results", ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Tracking search failed", error: error.message });
    }
  }

  async searchFuzzy(req, res) {
    try {
      const { q, page, limit } = req.query;
      const result = await searchService.searchFuzzy(q, parseInt(page), parseInt(limit));
      res.status(200).json({ success: true, message: "Fuzzy search results", ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Fuzzy search failed", error: error.message });
    }
  }

  async autocomplete(req, res) {
    try {
      const { q } = req.query;
      const suggestions = await searchService.autocomplete(q);
      res.status(200).json({ success: true, suggestions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Autocomplete failed", error: error.message });
    }
  }

  async searchHighlight(req, res) {
    try {
      const { q, page, limit } = req.query;
      const result = await searchService.searchHighlight(q, parseInt(page), parseInt(limit));
      res.status(200).json({ success: true, message: "Highlight search results", ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Highlight search failed", error: error.message });
    }
  }

  async getRecent(req, res) {
    try {
      const data = searchService.getRecentSearches();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get recent searches", error: error.message });
    }
  }

  async getPopular(req, res) {
    try {
      const data = searchService.getPopularSearches();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get popular searches", error: error.message });
    }
  }
}

module.exports = new SearchController();
