interface HttpErrorOptions {
  status: number;
  message?: string;
  cause?: unknown;
}
class HttpError extends Error {
  static {
    this.prototype.name = "HttpError";
  }

  status: number;

  constructor(options: HttpErrorOptions) {
    super(options.message, { cause: options.cause });
    this.status = options.status;
  }

  public toString(): string {
    return `${this.name} ${this.status}: ${this.message}`;
  }
}

class ApiError extends HttpError {
  static {
    this.prototype.name = "ApiError";
  }
}

export { ApiError, HttpError };
