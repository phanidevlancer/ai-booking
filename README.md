# AIBookings - Local Setup Guide

This project is a React Vite application with an Express backend for AI-powered movie booking.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup Instructions

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

## Project Structure

- `client/`: Frontend React application
- `server/`: Backend Express server
- `shared/`: Shared code between frontend and backend

## Database

The application uses an in-memory database by default for local development.

## Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```