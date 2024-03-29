import express from "express";
import errorHandler from "./middleware/errorHandler";
import secretKeyProtected from "./middleware/secretKeyProtected";
import cors from "cors";
import pdfRouter from "./routes/pdfRoutes";
import dotenv from "dotenv";
import logger from "./utils/logger";
import { launchBrowser } from "./utils/puppeteer";
import { Cluster } from "puppeteer-cluster";
dotenv.config();
const app = express();
launchBrowser();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "30mb" })); // Increase limit to 10MB
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static("public"));
app.use(secretKeyProtected);
app.use(errorHandler);

// Routes
app.use("/", pdfRouter);

app.listen(process.env.PORT, () => {
  logger.info(`Listening to ${process.env.PORT}`);
});

// get the unhandled rejection and throw it to another fallback handler we already have.
// Prevents server from crashing, as all rejections and exceptions are handled.
process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
  throw reason;
});

process.on("uncaughtException", (error: Error) => {
  logger.error(error.stack);

  process.exit(1);
});
