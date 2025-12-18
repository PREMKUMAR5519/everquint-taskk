# Design

## Overview
Express app (`app.js`) with modular routers for rooms, bookings, and reports. Persistence via Mongoose models; time handling via Luxon (IST).

## Modules
- `app.js`: JSON parsing, route mounting, centralized error handler.
- `server.js`: env loading, Mongo connection, server boot.
- Routes: `routes/*.js` -> controllers.
- Controllers: `controllers/*.js` implement business logic.
- Models: `models/Room.js`, `models/Booking.js`, `models/IdempotencyKey.js`.
- Utils: validation, time helpers, custom error classes.

## Data Model (key fields)
- Room: `name`, `nameLower` (unique), `capacity`, `floor`, `amenities[]`.
- Booking: `roomId`, `title`, `organizerEmail`, `startTime`, `endTime`, `status` (`confirmed|cancelled`), `createdAt`.
- IdempotencyKey: `organizerEmail`, `key`, `requestHash`, `bookingId`, `status` (`in_progress|completed`), `createdAt`.

