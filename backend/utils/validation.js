const { ValidationError } = require("./errors");

function isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRoom(data) {
    if (!data.name) throw new ValidationError("Room name required");
    if (!Number.isInteger(data.capacity) || data.capacity < 1) throw new ValidationError("Capacity must greater than 0");
    if (!Number.isInteger(data.floor)) throw new ValidationError("Floor required");
    if (!Array.isArray(data.amenities)) throw new ValidationError("Amenities must be an array");
}

function validateBooking(data) {
    if (!data.roomId) throw new ValidationError("roomId required");
    if (!data.title) throw new ValidationError("title required");
    if (!data.organizerEmail || !isEmail(data.organizerEmail)) throw new ValidationError("Valid organizerEmail required");
    if (!data.startTime || !data.endTime) throw new ValidationError("startTime and endTime required");
}

module.exports = { validateRoom, validateBooking };
