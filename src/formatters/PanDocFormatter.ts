import { DocBuilder } from "../DocBuilder";
import { adoc } from "./AdocFormatter";
import * as fs from 'fs-extra';
import * as path from 'path';

 const CreateDocbook = async (src: string): Promise<void> => {

  const asciidoctor = require('@asciidoctor/core')()
  const docbookConverter = require('@asciidoctor/docbook-converter')

  docbookConverter.register();

   const docbookContent = asciidoctor.convert(src, { backend: "docbook" });

  // Ensure tmp directory exists
  await fs.ensureDir('./tmp');
  // Write DocBook content to a temporary file
  await fs.writeFile(`./tmp/tmpDocbook.xml`, docbookContent.toString());

}

const runPandoc = async (src: string, format: string, outFile: string ): Promise<void> => {
  const { exec } = require('child_process');
  const args = `-f docbook -t ${format}  -o './${outFile}'`

  await CreateDocbook(src)

  const command = `pandoc ${args} ./tmp/tmpDocbook.xml`

  return new Promise<void>((resolve, reject) => {
    exec(command, (error: { message: any; }, stdout: any, stderr: any) => {
      if (error) {
        console.log(`error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        // Don't reject on stderr as it might just be warnings
      }
      if (stdout) {
        console.log(`Export file: ${outFile}`);
      }
      resolve();
    });
  });
};

export const docx = {
  saveFile:  async (dBuilder: DocBuilder, outFile: string) => {
     await runPandoc(dBuilder.sb.toString(),'docx', outFile)
  },

  /**
   * Converts content to DOCX and returns it as a Bun Buffer that can be streamed
   * @param dBuilder DocBuilder containing the content to convert
   * @returns Promise<Bun.Buffer> containing the DOCX data
   */
  getBuffer: async (dBuilder: DocBuilder): Promise<ArrayBuffer> => {

    const tempDocxFile = './tmp/tmp.docx';
    await fs.ensureDir('./tmp');

    // Convert to DOCX
    await runPandoc(dBuilder.sb.toString(), 'docx', tempDocxFile);

    // Read the file as a Bun Buffer
    return Bun.file(tempDocxFile).arrayBuffer();
  },
}

export const pdf = {

  saveFile:  async (docBuilder: DocBuilder, outFile: string, useStdout: boolean) => {

      if (useStdout)
          await Bun.write(Bun.stdout, docBuilder.toString());
      else
      {
          await fs.ensureDir(path.dirname(outFile));
          await Bun.write(outFile, docBuilder.toString());
          console.log(`\n Exported : ${outFile}`);
      }
      // Return the length of the written data as an approximation of bytes written
      return Buffer.from(docBuilder.toString()).length;
  },

  /**
   * Converts content to PDF and returns it as a Bun Buffer that can be streamed
   * @param dBuilder DocBuilder containing the content to convert
   * @returns Promise<Bun.Buffer> containing the PDF data
   */
  getBuffer: async (dBuilder: DocBuilder): Promise<ArrayBuffer> => {
    const tempAdocFile = './tmp/tmp.adoc';
    const tempPdfFile = './tmp/tmp.pdf';

    // Ensure tmp directory exists
    await fs.ensureDir('./tmp');

    // Save content as .adoc file
    await adoc.saveFile(dBuilder, tempAdocFile,false);

    // Convert to PDF - runPandoc now properly returns a Promise
    await runPandoc(dBuilder.sb.toString(), 'pdf', tempPdfFile);

    // Read the file as a Bun Buffer
    return Bun.file(tempPdfFile).arrayBuffer();
  },
}
