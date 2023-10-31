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
const pdfService_1 = __importDefault(require("../service/pdfService"));
const fs_1 = __importDefault(require("fs"));
const ApiError_1 = require("../@types/ApiError");
const compressPDF_1 = __importDefault(require("../utils/compressPDF"));
class PdfController {
    generatePdfFromURL(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url, displayHeaderFooter, footerTemplate, format, headerTemplate, height, landscape, margin, omitBackground, pageRanges, path, preferCSSPageSize, printBackground = true, scale, timeout, width, compressionType = "prepress", dpi = 300, } = req.body;
                //Set response headers
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", 'attachment; filename="reduced.pdf"');
                const resp = yield pdfService_1.default.generatePdfFromUrl({
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
                }, url);
                if (resp.isError)
                    return res.status(resp.statusCode).json(resp);
                const { stdout, stderr } = yield (0, compressPDF_1.default)(compressionType);
                if (stderr) {
                    const apiError = new ApiError_1.ApiError(new Error("Unable to compress your file."), "", true, stderr, 500);
                    return res.status(apiError.statusCode).json(apiError);
                }
                const reducedFile = fs_1.default.readFileSync("reduced.pdf");
                return res.status(200).send(reducedFile);
            }
            catch (error) {
                next(error);
            }
        });
    }
    generatePdfFromHTML(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { html, displayHeaderFooter, footerTemplate, format, headerTemplate, height, landscape, margin, omitBackground, pageRanges, path, preferCSSPageSize, printBackground = true, scale, timeout, width, compressionType = "prepress", dpi = 300, } = req.body;
                //Set response headers
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", 'attachment; filename="reduced.pdf"');
                const resp = yield pdfService_1.default.generatePdfFromHtml({
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
                }, html);
                if (resp.isError)
                    return res.status(resp.statusCode).json(resp);
                const { stdout, stderr } = yield (0, compressPDF_1.default)(compressionType);
                if (stderr) {
                    const apiError = new ApiError_1.ApiError(new Error("Unable to compress your file."), "", true, stderr, 500);
                    return res.status(apiError.statusCode).json(apiError);
                }
                const reducedFile = fs_1.default.readFileSync("reduced.pdf");
                return res.status(200).send(reducedFile);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
const pdfController = new PdfController();
exports.default = pdfController;
