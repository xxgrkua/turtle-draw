import express from "express";
import HttpError from "../http_error";

async function errorHandler(
  error: any,
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (!(error instanceof HttpError)) {
    error = new HttpError({ status: 500, cause: error });
  }
  console.log(error);
  if (error.message) {
    response.status(error.status).json({ error: error.message });
  } else {
    response.status(error.status).end();
  }
}

export default errorHandler;
