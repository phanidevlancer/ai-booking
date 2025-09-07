import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import * as schema from '../shared/schema';

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
    await migrate(db, { migrationsFolder: './migrations' });
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();