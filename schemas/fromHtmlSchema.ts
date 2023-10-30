import Joi from "joi";
import { puppeteerSchema } from "./puppeteerSchema";

export const fromHtmlSchema = Joi.object({
  html: Joi.string().required(),
  ...puppeteerSchema,
});

export default fromHtmlSchema;
