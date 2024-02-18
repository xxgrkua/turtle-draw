import express from "express";
import { ApiError } from "../http_error";

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
      next();
    }
  }
}

export default notFound;
