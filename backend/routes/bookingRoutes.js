const express = require("express");
const { createBooking, listBookings, cancelBooking } = require("../controllers/bookingController");
const router = express.Router();

router.post("/", createBooking);
router.get("/", listBookings);
router.post("/:id/cancel", cancelBooking);

module.exports = router;
