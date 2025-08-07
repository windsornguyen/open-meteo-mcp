import axios, { AxiosInstance } from 'axios';
import type { 
  ForecastParams, 
  ArchiveParams, 
  AirQualityParams, 
  MarineParams, 
  FloodParams,
  ElevationParams,
  GeocodingParams,
  WeatherResponse,
  ElevationResponse,
  GeocodingResponse 
} from './types.js';

/**
 * Open-Meteo API client providing access to comprehensive weather data
 * Supports multiple specialized API endpoints for different weather services
 * @class OpenMeteoClient
 */
export class OpenMeteoClient {
  private client: AxiosInstance;
  private airQualityClient: AxiosInstance;
  private marineClient: AxiosInstance;
  private archiveClient: AxiosInstance;
  private seasonalClient: AxiosInstance;
  private ensembleClient: AxiosInstance;
  private geocodingClient: AxiosInstance;
  private floodClient: AxiosInstance;

  /**
   * Creates a new OpenMeteoClient instance with configurable API endpoints
   * @param baseURL - Main Open-Meteo API URL for weather forecasts
   * @param airQualityURL - Air quality API endpoint
   * @param marineURL - Marine weather API endpoint  
   * @param archiveURL - Historical weather data API endpoint
   * @param seasonalURL - Seasonal forecast API endpoint
   * @param ensembleURL - Ensemble forecast API endpoint
   * @param geocodingURL - Geocoding API endpoint
   * @param floodURL - Flood forecast API endpoint
   */
  constructor(
    baseURL: string = 'https://api.open-meteo.com',
    airQualityURL: string = 'https://air-quality-api.open-meteo.com',
    marineURL: string = 'https://marine-api.open-meteo.com',
    archiveURL: string = 'https://archive-api.open-meteo.com',
    seasonalURL: string = 'https://seasonal-api.open-meteo.com',
    ensembleURL: string = 'https://ensemble-api.open-meteo.com',
    geocodingURL: string = 'https://geocoding-api.open-meteo.com',
    floodURL: string = 'https://flood-api.open-meteo.com'
  ) {
    const config = {
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Open-Meteo-MCP-Server/1.1.1'
      }
    };

    this.client = axios.create({ baseURL, ...config });
    this.airQualityClient = axios.create({ baseURL: airQualityURL, ...config });
    this.marineClient = axios.create({ baseURL: marineURL, ...config });
    this.archiveClient = axios.create({ baseURL: archiveURL, ...config });
    this.seasonalClient = axios.create({ baseURL: seasonalURL, ...config });
    this.ensembleClient = axios.create({ baseURL: ensembleURL, ...config });
    this.geocodingClient = axios.create({ baseURL: geocodingURL, ...config });
    this.floodClient = axios.create({ baseURL: floodURL, ...config });
  }

  /**
   * Converts parameter object to string-based query parameters for API requests
   * @param params - Parameters to convert
   * @returns String-based parameters suitable for HTTP requests
   * @private
   */
  private buildParams(params: Record<string, unknown>): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          result[key] = value.join(',');
        } else {
          result[key] = String(value);
        }
      }
    }
    
    return result;
  }

  /**
   * Gets weather forecast data using the main Open-Meteo API
   * @param params - Forecast parameters including location and weather variables
   * @returns Promise resolving to weather response data
   */
  async getForecast(params: ForecastParams): Promise<WeatherResponse> {
    const response = await this.client.get('/v1/forecast', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getArchive(params: ArchiveParams): Promise<WeatherResponse> {
    const response = await this.archiveClient.get('/v1/archive', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getDwdIcon(params: ForecastParams): Promise<WeatherResponse> {
    const response = await this.client.get('/v1/dwd-icon', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getGfs(params: ForecastParams): Promise<WeatherResponse> {
    const response = await this.client.get('/v1/gfs', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getMeteoFrance(params: ForecastParams): Promise<WeatherResponse> {
    const response = await this.client.get('/v1/meteofrance', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getEcmwf(params: ForecastParams): Promise<WeatherResponse> {
    const response = await this.client.get('/v1/ecmwf', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getJma(params: ForecastParams): Promise<WeatherResponse> {
    const response = await this.client.get('/v1/jma', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getMetno(params: ForecastParams): Promise<WeatherResponse> {
    const response = await this.client.get('/v1/metno', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getGem(params: ForecastParams): Promise<WeatherResponse> {
    const response = await this.client.get('/v1/gem', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getAirQuality(params: AirQualityParams): Promise<WeatherResponse> {
    const response = await this.airQualityClient.get('/v1/air-quality', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getMarine(params: MarineParams): Promise<WeatherResponse> {
    const response = await this.marineClient.get('/v1/marine', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getEnsemble(params: ForecastParams): Promise<WeatherResponse> {
    const response = await this.ensembleClient.get('/v1/ensemble', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getElevation(params: ElevationParams): Promise<ElevationResponse> {
    const response = await this.client.get('/v1/elevation', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getFlood(params: FloodParams): Promise<WeatherResponse> {
    const response = await this.floodClient.get('/v1/flood', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getSeasonal(params: ForecastParams): Promise<WeatherResponse> {
    const response = await this.seasonalClient.get('/v1/seasonal', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getClimate(params: ForecastParams): Promise<WeatherResponse> {
    const response = await this.client.get('/v1/climate', {
      params: this.buildParams(params)
    });
    return response.data;
  }

  async getGeocoding(params: GeocodingParams): Promise<GeocodingResponse> {
    const response = await this.geocodingClient.get('/v1/search', {
      params: this.buildParams(params)
    });
    return response.data;
  }
}