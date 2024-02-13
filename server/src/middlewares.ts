import express from "express";
import { validationResult, type ContextRunner } from "express-validator";
import HttpError from "./http_error";

export async function authenticateUsername(
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

export async function authenticateUserId(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  if (request.session.user_id === request.params.user_id) {
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
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const msg: string[] = [];

    for (const error of errors.array()) {
      console.log(error);
      switch (error.type) {
        case "field":
          if (error.value) {
            msg.push(`${error.path} is invalid`);
          } else {
            msg.push(`${error.path} is required`);
          }
          break;
        case "alternative":
          break;
        case "alternative_grouped":
          break;
        case "unknown_fields":
          break;
      }
    }
    next(new HttpError({ status: 400, message: msg.join(", ") }));
  };
}
