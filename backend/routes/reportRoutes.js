const express = require("express");
const { roomUtilization } = require("../controllers/reportController");
const router = express.Router();

router.get("/room-utilization", roomUtilization);

module.exports = router;
