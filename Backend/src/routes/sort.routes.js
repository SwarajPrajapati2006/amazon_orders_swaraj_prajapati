const express = require("express");
const router = express.Router();
const sortController = require("../controllers/sort.controller");

// Base: /api/v1/orders/sort

router.get("/highest-value", sortController.getHighestValue);
router.get("/lowest-value", sortController.getLowestValue);
router.get("/latest", sortController.getLatest);
router.get("/oldest", sortController.getOldest);
router.get("/most-items", sortController.getMostItems);
router.get("/least-items", sortController.getLeastItems);
router.get("/discount", sortController.getDiscountSort);

module.exports = router;
