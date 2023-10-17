"use strict";
// const {
//   compressionType,
//   dpi,
//   html,
//   displayHeaderFooter,
//   footerTemplate,
//   format,
//   headerTemplate,
//   height,
//   landscape,
//   margin,
//   omitBackground,
//   pageRanges,
//   path,
//   preferCSSPageSize,
//   printBackground,
//   scale,
//   timeout,
//   width,
// } = req.body;
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
const puppeteer_2 = __importDefault(require("puppeteer"));
const child_process_1 = require("child_process"); // Import the child_process module
class PdfController {
    generatePdf(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.time("browserOpen");
                const browser = yield puppeteer_2.default.launch({
                    executablePath: "/usr/bin/chromium-browser",
                    headless: true,
                    args: [
                        "--no-sandbox",
                        "--disable-features=IsolateOrigins",
                        "--disable-site-isolation-trials",
                        "--autoplay-policy=user-gesture-required",
                        "--disable-background-networking",
                        "--disable-background-timer-throttling",
                        "--disable-backgrounding-occluded-windows",
                        "--disable-breakpad",
                        "--disable-client-side-phishing-detection",
                        "--disable-component-update",
                        "--disable-default-apps",
                        "--disable-dev-shm-usage",
                        "--disable-domain-reliability",
                        "--disable-extensions",
                        "--disable-features=AudioServiceOutOfProcess",
                        "--disable-hang-monitor",
                        "--disable-ipc-flooding-protection",
                        "--disable-notifications",
                        "--disable-offer-store-unmasked-wallet-cards",
                        "--disable-popup-blocking",
                        "--disable-print-preview",
                        "--disable-prompt-on-repost",
                        "--disable-renderer-backgrounding",
                        "--disable-setuid-sandbox",
                        "--disable-speech-api",
                        "--disable-sync",
                        "--hide-scrollbars",
                        "--ignore-gpu-blacklist",
                        "--metrics-recording-only",
                        "--mute-audio",
                        "--no-default-browser-check",
                        "--no-first-run",
                        "--no-pings",
                        "--no-zygote",
                        "--password-store=basic",
                        "--use-gl=swiftshader",
                        "--use-mock-keychain",
                    ],
                });
                const page = yield browser.newPage();
                console.timeEnd("browserOpen");
                const { html, displayHeaderFooter, footerTemplate, format, headerTemplate, height, landscape, margin, omitBackground, pageRanges, path, preferCSSPageSize, printBackground, scale, timeout, width, } = req.body;
                //
                yield page.setContent(html, { waitUntil: "networkidle0" });
                //
                // Generate the PDF
                console.time("Generatingpdf");
                const pdf = yield page.pdf(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (displayHeaderFooter && { displayHeaderFooter })), (footerTemplate && { footerTemplate })), ((!height || !width) && { format: format || "A4" })), (headerTemplate && { headerTemplate })), (height && { height })), (landscape && { landscape })), (margin && { margin })), (omitBackground && { omitBackground })), (pageRanges && { pageRanges })), (path && { path })), (preferCSSPageSize && { preferCSSPageSize })), (printBackground && { printBackground })), (scale && { scale })), (timeout && { timeout })), (width && { width })), { path: "output.pdf" }));
                console.timeEnd("Generatingpdf");
                const pdfFilePath = "output.pdf";
                require("fs").writeFileSync(pdfFilePath, pdf);
                // Use Ghostscript to reduce the PDF file size
                const compressionType = req.body.compressionType || "prepress";
                const dpi = req.body.dpi || 300;
                console.time("Reducingpdf");
                (0, child_process_1.exec)(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`, 
                // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Ghostscript error: ${error}`);
                        res
                            .status(500)
                            .send(`Error generating PDF Ghostscript error: ${error}`);
                    }
                    else {
                        // Read the reduced PDF from the temporary file
                        const reducedPdf = require("fs").readFileSync("reduced.pdf");
                        // Set response headers
                        res.setHeader("Content-Type", "application/pdf");
                        res.setHeader("Content-Disposition", 'attachment; filename="reduced.pdf"');
                        console.timeEnd("Reducingpdf");
                        // Send the reduced PDF as a response
                        res.send(reducedPdf);
                        // Optionally, remove the temporary files after sending the response
                        require("fs").unlinkSync(pdfFilePath);
                        require("fs").unlinkSync("reduced.pdf");
                    }
                });
                console.time("browserClose");
                yield browser.close();
                console.timeEnd("browserClose");
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
                const resp = yield pdfService_1.default.generatePdfWebsiteService({
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
