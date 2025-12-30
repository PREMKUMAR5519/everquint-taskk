const Booking = require("../models/Booking");
const Room = require("../models/Room");
const IdempotencyKey = require("../models/IdempotencyKey");
const { validateBooking } = require("../utils/validation");
const { assertValidBookingTimes, getISTNow, toISTDateTimeFromISO, toISTDateTimeFromJSDate } = require("../utils/time");
const { ValidationError, NotFoundError, ConflictError } = require("../utils/errors");
const crypto = require("crypto");

function hashRequest(body) {
    return crypto.createHash("sha512").update(JSON.stringify(body)).digest("hex");
}

exports.createBooking = async (req, res, next) => {
    try {
        validateBooking(req.body);
        const { start, end } = assertValidBookingTimes(req.body.startTime, req.body.endTime);

        const room = await Room.findById(req.body.roomId);
        if (!room) throw new NotFoundError("Unknown room");

        // Overlap: find confirmed bookings for room with overlap
        const overlap = await Booking.findOne({
            roomId: req.body.roomId,
            status: "confirmed",
            startTime: { $lt: end.toJSDate() },
            endTime: { $gt: start.toJSDate() }
        });
        if (overlap) throw new ConflictError("Overlapping booking exists");

        // Idempotency support (by organizerEmail + key)
        const idKey = req.header("Idempotency-Key");
        const requestHash = hashRequest(req.body);

        if (idKey) {
            const found = await IdempotencyKey.findOne({ organizerEmail: req.body.organizerEmail, key: idKey });
            if (found) {
                if (found.requestHash !== requestHash)
                    throw new ConflictError("Idempotency-Key reused with different request");
                if (found.status === "completed" && found.bookingId)
                    return res.status(201).json(await Booking.findById(found.bookingId));
                if (found.status === "in_progress")
                    throw new ConflictError("Request with this Idempotency-Key is still in progress");
            }
            // Save as in_progress, then create booking, then update to completed
            const idemDoc = await IdempotencyKey.create({
                organizerEmail: req.body.organizerEmail,
                key: idKey,
                requestHash,
                status: "in_progress"
            });
            const booking = await Booking.create({
                roomId: req.body.roomId,
                title: req.body.title,
                organizerEmail: req.body.organizerEmail,
                startTime: start.toISO(),
                endTime: end.toISO(),
                status: "confirmed"
            });
            idemDoc.status = "completed";
            idemDoc.bookingId = booking._id;
            await idemDoc.save();
            return res.status(201).json(booking);
        } else {
            // Normal booking
            const booking = await Booking.create({
                roomId: req.body.roomId,
                title: req.body.title,
                organizerEmail: req.body.organizerEmail,
                startTime: start.toISO(),
                endTime: end.toISO(),
                status: "confirmed"
            });
            return res.status(201).json(booking);
        }
    } catch (e) { next(e); }
};

exports.listBookings = async (req, res, next) => {
    try {
        const q = {};
        if (req.query.roomId) q.roomId = req.query.roomId;
        if (req.query.from) q.endTime = { ...q.endTime, $gt: toISTDateTimeFromISO(req.query.from).toISO() };
        if (req.query.to) q.startTime = { ...q.startTime, $lt: toISTDateTimeFromISO(req.query.to).toISO() };

        const limit = Math.min(Number(req.query.limit) || 20, 200);
        const offset = Number(req.query.offset) || 0;

        const items = await Booking.find(q).skip(offset).limit(limit).lean();
        const total = await Booking.countDocuments(q);

        res.json({ items, total, limit, offset });
    } catch (e) { next(e); }
};

exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) throw new NotFoundError("Booking not found");
        if (booking.status === "cancelled") return res.json(booking);

        const start = toISTDateTimeFromJSDate(booking.startTime instanceof Date ? booking.startTime : new Date(booking.startTime));
        const cutoff = start.minus({ hours: 1 });
        if (getISTNow() > cutoff)
            throw new ValidationError("Booking can only be cancelled up to 1 hour before startTime");
        booking.status = "cancelled";
        await booking.save();
        res.json(booking);
    } catch (e) { next(e); }
};

