/**
 * Environment configuration
 * Reads API_BASE_URL from .env file
 * The babel-plugin-inline-dotenv will inject the .env variables at build time
 */

// Type declaration for process.env
declare const process: {
  env: {
    API_BASE_URL?: string;
    [key: string]: string | undefined;
  };
};

const getApiBaseUrl = (): string => {
  // Read from .env file (loaded by babel-plugin-inline-dotenv)
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  
  // Default fallback (should not be used if .env is properly configured)
  console.warn('API_BASE_URL not found in .env file, using default URL');
  return 'http://10.123.124.42:8000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();
