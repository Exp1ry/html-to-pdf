"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pdfController_1 = __importDefault(require("../controller/pdfController"));
const fromHtmlSchema_1 = require("../schemas/fromHtmlSchema");
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
const fromUrlSchema_1 = __importDefault(require("../schemas/fromUrlSchema"));
const parseString_1 = __importDefault(require("../middleware/parseString"));
const pdfRouter = express_1.default.Router();
pdfRouter.post("/generate-pdf-url", parseString_1.default, (0, validationMiddleware_1.default)(fromUrlSchema_1.default), pdfController_1.default.generatePdfFromURL);
pdfRouter.post("/generate-pdf-html", parseString_1.default, (0, validationMiddleware_1.default)(fromHtmlSchema_1.fromHtmlSchema), pdfController_1.default.generatePdfFromHTML);
exports.default = pdfRouter;
