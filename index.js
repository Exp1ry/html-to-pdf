const express = require("express");
const puppeteer = require("puppeteer");
const { notFound, secretKeyProtected } = require("./middleware");
const app = express();
app.listen(8080, () => console.log("running bwehehehe"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(secretKeyProtected);

app.post("/generate-pdf", async (req, res) => {
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
      ...(preferCSSPageSize && { preferCSSPageSize }),
      printBackground: printBackground || true,
      ...(scale && { scale }),
      ...(timeout && { timeout }),
      ...(width && { width }),
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="generated.pdf"'
    );

    // Send the PDF as response
    return res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
});
//
app.use(notFound);
