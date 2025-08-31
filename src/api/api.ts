import { DocBuilder } from '../DocBuilder';
import { Config, importConfig } from '../BuilderConfig';
import {ExportFormat, getOutputBuffer} from '../formatters/DocFormatter';
import { WebTemplate } from "../types/WebTemplate.ts";
//import type { Serve } from "bun";
const PORT = process.env['PORT'] || 3001;
// Create a server instance that we can export for testing
let server: Bun.Serve | null = null;

// Handler function for the server
async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Only handle POST requests to /convert
  const url = new URL(req.url);
    if (req.method !== 'POST' || url.pathname !== '/api/v1/convert') {
    return new Response('Not Found', { status: 404 });
  }

  try {
    // Parse query parameters
    const params = new URLSearchParams(url.search);
    const exportFormat = params.get('exportAs') || 'adoc';
    const exportFormatKey = exportFormat as keyof typeof ExportFormat;

    // Parse request body
    let template: WebTemplate;
    try {
      const contentType = req.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        template = await req.json() as WebTemplate;
      }
      else throw new Error('Invalid content type: Must be application/json');

    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if the template is provided
    if (!template) {
      return new Response(
        JSON.stringify({ error: 'No template provided' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate format
    if (!Object.keys(ExportFormat).includes(exportFormatKey)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid format',
          validFormats: Object.keys(ExportFormat)
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Load default config
    const config: Config = await importConfig('../config/wtconfig.json');

    // Override config with our settings
    config.exportFormat = ExportFormat[exportFormatKey];
      console.log('1: ', config.exportFormat);
    // Create DocBuilder and process the template
    const docBuilder =  new DocBuilder(template, config);
    await docBuilder.run(true)
      console.log('2: ', docBuilder.config.exportFormat);
    // Get the string output directly from DocBuilder
    const output: ArrayBufferLike|string|void = await getOutputBuffer(docBuilder);

    // Set the appropriate content type based on the format
    let contentType = 'text/plain';
    switch (exportFormat) {
        case 'adoc':
        case 'fshl':
        case 'fsht':
        case 'fshq':
        case 'md':
            contentType = 'text/plain';
            break;
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'pdf':
        contentType = 'application/pdf';
        break;

      case 'xmind':
        contentType = 'application/octet-stream';
        break;
    }

    // Create a ReadableStream to stream the output
    const stream = new ReadableStream({
      start(controller) {
        if (contentType === 'text/plain')
            controller.enqueue(new TextEncoder().encode(output as string));
        else
            controller.enqueue(output);
        controller.close();
      }
    });

    // Return the streamed response
    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
      }
    });
  } catch (error) {
    console.error('Error processing template:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Start the server
const start = async () => {
  try {
    server = Bun.serve({
      port: Number(PORT),
      hostname: '0.0.0.0',
      fetch: handleRequest,
      development: process.env.NODE_ENV !== 'production',
    });

    console.log(`Server started on http://localhost:${PORT}`);
    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    throw error;
  }
};

// Close the server
const close = async () => {
  if (server) {
    // @ts-ignore
      await server.stop(true)
    server = null;
    console.log('Server stopped');
  }
};

// Export the functions for use in other modules
export { start, close, handleRequest };

// Start the server if this file is run directly
if (import.meta.main) {
  await start();
}
