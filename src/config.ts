/**
 * Configuration interface for the Open-Meteo MCP Server
 * @interface Config
 */
export interface Config {
    /** Base URL for Open-Meteo API */
    apiUrl: string;
    /** URL for Open-Meteo Air Quality API */
    airQualityApiUrl: string;
    /** URL for Open-Meteo Marine API */
    marineApiUrl: string;
    /** URL for Open-Meteo Archive API */
    archiveApiUrl: string;
    /** URL for Open-Meteo Seasonal API */
    seasonalApiUrl: string;
    /** URL for Open-Meteo Ensemble API */
    ensembleApiUrl: string;
    /** URL for Open-Meteo Geocoding API */
    geocodingApiUrl: string;
    /** URL for Open-Meteo Flood API */
    floodApiUrl: string;
    /** Port number for HTTP server */
    port: number;
    /** Current environment mode */
    nodeEnv: 'development' | 'production';
    /** Convenience flag for production environment */
    isProduction: boolean;
}

/**
 * Loads and validates configuration from environment variables
 * @returns {Config} Validated configuration object
 */
export function loadConfig(): Config {
    const nodeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    const port = parseInt(process.env.PORT || '3003', 10);

    return {
        apiUrl: process.env.OPEN_METEO_API_URL || 'https://api.open-meteo.com',
        airQualityApiUrl: process.env.OPEN_METEO_AIR_QUALITY_API_URL || 'https://air-quality-api.open-meteo.com',
        marineApiUrl: process.env.OPEN_METEO_MARINE_API_URL || 'https://marine-api.open-meteo.com',
        archiveApiUrl: process.env.OPEN_METEO_ARCHIVE_API_URL || 'https://archive-api.open-meteo.com',
        seasonalApiUrl: process.env.OPEN_METEO_SEASONAL_API_URL || 'https://seasonal-api.open-meteo.com',
        ensembleApiUrl: process.env.OPEN_METEO_ENSEMBLE_API_URL || 'https://ensemble-api.open-meteo.com',
        geocodingApiUrl: process.env.OPEN_METEO_GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com',
        floodApiUrl: process.env.OPEN_METEO_FLOOD_API_URL || 'https://flood-api.open-meteo.com',
        port,
        nodeEnv,
        isProduction: nodeEnv === 'production',
    };
}