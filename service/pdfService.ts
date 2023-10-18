import { PDFOptions, Page } from "puppeteer";
import { exec } from "child_process"; // Import the child_process module
import ApiResponse from "../@types/ApiResponse";
import { ApiError } from "../@types/ApiError";

import createPdfWithSettings from "../utils/puppeteer";
class PdfService {
  public async generatePdfService(
    url: string,
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
    }: PDFOptions
  ): Promise<ApiResponse<any>> {
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

    // Unlinks the file
    // fs.unlinkSync("result.pdf");
    return new ApiResponse(
      reducedPdf,
      "Successfully created PDF",
      false,
      "",
      200
    );
  }

  // public async generatePdfWebsiteService(
  //   options: PDFOptions,
  //   compressionType = "prepress",
  //   dpi = 300
  // ) {
  //   const {
  //     displayHeaderFooter,
  //     footerTemplate,
  //     width,
  //     height,
  //     headerTemplate,
  //     landscape,
  //     margin,
  //     omitBackground,
  //     pageRanges,
  //     format,
  //     path,
  //     timeout,
  //     scale,
  //     printBackground,
  //     preferCSSPageSize,
  //   } = options;

  //   // const browser = await launchBrowser();
  //   // const page = await browser.newPage();

  //   // // Generate the PDF
  //   // const pdf = await page.pdf({
  //   //   ...(displayHeaderFooter && { displayHeaderFooter }),
  //   //   ...(footerTemplate && { footerTemplate }),
  //   //   ...((!height || !width) && { format: format || "A4" }),
  //   //   ...(headerTemplate && { headerTemplate }),
  //   //   ...(height && { height }),
  //   //   ...(landscape && { landscape }),
  //   //   ...(margin && { margin }),
  //   //   ...(omitBackground && { omitBackground }),
  //   //   ...(pageRanges && { pageRanges }),
  //   //   ...(path && { path }),
  //   //   ...(preferCSSPageSize && { preferCSSPageSize }),
  //   //   ...(printBackground && { printBackground }),
  //   //   ...(scale && { scale }),
  //   //   ...(timeout && { timeout }),
  //   //   ...(width && { width }),
  //   //   path: "output.pdf",
  //   // });

  //   const pdfFilePath = "output.pdf";
  //   // require("fs").writeFileSync(pdfFilePath, pdf);

  //   let reducedPdf;

  //   exec(
  //     `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`,
  //     // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,

  //     (error, stdout, stderr) => {
  //       if (error) {
  //         console.error(`Ghostscript error: ${error}`);
  //         return new ApiError(error, "", true, "Ghostscript error", 403);
  //       } else {
  //         // Read the reduced PDF from the temporary file
  //         reducedPdf = require("fs").readFileSync("reduced.pdf");

  //         // Set response headers

  //         console.timeEnd("Reducingpdf");

  //         // Send the reduced PDF as a response

  //         // Optionally, remove the temporary files after sending the response
  //         require("fs").unlinkSync(pdfFilePath);
  //         require("fs").unlinkSync("reduced.pdf");
  //       }
  //     }
  //   );
  //   console.time("Reducingpdf");

  //   console.time("browserClose");
  //   // await browser.close();
  //   console.timeEnd("browserClose");

  //   return new ApiResponse(
  //     reducedPdf,
  //     "Successfully reduced PDF",
  //     false,
  //     "",
  //     200
  //   );
  // }
}

const pdfService = new PdfService();
export default pdfService;
