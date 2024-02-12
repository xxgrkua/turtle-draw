import express from "express";
import HttpError from "../http_error";

async function errorHandler(
  error: any,
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (!(error instanceof HttpError)) {
    if (error instanceof Error) {
      error = new HttpError(500);
    } else {
      error = new HttpError(500, error);
    }
  }
  console.log(error);
  if (error.message) {
    response.status(error.status).json({ error: error.message });
  } else {
    response.status(error.status).end();
  }
}

export default errorHandler;
