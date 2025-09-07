-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Create pre_bookings table if not exists
CREATE TABLE IF NOT EXISTS pre_bookings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_title TEXT NOT NULL,
  movie_poster TEXT NOT NULL,
  ticket_count INTEGER NOT NULL,
  selected_theaters JSONB NOT NULL,
  seat_preference TEXT NOT NULL,
  seat_row_preference TEXT NOT NULL,
  time_range TEXT NOT NULL,
  selected_dates JSONB NOT NULL,
  upi_id TEXT NOT NULL,
  user_location JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  match_details JSONB
);

-- Create movie_bookings table if not exists
CREATE TABLE IF NOT EXISTS movie_bookings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_title TEXT NOT NULL,
  is_booking_open BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);