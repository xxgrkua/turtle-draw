import express from "express";
import HttpError from "../http_error";

const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE"];

export function restrictHttpMethod(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (!ALLOWED_METHODS.includes(request.method)) {
    next(
      new HttpError({
        status: 405,
        message: `${request.method} ${request.url}`,
      }),
    );
  } else {
    next();
  }
}
