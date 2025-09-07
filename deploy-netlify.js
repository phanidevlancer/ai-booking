#!/usr/bin/env node

/**
 * This script helps prepare the project for Netlify deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Install required dependencies
console.log('Installing required dependencies for Netlify deployment...');
execSync('npm install serverless-http --save', { stdio: 'inherit' });

// Check if netlify.toml exists
if (!fs.existsSync('./netlify.toml')) {
  console.log('Creating netlify.toml configuration file...');
  const netlifyConfig = `[build]
  command = "npm run build"
  publish = "dist/public"
  functions = "netlify/functions"

[dev]
  command = "npm run dev"
  port = 3000
  targetPort = 3000

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;
  
  fs.writeFileSync('./netlify.toml', netlifyConfig);
}

// Create netlify functions directory
const functionsDir = './netlify/functions';
if (!fs.existsSync(functionsDir)) {
  console.log('Creating Netlify functions directory...');
  fs.mkdirSync(functionsDir, { recursive: true });
}

// Create API function
const apiFunctionPath = path.join(functionsDir, 'api.js');
if (!fs.existsSync(apiFunctionPath)) {
  console.log('Creating API function for Netlify...');
  const apiFunction = `import express from 'express';
import serverless from 'serverless-http';
import { registerRoutes } from '../../server/routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all routes from the server
registerRoutes(app);

// Export the serverless handler
export const handler = serverless(app);
`;
  
  fs.writeFileSync(apiFunctionPath, apiFunction);
}

console.log('\nProject is ready for Netlify deployment!');
console.log('\nTo deploy:');
console.log('1. Push your code to a Git repository');
console.log('2. Connect the repository to Netlify');
console.log('3. Configure build settings as specified in README.md');
console.log('\nOr use Netlify CLI with: netlify deploy --prod');