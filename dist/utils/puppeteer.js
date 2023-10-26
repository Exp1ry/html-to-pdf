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
exports.createPdfWithHTML = exports.createPdfWithSettings = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const ApiError_1 = require("../@types/ApiError");
const httpCodes_1 = require("../@types/httpCodes");
function launchBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const browser = yield puppeteer_1.default.launch({
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
            return browser;
        }
        catch (error) {
            console.log(error);
            throw new ApiError_1.ApiError({}, "", true, "Unable to launch browser", httpCodes_1.httpCodes.INTERNAL_SERVER);
        }
    });
}
function createPdfWithSettings(url, { displayHeaderFooter = undefined, footerTemplate = undefined, format = undefined, headerTemplate = undefined, height = undefined, landscape = undefined, margin = undefined, omitBackground = undefined, pageRanges = undefined, path = undefined, preferCSSPageSize = undefined, printBackground = undefined, scale = undefined, timeout = undefined, width = undefined, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield launchBrowser();
        const page = yield browser.newPage();
        // Used promise.all to combine both promises for speed
        yield Promise.all([
            page.goto(url, { waitUntil: "networkidle0" }),
            page.emulateMediaType("screen"),
        ]);
        // Download the PDF
        yield page.pdf(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ path: "result.pdf" }, (displayHeaderFooter && { displayHeaderFooter })), (footerTemplate && { footerTemplate })), ((!height || !width) && { format: format || "a4" })), (headerTemplate && { headerTemplate })), (height && { height })), (landscape && { landscape })), (margin && { margin })), (omitBackground && { omitBackground })), (pageRanges && { pageRanges })), (path && { path })), (preferCSSPageSize && { preferCSSPageSize })), (printBackground && { printBackground: true })), (scale && { scale })), (timeout && { timeout })), (width && { width }))),
            // Close the browser
            yield browser.close();
        return page;
    });
}
exports.createPdfWithSettings = createPdfWithSettings;
function createPdfWithHTML(html, { displayHeaderFooter = undefined, footerTemplate = undefined, format = undefined, headerTemplate = undefined, height = undefined, landscape = undefined, margin = undefined, omitBackground = undefined, pageRanges = undefined, path = undefined, preferCSSPageSize = undefined, printBackground = undefined, scale = undefined, timeout = undefined, width = undefined, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield launchBrowser();
        const page = yield browser.newPage();
        // Used promise.all to combine both promises for speed
        yield page.setContent(html, { waitUntil: "networkidle0" }),
            // Download the PDF
            yield page.pdf(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ path: "output.pdf" }, (displayHeaderFooter && { displayHeaderFooter })), (footerTemplate && { footerTemplate })), ((!height || !width) && { format: format || "a4" })), (headerTemplate && { headerTemplate })), (height && { height })), (landscape && { landscape })), (margin && { margin })), (omitBackground && { omitBackground })), (pageRanges && { pageRanges })), (path && { path })), (preferCSSPageSize && { preferCSSPageSize })), (printBackground && { printBackground: true })), (scale && { scale })), (timeout && { timeout })), (width && { width }))),
            // Close the browser
            yield browser.close();
        return page;
    });
}
exports.createPdfWithHTML = createPdfWithHTML;
