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

// const browser = await launchBrowser();

// const page = await browser.newPage();

// await page.setContent(html, { waitUntil: "networkidle0" });

// if (!page) {
//   throw new ApiError(
//     {},
//     "",
//     true,
//     "Unable to generate PDF",
//     httpCodes.BAD_REQUEST
//   );
// }
// const resp = await pdfService.generatePdfService(
//   {
//     displayHeaderFooter,
//     footerTemplate,
//     format,
//     headerTemplate,
//     height,
//     landscape,
//     margin,
//     omitBackground,
//     pageRanges,
//     path,
//     preferCSSPageSize,
//     printBackground,
//     scale,
//     timeout,
//     width,
//   },
//   compressionType,
//   dpi,

//   page
// );

// res.setHeader("Content-Type", "application/pdf");
// res.setHeader(
//   "Content-Disposition",
//   'attachment; filename="reduced.pdf"'
// );

// console.log(resp.data, "DATA");
// fs.unlinkSync("reduced.pdf");

// console.time("browserClose");
// await browser.close();
// console.timeEnd("browserClose");
// return res.status(resp.statusCode).send(resp.data);
import { NextFunction, Request, Response } from "express";
import launchBrowser from "../utils/puppeteer";
import { IRequest } from "../@types/RequestBody";
import pdfService from "../service/pdfService";
import fs from "fs";
import { ApiError } from "../@types/ApiError";
import { httpCodes } from "../@types/httpCodes";
import puppeteer from "puppeteer";
import { exec } from "child_process"; // Import the child_process module

class PdfController {
  public async generatePdf(req: Request, res: Response, next: NextFunction) {
    try {
      console.time("browserOpen");

      const browser = await puppeteer.launch({
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

      const page = await browser.newPage();
      console.timeEnd("browserOpen");

      const {
        html,
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
        printBackground = true,
        scale,
        timeout,
        width,
      } = req.body;
      //
      await page.setContent(html, { waitUntil: "networkidle0" });
      //
      // Generate the PDF
      console.time("Generatingpdf");
      const pdf = await page.pdf({
        ...(displayHeaderFooter && { displayHeaderFooter }),
        ...(footerTemplate && { footerTemplate }),
        ...((!height || !width) && { format: format || "A4" }),
        ...(headerTemplate && { headerTemplate }),
        ...(height && { height }),
        ...(landscape && { landscape }),
        ...(margin && { margin }),
        ...(omitBackground && { omitBackground }),
        ...(pageRanges && { pageRanges }),
        ...(path && { path }),
        ...(preferCSSPageSize && { preferCSSPageSize }),
        ...(printBackground && { printBackground: true }),
        ...(scale && { scale }),
        ...(timeout && { timeout }),
        ...(width && { width }),
        path: "output.pdf",
      });
      console.timeEnd("Generatingpdf");

      const pdfFilePath = "output.pdf";
      require("fs").writeFileSync(pdfFilePath, pdf);

      // Use Ghostscript to reduce the PDF file size
      const compressionType = req.body.compressionType || "prepress";
      const dpi = req.body.dpi || 300;
      console.time("Reducingpdf");

      exec(
        `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`,
        // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,

        (error, stdout, stderr) => {
          if (error) {
            console.error(`Ghostscript error: ${error}`);
            res
              .status(500)
              .send(`Error generating PDF Ghostscript error: ${error}`);
          } else {
            // Read the reduced PDF from the temporary file
            const reducedPdf = require("fs").readFileSync("reduced.pdf");

            // Set response headers
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              'attachment; filename="reduced.pdf"'
            );
            console.timeEnd("Reducingpdf");

            // Send the reduced PDF as a response
            res.send(reducedPdf);

            // Optionally, remove the temporary files after sending the response
            require("fs").unlinkSync(pdfFilePath);
            require("fs").unlinkSync("reduced.pdf");
          }
        }
      );
      console.time("browserClose");
      await browser.close();
      console.timeEnd("browserClose");
    } catch (error) {
      next(error);
    }
  }

  public async generatePdfWebsite(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        compressionType,
        dpi,
        html,
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
      } = req.body;

      const browser = await launchBrowser();
      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: "networkidle0" });

      const resp = await pdfService.generatePdfWebsiteService(
        {
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
        },
        compressionType,
        dpi
      );

      return res.status(resp.statusCode).json(resp);
    } catch (error) {
      next(error);
    }
  }

  public async testPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const { url } = req.body;
      // Create a browser instance
      const browser = await launchBrowser();
      // Create a new page
      const page = await browser.newPage();

      // Website URL to export as pdf
      // const website_url =
      //   "https://www.bannerbear.com/blog/how-to-download-images-from-a-website-using-puppeteer/";

      // Open URL in current page
      await page.goto(url, { waitUntil: "networkidle0" });

      //To reflect CSS used for screens instead of print
      await page.emulateMediaType("screen");

      // Downlaod the PDF
      const pdf = await page.pdf({
        path: "result.pdf",
        // margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
        printBackground: true,
        format: "A4",
      });

      const reducedPdf = require("fs").readFileSync("result.pdf");

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="reduced.pdf"'
      );
      console.timeEnd("Reducingpdf");

      // Send the reduced PDF as a response
      res.send(reducedPdf);
      // Close the browser instance
      await browser.close();
    } catch (error) {
      next(error);
    }
  }
}

const pdfController = new PdfController();
export default pdfController;
