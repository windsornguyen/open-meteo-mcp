import { createServer } from 'http';
import { randomUUID } from 'crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createStandaloneServer } from '../server.js';
import { Config } from '../config.js';

/**
 * Session storage for HTTP connections
 * Maps session IDs to their transport and server instances
 */
const httpSessions = new Map<string, {transport: StreamableHTTPServerTransport, server: any}>();

/**
 * Starts the HTTP server with streamable HTTP transport
 * Used for cloud deployment and HTTP-based MCP connections
 * @param config - Server configuration
 */
export function startHttpTransport(config: Config): void {
    const httpServer = createServer();
    
    httpServer.on('request', async (req, res) => {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        
        if (url.pathname === '/mcp') {
            await handleStreamableHttp(req, res, config);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });
    
    httpServer.listen(config.port, () => {
        console.log(`Open-Meteo MCP Server listening on http://localhost:${config.port}`);
        console.log('Put this in your client config:');
        console.log(JSON.stringify({
            "mcpServers": {
                "open-meteo": {
                    "url": `http://localhost:${config.port}/mcp`
                }
            }
        }, null, 2));
    });
}

/**
 * Handles streamable HTTP transport requests
 * @param req - HTTP request
 * @param res - HTTP response
 * @param config - Server configuration
 */
async function handleStreamableHttp(req: any, res: any, config: Config): Promise<void> {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    
    if (sessionId) {
        // Use existing session
        const session = httpSessions.get(sessionId);
        if (!session) {
            res.statusCode = 404;
            res.end('Session not found');
            return;
        }
        return await session.transport.handleRequest(req, res);
    }
    
    // Create new session for initialization
    if (req.method === 'POST') {
        const serverInstance = createStandaloneServer(config);
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (sessionId) => {
                httpSessions.set(sessionId, { transport, server: serverInstance });
                console.log('New Open-Meteo session created:', sessionId);
            }
        });
        
        transport.onclose = () => {
            if (transport.sessionId) {
                httpSessions.delete(transport.sessionId);
                console.log('Open-Meteo session closed:', transport.sessionId);
            }
        };
        
        try {
            await serverInstance.connect(transport);
            await transport.handleRequest(req, res);
        } catch (error) {
            console.error('Streamable HTTP connection error:', error);
        }
        return;
    }
    
    res.statusCode = 400;
    res.end('Invalid request');
}