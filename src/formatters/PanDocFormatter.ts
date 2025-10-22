import { DocBuilder } from "../DocBuilder";
import { adoc } from "./AdocFormatter";
import * as fs from 'fs-extra';
import { generateRandomFilename, saveOutputArray } from "./DocFormatter.ts";
import {runPandocDockerStream} from "../RunPandocStream.ts";

const CreateDocbook = async (src: string): Promise<string> => {
  const asciidoctor = require('@asciidoctor/core')()
  const docbookConverter = require('@asciidoctor/docbook-converter')

  docbookConverter.register();

  const docbookContent = asciidoctor.convert(src, { backend: "docbook" });

  // Return the DocBook XML as a string, avoiding any temporary file on disk
  return docbookContent.toString();
}


const runPandoc = async (docbookXml: string, format: string): Promise<Uint8Array> => {
    const inputBytes = new TextEncoder().encode(docbookXml);
    return await runPandocDockerStream({
        input: inputBytes,
        outputFormat: format
    });
};
//     const runPandoc = async (docbookXml: string, format: string): Promise<Buffer> => {
//   const args: string[] = [];
//
//   // Read DocBook from stdin and write the converted output to stdout (binary-safe)
//   args.push('pandoc');
//   args.push('-f');
//   args.push('docbook');
//   args.push('-t');
//   args.push(`${format}`);
//   args.push('-o');
//   args.push('-'); // write output to stdout
//   args.push('-'); // read input from stdin
//
//   // Execute pandoc container and capture stdout as binary Buffer
//   const result = await runOneShot('pandoc/latex:3.4', args, docbookXml);
//   return result.stdout;
// };

/**
 * Unified function to convert content to various formats and return as appropriate type
 * @param dBuilder DocBuilder containing the content to convert
 * @param format The target format (docx, pdf, markdown_strict)
 * @param needsAdoc Whether the format requires an intermediate adoc file
 * @param returnAsText Whether to return the result as text (string) or binary (ArrayBuffer)
 * @returns Promise with the converted content
 */
const convertContent = async <T extends ArrayBufferLike | string>(
  dBuilder: DocBuilder,
  format: string
): Promise<T> => {

  // Ensure tmp directory exists
  await fs.ensureDir('./tmp');

  // Files scheduled for cleanup (if any temp files are created)
  const filesToCleanup: string[] = [];

  try {
    // If format needs intermediate adoc file (like PDF)
    // if (needsAdoc) {
    //   const tempAdocFile = generateRandomFilename('adoc');
    //   filesToCleanup.push(tempAdocFile);
    //   // Save content as .adoc file
    //   await adoc.saveFile(dBuilder, tempAdocFile, false);
    // }

      const docbookXml = await CreateDocbook(dBuilder.sb.toString());

      const bin = await runPandoc(docbookXml, format);
      if (format === 'markdown_strict') {
        const text = new TextDecoder().decode(bin);
        return text as T;
      }

      // Convert Uint8Array to a tightly sized ArrayBuffer
      const arrayBuffer = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength);
      return arrayBuffer as T;
      // Convert Uint8Array to a tightly sized ArrayBuffer
   //   return bin as ArrayBufferLike;

      // const arrayBuffer = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength);
      // outputBuffer = arrayBuffer;
      // return (outputBuffer as unknown) as T
      //
    // Read the file as appropriate type
 //   const result = returnAsText
 //     ? await Bun.file(tempOutputFile).text() as T
 //     : await Bun.file(tempOutputFile).arrayBuffer() as T;

    // Clean up all temporary files
   // await Promise.all(filesToCleanup.map(file => fs.remove(file)));

//    return result;
  } catch (error) {
    // Clean up files even if there's an error
    try {
        console.log('files', filesToCleanup);
   //   await Promise.all(filesToCleanup.map(file => fs.remove(file)));
    } catch (cleanupError) {
      console.error('Error cleaning up temporary files:', cleanupError);
    }
    throw error;
  }
};

export const docx = {
  saveFile: async (docBuilder: DocBuilder, outFile: string, useStdout: boolean) => {
    // Ensure the directory exists
    const outputBuffer: ArrayBufferLike = await docx.getOutputBuffer(docBuilder) as ArrayBufferLike;
    return saveOutputArray(outputBuffer, outFile, useStdout);
  },

  /**
   * Converts content to DOCX and returns it as binary Buffer
   * @param dBuilder DocBuilder containing the content to convert
   * @returns Promise<ArrayBufferLike> containing the DOCX data
   */
  getOutputBuffer: async (dBuilder: DocBuilder): Promise<ArrayBufferLike> => {
    return convertContent<ArrayBufferLike>(dBuilder, 'docx');
  },
}

export const md = {
  saveFile: async (docBuilder: DocBuilder, outFile: string, useStdout: boolean) => {
    // Ensure the directory exists
    const outputBuffer: string = await md.getOutputBuffer(docBuilder) as string
    return saveOutputArray(outputBuffer, outFile, useStdout);
  },

  /**
   * Converts content to Markdown and returns it as a string
   * @param dBuilder DocBuilder containing the content to convert
   * @returns Promise<string> containing the Markdown text
   */
  getOutputBuffer: async (dBuilder: DocBuilder): Promise<string> => {
    return convertContent<string>(dBuilder, 'markdown_strict');
  },
}

export const pdf = {
  saveFile: async (docBuilder: DocBuilder, outFile: string, useStdout: boolean) => {
    // Ensure the directory exists
    const outputBuffer: ArrayBufferLike = await pdf.getOutputBuffer(docBuilder) as ArrayBufferLike;
    return saveOutputArray(outputBuffer, outFile, useStdout);
  },

  /**
   * Converts content to PDF and returns it as binary Buffer
   * @param dBuilder DocBuilder containing the content to convert
   * @returns Promise<ArrayBufferLike> containing the PDF data
   */
  getOutputBuffer: async (dBuilder: DocBuilder): Promise<ArrayBufferLike> => {
    return convertContent<ArrayBufferLike>(dBuilder, 'pdf');
  },
}
