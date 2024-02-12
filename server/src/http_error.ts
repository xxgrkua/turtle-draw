class HttpError extends Error {
  static {
    this.prototype.name = "HttpError";
  }

  status: number;

  constructor(status: number, message?: string, cause?: unknown) {
    super(message, { cause: cause });
    this.status = status;
  }

  public toString(): string {
    return `${this.name}: ${this.status} ${this.message}`;
  }
}

export default HttpError;
