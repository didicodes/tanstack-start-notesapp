# Notes App - TanStack Start + MongoDB

A modern, full-stack notes application demonstrating type-safe server functions, server-side rendering, and serverless-optimized MongoDB integration with TanStack Start.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- **Router**: [TanStack Router](https://tanstack.com/router) - Type-safe routing
- **Database**: [MongoDB](https://www.mongodb.com/) - Document database
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Language**: TypeScript - End-to-end type safety

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** (Node.js 22+ recommended for best compatibility)
- **npm**, **pnpm**, or **yarn** package manager
- **MongoDB** - Either:
  - Local MongoDB installation, OR
  - Free MongoDB Atlas account ([sign up here](https://www.mongodb.com/cloud/atlas))

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/didicodes/tanstack-start-notesapp.git
cd tanstack-start-notesapp
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set Up MongoDB

Choose one of these options:

#### Option A: MongoDB Atlas (Recommended for Beginners)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose password authentication
   - Set permissions to "Read and write to any database"
4. Whitelist your IP address:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
5. Get your connection string:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `notes-app`

#### Option B: Local MongoDB

If you have MongoDB installed locally:

**macOS (with Homebrew):**

```bash
brew services start mongodb-community
```

**Linux (with systemd):**

```bash
sudo systemctl start mongod
```

**Windows:**
MongoDB should start automatically as a service.

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes-app

# For local MongoDB
# MONGODB_URI=mongodb://localhost:27017/notes-app
```

**Important:** Replace `username`, `password`, and `cluster` with your actual values!

### 5. Initialize the Database

This step creates database indexes and adds sample notes:

```bash
npm run init-db
```

You should see:

```
🚀 Initializing MongoDB database...
✅ Connected to MongoDB
Creating indexes...
✅ Created index on updatedAt
✅ Created index on createdAt
✅ Created text search index
📝 Adding sample notes...
✅ Added 3 sample notes
🎉 Database initialization complete!
```

If you see errors, check the [Troubleshooting](#-troubleshooting) section.

### 6. Start the Development Server

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

Open your browser and you should see 3 sample notes ready to interact with!

## 📁 Project Structure

```
tanstack-start-notesapp/
├── src/
│   ├── components/           # React components
│   │   ├── DefaultCatchBoundary.tsx
│   │   ├── NotFound.tsx
│   │   └── ...
│   ├── config/
│   │   └── mongodb.ts       # MongoDB configuration
│   ├── lib/
│   │   ├── mongodb.ts       # Connection manager (singleton pattern)
│   │   ├── types.ts         # Zod schemas and TypeScript types
│   │   └── utils.ts         # Utility functions
│   ├── routes/
│   │   ├── __root.tsx       # Root layout component
│   │   └── index.tsx        # Notes page with CRUD interface
│   ├── server/
│   │   └── notes.ts         # Server functions for CRUD operations
│   ├── styles/
│   │   └── app.css          # Tailwind CSS imports
│   ├── router.tsx           # Router configuration
│   └── routeTree.gen.ts     # Auto-generated route tree
├── scripts/
│   └── init-db.ts           # Database initialization script
├── public/                   # Static assets
├── .env                      # Environment variables (not committed)
├── .env.example             # Environment template
├── package.json
├── tsconfig.json
├── vite.config.ts           # Vite configuration
└── tailwind.config.js       # Tailwind configuration
```

## 🔧 Available Scripts

| Script            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start development server on port 3000            |
| `npm run build`   | Build for production                             |
| `npm run preview` | Preview production build locally                 |
| `npm run init-db` | Initialize database with indexes and sample data |
| `npm start`       | Start production server (after build)            |

## 🚢 Deployment

### Deploy to Netlify

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Login and initialize:

```bash
netlify login
netlify init
```

3. Configure build settings when prompted:
   - **Build command:** `npm run build`
   - **Publish directory:** `.output/public`

4. Set environment variable:

```bash
netlify env:set MONGODB_URI "your-mongodb-uri-here"
```

5. Deploy:

```bash
netlify deploy --prod
```
