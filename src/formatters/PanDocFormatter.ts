import { DocBuilder } from "../DocBuilder";
import * as fs from 'fs-extra';
import {saveOutputArray } from "./DocFormatter.ts";
import {runPandocDockerComposeStream, runPandocDockerStream, runPandocLocalStream} from "../RunPandocStream.ts";

const CreateDocbook = async (src: string): Promise<string> => {
  const asciidoctor = require('@asciidoctor/core')()
  const docbookConverter = require('@asciidoctor/docbook-converter')

  docbookConverter.register();

  const docbookContent = asciidoctor.convert(src, { backend: "docbook" });

  // Return the DocBook XML as a string, avoiding any temporary file on disk
  return docbookContent.toString();
}
async function localPandocAvailable() {
    // Fallback: Avoid DinD by using a locally installed pandoc inside the current container if present.
    try {
        const check = Bun.spawn(["pandoc", "-v"], {stdout: "ignore", stderr: "ignore"});
        await check.exited;
        return check.exitCode === 0;
    } catch (_) {
        return false;
    }
}

function hostDockerAvailable(): boolean {
    try {
//        console.log('Bun.env', Bun.env);
        const insideContainer = fs.existsSync('/.dockerenv') || Boolean(Bun.env.DOCKER_CONTAINER || Bun.env.CONTAINER);
        const hostDockerAvailable = Boolean(Bun.env.DOCKER_HOST) || fs.existsSync('/var/run/docker.sock');
        return insideContainer && hostDockerAvailable;
    } catch (e) {
        return false// ignore
    }
}

const runPandoc = async (docbookXml: string, format: string): Promise<Uint8Array> => {

    const inputBytes = new TextEncoder().encode(docbookXml);
    const pandocFormat = format==='md' ? 'markdown_strict' : format

    if (hostDockerAvailable()) {
            // Use the compose-networked docker runner so the pandoc container can reach sibling services.
        return await runPandocDockerComposeStream({
            input: inputBytes,
            outputFormat: pandocFormat,
   //         network: Bun.env.DOCKER_COMPOSE_NETWORK || 'frontend'
        });
    }
    if (await localPandocAvailable()) {
        return await runPandocLocalStream({
            input: inputBytes,
            outputFormat: pandocFormat,
        });
    }

    return await runPandocDockerStream({
        input: inputBytes,
        outputFormat: pandocFormat,
    });
};

/**
 * Unified function to convert content to various formats and return as appropriate type
 * @param dBuilder DocBuilder containing the content to convert
 * @param format The target format (docx, pdf, markdown_strict)
 * @returns Promise with the converted content
 */
const convertContent = async <T extends ArrayBufferLike | string>(
  dBuilder: DocBuilder,
  format: string
): Promise<T> => {

  // Ensure tmp directory exists
  await fs.ensureDir('./tmp');

  // Files scheduled for cleanup (if any temp files are created)
  try {
      const docbookXml = await CreateDocbook(dBuilder.sb.toString());

      const bin = await runPandoc(docbookXml, format);

      if (format === 'md') {
        const text = new TextDecoder().decode(bin);
        return text as T;
      }

  // Handle other formats docs, pdf etc
  // Convert Uint8Array to a tightly sized ArrayBuffer

      const arrayBuffer = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength);
      return arrayBuffer as T;

//    return result;
  } catch (error) {
    // Clean up files even if there's an error
    try {
        //console.log('files', filesToCleanup);
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
    const outputBuffer: ArrayBufferLike = await md.getOutputBuffer(docBuilder) as ArrayBufferLike;
    return saveOutputArray(outputBuffer, outFile, useStdout);
  },

  /**
   * Converts content to Markdown and returns it as a string
   * @param dBuilder DocBuilder containing the content to convert
   * @returns Promise<string> containing the Markdown text
   */
  getOutputBuffer: async (dBuilder: DocBuilder): Promise<ArrayBufferLike> => {
    return convertContent<ArrayBufferLike>(dBuilder, 'md');
  },
}

export const html = {
    saveFile: async (docBuilder: DocBuilder, outFile: string, useStdout: boolean) => {
        // Ensure the directory exists
        const outputBuffer: ArrayBufferLike = await html.getOutputBuffer(docBuilder) as ArrayBufferLike;
        return saveOutputArray(outputBuffer, outFile, useStdout);
    },

    /**
     * Converts content to Markdown and returns it as a string
     * @param dBuilder DocBuilder containing the content to convert
     * @returns Promise<string> containing the Markdown text
     */
    getOutputBuffer: async (dBuilder: DocBuilder): Promise<ArrayBufferLike> => {
        return convertContent<ArrayBufferLike>(dBuilder, 'html');
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
