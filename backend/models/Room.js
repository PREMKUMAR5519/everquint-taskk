const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameLower: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true, min: 1 },
  floor: { type: Number, required: true },
  amenities: [String]
});

roomSchema.pre("validate", function (next) {
  this.nameLower = this.name.toLowerCase();
  next();
});

module.exports = mongoose.model("Room", roomSchema);
