import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

/**
 * Test script to verify database setup
 * This script checks if the database tables exist after migrations
 */
async function testDatabaseSetup() {
  console.log('Testing database setup...');
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  try {
    console.log('Connecting to database...');
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);
    
    // Check if tables exist
    console.log('Checking if tables exist...');
    
    // Query to get all tables in the public schema
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('Found tables:', tables.map(t => t.table_name));
    
    // Check for specific tables
    const expectedTables = ['users', 'pre_bookings', 'movie_bookings'];
    const missingTables = expectedTables.filter(
      table => !tables.some(t => t.table_name === table)
    );
    
    if (missingTables.length > 0) {
      console.error('Missing tables:', missingTables);
      process.exit(1);
    }
    
    console.log('All expected tables exist!');
    
    // Test a simple query on each table
    for (const table of expectedTables) {
      console.log(`Testing query on ${table}...`);
      const count = await sql`SELECT COUNT(*) as count FROM ${sql.identifier(table)}`;
      console.log(`${table} has ${count[0].count} records`);
    }
    
    console.log('Database setup verification completed successfully!');
  } catch (error) {
    console.error('Database setup verification failed:', error);
    process.exit(1);
  }
}

testDatabaseSetup();