"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function shrinkPDFMiddleware(req, res, next) {
    const { compressionType = 200 } = req.body;
    const pdfFilePath = "output.pdf";
    return () => {
        (0, child_process_1.exec)(`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`, 
        // `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dQUIET -dBATCH -dDetectDuplicateImages=true -dDownsampleColorImages=true -dDownsampleGrayImages=true -dDownsampleMonoImages=true -dColorImageResolution=${dpi} -dGrayImageResolution=${dpi} -dMonoImageResolution=${dpi} -sOutputFile=reduced.pdf ${pdfFilePath}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`Ghostscript error: ${error}`);
                res
                    .status(500)
                    .send(`Error generating PDF Ghostscript error: ${error}`);
            }
            else {
                // Read the reduced PDF from the temporary file
                const reducedPdf = require("fs").readFileSync("reduced.pdf");
                // Set response headers
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", 'attachment; filename="reduced.pdf"');
                console.timeEnd("Reducingpdf");
                // Send the reduced PDF as a response
                res.send(reducedPdf);
                // Optionally, remove the temporary files after sending the response
                require("fs").unlinkSync(pdfFilePath);
                require("fs").unlinkSync("reduced.pdf");
            }
        });
    };
}
