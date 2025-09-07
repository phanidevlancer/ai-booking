# AIBookings - Netlify Deployment Guide

This project is a React Vite application with an Express backend for AI-powered movie booking.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Netlify account
- Git repository (GitHub, GitLab, or Bitbucket)

## Local Development

1. **Install dependencies**

```bash
npm install
```

2. **Start the development server**

```bash
npm run dev
```

This will start both the frontend and backend servers in development mode.

3. **Access the application**

Open your browser and navigate to: http://localhost:3000

## Deploying to Netlify

### Option 1: Netlify UI (Recommended for beginners)

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Log in to Netlify** and click "New site from Git"

3. **Connect your Git repository** and select the repository containing this project

4. **Configure the build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist/public`

5. **Deploy the site**

### Option 2: Netlify CLI

1. **Install the Netlify CLI**

```bash
npm install -g netlify-cli
```

2. **Login to Netlify**

```bash
netlify login
```

3. **Initialize your site**

```bash
netlify init
```

4. **Deploy your site**

```bash
netlify deploy --prod
```

## Project Structure

- `client/`: Frontend React application
- `server/`: Backend Express server
- `shared/`: Shared code between frontend and backend
- `netlify/functions/`: Serverless functions for Netlify deployment

## Database Configuration

For production deployment on Netlify, you should use a cloud database service like:

- [Neon](https://neon.tech/) (PostgreSQL)
- [Supabase](https://supabase.com/) (PostgreSQL)
- [PlanetScale](https://planetscale.com/) (MySQL)

Update your database connection string in environment variables on Netlify.

## Environment Variables

Set these environment variables in the Netlify UI under Site settings > Build & deploy > Environment:

- `NODE_ENV`: Set to `production`
- `DATABASE_URL`: Your database connection string