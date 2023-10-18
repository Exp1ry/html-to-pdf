import { PDFOptions, Page } from "puppeteer";
import { exec } from "child_process"; // Import the child_process module
import ApiResponse from "../@types/ApiResponse";
import { ApiError } from "../@types/ApiError";

import { createPdfWithHTML, createPdfWithSettings } from "../utils/puppeteer";
import { httpCodes } from "../@types/httpCodes";
class PdfService {
  public async generatePdfFromUrl(
    {
      displayHeaderFooter = undefined,
      footerTemplate = undefined,
      format = undefined,
      headerTemplate = undefined,
      height = undefined,
      landscape = undefined,
      margin = undefined,
      omitBackground = undefined,
      pageRanges = undefined,
      path = undefined,
      preferCSSPageSize = undefined,
      printBackground = undefined,
      scale = undefined,
      timeout = undefined,
      width = undefined,
    }: PDFOptions,
    url: string
  ) {
    // Create a new page, and go to the url, and create the PDF
    await createPdfWithSettings(url, {
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

    return new ApiResponse(
      reducedPdf,
      "Successfully created PDF",
      false,
      "",
      200
    );
  }
  // public async generatePdfFromHtml(
  //   {
  //     displayHeaderFooter = undefined,
  //     footerTemplate = undefined,
  //     format = undefined,
  //     headerTemplate = undefined,
  //     height = undefined,
  //     landscape = undefined,
  //     margin = undefined,
  //     omitBackground = undefined,
  //     pageRanges = undefined,
  //     path = undefined,
  //     preferCSSPageSize = undefined,
  //     printBackground = undefined,
  //     scale = undefined,
  //     timeout = undefined,
  //     width = undefined,
  //   }: PDFOptions,

  //   html: string
  // ): Promise<any> {
  //   const pdf = await createPdfWithHTML(html, {
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
  //   });

  //   const pdfFilePath = "output.pdf";
  //   require("fs").writeFileSync(pdfFilePath, pdf);

  //   // Use Ghostscript to reduce the PDF file size
  //   const compressionType = "prepress";

  //   exec(
  //     `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`,
  //     // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,

  //     (error, stdout, stderr) => {
  //       if (error) {
  //         console.error(`Ghostscript error: ${error}`);
  //         throw new ApiError(
  //           error,
  //           "",
  //           true,
  //           "Ghostscript error",
  //           httpCodes.CONFLICT
  //         );
  //       } else {
  //         // Read the reduced PDF from the temporary file
  //         const reducedPdf = require("fs").readFileSync("reduced.pdf");

  //         // Set response headers

  //         console.timeEnd("Reducingpdf");

  //         // Send the reduced PDF as a response
  //         return new ApiResponse(
  //           reducedPdf,
  //           "Successfully generated PDF",
  //           false,
  //           "",
  //           httpCodes.OK
  //         );
  //       }
  //     }
  //   );
  //   // Optionally, remove the temporary files after sending the response
  //   require("fs").unlinkSync(pdfFilePath);
  //   require("fs").unlinkSync("reduced.pdf");

  //   // Unlinks the file
  //   // fs.unlinkSync("result.pdf");
  // }
}
const pdfService = new PdfService();
export default pdfService;
