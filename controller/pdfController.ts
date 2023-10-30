import { NextFunction, Request, Response } from "express";
import pdfService from "../service/pdfService";
import { exec } from "child_process";
import puppeteer, { PDFOptions } from "puppeteer";

class PdfController {
  public async generatePdfFromURL(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
      }: { url: string; html: string; options: PDFOptions } = req.body;

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

      // Send the reduced PDF as a response
      res.status(resp.statusCode).send(resp.data);
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

      // Send the reduced PDF as a response
      res.status(resp.statusCode).send(resp.data);
    } catch (error) {
      next(error);
    }
  }
}

const pdfController = new PdfController();
export default pdfController;
