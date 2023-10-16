"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    constructor(data, message, isError, errorMessage, statusCode) {
        this.data = data;
        this.message = message;
        this.isError = isError;
        this.errorMessage = errorMessage;
        this.statusCode = statusCode;
    }
}
exports.default = ApiResponse;
