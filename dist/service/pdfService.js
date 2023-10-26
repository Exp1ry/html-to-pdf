"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("../@types/ApiResponse"));
const puppeteer_1 = require("../utils/puppeteer");
class PdfService {
    generatePdfFromUrl({ displayHeaderFooter = undefined, footerTemplate = undefined, format = undefined, headerTemplate = undefined, height = undefined, landscape = undefined, margin = undefined, omitBackground = undefined, pageRanges = undefined, path = undefined, preferCSSPageSize = undefined, printBackground = undefined, scale = undefined, timeout = undefined, width = undefined, }, url) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a new page, and go to the url, and create the PDF
            yield (0, puppeteer_1.createPdfWithSettings)(url, {
                displayHeaderFooter,
                footerTemplate,
                format,
                headerTemplate,
                height,
                landscape,
                margin,
                omitBackground,
                pageRanges,
                path,
                preferCSSPageSize,
                printBackground,
                scale,
                timeout,
                width,
            });
            const reducedPdf = require("fs").readFileSync("result.pdf");
            return new ApiResponse_1.default(reducedPdf, "Successfully created PDF", false, "", 200);
        });
    }
}
const pdfService = new PdfService();
exports.default = pdfService;
