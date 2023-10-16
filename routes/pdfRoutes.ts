import express, { Router } from "express";
import pdfController from "../controller/pdfController";
import bodySchema from "../schemas/bodySchema";
import validationMiddleware from "../middleware/validationMiddleware";
const pdfRouter: Router = express.Router();

pdfRouter.post(
  "/generate-pdf",
  validationMiddleware(bodySchema),
  pdfController.generatePdf
);
pdfRouter.post(
  "/generate-pdf-website",
  validationMiddleware(bodySchema),
  pdfController.generatePdfWebsite
);

export default pdfRouter;
