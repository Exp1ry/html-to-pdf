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
const child_process_1 = require("child_process"); // Import the child_process module
const ApiResponse_1 = __importDefault(require("../@types/ApiResponse"));
const ApiError_1 = require("../@types/ApiError");
const httpCodes_1 = require("../@types/httpCodes");
const puppeteer_1 = __importDefault(require("../utils/puppeteer"));
const fs_1 = __importDefault(require("fs"));
class PdfService {
    generatePdfService(options, compressionType = "prepress", dpi = 300, page) {
        return __awaiter(this, void 0, void 0, function* () {
            console.time("browserOpen");
            const { displayHeaderFooter, footerTemplate, width, height, headerTemplate, landscape, margin, omitBackground, pageRanges, format, path, timeout, scale, printBackground, preferCSSPageSize, } = options;
            console.time("Generatingpdf");
            const pdf = yield page.pdf(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (displayHeaderFooter && { displayHeaderFooter })), (footerTemplate && { footerTemplate })), ((!height || !width) && { format: format || "A4" })), (headerTemplate && { headerTemplate })), (height && { height })), (landscape && { landscape })), (margin && { margin })), (omitBackground && { omitBackground })), (pageRanges && { pageRanges })), (path && { path })), (preferCSSPageSize && { preferCSSPageSize })), (printBackground && { printBackground })), (scale && { scale })), (timeout && { timeout })), (width && { width })), { path: "output.pdf" }));
            // Use Ghostscript to reduce the PDF file size
            const pdfFilePath = "output.pdf";
            // Generate the PDF
            console.time("Reducingpdf");
            fs_1.default.writeFileSync(pdfFilePath, pdf);
            (0, child_process_1.exec)(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`, 
            // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,
            (error, stdout, stderr) => {
                if (error) {
                    throw new ApiError_1.ApiError(error, "", true, "Ghostscript error", httpCodes_1.httpCodes.BAD_REQUEST);
                }
                else {
                    // Read the reduced PDF from the temporary file
                    const reducedPdf = require("fs").readFileSync("reduced.pdf");
                    // Send the reduced PDF as a response
                    return new ApiResponse_1.default(reducedPdf, "Successfully generated PDF", false, "", 200);
                }
            });
        });
    }
    generatePdfWebsiteService(options, compressionType = "prepress", dpi = 300) {
        return __awaiter(this, void 0, void 0, function* () {
            const { displayHeaderFooter, footerTemplate, width, height, headerTemplate, landscape, margin, omitBackground, pageRanges, format, path, timeout, scale, printBackground, preferCSSPageSize, } = options;
            const browser = yield (0, puppeteer_1.default)();
            const page = yield browser.newPage();
            // Generate the PDF
            const pdf = yield page.pdf(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (displayHeaderFooter && { displayHeaderFooter })), (footerTemplate && { footerTemplate })), ((!height || !width) && { format: format || "A4" })), (headerTemplate && { headerTemplate })), (height && { height })), (landscape && { landscape })), (margin && { margin })), (omitBackground && { omitBackground })), (pageRanges && { pageRanges })), (path && { path })), (preferCSSPageSize && { preferCSSPageSize })), (printBackground && { printBackground })), (scale && { scale })), (timeout && { timeout })), (width && { width })), { path: "output.pdf" }));
            const pdfFilePath = "output.pdf";
            require("fs").writeFileSync(pdfFilePath, pdf);
            let reducedPdf;
            (0, child_process_1.exec)(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`, 
            // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Ghostscript error: ${error}`);
                    return new ApiError_1.ApiError(error, "", true, "Ghostscript error", 403);
                }
                else {
                    // Read the reduced PDF from the temporary file
                    reducedPdf = require("fs").readFileSync("reduced.pdf");
                    // Set response headers
                    console.timeEnd("Reducingpdf");
                    // Send the reduced PDF as a response
                    // Optionally, remove the temporary files after sending the response
                    require("fs").unlinkSync(pdfFilePath);
                    require("fs").unlinkSync("reduced.pdf");
                }
            });
            console.time("Reducingpdf");
            console.time("browserClose");
            yield browser.close();
            console.timeEnd("browserClose");
            return new ApiResponse_1.default(reducedPdf, "Successfully reduced PDF", false, "", 200);
        });
    }
}
const pdfService = new PdfService();
exports.default = pdfService;
