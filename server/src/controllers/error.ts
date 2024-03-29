import express from "express";
import { ApiError, HttpError } from "../http_error";

function errorHandler(
  error: any,
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (response.headersSent) {
    next(error);
    return;
  }
  if (!(error instanceof HttpError)) {
    if (request.url.startsWith("/api/")) {
      error = new ApiError({
        status: 500,
        message: "Internal Server Error",
        cause: error,
      });
    } else {
      error = new HttpError({
        status: 500,
        message: "Internal Server Error",
        cause: error,
      });
    }
  }

  if (error instanceof ApiError) {
    console.log(error);
    if (error.message) {
      response.status(error.status).json({ error: error.message });
    } else {
      response.status(error.status).end();
    }
  } else {
    next(error);
  }
}

export default errorHandler;
