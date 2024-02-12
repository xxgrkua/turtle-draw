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
    next(new HttpError(404, `${request.method} ${request.url}`));
  }
}

export default notFound;
