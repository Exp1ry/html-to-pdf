// body data joi validation
import Joi, { Schema } from "joi";
import Validator from "express-joi-validation";
import { NextFunction, Request, Response } from "express";
import ApiResponse from "../@types/ApiResponse";
import { httpCodes } from "../@types/httpCodes";
import logger from "../utils/logger";
export const validator = Validator.createValidator({
  passError: true,
});

// JOI CUSTOM ERROR HANDLER
export const validationMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      logger.error(error.stack);
      const newResp = new ApiResponse(
        {},
        "",
        true,
        error.details[0].message,
        httpCodes.BAD_REQUEST
      );

      return res.status(newResp.statusCode).json(newResp);
    }
    next();
  };
};

export default validationMiddleware;
