const mongoose = require("mongoose");
const { getISTNow } = require("../utils/time");

const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  title: { type: String, required: true },
  organizerEmail: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  createdAt: { type: Date, default: () => getISTNow().toISO() }
});

module.exports = mongoose.model("Booking", bookingSchema);
