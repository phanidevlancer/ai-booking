# Netlify Deployment Instructions for AIBookings

This guide will help you deploy the AIBookings application to Netlify with the proper database configuration.

## Prerequisites

1. A Netlify account
2. A Neon PostgreSQL database

## Step 1: Set Up Your Neon Database

1. Go to [Neon.tech](https://neon.tech) and sign up for an account
2. Create a new project
3. Get your database connection string from the Neon dashboard

## Step 2: Deploy to Netlify

### Option 1: Deploy via Netlify UI

1. Go to [Netlify](https://app.netlify.com/) and log in
2. Click "New site from Git"
3. Connect to your Git provider and select your repository
4. Configure build settings:
   - Build command: `npm run netlify:build`
   - Publish directory: `dist`
5. Add environment variables:
   - `DATABASE_URL`: Your Neon database connection string
   - `NETLIFY`: `true`
   - `NODE_ENV`: `production`
6. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login to Netlify: `netlify login`
3. Initialize your site: `netlify init`
4. Set environment variables:
   ```
   netlify env:set DATABASE_URL "your-neon-connection-string"
   netlify env:set NETLIFY true
   netlify env:set NODE_ENV production
   ```
5. Deploy your site: `netlify deploy --prod`

## Step 3: Verify Your Deployment

1. Once deployed, visit your Netlify site URL
2. Test the pre-booking functionality
3. Check the Netlify function logs for any errors

## Troubleshooting

If you encounter issues with the pre-booking functionality:

1. Check the Netlify function logs for errors
2. Verify that your database connection string is correct
3. Make sure the `NETLIFY` environment variable is set to `true`
4. Check that the database migrations have run successfully

## Database Migrations

The application is configured to run database migrations automatically during the build process. If you need to run migrations manually:

```bash
# Set your DATABASE_URL environment variable
export DATABASE_URL=postgres://username:password@endpoint/database

# Run migrations
npm run db:migrate
```

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Neon PostgreSQL Documentation](https://neon.tech/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)