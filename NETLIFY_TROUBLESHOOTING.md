# Netlify Deployment Troubleshooting Guide

This guide helps you troubleshoot common issues when deploying the AIBookings application to Netlify.

## Common Deployment Issues

### 1. Build Failures

#### Module Not Found Errors

**Error:** `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/build/repo/shared/schema'`

**Solution:**
- Ensure the build process correctly compiles TypeScript files before they're imported
- Check that import paths use `.js` extensions for ESM imports
- Verify the build script is running in the correct order

```bash
# Fix by updating import paths in server/migrate.js
# Change from:
import { ... } from '../shared/schema';
# To:
import { ... } from '../dist/shared/schema.js';
```

#### Database Connection Issues

**Error:** Database connection errors during build

**Solution:**
- Verify the `DATABASE_URL` environment variable is correctly set in Netlify
- Test the database connection using the `db:check` script
- Ensure your IP is whitelisted in Neon PostgreSQL if required

### 2. Runtime Errors

#### Failed to Create Pre-Booking

**Error:** API calls fail with "failed to create pre-booking" or similar errors

**Solution:**
- Check that database migrations have been run successfully
- Verify the database connection in the Netlify function environment
- Run the `db:test` script to check if all tables exist
- Check logs in the Netlify dashboard for specific error messages

#### Storage Implementation Issues

**Error:** Storage-related errors in serverless environment

**Solution:**
- Ensure the `NETLIFY` environment variable is set to `true`
- Verify that the `DbStorage` class is being used in the Netlify environment
- Check database connection parameters

## Debugging Steps

### 1. Check Netlify Build Logs

Review the build logs in the Netlify dashboard for specific error messages.

### 2. Test Database Connection

```bash
# Run the database connection check
npm run db:check

# Test if database tables exist
npm run db:test
```

### 3. Run Database Migrations

Ensure database migrations have been run:

```bash
# Option 1: Using the setup-db function
curl https://your-netlify-site.netlify.app/.netlify/functions/setup-db

# Option 2: Using Netlify CLI
netlify env:run --scope=production -- npm run db:migrate
```

### 4. Check Environment Variables

Verify all required environment variables are set in Netlify:

- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `NETLIFY`: Set to `true`
- Any other environment-specific variables

### 5. Local Testing

Test the application locally with the Netlify CLI:

```bash
npm install -g netlify-cli
netlify dev
```

## Advanced Troubleshooting

### Manually Inspecting Database

Connect to your Neon PostgreSQL database to check tables and data:

```bash
# Using psql
psql "your-database-connection-string"

# Common commands
\dt             # List tables
SELECT * FROM users LIMIT 5;  # Check users table
```

### Function Logs

Check function logs in the Netlify dashboard for runtime errors:

1. Go to Netlify Dashboard > Your Site > Functions
2. Click on the function name to view logs

### Rebuilding from Scratch

If all else fails, try a clean rebuild:

1. Clear the Netlify cache (Site settings > Build & deploy > Clear cache and deploy site)
2. Ensure all environment variables are set correctly
3. Deploy again

## Getting Help

If you're still experiencing issues:

1. Check the project documentation
2. Review Netlify's [deployment troubleshooting guide](https://docs.netlify.com/configure-builds/troubleshooting-tips/)
3. Contact the development team for assistance