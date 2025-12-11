/**
 * MongoDB Database Initialization Script
 * Run with: npm run init-db
 */

// Load environment variables from .env file
import "dotenv/config";

import { connectToDatabase } from "../src/lib/mongodb.ts";
import { COLLECTION_NAME } from "../src/config/mongodb.ts";

async function initializeDatabase() {
  console.log("🚀 Initializing MongoDB database...\n");

  try {
    // Connect to database
    const { db, client } = await connectToDatabase();
    console.log("✅ Connected to MongoDB\n");
    console.log("✅ Connected to MongoDB");
    console.log("📊 Database name:", db.databaseName); // Add this line
    console.log("📋 Collection name:", COLLECTION_NAME); // Add this line
    console.log();

    // Get notes collection
    const collection = db.collection(COLLECTION_NAME);

    // Create indexes for optimal performance
    console.log("Creating indexes...");

    await collection.createIndex({ updatedAt: -1 });
    console.log("✅ Created index on updatedAt");

    await collection.createIndex({ createdAt: -1 });
    console.log("✅ Created index on createdAt");

    await collection.createIndex(
      { title: "text", content: "text" },
      { name: "notes_text_search" }
    );
    console.log("✅ Created text search index\n");

    // Add sample data if collection is empty
    const count = await collection.countDocuments();

    if (count === 0) {
      console.log("📝 Adding sample notes...\n");

      const sampleNotes = [
        {
          title: "Welcome to Notes App! 👋",
          content:
            "This is your first note. You can edit or delete it, or create new ones.\n\nKey features:\n• Create, read, update, delete notes\n• Real-time updates\n• Server-side rendering\n• Built with TanStack Start and MongoDB",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "About This App 🚀",
          content:
            "This application demonstrates:\n\n• Type-safe server functions with TanStack Start\n• MongoDB native driver (no ORM)\n• Serverless-optimized connection pooling\n• Modern UI with Tailwind CSS\n• Full-stack TypeScript",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Quick Tips 💡",
          content:
            "1. Notes are sorted by last updated\n2. All changes happen in real-time\n3. Dark mode is supported!\n4. The UI is fully responsive\n5. Try creating, editing, and deleting notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await collection.insertMany(sampleNotes);
      console.log(`✅ Added ${sampleNotes.length} sample notes\n`);
    } else {
      console.log(`ℹ️  Database already contains ${count} notes\n`);
    }

    console.log("🎉 Database initialization complete!\n");
    console.log("📊 You can now run: npm run dev\n");

    // Close the connection
    await client.close();
    console.log("✅ Database connection closed\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();
