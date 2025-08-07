import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { OpenMeteoClient } from '../client.js';
import { ALL_TOOLS } from '../tools.js';
import {
  ForecastParamsSchema,
  ArchiveParamsSchema,
  AirQualityParamsSchema,
  MarineParamsSchema,
  FloodParamsSchema,
  ElevationParamsSchema,
  GeocodingParamsSchema,
} from '../types.js';

/**
 * Weather tool definitions for Open-Meteo API
 */
export const weatherToolDefinitions = ALL_TOOLS;

/**
 * Tool handler function type
 */
type ToolHandler = (client: OpenMeteoClient, args: any) => Promise<CallToolResult>;

/**
 * Registry mapping tool names to their handler functions
 * This eliminates the need for duplicate switch statements
 */
const toolHandlers: Record<string, ToolHandler> = {
  weather_forecast: async (client, args) => {
    const params = ForecastParamsSchema.parse(args);
    const result = await client.getForecast(params);
    return createToolResponse(result);
  },

  weather_archive: async (client, args) => {
    const params = ArchiveParamsSchema.parse(args);
    const result = await client.getArchive(params);
    return createToolResponse(result);
  },

  air_quality: async (client, args) => {
    const params = AirQualityParamsSchema.parse(args);
    const result = await client.getAirQuality(params);
    return createToolResponse(result);
  },

  marine_weather: async (client, args) => {
    const params = MarineParamsSchema.parse(args);
    const result = await client.getMarine(params);
    return createToolResponse(result);
  },

  elevation: async (client, args) => {
    const params = ElevationParamsSchema.parse(args);
    const result = await client.getElevation(params);
    return createToolResponse(result);
  },

  // Weather model tools
  dwd_icon_forecast: async (client, args) => {
    const params = ForecastParamsSchema.parse(args);
    const result = await client.getDwdIcon(params);
    return createToolResponse(result);
  },

  gfs_forecast: async (client, args) => {
    const params = ForecastParamsSchema.parse(args);
    const result = await client.getGfs(params);
    return createToolResponse(result);
  },

  meteofrance_forecast: async (client, args) => {
    const params = ForecastParamsSchema.parse(args);
    const result = await client.getMeteoFrance(params);
    return createToolResponse(result);
  },

  ecmwf_forecast: async (client, args) => {
    const params = ForecastParamsSchema.parse(args);
    const result = await client.getEcmwf(params);
    return createToolResponse(result);
  },

  jma_forecast: async (client, args) => {
    const params = ForecastParamsSchema.parse(args);
    const result = await client.getJma(params);
    return createToolResponse(result);
  },

  metno_forecast: async (client, args) => {
    const params = ForecastParamsSchema.parse(args);
    const result = await client.getMetno(params);
    return createToolResponse(result);
  },

  gem_forecast: async (client, args) => {
    const params = ForecastParamsSchema.parse(args);
    const result = await client.getGem(params);
    return createToolResponse(result);
  },

  // Advanced weather tools
  flood_forecast: async (client, args) => {
    const params = FloodParamsSchema.parse(args);
    const result = await client.getFlood(params);
    return createToolResponse(result);
  },

  seasonal_forecast: async (client, args) => {
    const params = ForecastParamsSchema.parse(args);
    const result = await client.getSeasonal(params);
    return createToolResponse(result);
  },

  climate_projection: async (client, args) => {
    const params = ForecastParamsSchema.parse(args);
    const result = await client.getClimate(params);
    return createToolResponse(result);
  },

  ensemble_forecast: async (client, args) => {
    const params = ForecastParamsSchema.parse(args);
    const result = await client.getEnsemble(params);
    return createToolResponse(result);
  },

  geocoding: async (client, args) => {
    const params = GeocodingParamsSchema.parse(args);
    const result = await client.getGeocoding(params);
    return createToolResponse(result);
  },
};

/**
 * Creates a standardized tool response
 * @param result - The API response data
 * @returns Formatted CallToolResult
 */
function createToolResponse(result: any): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

/**
 * Handles weather tool calls using the registry pattern
 * This replaces the massive switch statements with a clean dispatcher
 * @param client - OpenMeteoClient instance
 * @param toolName - Name of the tool to execute
 * @param args - Tool arguments
 * @returns Promise<CallToolResult>
 * @throws Error if tool is not found
 */
export async function handleWeatherTool(
  client: OpenMeteoClient,
  toolName: string,
  args: any
): Promise<CallToolResult> {
  const handler = toolHandlers[toolName];
  
  if (!handler) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
  
  try {
    return await handler(client, args);
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
}

/**
 * Gets all available weather tool names
 * @returns Array of tool names
 */
export function getAvailableToolNames(): string[] {
  return Object.keys(toolHandlers);
}

/**
 * Checks if a tool name is supported
 * @param toolName - Name of the tool to check
 * @returns True if tool is supported
 */
export function isToolSupported(toolName: string): boolean {
  return toolName in toolHandlers;
}