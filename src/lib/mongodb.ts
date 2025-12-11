/**
 * MongoDB Connection Singleton
 *
 * This module implements a connection pooling pattern optimized for serverless environments.
 * Key features:
 * - Caches connection across invocations to prevent connection exhaustion
 * - Configures optimal pool size for serverless (typically 1-10 connections)
 * - Provides type-safe database and collection accessors
 *
 * Best Practices for Serverless:
 * 1. Reuse connections across function invocations
 * 2. Set appropriate maxPoolSize (lower for serverless)
 * 3. Enable connection monitoring for debugging
 * 4. Handle connection errors gracefully
 */

import { MongoClient } from "mongodb";
import {
  COLLECTION_NAME,
  DB_NAME,
  MONGODB_CONNECTION_CONFIG,
} from "../config/mongodb";
import type { Collection, Db } from "mongodb";
import type { NoteResponse } from "./types";

const MONGODB_URI = process.env.MONGODB_URI;

// Global cache for MongoDB client (survives across serverless function invocations)
interface CachedConnection {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

const cached: CachedConnection = {
  client: null,
  db: null,
  promise: null,
};

/**
 * Parse MongoDB connection errors and return user-friendly messages
 */
function getConnectionErrorMessage(error: Error): string {
  const errorMsg = error.message.toLowerCase();

  // Authentication errors
  if (
    errorMsg.includes("bad auth") ||
    errorMsg.includes("authentication failed")
  ) {
    return "Authentication failed";
  }

  // Network/DNS errors
  if (errorMsg.includes("enotfound") || errorMsg.includes("getaddrinfo")) {
    return "Cannot reach MongoDB server";
  }

  // Timeout errors
  if (errorMsg.includes("timeout") || errorMsg.includes("timed out")) {
    return "Connection timeout";
  }

  // IP whitelist errors (common with MongoDB Atlas)
  if (
    errorMsg.includes("ip") &&
    errorMsg.includes("not") &&
    errorMsg.includes("whitelist")
  ) {
    return "IP address not whitelisted";
  }

  // Connection string format errors
  if (
    errorMsg.includes("invalid connection string") ||
    errorMsg.includes("uri must")
  ) {
    return "Invalid connection string format";
  }

  // Server selection errors
  if (errorMsg.includes("server selection")) {
    return "Cannot connect to MongoDB";
  }

  // Generic fallback
  return "MongoDB connection error";
}

/**
 * Get or create MongoDB connection
 * Uses singleton pattern to reuse connections across function invocations
 */
export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  // Return cached connection if available
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  // Return in-flight connection promise if exists
  if (cached.promise) {
    return cached.promise;
  }

  // Check if MONGODB_URI is provided
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI configuration");
  }

  // Create new connection with error handling
  cached.promise = MongoClient.connect(MONGODB_URI, {
    appName: "devrel.template.tanstack-start-todo",
    ...MONGODB_CONNECTION_CONFIG,
  })
    .then((client) => {
      const db = client.db(DB_NAME);
      cached.client = client;
      cached.db = db;
      cached.promise = null;
      return { client, db };
    })
    .catch((error) => {
      // Reset promise to allow retry
      cached.promise = null;
      // Provide user-friendly error message
      const message = getConnectionErrorMessage(error);
      throw new Error(message);
    });

  return cached.promise;
}

/**
 * Get typed collection accessor
 * Provides type-safe access to MongoDB collections
 */

export async function getNotesCollection(): Promise<Collection<NoteResponse>> {
  const { db } = await connectToDatabase();
  return db.collection<NoteResponse>(COLLECTION_NAME);
}
