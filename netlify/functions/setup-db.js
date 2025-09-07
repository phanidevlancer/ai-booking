import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import path from 'path';
import fs from 'fs';

/**
 * Netlify function to set up the database
 * This can be triggered manually after deployment
 */
export const handler = async (event, context) => {
  console.log('Starting database setup...');
  
  try {
    // Check for DATABASE_URL
    if (!process.env.DATABASE_URL) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'DATABASE_URL environment variable is not set' })
      };
    }
    
    console.log('Connecting to database...');
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);
    
    // Test connection
    const testResult = await sql`SELECT 1 as connected`;
    console.log('Database connection test:', testResult);
    
    // Try different paths for migrations folder
    const possiblePaths = [
      path.resolve(process.cwd(), 'migrations'),
      path.resolve(process.cwd(), 'dist/migrations'),
      path.resolve(process.cwd(), '../migrations'),
      './migrations'
    ];
    
    let migrationsDir = null;
    for (const pathToCheck of possiblePaths) {
      console.log('Checking migrations path:', pathToCheck);
      if (fs.existsSync(pathToCheck)) {
        console.log('Found migrations folder at:', pathToCheck);
        migrationsDir = pathToCheck;
        break;
      }
    }
    
    // Check if migrations directory exists
    if (!migrationsDir) {
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: 'Migrations directory not found', 
          checkedPaths: possiblePaths,
          cwd: process.cwd() 
        })
      };
    }
    
    // List migration files
    const migrationFiles = fs.readdirSync(migrationsDir);
    console.log('Found migration files:', migrationFiles);
    
    if (migrationFiles.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No migration files found in directory', path: migrationsDir })
      };
    }
    
    // Run migrations
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: migrationsDir });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Database setup completed successfully',
        migrations: migrationFiles
      })
    };
  } catch (error) {
    console.error('Database setup failed:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Database setup failed', 
        message: error.message,
        stack: error.stack
      })
    };
  }
};