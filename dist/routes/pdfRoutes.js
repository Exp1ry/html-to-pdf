"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pdfController_1 = __importDefault(require("../controller/pdfController"));
const bodySchema_1 = __importDefault(require("../schemas/bodySchema"));
const validationMiddleware_1 = __importDefault(require("../middleware/validationMiddleware"));
const pdfRouter = express_1.default.Router();
pdfRouter.post("/generate-pdf-url", (0, validationMiddleware_1.default)(bodySchema_1.default), pdfController_1.default.generatePdfFromURL);
// pdfRouter.post("/test", pdfController.generatePdf);
pdfRouter.post("/generate-pdf-html", (0, validationMiddleware_1.default)(bodySchema_1.default), pdfController_1.default.generatePdfFromHTML);
exports.default = pdfRouter;
