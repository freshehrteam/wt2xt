import * as fs from 'fs';
import path from 'path';
import { DocBuilder } from '../DocBuilder';
import { Config, importConfig } from '../BuilderConfig';
import { ExportFormat } from '../formatters/DocFormatter';
import { WebTemplate } from "../types/WebTemplate.ts";
import { Serve } from "bun";

const PORT = process.env['PORT'] || 3000;

// Helper function to parse query parameters
function parseQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const queryString = url.split('?')[1];

  if (!queryString) return params;

  const pairs = queryString.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }

  return params;
}

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
  if (req.method !== 'POST' || url.pathname !== '/convert') {
    return new Response('Not Found', { status: 404 });
  }

  try {
    // Parse query parameters
    const queryParams = parseQueryParams(url.search);
    const formatParam = queryParams['format'] || 'adoc';
    const includeFileContent = queryParams["includeFileContent"] === 'true';
    const exportFormatKey = formatParam as keyof typeof ExportFormat;

    // Parse request body
    let template: WebTemplate;
    try {
      const contentType = req.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        template = await req.json() as WebTemplate;
      } else {
        // Handle text/plain or other formats by parsing as JSON
        const text = await req.text();
        template = JSON.parse(text);
      }

      console.log('body', template);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if template is provided
    // Handle both direct template and nested template structure
    if (!template ) {
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

    // Create a temporary directory for output if it doesn't exist
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const tempFilename = `template_${timestamp}`;
    const outputFilename = `${tempFilename}.${formatParam}`;
    const outputPath = path.join(tempDir, outputFilename);

    // Load default config
    const config: Config = importConfig('./config/wtconfig.json');

    // Override config with our settings
    config.exportFormat = ExportFormat[exportFormatKey];
    config.outFileDir = tempDir;
    config.outFilePath = outputPath;

    // Create DocBuilder and process the template
    const docBuilder = new DocBuilder(template, config);
    await docBuilder.run();

    console.log("out path", outputPath);

    // Read the generated file
    const fileContent = fs.readFileSync(outputPath);

    // Clean up the temporary file after reading it
    fs.unlinkSync(outputPath);

    if (includeFileContent) {
      // Include the file content in the JSON response
      const response = {
        filename: outputFilename,
        content: fileContent.toString('base64'),
        format: formatParam
      };

      return new Response(
        JSON.stringify(response),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      // Set the appropriate content type based on the format
      let contentType = 'text/plain';
      switch (formatParam) {
        case 'adoc':
          contentType = 'text/plain';
          break;
        case 'docx':
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case 'pdf':
          contentType = 'application/pdf';
          break;
        case 'fshl':
        case 'fsht':
        case 'fshq':
          contentType = 'text/plain';
          break;
        case 'xmind':
          contentType = 'application/octet-stream';
          break;
      }

      // Send the file as the response
      return new Response(fileContent, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename=${outputFilename}`
        }
      });
    }
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

    console.log(`API server running on port ${PORT}`);
    return server;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Close the server (for testing)
const close = async () => {
  if (server) {
    await server.stop(true);
    server = null;
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  start().then();
}

// Export for testing
export default {
  start,
  close,
  fetch: handleRequest, // Export the handler for testing
  // For compatibility with tests that expect Fastify's inject method
  inject: async (options: { method: string; url: string; payload?: any }) => {
    const url = new URL(`http://localhost${options.url}`);

    const request = new Request(url, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: options.payload ? JSON.stringify(options.payload) : undefined,
    });

    const response = await handleRequest(request);
    const body = await response.text();

    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body,
    };
  }
};
