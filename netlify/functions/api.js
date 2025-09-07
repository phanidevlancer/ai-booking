import express from 'express';
import serverless from 'serverless-http';
import { registerRoutes } from '../../server/routes';
import { storage } from '../../server/storage';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers for Netlify Functions
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Register all routes from the server
registerRoutes(app);

// Add a health check endpoint
app.get('/.netlify/functions/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Export the serverless handler
export const handler = serverless(app);