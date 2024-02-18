import express from "express";
import { ApiError, HttpError } from "../http_error";

const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE"];

export function restrictHttpMethod(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (!ALLOWED_METHODS.includes(request.method)) {
    if (request.url.includes("/api/")) {
      next(
        new ApiError({
          status: 405,
          message: `${request.method} ${request.url}`,
        }),
      );
    } else {
      next(new HttpError({ status: 405 }));
    }
  } else {
    next();
  }
}
