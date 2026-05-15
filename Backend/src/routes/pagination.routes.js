const express = require("express");
const router = express.Router();
const paginationController = require("../controllers/pagination.controller");

// Base: /api/v1/orders

router.get("/paged", paginationController.getPaged);
router.get("/infinite", paginationController.getInfinite);
router.get("/recent", paginationController.getRecent);
router.get("/cancelled", paginationController.getCancelled);
router.get("/refunded", paginationController.getRefunded);
router.get("/customer/:customerId", paginationController.getByCustomer);
router.get("/product/:productId", paginationController.getByProduct);

module.exports = router;
