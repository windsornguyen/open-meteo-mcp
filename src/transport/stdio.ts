import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

/**
 * Runs the MCP server with STDIO transport
 * Used for local development and direct MCP client connections
 * @param server - MCP Server instance to run
 * @returns Promise that resolves when transport is connected
 */
export async function runStdioTransport(server: Server): Promise<void> {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Open-Meteo MCP Server running on stdio');
}