import { DocBuilder } from "../DocBuilder";
import { adoc } from "./AdocFormatter";
import * as fs from 'fs-extra';
import * as path from 'path';
import { ExportFormat, generateRandomFilename, getOutputBuffer, saveOutputArray } from "./DocFormatter.ts";

const CreateDocbook = async (src: string): Promise<string> => {
  const asciidoctor = require('@asciidoctor/core')()
  const docbookConverter = require('@asciidoctor/docbook-converter')

  docbookConverter.register();

  const docbookContent = asciidoctor.convert(src, { backend: "docbook" });

  // Ensure tmp directory exists
  await fs.ensureDir('./tmp');

  // Generate a random filename for the DocBook content
  const docbookFile = generateRandomFilename('xml');

  // Write DocBook content to a temporary file
  await fs.writeFile(docbookFile, docbookContent.toString());

  // Return the filename so it can be used by runPandoc
  return docbookFile;
}

const runPandoc = async (src: string, format: string, outFile: string ): Promise<string> => {
  const { exec } = require('child_process');
  const args = `-f docbook -t ${format}  -o ./${outFile}`

  // Get the path to the DocBook file
  const docbookFile = await CreateDocbook(src);

  const command = `pandoc ${args} ${docbookFile}`

  return new Promise<string>((resolve, reject) => {
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
      resolve(docbookFile);
    });
  });
};

/**
 * Unified function to convert content to various formats and return as appropriate type
 * @param dBuilder DocBuilder containing the content to convert
 * @param format The target format (docx, pdf, markdown_strict)
 * @param extension The file extension for the output file
 * @param needsAdoc Whether the format requires an intermediate adoc file
 * @param returnAsText Whether to return the result as text (string) or binary (ArrayBuffer)
 * @returns Promise with the converted content
 */
const convertContent = async <T extends ArrayBuffer | string>(
  dBuilder: DocBuilder,
  format: string,
  extension: string,
  needsAdoc: boolean = false,
  returnAsText: boolean = false
): Promise<T> => {
  // Ensure tmp directory exists
  await fs.ensureDir('./tmp');

  // Generate random filenames for temporary files
  const tempOutputFile = generateRandomFilename(extension);
  const filesToCleanup: string[] = [tempOutputFile];
  let docbookFile: string | null = null;

  try {
    // If format needs intermediate adoc file (like PDF)
    if (needsAdoc) {
      const tempAdocFile = generateRandomFilename('adoc');
      filesToCleanup.push(tempAdocFile);

      // Save content as .adoc file
      await adoc.saveFile(dBuilder, tempAdocFile, false);
    }

    // Convert to target format
    docbookFile = await runPandoc(dBuilder.sb.toString(), format, tempOutputFile);
    if (docbookFile) filesToCleanup.push(docbookFile);

    // Read the file as appropriate type
    const result = returnAsText
      ? await Bun.file(tempOutputFile).text() as T
      : await Bun.file(tempOutputFile).arrayBuffer() as T;

    // Clean up all temporary files
    await Promise.all(filesToCleanup.map(file => fs.remove(file)));

    return result;
  } catch (error) {
    // Clean up files even if there's an error
    try {
      await Promise.all(filesToCleanup.map(file => fs.remove(file)));
    } catch (cleanupError) {
      console.error('Error cleaning up temporary files:', cleanupError);
    }
    throw error;
  }
};

export const docx = {
  saveFile: async (docBuilder: DocBuilder, outFile: string, useStdout: boolean) => {
    // Ensure the directory exists
    const outputBuffer: ArrayBufferLike = await getOutputBuffer(docBuilder) as ArrayBufferLike
    return saveOutputArray(outputBuffer, outFile, useStdout);
  },

  /**
   * Converts content to DOCX and returns it as a Bun Buffer that can be streamed
   * @param dBuilder DocBuilder containing the content to convert
   * @returns Promise<ArrayBuffer> containing the DOCX data
   */
  getOutputBuffer: async (dBuilder: DocBuilder): Promise<ArrayBuffer> => {
    return convertContent<ArrayBuffer>(dBuilder, 'docx', 'docx', false, false);
  },
}

export const md = {
  saveFile: async (docBuilder: DocBuilder, outFile: string, useStdout: boolean) => {
    // Ensure the directory exists
    const outputBuffer: string = await getOutputBuffer(docBuilder) as string
    return saveOutputArray(outputBuffer, outFile, useStdout);
  },

  /**
   * Converts content to Markdown and returns it as a string
   * @param dBuilder DocBuilder containing the content to convert
   * @returns Promise<string> containing the Markdown text
   */
  getOutputBuffer: async (dBuilder: DocBuilder): Promise<string> => {
    return convertContent<string>(dBuilder, 'markdown_strict', 'md', false, true);
  },
}

export const pdf = {
  saveFile: async (docBuilder: DocBuilder, outFile: string, useStdout: boolean) => {
    // Ensure the directory exists
    const outputBuffer: ArrayBufferLike = await getOutputBuffer(docBuilder) as ArrayBufferLike
    return saveOutputArray(outputBuffer, outFile, useStdout);
  },

  /**
   * Converts content to PDF and returns it as a Bun Buffer that can be streamed
   * @param dBuilder DocBuilder containing the content to convert
   * @returns Promise<ArrayBuffer> containing the PDF data
   */
  getOutputBuffer: async (dBuilder: DocBuilder): Promise<ArrayBuffer> => {
    return convertContent<ArrayBuffer>(dBuilder, 'pdf', 'pdf', true, false);
  },
}
