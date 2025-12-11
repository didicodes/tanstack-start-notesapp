import { createServerFn } from "@tanstack/react-start";
import { connectToDatabase } from "../lib/mongodb";

/**
 * Check MongoDB connection status
 * Returns connection status without throwing errors
 */
export const checkMongoDBConnection = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      // Check if MONGODB_URI is configured
      if (!process.env.MONGODB_URI) {
        return { connected: false };
      }

      // Attempt to connect and ping the database
      const { db } = await connectToDatabase();
      await db.admin().ping();

      return { connected: true };
    } catch (error) {
      // Any connection error means we're disconnected
      return { connected: false };
    }
  }
);
