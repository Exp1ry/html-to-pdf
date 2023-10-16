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
const puppeteer_1 = __importDefault(require("../utils/puppeteer"));
const pdfService_1 = __importDefault(require("../service/pdfService"));
class PdfController {
    generatePdf(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { compressionType, dpi, html, displayHeaderFooter, footerTemplate, format, headerTemplate, height, landscape, margin, omitBackground, pageRanges, path, preferCSSPageSize, printBackground, scale, timeout, width, } = req.body;
                const browser = yield (0, puppeteer_1.default)();
                const page = yield browser.newPage();
                yield page.setContent(html, { waitUntil: "networkidle0" });
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", 'attachment; filename="reduced.pdf"');
                const resp = yield pdfService_1.default.generatePdfService({
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
                }, compressionType, dpi);
                return res.status(resp.statusCode).json(resp);
            }
            catch (error) {
                next(error);
            }
        });
    }
    generatePdfWebsite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { compressionType, dpi, html, displayHeaderFooter, footerTemplate, format, headerTemplate, height, landscape, margin, omitBackground, pageRanges, path, preferCSSPageSize, printBackground, scale, timeout, width, } = req.body;
                const browser = yield (0, puppeteer_1.default)();
                const page = yield browser.newPage();
                yield page.setContent(html, { waitUntil: "networkidle0" });
                const resp = yield pdfService_1.default.generatePdfService({
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
                }, compressionType, dpi);
                return res.status(resp.statusCode).json(resp);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
const pdfController = new PdfController();
exports.default = pdfController;
