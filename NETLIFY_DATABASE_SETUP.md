# Setting Up PostgreSQL Database for Netlify Deployment

This guide will help you set up a PostgreSQL database using Neon.tech for your AIBookings application deployed on Netlify.

## Why Neon?

Neon is a serverless PostgreSQL service that offers:
- Serverless architecture (pay for what you use)
- Free tier for development and small projects
- PostgreSQL compatibility
- Easy integration with Netlify

## Step 1: Create a Neon Account

1. Go to [Neon.tech](https://neon.tech) and sign up for an account
2. Verify your email address

## Step 2: Create a New Project

1. From the Neon dashboard, click "Create a Project"
2. Name your project (e.g., "aibookings")
3. Select a region closest to your users
4. Click "Create Project"

## Step 3: Get Your Connection String

1. In your project dashboard, go to the "Connection Details" tab
2. Copy the connection string that looks like:
   ```
   postgres://username:password@endpoint/database
   ```

## Step 4: Set Up Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to Site settings > Build & deploy > Environment
4. Add a new environment variable:
   - Key: `DATABASE_URL`
   - Value: Your Neon connection string

## Step 5: Update Database Configuration

Create a new file in your project called `server/database.js` with the following content:

```javascript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

// For Netlify Functions environment
export function getDatabase() {
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
}
```

## Step 6: Update Your Netlify Function

Modify your `netlify/functions/api.js` file to use the database:

```javascript
import express from 'express';
import serverless from 'serverless-http';
import { registerRoutes } from '../../server/routes';
import { getDatabase } from '../../server/database';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Initialize database connection
const db = getDatabase();

// Make db available in request object
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Register all routes
registerRoutes(app);

// Health check endpoint
app.get('/.netlify/functions/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

export const handler = serverless(app);
```

## Step 7: Initialize Your Database Schema

Create a script to initialize your database schema:

```javascript
// scripts/init-db.js
import { getDatabase } from '../server/database';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';

async function main() {
  console.log('Initializing database...');
  const db = getDatabase();
  
  try {
    // Run migrations
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

main();
```

## Step 8: Run Database Migrations Before Deployment

Update your `package.json` build script to run migrations:

```json
"scripts": {
  "build": "node scripts/init-db.js && vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist && npm run build:functions",
  // other scripts...
}
```

## Testing Your Database Connection

To test your database connection locally:

1. Create a `.env` file with your Neon connection string
2. Run `node scripts/init-db.js`
3. Start your application with `npm run dev`

## Troubleshooting

- **Connection Issues**: Ensure your IP is allowed in Neon's connection settings
- **Migration Errors**: Check your schema definitions for compatibility issues
- **Environment Variables**: Verify your DATABASE_URL is correctly set in Netlify