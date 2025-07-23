#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createServer } from 'http';
import { randomUUID } from 'crypto';
import { OpenMeteoClient } from './client.js';
import { ALL_TOOLS } from './tools.js';
import {
  ForecastParamsSchema,
  ArchiveParamsSchema,
  AirQualityParamsSchema,
  MarineParamsSchema,
  FloodParamsSchema,
  ElevationParamsSchema,
  GeocodingParamsSchema,
} from './types.js';

class OpenMeteoMCPServer {
  private server: Server;
  private client: OpenMeteoClient;

  constructor() {
    this.server = new Server(
      {
        name: 'open-meteo-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize with default Open-Meteo API URL, but allow override via environment
    const baseURL = process.env.OPEN_METEO_API_URL || 'https://api.open-meteo.com';
    this.client = new OpenMeteoClient(baseURL);

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: ALL_TOOLS,
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'weather_forecast': {
            const params = ForecastParamsSchema.parse(args);
            const result = await this.client.getForecast(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'weather_archive': {
            const params = ArchiveParamsSchema.parse(args);
            const result = await this.client.getArchive(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'air_quality': {
            const params = AirQualityParamsSchema.parse(args);
            const result = await this.client.getAirQuality(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'marine_weather': {
            const params = MarineParamsSchema.parse(args);
            const result = await this.client.getMarine(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'elevation': {
            const params = ElevationParamsSchema.parse(args);
            const result = await this.client.getElevation(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'dwd_icon_forecast': {
            const params = ForecastParamsSchema.parse(args);
            const result = await this.client.getDwdIcon(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'gfs_forecast': {
            const params = ForecastParamsSchema.parse(args);
            const result = await this.client.getGfs(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'meteofrance_forecast': {
            const params = ForecastParamsSchema.parse(args);
            const result = await this.client.getMeteoFrance(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'ecmwf_forecast': {
            const params = ForecastParamsSchema.parse(args);
            const result = await this.client.getEcmwf(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'jma_forecast': {
            const params = ForecastParamsSchema.parse(args);
            const result = await this.client.getJma(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'metno_forecast': {
            const params = ForecastParamsSchema.parse(args);
            const result = await this.client.getMetno(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'gem_forecast': {
            const params = ForecastParamsSchema.parse(args);
            const result = await this.client.getGem(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'flood_forecast': {
            const params = FloodParamsSchema.parse(args);
            const result = await this.client.getFlood(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'seasonal_forecast': {
            const params = ForecastParamsSchema.parse(args);
            const result = await this.client.getSeasonal(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'climate_projection': {
            const params = ForecastParamsSchema.parse(args);
            const result = await this.client.getClimate(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'ensemble_forecast': {
            const params = ForecastParamsSchema.parse(args); 
            const result = await this.client.getEnsemble(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'geocoding': {
            const params = GeocodingParamsSchema.parse(args);
            const result = await this.client.getGeocoding(params);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Open-Meteo MCP Server running on stdio');
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options: { port?: number; headless?: boolean } = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && i + 1 < args.length) {
      options.port = parseInt(args[i + 1]!, 10);
      i++;
    } else if (args[i] === '--headless') {
      options.headless = true;
    }
  }
  
  return options;
}

// Session storage for streamable HTTP
const streamableSessions = new Map<string, {transport: any, server: any}>();

// Create a new server instance
function createOpenMeteoServerInstance() {
  const serverInstance = new Server(
    {
      name: "open-meteo-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  const baseURL = process.env.OPEN_METEO_API_URL || 'https://api.open-meteo.com';
  const client = new OpenMeteoClient(baseURL);

  serverInstance.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: ALL_TOOLS,
    };
  });

  serverInstance.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'weather_forecast': {
          const params = ForecastParamsSchema.parse(args);
          const result = await client.getForecast(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'weather_archive': {
          const params = ArchiveParamsSchema.parse(args);
          const result = await client.getArchive(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'air_quality': {
          const params = AirQualityParamsSchema.parse(args);
          const result = await client.getAirQuality(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'marine_weather': {
          const params = MarineParamsSchema.parse(args);
          const result = await client.getMarine(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'elevation': {
          const params = ElevationParamsSchema.parse(args);
          const result = await client.getElevation(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'dwd_icon_forecast': {
          const params = ForecastParamsSchema.parse(args);
          const result = await client.getDwdIcon(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'gfs_forecast': {
          const params = ForecastParamsSchema.parse(args);
          const result = await client.getGfs(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'meteofrance_forecast': {
          const params = ForecastParamsSchema.parse(args);
          const result = await client.getMeteoFrance(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'ecmwf_forecast': {
          const params = ForecastParamsSchema.parse(args);
          const result = await client.getEcmwf(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'jma_forecast': {
          const params = ForecastParamsSchema.parse(args);
          const result = await client.getJma(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'metno_forecast': {
          const params = ForecastParamsSchema.parse(args);
          const result = await client.getMetno(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'gem_forecast': {
          const params = ForecastParamsSchema.parse(args);
          const result = await client.getGem(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'flood_forecast': {
          const params = FloodParamsSchema.parse(args);
          const result = await client.getFlood(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'seasonal_forecast': {
          const params = ForecastParamsSchema.parse(args);
          const result = await client.getSeasonal(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'climate_projection': {
          const params = ForecastParamsSchema.parse(args);
          const result = await client.getClimate(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'ensemble_forecast': {
          const params = ForecastParamsSchema.parse(args);
          const result = await client.getEnsemble(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        case 'geocoding': {
          const params = GeocodingParamsSchema.parse(args);
          const result = await client.getGeocoding(params);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          },
        ],
      };
    }
  });

  return serverInstance;
}

// HTTP server setup
function startHttpServer(port: number) {
  const httpServer = createServer();
  
  httpServer.on('request', async (req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    
    if (url.pathname === '/sse') {
      await handleSSE(req, res);
    } else if (url.pathname === '/mcp') {
      await handleStreamable(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });
  
  httpServer.listen(port, () => {
    console.log(`Open-Meteo MCP Server listening on http://localhost:${port}`);
    console.log('Put this in your client config:');
    console.log(JSON.stringify({
      "mcpServers": {
        "open-meteo": {
          "url": `http://localhost:${port}/sse`
        }
      }
    }, null, 2));
    console.log('If your client supports streamable HTTP, you can use the /mcp endpoint instead.');
  });
  
  return httpServer;
}

// SSE transport handler
async function handleSSE(_req: any, res: any) {
  const serverInstance = createOpenMeteoServerInstance();
  const transport = new SSEServerTransport('/sse', res);
  try {
    await serverInstance.connect(transport);
  } catch (error) {
    console.error('SSE connection error:', error);
  }
}

// Streamable HTTP transport handler
async function handleStreamable(req: any, res: any) {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  
  if (sessionId) {
    // Use existing session
    const session = streamableSessions.get(sessionId);
    if (!session) {
      res.statusCode = 404;
      res.end('Session not found');
      return;
    }
    return await session.transport.handleRequest(req, res);
  }
  
  // Create new session for initialization
  if (req.method === 'POST') {
    const serverInstance = createOpenMeteoServerInstance();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        streamableSessions.set(sessionId, { transport, server: serverInstance });
        console.log('New Open-Meteo session created:', sessionId);
      }
    });
    
    transport.onclose = () => {
      if (transport.sessionId) {
        streamableSessions.delete(transport.sessionId);
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

// Main server function
async function runServer() {
  const options = parseArgs();
  
  if (options.port) {
    // HTTP mode
    startHttpServer(options.port);
  } else {
    // STDIO mode (default)
    const server = new OpenMeteoMCPServer();
    await server.run();
  }
}

runServer().catch((error) => {
  console.error("Fatal error running Open-Meteo server:", error);
  process.exit(1);
});