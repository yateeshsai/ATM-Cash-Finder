const express = require("express");

const router = express.Router();

const {
    getATMs,
    getNearbyATMs,
    checkCashAvailability,
    searchATMs
} = require("../controllers/atmController");

router.get("/", getATMs);
router.get("/check", checkCashAvailability);
router.get("/nearby", getNearbyATMs);
router.get("/search",searchATMs);
module.exports = router;