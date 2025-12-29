import { DocBuilder } from '../DocBuilder';
import { Config, importConfig } from '../BuilderConfig';
import {ExportFormat, getOutputBuffer} from '../formatters/DocFormatter';
import { WebTemplate } from "../types/WebTemplate.ts";
import { cleanOptText } from "../tools/patchText.ts";
import {
    PORT,
    requireAuth,
    createUnauthorizedResponse,
    handleCorsPreflightRequest,
    handleHeartbeat,
    getContentTypeForFormat,
    createErrorResponse,
    getCORSHeaders
} from './serverUtils';

// Create a server instance that we can export for testing
let server: Bun.Server<WebSocket> | null = null;

// Clean an OPT/XML payload by applying the same textual patches used by the CLI tool.
const handleCleanOpt = async (req: Request) => {
    if (!requireAuth(req)) return createUnauthorizedResponse();

    try {
        const contentType = (req.headers.get('content-type') || '').toLowerCase();
        const isXml = contentType.includes('application/xml') || contentType.includes('text/xml');
        if (!isXml) {
            return createErrorResponse('Invalid content type: Must be application/xml or text/xml');
        }

        const xml = await req.text();
        const { output } = cleanOptText(xml);

        return new Response(output, {
            status: 200,
            headers: { ...getCORSHeaders(), 'Content-Type': 'application/xml' }
        });
    } catch (e) {
        return createErrorResponse('Failed to clean XML', 500, e instanceof Error ? e.message : String(e));
    }
};

const handleConfigPost = async (req: Request) => {
    if (!requireAuth(req)) return createUnauthorizedResponse();

    try {
        const contentType = req.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return createErrorResponse('Invalid content type: Must be application/json');
        }

        const body = await req.text();
        try {
            JSON.parse(body);
        } catch {
            return createErrorResponse('Invalid JSON');
        }

        const configDir = '/app/config';
        const customConfigPath = `${configDir}/custom_config.json`;
        await Bun.write(customConfigPath, body);
        return new Response(null, {status: 204, headers: {'Access-Control-Allow-Origin': '*'}});
    } catch (e) {
        return createErrorResponse('Failed to save config', 500, e instanceof Error ? e.message : String(e));
    }
};

const handleConfigGet = async (req: Request) => {
    if (!requireAuth(req)) return createUnauthorizedResponse();

    try {
        const configDir = '/app/config';
        const customConfigPath = `${configDir}/custom_config.json`;
        const file = Bun.file(customConfigPath);

        if (!(await file.exists())) {
            return createErrorResponse('custom_config.json not found', 404);
        }

        return new Response(file, {
            status: 200,
            headers: {...getCORSHeaders(),'Content-Type': 'application/json'}
        });
    } catch (e) {
        return createErrorResponse('Failed to read config', 500, e instanceof Error ? e.message : String(e));
    }
};

// Parse and validate the request body. Supports both the new wrapped shape
// { template: WebTemplate, config?: Partial<Config> } and the legacy body which
// is just the template object. Returns a Response on client error.
interface IncomingConvertBody { template: WebTemplate; config?: Partial<Config> }
const parseTemplateFromRequest = async (req: Request): Promise<IncomingConvertBody | Response> => {
    const contentType = req.headers.get('content-type') || '';

    // Validate content type up-front and return a client error response
    if (!contentType.includes('application/json')) {
        return createErrorResponse('Invalid Content-type : must be application/json');
    }

    try {
        const body = await req.json() as any;

        // New shape
        if (body && typeof body === 'object' && 'template' in body) {
            if (!body.template) {
                return createErrorResponse('No template provided');
            }
            return { template: body.template as WebTemplate, config: body.config as Partial<Config> | undefined };
        }

        // Legacy shape: body is the template itself
        return { template: body as WebTemplate };
    } catch {
        return createErrorResponse('Invalid request body');
    }
};

const handleConvert = async (req: Request, url: URL) => {
    if (!requireAuth(req)) return createUnauthorizedResponse();

    try {
        const params = new URLSearchParams(url.search);
        const exportFormat = params.get('exportAs') || params.get('out') || 'adoc';
        const exportFormatKey = exportFormat as keyof typeof ExportFormat;

        // Parse request body (no local try/catch; delegate to helper)
        const parsed = await parseTemplateFromRequest(req);
        if (parsed instanceof Response) {
            return parsed;
        }
        const { template, config: incomingConfig } = parsed;

        if (!template) {
            return createErrorResponse('No template provided');
        }

        if (!Object.keys(ExportFormat).includes(exportFormatKey)) {
            return createErrorResponse('Invalid format', 400, { validFormats: Object.keys(ExportFormat) });
        }

        // Load base config and merge incoming overrides if provided
        const baseConfig: Config = await importConfig('../config/wtconfig.json');
        const mergedConfig: Config = { ...baseConfig, ...(incomingConfig || {}) } as Config;
        // Always set exportFormat from query param
        mergedConfig.exportFormat = ExportFormat[exportFormatKey];

        const docBuilder = new DocBuilder(template, mergedConfig);
        await docBuilder.run(true);

        const output: ArrayBufferLike | string | void = await getOutputBuffer(docBuilder);
        const contentType = getContentTypeForFormat(exportFormat);
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
            headers: {...getCORSHeaders(),'Content-Type': contentType }

        });
    } catch (error) {
        console.error('Error processing template:', error);
        return createErrorResponse('Internal server error', 500, error instanceof Error ? error.message : 'Unknown error occurred');
    }
};

async function handleRequest(req: Request): Promise<Response> {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return handleCorsPreflightRequest();
    }

    const url = new URL(req.url);

    // ... existing code ...
    async function handleRequest(req: Request): Promise<Response> {
        // Handle CORS preflight requests
        if (req.method === 'OPTIONS') {
            return handleCorsPreflightRequest();
        }

        const url = new URL(req.url);
        const {pathname} = url;
        const method = req.method;
        const API_V1 = '/api/v1';

        // Route to appropriate handlers
        if (method === 'GET' && pathname === `${API_V1}/heartbeat`) return handleHeartbeat();
        if (method === 'GET' && pathname === `${API_V1}/config`) return handleConfigGet(req);
        if (method === 'POST' && pathname === `${API_V1}/config`) return handleConfigPost(req);
        if (method === 'POST' && pathname === `${API_V1}/convert`) return handleConvert(req, url);
        if (method === 'POST' && pathname === `${API_V1}/cleanOpt`) return handleCleanOpt(req);

        return new Response('Not Found', {status: 404});
    }

// ... existing code ...
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
