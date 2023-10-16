import Joi from "joi";
export const bodySchema = Joi.object({
  html: Joi.string().required(),
  compressionType: Joi.string().optional(),
  dpi: Joi.number().optional(),
  // .valid("prepass", "ebook", "print", "screen"),
  displayHeaderFooter: Joi.boolean().optional(),
  footerTemplate: Joi.string().optional(),
  format: Joi.string()
    .optional()
    .valid(
      "letter",
      "legal",
      "tabloid",
      "ledge",
      "a0",
      "a1",
      "a2",
      "a3",
      "a4",
      "a5",
      "a6"
    ),
  headerTemplate: Joi.string().optional(),
  height: Joi.string().optional(),
  width: Joi.string().optional(),
  landscape: Joi.boolean().optional(),
  margin: Joi.object({
    bottom: Joi.number().optional(),
    right: Joi.number().optional(),
    top: Joi.number().optional(),
    left: Joi.number().optional(),
  }).optional(),

  omitBackground: Joi.boolean().optional(),
  pageRanges: Joi.string().optional(),
  path: Joi.string().optional(),
  preferCSSPageSize: Joi.boolean().optional(),
  printBackground: Joi.boolean().optional(),
  scale: Joi.number().optional(),
  timeout: Joi.number().optional(),
});

export default bodySchema;
