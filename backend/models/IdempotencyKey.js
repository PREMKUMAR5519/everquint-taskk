const mongoose = require("mongoose");
const { getISTNow } = require("../utils/time");

const idempotencySchema = new mongoose.Schema({
  organizerEmail: { type: String, required: true },
  key: { type: String, required: true },
  requestHash: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  status: { type: String, enum: ["in_progress", "completed"], required: true },
  createdAt: { type: Date, default: () => getISTNow().toISO() }
});

idempotencySchema.index({ organizerEmail: 1, key: 1 }, { unique: true });

module.exports = mongoose.model("IdempotencyKey", idempotencySchema);
