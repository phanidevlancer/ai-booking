import { getDatabase } from '../server/database.js';
import * as schema from '../shared/schema.js';

/**
 * Initialize the database schema for Netlify deployment
 * This script creates the necessary tables in the PostgreSQL database
 */
async function main() {
  console.log('Initializing database...');
  
  try {
    const db = getDatabase();
    
    // Create tables based on schema
    console.log('Creating users table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating pre_bookings table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS pre_bookings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        movie_title TEXT NOT NULL,
        preferred_date TEXT NOT NULL,
        preferred_time TEXT NOT NULL,
        number_of_tickets INTEGER NOT NULL,
        status TEXT NOT NULL,
        match_details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Creating movie_bookings table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS movie_bookings (
        movie_title TEXT PRIMARY KEY,
        is_booking_open BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

main();