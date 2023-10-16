import { NextFunction, Request, Response } from "express";
import launchBrowser from "../utils/puppeteer";
import { IRequest } from "../@types/RequestBody";
import pdfService from "../service/pdfService";

class PdfController {
  public async generatePdf(req: Request, res: Response, next: NextFunction) {
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

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="reduced.pdf"'
      );

      const resp = await pdfService.generatePdfService(
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

      const resp = await pdfService.generatePdfService(
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
}

const pdfController = new PdfController();
export default pdfController;
