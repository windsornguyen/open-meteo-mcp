import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
    CallToolRequestSchema,
    ErrorCode,
    ListToolsRequestSchema,
    McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { OpenMeteoClient } from './client.js';
import { weatherToolDefinitions, handleWeatherTool, isToolSupported } from './tools/index.js';
import { Config } from './config.js';

/**
 * Main server class for Open-Meteo MCP integration
 * Eliminates code duplication through clean tool registry pattern
 * @class OpenMeteoServer
 */
export class OpenMeteoServer {
    private client: OpenMeteoClient;
    private server: Server;

    /**
     * Creates a new OpenMeteoServer instance
     * @param {Config} config - Server configuration including API URLs
     */
    constructor(config: Config) {
        // Initialize client with all API endpoints from config
        this.client = new OpenMeteoClient(
            config.apiUrl,
            config.airQualityApiUrl,
            config.marineApiUrl,
            config.archiveApiUrl,
            config.seasonalApiUrl,
            config.ensembleApiUrl,
            config.geocodingApiUrl,
            config.floodApiUrl
        );

        this.server = new Server(
            {
                name: 'open-meteo',
                version: '1.1.1',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.setupHandlers();
        this.setupErrorHandling();
    }

    /**
     * Sets up MCP request handlers for tools
     * Uses clean dispatcher pattern instead of duplicate switch statements
     * @private
     */
    private setupHandlers(): void {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: weatherToolDefinitions,
        }));

        // Handle tool calls with clean dispatcher
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name: toolName, arguments: args } = request.params;

            if (!isToolSupported(toolName)) {
                throw new McpError(
                    ErrorCode.MethodNotFound,
                    `Unknown tool: ${toolName}`
                );
            }

            return handleWeatherTool(this.client, toolName, args);
        });
    }

    /**
     * Configures error handling and graceful shutdown
     * @private
     */
    private setupErrorHandling(): void {
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }

    /**
     * Returns the underlying MCP server instance
     * @returns {Server} MCP server instance
     */
    getServer(): Server {
        return this.server;
    }
}

/**
 * Factory function for creating standalone server instances
 * Used by HTTP transport for session-based connections
 * @param {Config} config - Server configuration
 * @returns {Server} Configured MCP server instance
 */
export function createStandaloneServer(config: Config): Server {
    const server = new Server(
        {
            name: "open-meteo-mcp-server",
            version: "1.1.1",
        },
        {
            capabilities: {
                tools: {},
            },
        },
    );

    // Initialize client with all API endpoints from config
    const client = new OpenMeteoClient(
        config.apiUrl,
        config.airQualityApiUrl,
        config.marineApiUrl,
        config.archiveApiUrl,
        config.seasonalApiUrl,
        config.ensembleApiUrl,
        config.geocodingApiUrl,
        config.floodApiUrl
    );

    // Set up handlers using the same clean dispatcher pattern
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: weatherToolDefinitions,
    }));

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name: toolName, arguments: args } = request.params;

        if (!isToolSupported(toolName)) {
            throw new McpError(
                ErrorCode.MethodNotFound,
                `Unknown tool: ${toolName}`
            );
        }

        return handleWeatherTool(client, toolName, args);
    });

    return server;
}