const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");

// Base: /api/v1/orders/search

router.get("/", searchController.searchAll);
router.get("/customer", searchController.searchCustomer);
router.get("/product", searchController.searchProduct);
router.get("/category", searchController.searchCategory);
router.get("/brand", searchController.searchBrand);
router.get("/status", searchController.searchStatus);
router.get("/payment", searchController.searchPayment);
router.get("/location", searchController.searchLocation);
router.get("/date", searchController.searchDate);
router.get("/tracking", searchController.searchTracking);
router.get("/fuzzy", searchController.searchFuzzy);
router.get("/autocomplete", searchController.autocomplete);
router.get("/highlight", searchController.searchHighlight);
router.get("/recent", searchController.getRecent);
router.get("/popular", searchController.getPopular);

module.exports = router;
