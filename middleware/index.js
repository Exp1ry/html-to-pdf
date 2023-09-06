// import FormData from "form-data";
const fetch = require("node-fetch");
const axios = require("axios");

// for not found end points
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  return res.status(404).send(`Not Found - ${req.originalUrl}`);
  next(error);
};

// to verify secret id
const secretKeyProtected = async (req, res, next) => {
  const secretKey = req.header("secret");
  const appId = req.header("appId");
  const version = req.header("version");

  if (!secretKey || !appId || !version) {
    return res
      .status(401)
      .json({ msg: "Error, send secret key, appId, and version" });
  } else {
    try {
      const formData = new URLSearchParams();
      formData.set("secret", secretKey);
      formData.set("appId", appId);
      formData.set("version", version);

      const { data } = await axios.post(
        `https://${appId}.mediaslide.com/api/validateApi`,
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
      console.log(error);
      return res.status(500).json({
        msg: "Credential error: Please verify your appId and your secret key.",
      });
    }
  }
};

// body data joi validation
const Joi = require("joi");
const Validator = require("express-joi-validation");
const validator = Validator.createValidator({
  passError: true,
});

const bodySchema = Joi.object({
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

// JOI CUSTOM ERROR HANDLER
const joiCustomErrorHandler = (err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    const errorResponse = {};

    // Extract and format the relevant error details
    const details = err.error.details.map((detail) => ({
      message: detail.message,
      path: detail.path,
    }));

    // Populate the error response
    errorResponse.message = details.map((detail) => detail.message);
    errorResponse.fields = details.reduce((acc, detail) => {
      const field = detail.path[0];
      if (!acc[field]) {
        acc[field] = [];
      }
      acc[field].push(detail.message);
      return acc;
    }, {});

    // Send a JSON response with the error details
    return res.status(400).json(errorResponse); // Adjust status code as needed
  } else {
    next(err);
  }
};

module.exports = {
  notFound,
  secretKeyProtected,
  validator,
  bodySchema,
  joiCustomErrorHandler,
};
