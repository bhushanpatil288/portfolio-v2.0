export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.statusCode = status;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
