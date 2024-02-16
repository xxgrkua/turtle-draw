import express from "express";
import HttpError from "../http_error";

async function notFound(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (request.method === "GET") {
    next();
  } else {
    if (request.url.includes("/api/")) {
      next(
        new HttpError({
          status: 404,
          message: `${request.method} ${request.url}`,
        }),
      );
    } else {
      response.status(404).send("Not Found");
    }
  }
}

export default notFound;
