const express = require("express");
const router = express.Router();
const filterController = require("../controllers/filter.controller");

// Base: /api/v1/orders/filter

router.get("/status", filterController.filterStatus);
router.get("/payment", filterController.filterPayment);
router.get("/category", filterController.filterCategory);
router.get("/brand", filterController.filterBrand);
router.get("/price", filterController.filterPrice);
router.get("/date", filterController.filterDate);
router.get("/country", filterController.filterCountry);
router.get("/state", filterController.filterState);
router.get("/city", filterController.filterCity);
router.get("/high-value", filterController.filterHighValue);
router.get("/discounted", filterController.filterDiscounted);
router.get("/cancelled", filterController.filterCancelled);
router.get("/refunded", filterController.filterRefunded);
router.get("/shipped", filterController.filterShipped);
router.get("/delivered", filterController.filterDelivered);

module.exports = router;
