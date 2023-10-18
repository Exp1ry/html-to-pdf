import { NextFunction, Request, Response } from "express";
import launchBrowser from "../utils/puppeteer";
import pdfService from "../service/pdfService";

import { PDFOptions } from "puppeteer";

class PdfController {
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

      // );

      // return res.status(resp.statusCode).json(resp);
    } catch (error) {
      next(error);
    }
  }

  public async generatePdf(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        url,
        options: {
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
        },
      }: { url: string; options: PDFOptions } = req.body;

      const resp = await pdfService.generatePdfService(url, {
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
      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="reduced.pdf"'
      );

      // Send the reduced PDF as a response
      res.status(resp.statusCode).send(resp.data);
    } catch (error) {
      next(error);
    }
  }
}

const pdfController = new PdfController();
export default pdfController;
