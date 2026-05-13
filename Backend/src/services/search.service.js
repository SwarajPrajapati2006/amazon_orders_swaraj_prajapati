const Order = require("../models/order.model");

const recentSearches = [];
const popularSearches = {};

class SearchService {
  trackSearch(q) {
    if (!q) return;
    
    // Recent Searches: push to front, keep last 10, unique only
    const index = recentSearches.indexOf(q);
    if (index  !==-1) {
      recentSearches.splice(index, 1);
    }
    recentSearches.unshift(q);
    if (recentSearches.length > 10) {
      recentSearches.pop();
    }

    // Popular Searches: increment count
    popularSearches[q] = (popularSearches[q] || 0) + 1;
  }

  fuzzyRegex(q) {
    const escaped = q.split("").map(c => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    return new RegExp(escaped.join(".*"), "i");
  }

  highlightText(text, q) {
    if (!text) return text;
    const regex = new RegExp(`(${q})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  async paginate(query, page = 1, limit = 10, projection = {}) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const skip = (p - 1) * l;
    const [data, total] = await Promise.all([
      Order.find(query, projection).skip(skip).limit(l).lean(),
      Order.countDocuments(query)
    ]);
    const totalPages = Math.ceil(total / l);
    return { data, page: p, limit: l, total, totalPages };
  }

  async searchAll(q, page, limit) {
    if (!q) return { data: [], page, limit, total: 0, totalPages: 0 };
    this.trackSearch(q);
    const regex = new RegExp(q, "i");
    const query = {
      $or: [
        { OrderID: regex },
        { CustomerName: regex },
        { ProductName: regex },
        { Category: regex },
        { Brand: regex },
        { OrderStatus: regex },
        { PaymentMethod: regex },
        { City: regex },
        { State: regex },
        { Country: regex }
      ]
    };
    return await this.paginate(query, page, limit);
  }

  async searchByField(field, q, page, limit, projection = {}) {
    if (!q) return { data: [], page, limit, total: 0, totalPages: 0 };
    this.trackSearch(q);
    const regex = new RegExp(q, "i");
    const query = { [field]: regex };
    return await this.paginate(query, page, limit, projection);
  }

  async searchLocation(q, page, limit, projection = {}) {
    if (!q) return { data: [], page, limit, total: 0, totalPages: 0 };
    this.trackSearch(q);
    const regex = new RegExp(q, "i");
    const query = {
      $or: [
        { City: regex },
        { State: regex },
        { Country: regex }
      ]
    };
    return await this.paginate(query, page, limit, projection);
  }

  async searchDate(q, page, limit, projection = {}) {
    if (!q) return { data: [], page, limit, total: 0, totalPages: 0 };
    this.trackSearch(q);
    const regex = new RegExp(q, "i");
    const query = { OrderDate: regex };
    return await this.paginate(query, page, limit, projection);
  }

  async searchFuzzy(q, page, limit) {
    this.trackSearch(q);
    const regex = this.fuzzyRegex(q);
    const query = {
      $or: [
        { ProductName: regex },
        { CustomerName: regex },
        { Category: regex },
        { Brand: regex }
      ]
    };
    return await this.paginate(query, page, limit);
  }

  async autocomplete(q) {
    const regex = new RegExp(`^${q}`, "i");
    const fields = ["ProductName", "CustomerName", "Brand", "Category"];
    
    const results = await Promise.all(
      fields.map(field => 
        Order.distinct(field, { [field]: regex })
      )
    );

    const suggestions = [...new Set(results.flat())].slice(0, 10);
    return suggestions;
  }

  async searchHighlight(q, page, limit) {
    this.trackSearch(q);
    const regex = new RegExp(q, "i");
    const query = {
      $or: [
        { ProductName: regex },
        { CustomerName: regex },
        { Category: regex },
        { Brand: regex }
      ]
    };
    
    const result = await this.paginate(query, page, limit);
    
    result.data = result.data.map(doc => ({
      ...doc,
      ProductName: this.highlightText(doc.ProductName, q),
      CustomerName: this.highlightText(doc.CustomerName, q),
      Category: this.highlightText(doc.Category, q),
      Brand: this.highlightText(doc.Brand, q)
    }));

    return result;
  }

  getRecentSearches() {
    return recentSearches;
  }

  getPopularSearches() {
    return Object.entries(popularSearches)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

module.exports = new SearchService();
