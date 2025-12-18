const Room = require("../models/Room");
const { validateRoom } = require("../utils/validation");
const { ConflictError } = require("../utils/errors");

exports.createRoom = async (req, res, next) => {
    try {
        validateRoom(req.body);
        const { name, capacity, floor, amenities } = req.body;
        const room = await Room.create({ name, capacity, floor, amenities });
        res.status(201).json(room);
    } catch (e) {
        if (e.code === 11000) return next(new ConflictError("Room already exists"));
        next(e);
    }
};

exports.listRooms = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.minCapacity) filter.capacity = { $gte: Number(req.query.minCapacity) };
        let rooms = await Room.find(filter).lean();
        if (req.query.amenity)
            rooms = rooms.filter(r => (r.amenities || []).includes(req.query.amenity));
        res.json(rooms);
    } catch (e) { next(e); }
};
