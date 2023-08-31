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
// const Joi = require("joi");
// const Validator = require("express-joi-validation");
// const validator = Validator.createValidator({
//   passError: true,
// });

// const bodySchema = Joi.object({
//   imageType: Joi.string().valid("webp", "jpg", "jpeg", "png").optional(),
//   imageName: Joi.string().required(),
//   bucketName: Joi.string().required(),
//   path: Joi.string().required(),
//   imageResize: Joi.string()
//     .optional()
//     .custom((value, helpers) => {
//       const validValues = ["original", "large", "square", "profile"];
//       const values = value.split(",").map((val) => val.trim());

//       // Check for duplicate values
//       if (new Set(values).size !== values.length) {
//         return helpers.error("any.invalid");
//       }

//       // Check if all values are valid
//       const isValid = values.every((val) => validValues.includes(val));
//       if (!isValid) {
//         return helpers.error("any.invalid");
//       }

//       return value;
//     })
//     .messages({
//       "any.invalid":
//         "Pleae pass comma sepeated values for imageFormat ,accepted values -> 'original,large,profile,square",
//     }),
//   grayScale: Joi.number().valid(0, 1).optional(),
//   brightness: Joi.number().integer().min(0).max(200).optional(),
//   contrast: Joi.number().integer().min(0).max(200).optional(),
//   rotate: Joi.number().integer().min(0).max(360).optional(),
//   flip: Joi.string().valid("vertical", "horizontal").optional(),
//   cropWidth: Joi.number().optional(),
//   cropHeight: Joi.number().optional(),
//   cropLeft: Joi.number().optional(),
//   cropTop: Joi.number().optional(),
//   cropPictureWidth: Joi.number().optional(),
//   cropPictureHeight: Joi.number().optional(),
//   resizeExact: Joi.number().valid(0, 1).optional(),
//   resizeHeight: Joi.number().optional().min(0),
//   resizeWidth: Joi.number().optional().min(0),
//   sharpen: Joi.number().valid(0, 1).optional(),
//   quality: Joi.number().optional().min(1).max(100),
//   replaceImage: Joi.number().optional().valid(0, 1),
//   // new
//   mozjpeg: Joi.number().integer().optional().valid(0, 1),
//   progressive: Joi.number().integer().optional().valid(0, 1),
//   chromaSubsampling: Joi.string().optional().valid("4:4:4", "4:2:0"),
//   compressionLevel: Joi.number().integer().min(0).max(9).optional(),
//   effortPng: Joi.number().integer().min(1).max(10).optional(),
//   nearLossless: Joi.number().optional().valid(0, 1),
//   lossless: Joi.number().optional().valid(0, 1),
//   effortWebp: Joi.number().integer().min(0).max(6).optional(),
//   smartSubsample: Joi.number().optional().valid(0, 1),
// });

// // JOI CUSTOM ERROR HANDLER
// const joiCustomErrorHandler = (err, req, res, next) => {
//   if (err && err.error && err.error.isJoi) {
//     const errorResponse = {};

//     // Extract and format the relevant error details
//     const details = err.error.details.map((detail) => ({
//       message: detail.message,
//       path: detail.path,
//     }));

//     // Populate the error response
//     errorResponse.message = details.map((detail) => detail.message);
//     errorResponse.fields = details.reduce((acc, detail) => {
//       const field = detail.path[0];
//       if (!acc[field]) {
//         acc[field] = [];
//       }
//       acc[field].push(detail.message);
//       return acc;
//     }, {});
//     fs.unlink(
//       path.join(__dirname, "uploads", `${req.file.filename}`),
//       (err) => {
//         res.status(400).json(errorResponse);
//       }
//     );
//   } else {
//     next(err);
//   }
// };

module.exports = {
  notFound,
  secretKeyProtected,
  //   multerCustomMiddleWare,
  //   validator,
  //   bodySchema,
  //   joiCustomErrorHandler,
};
