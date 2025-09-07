import { neon } from '@neondatabase/serverless';

/**
 * Check database connection for Netlify deployment
 * This script can be run before migrations to verify database connectivity
 */
async function checkDatabaseConnection() {
  console.log('Checking database connection...');
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  try {
    console.log('Connecting to database...');
    const sql = neon(process.env.DATABASE_URL);
    
    // Execute a simple query to test the connection
    const result = await sql`SELECT 1 as connected`;
    
    if (result && result[0] && result[0].connected === 1) {
      console.log('Database connection successful!');
    } else {
      console.error('Database connection failed: Unexpected response');
      process.exit(1);
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

checkDatabaseConnection();