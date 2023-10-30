import Joi from "joi";
import { puppeteerSchema } from "./puppeteerSchema";

const fromUrlSchema = Joi.object({
  url: Joi.string().required(),
  ...puppeteerSchema,
});

export default fromUrlSchema;
