class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.error = "ValidationError";
  }
}
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
    this.error = "NotFoundError";
  }
}
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
    this.error = "ConflictError";
  }
}
module.exports = { ValidationError, NotFoundError, ConflictError };
