import { DocBuilder } from '../DocBuilder';
import { Config, importConfig } from '../BuilderConfig';
import {ExportFormat, getOutputBuffer} from '../formatters/DocFormatter';
import { WebTemplate } from "../types/WebTemplate.ts";
const PORT = process.env['PORT'] || 3000;
// Create a server instance that we can export for testing
let server: Bun.Serve | null = null;

// Handler function for the server
// Authentication configuration and utilities
const getAuthConfig = () => {
    const AUTH_USER = process.env['API_USER'] || '';
    const AUTH_PASS = process.env['API_PASS'] || '';
    const AUTH_ENABLED = AUTH_USER !== '' && AUTH_PASS !== '';
    return {AUTH_USER, AUTH_PASS, AUTH_ENABLED};
};

const createUnauthorizedResponse = () => new Response('Unauthorized', {
    status: 401,
    headers: {
        'WWW-Authenticate': 'Basic realm="wt2xt"',
        'Access-Control-Allow-Origin': '*'
    }
});

const requireAuth = (req: Request) => {
    const {AUTH_USER, AUTH_PASS, AUTH_ENABLED} = getAuthConfig();
    if (!AUTH_ENABLED) return true;

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

// CORS handling
const handleCorsPreflightRequest = () => new Response(null, {
    status: 204,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    },
});

// Route handlers
const handleHeartbeat = () => new Response(null, {
    status: 204,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});

const handleConfigPost = async (req: Request) => {
    if (!requireAuth(req)) return createUnauthorizedResponse();

    try {
        const contentType = req.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return new Response(JSON.stringify({error: 'Invalid content type: Must be application/json'}), {
                status: 400,
                headers: {'Content-Type': 'application/json'}
            });
        }

        const body = await req.text();
        try {
            JSON.parse(body);
        } catch {
            return new Response(JSON.stringify({error: 'Invalid JSON'}), {
                status: 400,
                headers: {'Content-Type': 'application/json'}
            });
        }

        const configDir = '/app/config';
        const customConfigPath = `${configDir}/custom_config.json`;
        await Bun.write(customConfigPath, body);
        return new Response(null, {status: 204, headers: {'Access-Control-Allow-Origin': '*'}});
    } catch (e) {
        return new Response(JSON.stringify({
            error: 'Failed to save config',
            details: e instanceof Error ? e.message : String(e)
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
};

const handleConfigGet = async (req: Request) => {
    if (!requireAuth(req)) return createUnauthorizedResponse();

    try {
        const configDir = '/app/config';
        const customConfigPath = `${configDir}/custom_config.json`;
        const file = Bun.file(customConfigPath);

        if (!(await file.exists())) {
            return new Response(JSON.stringify({error: 'custom_config.json not found'}), {
                status: 404,
                headers: {'Content-Type': 'application/json'}
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
        return new Response(JSON.stringify({
            error: 'Failed to read config',
            details: e instanceof Error ? e.message : String(e)
        }), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
};

// Content type utilities
const getContentTypeForFormat = (exportFormat: string): string => {
    switch (exportFormat) {
        case 'adoc':
        case 'md':
        case 'fshl':
        case 'fsht':
        case 'fshq':
            return 'text/plain';
        case 'docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'pdf':
            return 'application/pdf';
        case 'xmind':
            return 'application/octet-stream';
        case 'fhirl':
            return 'application/zip';
        default:
            return 'text/plain';
    }
};

// Parse and validate the request body without using throw/catch for control flow in the caller
const parseTemplateFromRequest = async (req: Request): Promise<WebTemplate | Response> => {
    const contentType = req.headers.get('content-type') || '';

    // Validate content type up-front and return a client error response
    if (!contentType.includes('application/json')) {
        return new Response(
            JSON.stringify({ error: 'Invalid Content-type : must be application/json' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Safely parse JSON; if invalid, return a 400 without throwing to the caller
    try {
        return await req.json() as WebTemplate;
    } catch {
        return new Response(
            JSON.stringify({ error: 'Invalid request body' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

const handleConvert = async (req: Request, url: URL) => {
    if (!requireAuth(req)) return createUnauthorizedResponse();

    try {
        const params = new URLSearchParams(url.search);
        const exportFormat = params.get('exportAs') || 'adoc';
        const exportFormatKey = exportFormat as keyof typeof ExportFormat;

        // Parse request body (no local try/catch; delegate to helper)
        const parsed = await parseTemplateFromRequest(req);
        if (parsed instanceof Response) {
            return parsed;
        }
        const template: WebTemplate = parsed;

        if (!template) {
            return new Response(
                JSON.stringify({error: 'No template provided'}),
                {
                    status: 400,
                    headers: {'Content-Type': 'application/json'}
                }
            );
        }

        if (!Object.keys(ExportFormat).includes(exportFormatKey)) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid format',
                    validFormats: Object.keys(ExportFormat)
                }),
                {
                    status: 400,
                    headers: {'Content-Type': 'application/json'}
                }
            );
        }

        const config: Config = await importConfig('../config/wtconfig.json');
        config.exportFormat = ExportFormat[exportFormatKey];
        //console.log('1: ', config.exportFormat);

        const docBuilder = new DocBuilder(template, config);
        await docBuilder.run(true);

        const output: ArrayBufferLike | string | void = await getOutputBuffer(docBuilder);
        const contentType = getContentTypeForFormat(exportFormat);
console.log('2: ', contentType);
        const stream = new ReadableStream({
            start(controller) {
                if (contentType === 'text/plain') {
                    console.log('MD ', output);
                    controller.enqueue(new TextEncoder().encode(output as string));
                } else {
                    controller.enqueue(output);
                }
                controller.close();
            }
        });

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
                headers: {'Content-Type': 'application/json'}
            }
        );
    }
};

async function handleRequest(req: Request): Promise<Response> {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return handleCorsPreflightRequest();
    }

    const url = new URL(req.url);

    // Route to appropriate handlers
    if (req.method === 'GET' && url.pathname === '/api/v1/heartbeat') {
        return handleHeartbeat();
    }

    if (req.method === 'POST' && url.pathname === '/api/v1/config') {
        return handleConfigPost(req);
    }

    if (req.method === 'GET' && url.pathname === '/api/v1/config') {
        return handleConfigGet(req);
    }

    if (req.method === 'POST' && url.pathname === '/api/v1/convert') {
        return handleConvert(req, url);
    }

    return new Response('Not Found', {status: 404});
}

// Start the server
const start = async () => {
  try {
    server = Bun.serve({
        port: Number(PORT),
      hostname: '0.0.0.0',
      idleTimeout: 0, // Disable timeout
      fetch: handleRequest,
      development: process.env.NODE_ENV !== 'production'
    });

    console.log(`Server started`);
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
