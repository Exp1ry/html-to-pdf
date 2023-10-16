"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = exports.validator = void 0;
const express_joi_validation_1 = __importDefault(require("express-joi-validation"));
const ApiResponse_1 = __importDefault(require("../@types/ApiResponse"));
const httpCodes_1 = require("../@types/httpCodes");
const logger_1 = __importDefault(require("../utils/logger"));
exports.validator = express_joi_validation_1.default.createValidator({
    passError: true,
});
// JOI CUSTOM ERROR HANDLER
const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            logger_1.default.error(error.stack);
            const newResp = new ApiResponse_1.default({}, "", true, error.details[0].message, httpCodes_1.httpCodes.BAD_REQUEST);
            return res.status(newResp.statusCode).json(newResp);
        }
        next();
    };
};
exports.validationMiddleware = validationMiddleware;
exports.default = exports.validationMiddleware;
