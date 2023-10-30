import { NextFunction, Request, Response } from "express";
import pdfService from "../service/pdfService";
import { exec } from "child_process";
import { PDFOptions } from "puppeteer";

class PdfController {
  public async generatePdfFromURL(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        url,
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
        compressionType = "prepress",
        dpi = 300,
      }: {
        url: string;
        displayHeaderFooter: PDFOptions["displayHeaderFooter"];
        footerTemplate: PDFOptions["footerTemplate"];
        format: PDFOptions["format"];
        headerTemplate: PDFOptions["headerTemplate"];
        height: PDFOptions["height"];
        landscape: PDFOptions["landscape"];
        margin: PDFOptions["margin"];
        omitBackground: PDFOptions["omitBackground"];
        pageRanges: PDFOptions["pageRanges"];
        path: PDFOptions["path"];
        preferCSSPageSize: PDFOptions["preferCSSPageSize"];
        printBackground: PDFOptions["printBackground"];
        scale: PDFOptions["scale"];
        timeout: PDFOptions["timeout"];
        width: PDFOptions["width"];
        compressionType: string;
        dpi: number;
      } = req.body;

      //Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="reduced.pdf"'
      );

      const resp = await pdfService.generatePdfFromUrl(
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
        url
      );

      if (resp.isError) return res.status(resp.statusCode).json(resp);

      const pdfFilePath = "result.pdf";

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
            res.status(200).send(reducedPdf);

            // Optionally, remove the temporary files after sending the response
            require("fs").unlinkSync(pdfFilePath);
            require("fs").unlinkSync("reduced.pdf");
          }
        }
      );
    } catch (error) {
      next(error);
    }
  }
  public async generatePdfFromHTML(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
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
        compressionType = "prepress",
        dpi = 300,
      }: {
        html: string;
        displayHeaderFooter: PDFOptions["displayHeaderFooter"];
        footerTemplate: PDFOptions["footerTemplate"];
        format: PDFOptions["format"];
        headerTemplate: PDFOptions["headerTemplate"];
        height: PDFOptions["height"];
        landscape: PDFOptions["landscape"];
        margin: PDFOptions["margin"];
        omitBackground: PDFOptions["omitBackground"];
        pageRanges: PDFOptions["pageRanges"];
        path: PDFOptions["path"];
        preferCSSPageSize: PDFOptions["preferCSSPageSize"];
        printBackground: PDFOptions["printBackground"];
        scale: PDFOptions["scale"];
        timeout: PDFOptions["timeout"];
        width: PDFOptions["width"];
        compressionType: string;
        dpi: number;
      } = req.body;

      //Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="reduced.pdf"'
      );
      const resp = await pdfService.generatePdfFromHtml(
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
        html
      );

      if (resp.isError) return res.status(resp.statusCode).json(resp);

      const pdfFilePath = "result.pdf";

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
            res.status(200).send(reducedPdf);

            // Optionally, remove the temporary files after sending the response
            require("fs").unlinkSync(pdfFilePath);
            require("fs").unlinkSync("reduced.pdf");
          }
        }
      );
    } catch (error) {
      next(error);
    }
  }
}

const pdfController = new PdfController();
export default pdfController;
