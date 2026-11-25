export class AppError extends Error {
    constructor(code, message, statusCode = 500, details = null) {
      super(message);
      this.name = 'AppError';
      this.code = code;
      this.statusCode = statusCode;
      this.details = details;
    }
  
    static notFound(code, message) {
      return new AppError(code, message, 404);
    }
  
    static conflict(code, message) {
      return new AppError(code, message, 409);
    }
  }