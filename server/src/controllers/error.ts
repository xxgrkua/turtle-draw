import express from "express";
import HttpError from "../http_error";

function errorHandler(
  error: any,
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  console.log("errorHandler");
  if (request.url.includes("/api/")) {
    if (!(error instanceof HttpError)) {
      error = new HttpError({ status: 500, cause: error });
    }
    console.log(error);
    /*
      eslint-disable
      @typescript-eslint/no-unsafe-member-access,
      @typescript-eslint/no-unsafe-argument,
      @typescript-eslint/no-unsafe-assignment
    */
    // eslint seems to not support narrowing the type by condition
    console.log("here");
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
