# AI Pre-Book Movie Booking System

## Overview

This is a React + Vite movie booking application styled like BookMyShow with a dark theme. The app allows users to browse upcoming movies and either book tickets normally or use an AI-powered pre-booking system that automatically finds and allocates seats when bookings open. The system includes a booking management dashboard with admin controls to simulate theater booking opening and seat matching.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful API endpoints for pre-bookings and movie bookings
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Development**: Hot reload with Vite middleware integration

### Database Schema Design
- **ORM**: Drizzle ORM with PostgreSQL dialect configuration
- **Tables**: 
  - `users` - User authentication and profiles
  - `pre_bookings` - AI pre-booking requests with preferences
  - `movie_bookings` - Movie booking availability status
- **Data Validation**: Zod schemas for type-safe data validation

### Component Architecture
- **Atomic Design**: Reusable UI components (buttons, inputs, cards)
- **Feature Components**: Specialized components (MovieCard, TheaterSelector, DateSelector)
- **Page Components**: Route-level components for different app screens
- **Layout Components**: Navigation and shared layout elements

### State Management Pattern
- **Server State**: TanStack Query for API data fetching and caching
- **Local State**: React useState for form inputs and UI interactions
- **Global State**: Minimal global state, preferring component-level state

### Authentication & Authorization
- Basic user schema defined but authentication not implemented
- Prepared for future session-based authentication with express-session

### Data Flow Architecture
1. User creates pre-booking with preferences (theaters, dates, seat preferences)
2. System stores pre-booking in "pending" status
3. Admin can simulate opening bookings for specific movies
4. Background automation checks for seat availability
5. When matches found, pre-bookings status updated to "match_found"
6. Users can confirm final booking and receive e-tickets

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver for Neon serverless
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Headless UI primitives for accessibility
- **class-variance-authority**: Utility for creating component variants
- **clsx & tailwind-merge**: Conditional className utilities
- **lucide-react**: Icon library for consistent iconography

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and IntelliSense
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

### Production Dependencies
- **express**: Web server framework
- **connect-pg-simple**: PostgreSQL session store (prepared for future use)
- **date-fns**: Date manipulation and formatting utilities