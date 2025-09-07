# AIBookings - Netlify Deployment Guide

This guide provides step-by-step instructions for deploying your AIBookings application to Netlify.

## Prerequisites

- [Git](https://git-scm.com/) installed on your machine
- [Node.js](https://nodejs.org/) (v16 or higher) and npm installed
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (optional for CLI deployment)
- A [Netlify account](https://app.netlify.com/signup)
- A [Neon](https://neon.tech) account for PostgreSQL database (or another PostgreSQL provider)

## Step 1: Prepare Your Repository

1. Make sure your code is committed to a Git repository (GitHub, GitLab, or Bitbucket)
2. Ensure your `.gitignore` file includes:
   ```
   node_modules
   dist
   .env
   .netlify
   ```

## Step 2: Set Up Your Database

1. Follow the instructions in `NETLIFY_DATABASE_SETUP.md` to create a PostgreSQL database with Neon
2. Copy your database connection string for later use

## Step 3: Deploy to Netlify

### Option A: Deploy via Netlify UI (Recommended for beginners)

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "New site from Git"
3. Connect to your Git provider and select your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
5. Click "Show advanced" and add environment variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your Neon database connection string
6. Click "Deploy site"

### Option B: Deploy via Netlify CLI

1. Install Netlify CLI if you haven't already:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize your site:
   ```bash
   netlify init
   ```
   - Select "Create & configure a new site"
   - Follow the prompts to select your team and site name

4. Set environment variables:
   ```bash
   netlify env:set NODE_ENV production
   netlify env:set DATABASE_URL your_database_connection_string
   ```

5. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

## Step 4: Initialize Your Database

After deployment, you need to initialize your database schema:

1. Go to Netlify UI > Your site > Site settings > Functions > Console
2. Run the database initialization script:
   ```bash
   node scripts/init-db.js
   ```

Alternatively, you can run it locally with your production database URL:

```bash
DATABASE_URL=your_production_db_url node scripts/init-db.js
```

## Step 5: Verify Your Deployment

1. Visit your Netlify site URL (e.g., `https://your-site-name.netlify.app`)
2. Test the application functionality
3. Check the API endpoints (e.g., `https://your-site-name.netlify.app/.netlify/functions/api/health`)

## Troubleshooting

### API Endpoints Not Working

Check that your redirects are properly configured in `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

### Database Connection Issues

1. Verify your `DATABASE_URL` environment variable is correctly set
2. Check that your IP is allowed in Neon's connection settings
3. Review Netlify function logs for any connection errors

### Build Failures

1. Check your Netlify build logs for errors
2. Ensure all dependencies are correctly installed
3. Verify your build command is correct

## Continuous Deployment

Netlify automatically sets up continuous deployment from your Git repository. Any changes pushed to your main branch will trigger a new deployment.

## Custom Domain

To use a custom domain:

1. Go to Netlify UI > Your site > Domain settings
2. Click "Add custom domain"
3. Follow the instructions to configure your domain

## SSL/HTTPS

Netlify provides free SSL certificates via Let's Encrypt. HTTPS is enabled by default for all sites.

## Monitoring and Logs

To view function logs:

1. Go to Netlify UI > Your site > Functions
2. Click on a function to view its logs

## Need Help?

- [Netlify Support](https://www.netlify.com/support/)
- [Netlify Forums](https://answers.netlify.com/)
- [Netlify Documentation](https://docs.netlify.com/)