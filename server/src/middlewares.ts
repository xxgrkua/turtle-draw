import express from "express";
import { validationResult, type ContextRunner } from "express-validator";
import { ApiError } from "./http_error";

export function authenticateSession(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (request.session.user_id && request.session.username) {
    next();
  } else {
    next(new ApiError({ status: 401 }));
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
    next(new ApiError({ status: 401 }));
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
    next(new ApiError({ status: 401 }));
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
      // you can't omit the return statement here
      // ref: https://stackoverflow.com/a/43404213
      return;
    }

    const msg: any[] = [];

    for (const error of errors.array()) {
      console.log(error);
      msg.push(error.msg);
    }
    next(new ApiError({ status: 400, message: msg.join(", ") }));
  };
}
