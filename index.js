const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
app.listen(8080, () => console.log("running bwehehehe"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/generate-pdf", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    const { html } = req.body;

    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate the PDF
    const pdf = await page.pdf({
      path: "result1211.pdf",
      format: "A4",
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="generated.pdf"'
    );

    // Send the PDF as response
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
});
//
