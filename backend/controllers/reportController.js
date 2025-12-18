const Booking = require("../models/Booking");
const Room = require("../models/Room");
const { Interval } = require("luxon");
const { toISTDateTimeFromISO, toISTDateTimeFromJSDate } = require("../utils/time");

exports.roomUtilization = async (req, res, next) => {
  try {
    if (!req.query.from || !req.query.to) return res.status(400).json({ error: "ValidationError", message: "from and to are required" });
    const from = toISTDateTimeFromISO(req.query.from);
    const to = toISTDateTimeFromISO(req.query.to);

    const rooms = await Room.find().lean();
    const results = [];

    for (const room of rooms) {
      const bookings = await Booking.find({
        roomId: room._id,
        status: "confirmed",
        startTime: { $lt: to.toISO() },
        endTime: { $gt: from.toISO() }
      }).lean();

      let bookedSeconds = 0;
      for (const b of bookings) {
        const bs = toISTDateTimeFromJSDate(b.startTime);
        const be = toISTDateTimeFromJSDate(b.endTime);
        const overlapStart = bs > from ? bs : from;
        const overlapEnd = be < to ? be : to;
        bookedSeconds += Math.max(0, overlapEnd.diff(overlapStart, "seconds").seconds);
      }

      // Calculate business hours in range
      let businessSeconds = 0;
      let cursor = from.startOf("day");
      while (cursor < to) {
        if (cursor.weekday >= 1 && cursor.weekday <= 5) {
          const bStart = cursor.set({ hour: 8, minute: 0, second: 0 });
          const bEnd = cursor.set({ hour: 20, minute: 0, second: 0 });
          const inter = Interval.fromDateTimes(bStart, bEnd).intersection(Interval.fromDateTimes(from, to));
          if (inter) businessSeconds += inter.length("seconds");
        }
        cursor = cursor.plus({ days: 1 });
      }

      results.push({
        roomId: String(room._id),
        roomName: room.name,
        totalBookingHours: Math.round((bookedSeconds / 3600) * 100) / 100,
        utilizationPercent: businessSeconds > 0 ? Math.round((bookedSeconds / businessSeconds) * 10000) / 10000 : 0
      });
    }

    res.json(results);
  } catch (e) { next(e); }
};
