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
const puppeteer_1 = require("../utils/puppeteer");
const httpCodes_1 = require("../@types/httpCodes");
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
    generatePdfService({ displayHeaderFooter = undefined, footerTemplate = undefined, format = undefined, headerTemplate = undefined, height = undefined, landscape = undefined, margin = undefined, omitBackground = undefined, pageRanges = undefined, path = undefined, preferCSSPageSize = undefined, printBackground = undefined, scale = undefined, timeout = undefined, width = undefined, }, html) {
        return __awaiter(this, void 0, void 0, function* () {
            const pdf = yield (0, puppeteer_1.createPdfWithHTML)(html, {
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
            const pdfFilePath = "output.pdf";
            require("fs").writeFileSync(pdfFilePath, pdf);
            // Use Ghostscript to reduce the PDF file size
            const compressionType = "prepress";
            (0, child_process_1.exec)(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`, 
            // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Ghostscript error: ${error}`);
                    throw new ApiError_1.ApiError(error, "", true, "Ghostscript error", httpCodes_1.httpCodes.CONFLICT);
                }
                else {
                    // Read the reduced PDF from the temporary file
                    const reducedPdf = require("fs").readFileSync("reduced.pdf");
                    // Set response headers
                    console.timeEnd("Reducingpdf");
                    // Send the reduced PDF as a response
                    return new ApiResponse_1.default(reducedPdf, "Successfully generated PDF", false, "", httpCodes_1.httpCodes.OK);
                }
            });
            // Optionally, remove the temporary files after sending the response
            require("fs").unlinkSync(pdfFilePath);
            require("fs").unlinkSync("reduced.pdf");
            // Unlinks the file
            // fs.unlinkSync("result.pdf");
        });
    }
}
const pdfService = new PdfService();
exports.default = pdfService;
