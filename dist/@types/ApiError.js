"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP404Error = exports.ApiError = void 0;
const httpCodes_1 = require("./httpCodes");
class ApiError extends Error {
    constructor(error, message, isError, errorMessage, statusCode) {
        super();
        this.error = error;
        this.message = message;
        this.isError = isError;
        this.errorMessage = errorMessage;
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
class HTTP404Error extends ApiError {
    constructor(errorMessage = "Not found") {
        super({}, "", true, errorMessage, httpCodes_1.httpCodes.BAD_REQUEST);
    }
}
exports.HTTP404Error = HTTP404Error;
