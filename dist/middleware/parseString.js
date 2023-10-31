"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isTrueSet = (myValue) => myValue === "true";
function parseString(req, res, next) {
    const { landscape, margin, scale, displayHeaderFooter, printBackground, preferCSSPageSize, omitBackground, } = req.body;
    if (typeof margin !== "undefined" && margin !== undefined) {
        req.body.margin = JSON.parse(margin);
    }
    if (typeof scale !== "undefined" && scale !== undefined) {
        req.body.scale = parseInt(scale);
    }
    if (typeof displayHeaderFooter !== "undefined" &&
        displayHeaderFooter !== undefined) {
        req.body.displayHeaderFooter = isTrueSet(displayHeaderFooter);
    }
    if (typeof printBackground !== "undefined" && printBackground !== undefined) {
        req.body.printBackground = isTrueSet(printBackground);
    }
    if (typeof landscape !== "undefined" && landscape !== undefined) {
        req.body.landscape = isTrueSet(landscape);
    }
    if (typeof preferCSSPageSize !== "undefined" &&
        preferCSSPageSize !== undefined) {
        req.body.preferCSSPageSize = isTrueSet(preferCSSPageSize);
    }
    if (typeof omitBackground !== "undefined" && omitBackground !== undefined) {
        req.body.omitBackground = isTrueSet(omitBackground);
    }
    next();
}
exports.default = parseString;
