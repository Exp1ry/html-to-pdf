"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const optionsSchema = joi_1.default.object({
    displayHeaderFooter: joi_1.default.boolean().optional(),
    footerTemplate: joi_1.default.string().optional(),
    format: joi_1.default.string()
        .optional()
        .valid("letter", "legal", "tabloid", "ledge", "a0", "a1", "a2", "a3", "a4", "a5", "a6"),
    headerTemplate: joi_1.default.string().optional(),
    height: joi_1.default.string().optional(),
    width: joi_1.default.string().optional(),
    landscape: joi_1.default.boolean().optional(),
    margin: joi_1.default.object({
        bottom: joi_1.default.number().optional(),
        right: joi_1.default.number().optional(),
        top: joi_1.default.number().optional(),
        left: joi_1.default.number().optional(),
    }).optional(),
    omitBackground: joi_1.default.boolean().optional(),
    pageRanges: joi_1.default.string().optional(),
    path: joi_1.default.string().optional(),
    preferCSSPageSize: joi_1.default.boolean().optional(),
    printBackground: joi_1.default.boolean().optional(),
    scale: joi_1.default.number().optional(),
    timeout: joi_1.default.number().optional(),
});
exports.bodySchema = joi_1.default.object({
    html: joi_1.default.string().optional(),
    url: joi_1.default.string().optional(),
    options: optionsSchema,
});
exports.default = exports.bodySchema;
