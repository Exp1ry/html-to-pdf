"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = require("http-errors");
const ApiError_1 = require("../@types/ApiError");
const logger_1 = __importDefault(require("../utils/logger"));
function errorHandler(err, req, res, next) {
    logger_1.default.error(err.stack);
    let errorMessage = "Server error";
    let statusCode = 500;
    if (err instanceof ApiError_1.ApiError) {
        statusCode = err.statusCode;
        errorMessage = err.errorMessage;
    }
    if ((0, http_errors_1.isHttpError)(err)) {
        statusCode = err.statusCode;
        errorMessage = err.errorMessage;
    }
    return res.status(statusCode).json({ error: errorMessage });
}
exports.default = errorHandler;
