/**
 * MongoDB Configuration
 *
 * Centralized configuration for MongoDB connection settings,
 * database names, and collection names.
 */

/**
 * Database name
 */
export const DB_NAME = "notes-app";

/**
 * Collection name for todos
 */
export const COLLECTION_NAME = "note";

/**
 * MongoDB connection configuration optimized for generic serverless environments
 * Note: appName should be set in the consuming module (mongodb.ts)
 */
export const MONGODB_CONNECTION_CONFIG = {
  maxPoolSize: 10, // Generic serverless: moderate connection pool
  minPoolSize: 1,
  maxIdleTimeMS: 5000, // Close idle connections after 5s
  serverSelectionTimeoutMS: 5000, // Timeout after 5s if can't find server
  socketTimeoutMS: 30000, // Close sockets after 30s of inactivity
} as const;
