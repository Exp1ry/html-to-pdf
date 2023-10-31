import puppeteer, { Browser, PDFOptions, Page } from "puppeteer";
import { ApiError } from "../@types/ApiError";
import { httpCodes } from "../@types/httpCodes";

export async function launchBrowser(): Promise<Browser> {
  try {
    const browser: Browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
        "--autoplay-policy=user-gesture-required",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-domain-reliability",
        "--disable-extensions",
        "--disable-features=AudioServiceOutOfProcess",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-popup-blocking",
        "--disable-print-preview",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-speech-api",
        "--disable-sync",
        "--hide-scrollbars",
        "--ignore-gpu-blacklist",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-first-run",
        "--no-pings",
        "--no-zygote",
        "--password-store=basic",
        "--use-gl=swiftshader",
        "--use-mock-keychain",
      ],
    });

    return browser;
  } catch (error: any) {
    console.log(error);
    throw new ApiError(
      {},
      "",
      true,
      "Unable to launch browser",
      httpCodes.INTERNAL_SERVER
    );
  }
}

let page: Page;
async function getPage(): Promise<Page> {
  if (page) return page;

  const browser = await launchBrowser();

  page = await browser.newPage();

  return page;
}

async function createPdfWithSettings(
  url: string,
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
  }: PDFOptions
): Promise<Buffer> {
  const page = await getPage();

  // Used promise.all to combine both promises for speed
  await Promise.all([
    page.goto(url, { waitUntil: "networkidle0" }),
    page.emulateMediaType("screen"),
  ]);

  // Download the PDF
  const pdfPage = await page.pdf({
    path: "result.pdf",
    displayHeaderFooter,
    footerTemplate,
    height,
    width,
    landscape,
    margin,
    omitBackground,
    pageRanges,
    preferCSSPageSize,
    printBackground,
    scale,
    timeout,
  });
  // Close the browser
  // await browser.close();

  return pdfPage;
}

async function createPdfWithHTML(
  html: string,
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
  }: PDFOptions
): Promise<Buffer> {
  const page = await getPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  // Download the PDF
  const pdfPage = await page.pdf({
    path: "result.pdf",
    displayHeaderFooter,
    footerTemplate,
    height,
    width,
    landscape,
    margin,
    omitBackground,
    pageRanges,
    preferCSSPageSize,
    printBackground,
    scale,
    timeout,
  });
  // Close the browser
  // await browser.close();

  return pdfPage;
}

export { createPdfWithSettings, createPdfWithHTML };
