import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import * as schema from '../dist/shared/schema.js';

/**
 * Run database migrations for Netlify deployment
 * This script can be run manually before deployment or as part of the build process
 */
async function runMigrations() {
  console.log('Starting database migrations...');
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  try {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql, { schema });
    
    // Run migrations
    console.log('Running migrations...');
    
    // Try different paths for migrations folder
    const possiblePaths = [
      process.cwd() + '/migrations',
      process.cwd() + '/dist/migrations',
      './migrations',
      '../migrations'
    ];
    
    let migrationsPath = null;
    for (const path of possiblePaths) {
      console.log('Checking migrations path:', path);
      try {
        const fs = await import('fs');
        if (fs.existsSync(path)) {
          console.log('Found migrations folder at:', path);
          migrationsPath = path;
          break;
        }
      } catch (err) {
        console.log('Error checking path:', path, err);
      }
    }
    
    if (!migrationsPath) {
      console.error('Could not find migrations folder in any of the checked paths');
      process.exit(1);
    }
    
    console.log('Using migrations folder path:', migrationsPath);
    await migrate(db, { migrationsFolder: migrationsPath });
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();