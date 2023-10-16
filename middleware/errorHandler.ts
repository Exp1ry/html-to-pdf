import { NextFunction, Request, Response } from "express";
import { HttpError, isHttpError } from "http-errors";
import { ApiError } from "../@types/ApiError";
import logger from "../utils/logger";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err.stack);

  let errorMessage = "Server error";
  let statusCode = 500;
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    errorMessage = err.errorMessage;
  }

  if (isHttpError(err)) {
    statusCode = err.statusCode;
    errorMessage = err.errorMessage;
  }
  return res.status(statusCode).json({ error: errorMessage });
}
export default errorHandler;
