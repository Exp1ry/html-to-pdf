import { PDFOptions, Page } from "puppeteer";
import { exec } from "child_process"; // Import the child_process module
import ApiResponse from "../@types/ApiResponse";
import { ApiError } from "../@types/ApiError";
import fs from "fs";
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
    const pdfPage = await createPdfWithSettings(url, {
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

    return new ApiResponse(pdfPage, "Successfully created PDF", false, "", 200);
  }
  public async generatePdfFromHtml(
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

    html: string
  ) {
    const pdfFile = await createPdfWithHTML(html, {
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

    return new ApiResponse(pdfFile, "Successfully created PDF", false, "", 200);
  }
}
const pdfService = new PdfService();
export default pdfService;
