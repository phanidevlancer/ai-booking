import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

/**
 * Get a database connection using Neon serverless PostgreSQL
 * This is used for production deployment on Netlify
 */
export function getDatabase() {
  // Use DATABASE_URL environment variable
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
}