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
pdfRouter.post("/generate-pdf", (0, validationMiddleware_1.default)(bodySchema_1.default), pdfController_1.default.generatePdf);
pdfRouter.post("/generate-pdf-website", (0, validationMiddleware_1.default)(bodySchema_1.default), pdfController_1.default.generatePdfWebsite);
exports.default = pdfRouter;
