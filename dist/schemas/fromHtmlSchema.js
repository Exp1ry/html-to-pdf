"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromHtmlSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const puppeteerSchema_1 = require("./puppeteerSchema");
exports.fromHtmlSchema = joi_1.default.object(Object.assign({ html: joi_1.default.string().required() }, puppeteerSchema_1.puppeteerSchema));
exports.default = exports.fromHtmlSchema;
