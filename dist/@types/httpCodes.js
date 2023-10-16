"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpCodes = void 0;
var httpCodes;
(function (httpCodes) {
    httpCodes[httpCodes["OK"] = 200] = "OK";
    httpCodes[httpCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    httpCodes[httpCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    httpCodes[httpCodes["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
    httpCodes[httpCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    httpCodes[httpCodes["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    httpCodes[httpCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    httpCodes[httpCodes["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    httpCodes[httpCodes["CONFLICT"] = 409] = "CONFLICT";
    httpCodes[httpCodes["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    httpCodes[httpCodes["UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "UNAVAILABLE_FOR_LEGAL_REASONS";
})(httpCodes || (exports.httpCodes = httpCodes = {}));
