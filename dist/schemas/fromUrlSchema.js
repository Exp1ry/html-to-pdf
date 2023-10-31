"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const puppeteerSchema_1 = require("./puppeteerSchema");
const fromUrlSchema = joi_1.default.object(Object.assign({ url: joi_1.default.string().required() }, puppeteerSchema_1.puppeteerSchema));
exports.default = fromUrlSchema;
