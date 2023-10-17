import { PDFOptions, Page } from "puppeteer";
import { PdfServiceParams } from "../@types/PdfService";
import { exec } from "child_process"; // Import the child_process module
import ApiResponse from "../@types/ApiResponse";
import { ApiError } from "../@types/ApiError";
import { httpCodes } from "../@types/httpCodes";
import launchBrowser from "../utils/puppeteer";
import fs from "fs";
import { Response } from "express";
class PdfService {
  public async generatePdfService(
    options: PDFOptions,
    compressionType = "prepress",
    dpi = 300,
    page: Page
  ): Promise<any> {
    console.time("browserOpen");

    const {
      displayHeaderFooter,
      footerTemplate,
      width,
      height,
      headerTemplate,
      landscape,
      margin,
      omitBackground,
      pageRanges,
      format,
      path,
      timeout,
      scale,
      printBackground,
      preferCSSPageSize,
    } = options;
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
      ...(printBackground && { printBackground }),
      ...(scale && { scale }),
      ...(timeout && { timeout }),
      ...(width && { width }),
      path: "output.pdf",
    });

    // Use Ghostscript to reduce the PDF file size

    const pdfFilePath = "output.pdf";
    // Generate the PDF

    console.time("Reducingpdf");

    fs.writeFileSync(pdfFilePath, pdf);

    exec(
      `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`,
      // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,

      (error, stdout, stderr) => {
        if (error) {
          throw new ApiError(
            error,
            "",
            true,
            "Ghostscript error",
            httpCodes.BAD_REQUEST
          );
        } else {
          // Read the reduced PDF from the temporary file
          const reducedPdf = require("fs").readFileSync("reduced.pdf");

          // Send the reduced PDF as a response
          return new ApiResponse(
            reducedPdf,
            "Successfully generated PDF",
            false,
            "",
            200
          );
        }
      }
    );
  }

  public async generatePdfWebsiteService(
    options: PDFOptions,
    compressionType = "prepress",
    dpi = 300
  ) {
    const {
      displayHeaderFooter,
      footerTemplate,
      width,
      height,
      headerTemplate,
      landscape,
      margin,
      omitBackground,
      pageRanges,
      format,
      path,
      timeout,
      scale,
      printBackground,
      preferCSSPageSize,
    } = options;

    const browser = await launchBrowser();
    const page = await browser.newPage();

    // Generate the PDF
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
      ...(printBackground && { printBackground }),
      ...(scale && { scale }),
      ...(timeout && { timeout }),
      ...(width && { width }),
      path: "output.pdf",
    });

    const pdfFilePath = "output.pdf";
    require("fs").writeFileSync(pdfFilePath, pdf);

    let reducedPdf;

    exec(
      `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`,
      // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,

      (error, stdout, stderr) => {
        if (error) {
          console.error(`Ghostscript error: ${error}`);
          return new ApiError(error, "", true, "Ghostscript error", 403);
        } else {
          // Read the reduced PDF from the temporary file
          reducedPdf = require("fs").readFileSync("reduced.pdf");

          // Set response headers

          console.timeEnd("Reducingpdf");

          // Send the reduced PDF as a response

          // Optionally, remove the temporary files after sending the response
          require("fs").unlinkSync(pdfFilePath);
          require("fs").unlinkSync("reduced.pdf");
        }
      }
    );
    console.time("Reducingpdf");

    console.time("browserClose");
    await browser.close();
    console.timeEnd("browserClose");

    return new ApiResponse(
      reducedPdf,
      "Successfully reduced PDF",
      false,
      "",
      200
    );
  }
}

const pdfService = new PdfService();
export default pdfService;
