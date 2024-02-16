import express from "express";
import HttpError from "../http_error";

async function errorHandler(
  error: any,
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (request.url.includes("/api/")) {
    if (!(error instanceof HttpError)) {
      error = new HttpError({ status: 500, cause: error });
    }
    console.log(error);
    if (error.message) {
      response.status(error.status).json({ error: error.message });
    } else {
      response.status(error.status).end();
    }
  } else {
    console.log(error);
    if (error instanceof HttpError) {
      if (error.message) {
        response.status(error.status).send(error.message);
      } else {
        response.status(error.status).end();
      }
    } else {
      response.status(500).send("Internal Server Error");
    }
  }
}

export default errorHandler;
