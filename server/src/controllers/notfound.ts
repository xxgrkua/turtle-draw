import express from "express";
import { ApiError, HttpError } from "../http_error";

function notFound(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (request.method === "GET") {
    next();
  } else {
    if (request.url.includes("/api/")) {
      next(
        new ApiError({
          status: 404,
          message: `${request.method} ${request.url}`,
        }),
      );
    } else {
      next(
        new HttpError({
          status: 404,
          message: `Cannot ${request.method} ${request.url}`,
        }),
      );
    }
  }
}

export default notFound;
