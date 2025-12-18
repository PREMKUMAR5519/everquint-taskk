# Meeting Room Booking API

Express + MongoDB service for managing rooms, bookings, and utilization reports.

## Features
- Create/list rooms with capacity, floor, and amenities.
- Create/list/cancel bookings with business-hour validation.
- Idempotent booking creation via `Idempotency-Key` header.
- Utilization report by room over a date range.

## Prerequisites
- Node.js 18+
- MongoDB running locally or a reachable URI

## Setup
```
npm install
```

I didnt add .env in git ignore if you want Create  `.env` 
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/meeting_rooms
```

## Run
```
npm start
```
Server starts on `http://localhost:4000` after connecting to MongoDB.

## API

### Rooms
- `POST /rooms`
  ```json
  { "name": "Board Room", "capacity": 10, "floor": 2, "amenities": ["projector","whiteboard"] }
  ```
- `GET /rooms?minCapacity=8&amenity=projector`

### Bookings
- `POST /bookings` (all times ISO, IST business hours only)
  ```json
  {
    "roomId": "<room ObjectId>",
    "title": "chritmas planning",
    "organizerEmail": "prem@gmail.com",
    "startTime": "2025-12-19T10:00:00.000Z",
    "endTime":   "2025-12-19T12:00:00.000Z"
  }
  ```

### Reports
- `GET /reports/room-utilization?from=2025-12-18T00:00:00.000Z&to=2025-12-19T23:59:59.000Z`
  - Returns per-room `totalBookingHours` and `utilizationPercent` (Mon to Fri, 08:00 to 20:00 IST window).

## Errors
All errors return JSON: `{ "error": "<Type>", "message": "<detail>" }` with appropriate HTTP status (400/404/409/500).

## Notes
- Business rules enforced in `utils/time.js` and `bookingController.js`.
- Overlap prevention only checks confirmed bookings.
- Requests use IST for validation; provide ISO timestamps.
