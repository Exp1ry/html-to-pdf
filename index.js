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

app.use(express.json({ limit: "30mb" })); // Increase limit to 10MB
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static("public"));
app.use(secretKeyProtected);
app.use(cors());

app.post("/generate-pdf", validator.body(bodySchema), async (req, res) => {
  // console.log(req.body);
  // return res.send("ok");
  try {
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox"],
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

    // Generate the PDF
    const pdf = await page.pdf({
      ...(displayHeaderFooter && { displayHeaderFooter }),
      ...(footerTemplate && { footerTemplate }),
      format: format || "A4",
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
      path: "test.pdf",
    });

    await browser.close();
    const pdfFilePath = "test.pdf";
    require("fs").writeFileSync(pdfFilePath, pdf);

    // Use Ghostscript to reduce the PDF file size
    const compressionType = req.body.compressionType || "prepress";
    const dpi = req.body.dpi || 72;
    exec(
      `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Ghostscript error: ${error}`);
          res.status(500).send("Error generating PDF");
        } else {
          // Read the reduced PDF from the temporary file
          const reducedPdf = require("fs").readFileSync("reduced.pdf");

          // Set response headers
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="reduced.pdf"'
          );

          // Send the reduced PDF as a response
          res.send(reducedPdf);

          // Optionally, remove the temporary files after sending the response
          require("fs").unlinkSync(pdfFilePath);
          require("fs").unlinkSync("reduced.pdf");
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
});
//
app.use(joiCustomErrorHandler);

app.use(notFound);
