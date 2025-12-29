import { Config } from '../BuilderConfig';

export const PORT = process.env['PORT'] || 3000;
export const CORS_ORIGIN = process.env['CORS_ORIGIN'] || '*';

export const getAuthConfig = () => {
    const AUTH_USER = process.env['API_USER'] || '';
    const AUTH_PASS = process.env['API_PASS'] || '';
    const AUTH_ENABLED = AUTH_USER !== '' && AUTH_PASS !== '';
    return {AUTH_USER, AUTH_PASS, AUTH_ENABLED};
};

export const getCORSHeaders = () => {
    return {
        'Access-Control-Allow-Origin': CORS_ORIGIN || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    }
}

export const createUnauthorizedResponse = () => new Response('Unauthorized', {
    status: 401,
    headers: {
        'WWW-Authenticate': 'Basic realm="wt2xt"',
        'Access-Control-Allow-Origin': '*'
    }
});

export const requireAuth = (req: Request) => {
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

export const handleCorsPreflightRequest = () => new Response(null, {
    status: 204,
    headers: {...getCORSHeaders()
    },
});

export const handleHeartbeat = () => new Response(null, {
    status: 204,
    headers: {...getCORSHeaders()
    }
});

export const getContentTypeForFormat = (exportFormat: string): string => {
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
        case 'html':
            return 'text/html';

        default:
            return 'text/plain';
    }
};

export const createErrorResponse = (message: string, status: number = 400, details?: any) => {
    return new Response(
        JSON.stringify({ error: message, ...(details ? { details } : {}) }),
        { status, headers: { ...getCORSHeaders(), 'Content-Type': 'application/json' } }
    );
};
