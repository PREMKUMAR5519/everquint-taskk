const { DateTime } = require("luxon");

const IST_ZONE = "Asia/Kolkata";

function toISTDateTimeFromISO(value) {
  return DateTime.fromISO(value, { zone: IST_ZONE });
}

function toISTDateTimeFromJSDate(value) {
  return DateTime.fromJSDate(value, { zone: IST_ZONE });
}

function getISTNow() {
  return DateTime.now().setZone(IST_ZONE);
}

function isWeekday(dt) {
  return dt.weekday >= 1 && dt.weekday <= 5;
}

function isWithinBusinessHours(start, end) {
  if (!isWeekday(start) || !isWeekday(end)) return false;
  if (!start.hasSame(end, "day")) return false;
  const bStart = start.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
  const bEnd = start.set({ hour: 20, minute: 0, second: 0, millisecond: 0 });
  return start >= bStart && end <= bEnd;
}

function assertValidBookingTimes(startISO, endISO) {
  const start = toISTDateTimeFromISO(startISO);
  const end = toISTDateTimeFromISO(endISO);
  if (!start.isValid || !end.isValid) throw new Error("Invalid ISO date");
  if (start >= end) throw new Error("startTime must be before endTime");
  const minutes = end.diff(start, "minutes").minutes;
  if (minutes < 15) throw new Error("Booking duration must be at least 15 minutes");
  if (minutes > 240) throw new Error("Booking duration must be at most 4 hours");
  if (!isWithinBusinessHours(start, end)) throw new Error("Booking must be Mon-Fri, 08:00-20:00 IST, same day");
  return { start, end };
}

module.exports = {
  isWithinBusinessHours,
  assertValidBookingTimes,
  toISTDateTimeFromISO,
  toISTDateTimeFromJSDate,
  getISTNow
};
