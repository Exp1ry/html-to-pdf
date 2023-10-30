import { promisify } from "util";
import { exec } from "child_process";

const execPromise = promisify(exec);

async function compressPDF(compressionType: string): Promise<{
  stdout: string;
  stderr: string;
}> {
  const pdfFilePath = "result.pdf";
  const { stdout, stderr } = await execPromise(
    `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${compressionType} -dNOPAUSE -dBATCH -sOutputFile=reduced.pdf ${pdfFilePath}`
  );

  return { stdout, stderr };
}

export default compressPDF;
