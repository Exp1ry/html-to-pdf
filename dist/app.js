"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const secretKeyProtected_1 = __importDefault(require("./middleware/secretKeyProtected"));
const cors_1 = __importDefault(require("cors"));
const pdfRoutes_1 = __importDefault(require("./routes/pdfRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./utils/logger"));
const puppeteer_1 = require("./utils/puppeteer");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, puppeteer_1.launchBrowser)();
// Middlewares
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json({ limit: "30mb" })); // Increase limit to 10MB
app.use(express_1.default.urlencoded({ limit: "30mb", extended: true }));
app.use(express_1.default.static("public"));
app.use(secretKeyProtected_1.default);
app.use(errorHandler_1.default);
// Routes
app.use("/", pdfRoutes_1.default);
app.listen(process.env.PORT, () => {
    logger_1.default.info(`Listening to ${process.env.PORT}`);
});
// get the unhandled rejection and throw it to another fallback handler we already have.
// Prevents server from crashing, as all rejections and exceptions are handled.
process.on("unhandledRejection", (reason, promise) => {
    throw reason;
});
process.on("uncaughtException", (error) => {
    logger_1.default.error(error.stack);
    process.exit(1);
});
