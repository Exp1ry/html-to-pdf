import { NextFunction, Request, Response } from "express";

export default function parseString(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { margin } = req.body;

  if (typeof margin !== "undefined" && margin !== undefined) {
    req.body.margin = JSON.parse(margin);
    next();
  }
  next();
}
