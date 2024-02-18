import express from "express";
import { ApiError } from "../http_error";
import { PublishedFile } from "../models";

export async function getGallery(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  try {
    const gallery = await PublishedFile.find().exec();
    response.json(gallery);
  } catch (error) {
    next(new ApiError({ status: 500, cause: error }));
  }
}
