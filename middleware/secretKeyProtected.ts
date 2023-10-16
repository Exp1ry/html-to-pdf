import axios from "axios";
import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

// to verify secret id
const secretKeyProtected = async (
  err: any,
  req: any,
  res: Response,
  next: NextFunction
) => {
  const secretKey = req.header("secret");
  const appId = req.header("appId");
  const version = req.header("version");

  if (!secretKey || !appId || !version) {
    return res
      .status(401)
      .json({ msg: "Error, send secret key, appId, and version" });
  } else {
    try {
      const formData: any = new URLSearchParams();

      formData.set("secret", secretKey);
      formData.set("appId", appId);
      formData.set("version", version);

      const { data } = await axios.post(
        `https://${appId}.${process.env.VALIDATOR_API_URL}`,
        formData,
        {
          headers: {
            ...formData.headers,
          },
        }
      );

      if (data.success) {
        req.appId = appId;
        next();
      } else {
        return res.status(401).json({
          msg: "Credential error: Please verify your appId and your secret key.",
        });
      }
    } catch (error) {
      next(err);
      return res.status(500).json({
        msg: "Credential error: Please verify your appId and your secret key.",
      });
    }
  }
};

export default secretKeyProtected;
