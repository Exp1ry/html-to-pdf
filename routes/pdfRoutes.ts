import express, { Router } from "express";
import pdfController from "../controller/pdfController";
import bodySchema, { fromHtmlSchema } from "../schemas/fromHtmlSchema";
import validationMiddleware from "../middleware/validationMiddleware";
import fromUrlSchema from "../schemas/fromUrlSchema";
import parseString from "../middleware/parseString";
const pdfRouter: Router = express.Router();

pdfRouter.post(
  "/generate-pdf-url",
  validationMiddleware(fromUrlSchema),
  pdfController.generatePdfFromURL
);
// pdfRouter.post("/test", pdfController.generatePdf);
pdfRouter.post(
  "/generate-pdf-html",
  parseString,
  validationMiddleware(fromHtmlSchema),
  pdfController.generatePdfFromHTML
);

export default pdfRouter;
