import express from "express";
import { validationResult, type ContextRunner } from "express-validator";
import HttpError from "./http_error";

export function authenticateSession(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (request.session.user_id && request.session.username) {
    next();
  } else {
    next(new HttpError({ status: 401 }));
  }
}

export function authenticateUsername(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (request.session.username === request.params.username) {
    next();
  } else {
    next(new HttpError({ status: 401 }));
  }
}

export function authenticateUserId(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (request.session.user_id?.toString() === request.params.user_id) {
    next();
  } else {
    next(new HttpError({ status: 401 }));
  }
}

export function validate(validations: ContextRunner[]) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    const msg: any[] = [];

    for (const error of errors.array()) {
      console.log(error);
      msg.push(error.msg);
    }
    next(new HttpError({ status: 400, message: msg.join(", ") }));
  };
}
