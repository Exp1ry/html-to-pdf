const express = require("express");
const puppeteer = require("puppeteer");
const {
  notFound,
  secretKeyProtected,
  joiCustomErrorHandler,
  validator,
  bodySchema,
} = require("./middleware");
const cors = require("cors");
const { exec } = require("child_process"); // Import the child_process module

const app = express();
app.listen(8080, () => console.log("running on port 8080"));
app.use(cors({ origin: "*" }));

app.use(express.json({ limit: "30mb" })); // Increase limit to 10MB
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static("public"));
app.use(secretKeyProtected);

app.post("/generate-pdf", validator.body(bodySchema), async (req, res) => {
  try {
    console.time("browserOpen");

    const browser = await puppeteer.launch({
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

    const page = await browser.newPage();
    console.timeEnd("browserOpen");

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
      printBackground,
      scale,
      timeout,
      width,
    } = req.body;
    //
    await page.setContent(html, { waitUntil: "networkidle0" });
    //
    // Generate the PDF
    console.time("Generatingpdf");
    const pdf = await page.pdf({
      ...(displayHeaderFooter && { displayHeaderFooter }),
      ...(footerTemplate && { footerTemplate }),
      ...((!height || !width) && { format: format || "A4" }),
      ...(headerTemplate && { headerTemplate }),
      ...(height && { height }),
      ...(landscape && { landscape }),
      ...(margin && { margin }),
      ...(omitBackground && { omitBackground }),
      ...(pageRanges && { pageRanges }),
      ...(path && { path }),
      ...(preferCSSPageSize && { preferCSSPageSize }),
      ...(printBackground && { printBackground }),
      ...(scale && { scale }),
      ...(timeout && { timeout }),
      ...(width && { width }),
      path: "output.pdf",
    });
    console.timeEnd("Generatingpdf");

    const pdfFilePath = "output.pdf";
    require("fs").writeFileSync(pdfFilePath, pdf);

    // Use Ghostscript to reduce the PDF file size
    const compressionType = req.body.compressionType || "prepress";
    const dpi = req.body.dpi || 300;
    console.time("Reducingpdf");

    exec(
      `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`,
      // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,

      (error, stdout, stderr) => {
        if (error) {
          console.error(`Ghostscript error: ${error}`);
          res
            .status(500)
            .send(`Error generating PDF Ghostscript error: ${error}`);
        } else {
          // Read the reduced PDF from the temporary file
          const reducedPdf = require("fs").readFileSync("reduced.pdf");

          // Set response headers
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="reduced.pdf"'
          );
          console.timeEnd("Reducingpdf");

          // Send the reduced PDF as a response
          res.send(reducedPdf);

          // Optionally, remove the temporary files after sending the response
          require("fs").unlinkSync(pdfFilePath);
          require("fs").unlinkSync("reduced.pdf");
        }
      }
    );
    console.time("browserClose");
    await browser.close();
    console.timeEnd("browserClose");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
});

// clone stable endpoint for now for website use all changes shall be made on above endpoint
app.post(
  "/generate-pdf-website",
  validator.body(bodySchema),
  async (req, res) => {
    try {
      const browser = await puppeteer.launch({
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

      const page = await browser.newPage();

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
        printBackground,
        scale,
        timeout,
        width,
      } = req.body;
      //
      await page.setContent(html, { waitUntil: "networkidle0" });
      //
      // Generate the PDF
      const pdf = await page.pdf({
        ...(displayHeaderFooter && { displayHeaderFooter }),
        ...(footerTemplate && { footerTemplate }),
        ...((!height || !width) && { format: format || "A4" }),
        ...(headerTemplate && { headerTemplate }),
        ...(height && { height }),
        ...(landscape && { landscape }),
        ...(margin && { margin }),
        ...(omitBackground && { omitBackground }),
        ...(pageRanges && { pageRanges }),
        ...(path && { path }),
        ...(preferCSSPageSize && { preferCSSPageSize }),
        ...(printBackground && { printBackground }),
        ...(scale && { scale }),
        ...(timeout && { timeout }),
        ...(width && { width }),
        path: "output.pdf",
      });

      const pdfFilePath = "output.pdf";
      require("fs").writeFileSync(pdfFilePath, pdf);

      // Use Ghostscript to reduce the PDF file size
      const compressionType = req.body.compressionType || "prepress";
      const dpi = req.body.dpi || 300;
      console.time("Reducingpdf");

      exec(
        `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`,
        // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,

        (error, stdout, stderr) => {
          if (error) {
            console.error(`Ghostscript error: ${error}`);
            res
              .status(500)
              .send(`Error generating PDF Ghostscript error: ${error}`);
          } else {
            // Read the reduced PDF from the temporary file
            const reducedPdf = require("fs").readFileSync("reduced.pdf");

            // Set response headers
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              'attachment; filename="reduced.pdf"'
            );
            console.timeEnd("Reducingpdf");

            // Send the reduced PDF as a response
            res.send(reducedPdf);

            // Optionally, remove the temporary files after sending the response
            require("fs").unlinkSync(pdfFilePath);
            require("fs").unlinkSync("reduced.pdf");
          }
        }
      );
      console.time("browserClose");
      await browser.close();
      console.timeEnd("browserClose");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error generating PDF");
    }
  }
);
//
app.use(joiCustomErrorHandler);

app.use(notFound);
//
