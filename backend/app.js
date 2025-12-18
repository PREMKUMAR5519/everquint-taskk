const express = require("express");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
app.use(express.json());

app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reports", reportRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.error || "InternalError",
    message: err.message || "Something went wrong"
  });
});

module.exports = app;
