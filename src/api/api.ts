import { DocBuilder } from '../DocBuilder';
import { Config, importConfig } from '../BuilderConfig';
import {ExportFormat, getOutputBuffer} from '../formatters/DocFormatter';
import { WebTemplate } from "../types/WebTemplate.ts";
//import type { Serve } from "bun";
const PORT = process.env['PORT'] || 3000;
// Create a server instance that we can export for testing
let server: Bun.Serve | null = null;

// Handler function for the server
async function handleRequest(req: Request): Promise<Response> {

  // Basic Auth config
  const AUTH_USER = process.env['API_USER'] || '';
  const AUTH_PASS = process.env['API_PASS'] || '';
  const AUTH_ENABLED = AUTH_USER !== '' && AUTH_PASS !== '';

  const unauthorized = () => new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="wt2xt"',
      'Access-Control-Allow-Origin': '*'
    }
  });

  const requireAuth = (req: Request) => {
    if (!AUTH_ENABLED) return true; // auth disabled when no creds configured
    const auth = req.headers.get('authorization') || '';
    if (!auth.startsWith('Basic ')) return false;
    const b64 = auth.slice(6).trim();
    try {
      const decoded = Buffer.from(b64, 'base64').toString('utf8');
      const [user, pass] = decoded.split(':');
      return user === AUTH_USER && pass === AUTH_PASS;
    } catch {
      return false;
    }
  };


    // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Route handling
  const url = new URL(req.url);

  // Heartbeat endpoint
  if (req.method === 'GET' && url.pathname === '/api/v1/heartbeat') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Config endpoints
  const configDir = '/app/config';
  const customConfigPath = `${configDir}/custom_config.json`;

  // POST /config -> save JSON body to config/custom_config.json
  if (req.method === 'POST' && url.pathname === '/api/v1/config') {
    if (!requireAuth(req)) return unauthorized();
    try {
      const contentType = req.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return new Response(JSON.stringify({ error: 'Invalid content type: Must be application/json' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      const body = await req.text();
      // validate JSON
      try {
        JSON.parse(body);
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await Bun.write(customConfigPath, body);
      return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Failed to save config', details: e instanceof Error ? e.message : String(e) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // GET /config -> return config/custom_config.json
  if (req.method === 'GET' && url.pathname === '/api/v1/config') {
    if (!requireAuth(req)) return unauthorized();
    try {
      const file = Bun.file(customConfigPath);
      if (!(await file.exists())) {
        return new Response(JSON.stringify({ error: 'custom_config.json not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(file, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Failed to read config', details: e instanceof Error ? e.message : String(e) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Only handle POST requests to /api/v1/convert
  if (req.method !== 'POST' || url.pathname !== '/api/v1/convert') {
    return new Response('Not Found', { status: 404 });
  }
  // Require auth for convert
  if (!requireAuth(req)) return unauthorized();

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
  //    console.log('2: ', docBuilder.config.exportFormat);
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
      idleTimeout: 0, // Disable timeout
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
