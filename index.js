import express from "express";
import puppeteer from "puppeteer";
import path from "path";

const app = express();
app.listen(8080, () => console.log("running"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the 'public' folder

app.post("/generate-pdf", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const { html } = req.body;
    // Load the HTML content
    // const html = ` <!DOCTYPE html>
    // <html lang='en'>
    // <head>
    //     <meta charset='UTF-8'>
    //     <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    //     <title>Document</title>
    //     <style>
    //     body{
    //         background-color: black;
    //     }
    //     html{
    //         background-color: black;
    //     }
    //     .grid{
    //         display: grid;
    //         grid-template-columns: repeat(4, minmax(0, 1fr));
    //         gap: 20px;
    //         background-color: black;
    //         padding: 10px;
    //     }
    //    .grid img{
    //     object-fit: cover;
    //     width: 100%;
    //   aspect-ratio: 3/4;
    //   border-radius: 10px;
    //    }
    //    .grid p{
    //   color: white;
    //    }
    //    .grid div{

    //     overflow: hidden;
    //    }
    //     </style>
    // </head>
    // <body>
    //     <h1>This is my library</h1>
    //     <div class='grid'>
    //         <div>
    //             <img src='https://storage.googleapis.com/test-mediaslide-bucket-2/vince/test/testnew5.webp'/>
    //             <p>WOw amazing thankew</p>
    //         </div>
    //         <div>
    //             <img src='https://mediaslide-europe.storage.googleapis.com/city/pictures/2328/7202/large-1654600848-5bc70376b4524c4daaa53786c106b3f0.jpg'/>
    //             <p>WOw amazing thankew</p>
    //         </div>
    //         <div>
    //             <img src='https://mediaslide-europe.storage.googleapis.com/city/pictures/2328/7202/large-1654600840-2284260d0b2abdc8c4fdb55232c3a69c.jpg'/>
    //             <p>WOw amazing thankew</p>
    //         </div>
    //         <div>
    //             <img src='https://mediaslide-europe.storage.googleapis.com/city/pictures/2328/7202/large-1654600818-78713c99b7a90c3775584e2b705bf47f.jpg'/>
    //             <p>WOw amazing thankew</p>
    //         </div>
    //         <div>
    //             <img src='https://mediaslide-europe.storage.googleapis.com/city/pictures/2328/7202/large-1654600825-6748390cff1951650b02c5a37b55781e.jpg'/>
    //             <p>WOw amazing thankew</p>
    //         </div>
    //         <div>
    //             <img src='https://mediaslide-europe.storage.googleapis.com/city/pictures/2328/7202/large-1654600827-d75edc0f85a9ce4dad2895f2445205bf.jpg'/>
    //             <p>WOw amazing thankew</p>
    //         </div>
    //         <div>
    //             <img src='https://mediaslide-europe.storage.googleapis.com/city/pictures/2328/7202/large-1654600829-5b948f61b71649a8ab6d434d011521d6.jpg'/>
    //             <p>WOw amazing thankew</p>
    //         </div>
    //         <div>
    //             <img src='https://mediaslide-europe.storage.googleapis.com/city/pictures/2328/7202/large-1654600832-1b47e9057d4f3429e739ddfae1487d51.jpg'/>
    //             <p>WOw amazing thankew</p>
    //         </div>
    //         <div>
    //             <img src='https://storage.googleapis.com/test-mediaslide-bucket-2/vince/test/testnew5.webp'/>
    //             <p>WOw amazing thankew</p>
    //         </div>
    //     </div>
    // </body>
    // </html> `;

    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate the PDF
    const pdf = await page.pdf({
      path: "result1211.pdf",
      //   margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      //   printBackground: true,
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
