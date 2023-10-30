import { NextFunction, Request, Response } from "express";
import pdfService from "../service/pdfService";
import { exec } from "child_process";
import { PDFOptions } from "puppeteer";
import compressPdf from "../utils/compressPDF";
import { promisify } from "util";
import fs from "fs";
import { ApiError } from "../@types/ApiError";
import compressPDF from "../utils/compressPDF";
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

      const { stdout, stderr } = await compressPDF(compressionType);

      if (stderr) {
        const apiError = new ApiError(
          new Error("Unable to compress your file."),
          "",
          true,
          stderr,
          500
        );
        return res.status(apiError.statusCode).json(apiError);
      }

      const reducedFile = fs.readFileSync("reduced.pdf");

      return res.status(200).send(reducedFile);
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

      const { stdout, stderr } = await compressPDF(compressionType);

      if (stderr) {
        const apiError = new ApiError(
          new Error("Unable to compress your file."),
          "",
          true,
          stderr,
          500
        );
        return res.status(apiError.statusCode).json(apiError);
      }

      const reducedFile = fs.readFileSync("reduced.pdf");

      return res.status(200).send(reducedFile);
    } catch (error) {
      next(error);
    }
  }
}

const pdfController = new PdfController();
export default pdfController;
