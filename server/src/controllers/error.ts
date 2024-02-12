import express from "express";

async function errorHandler(
  error: Error,
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  console.log(typeof error);
  console.log(error);
  response.status(500).json({ res: "error", msg: error.message });
  next(error);
}

export default errorHandler;
