import { type User, type InsertUser, type PreBooking, type InsertPreBooking, type MovieBooking, type InsertMovieBooking } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createPreBooking(preBooking: InsertPreBooking): Promise<PreBooking>;
  getPreBookings(): Promise<PreBooking[]>;
  updatePreBookingStatus(id: string, status: string, matchDetails?: any): Promise<PreBooking | undefined>;
  
  createMovieBooking(movieBooking: InsertMovieBooking): Promise<MovieBooking>;
  getMovieBooking(movieTitle: string): Promise<MovieBooking | undefined>;
  updateMovieBookingStatus(movieTitle: string, isOpen: boolean): Promise<MovieBooking | undefined>;
  getOpenMovieBookings(): Promise<MovieBooking[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private preBookings: Map<string, PreBooking>;
  private movieBookings: Map<string, MovieBooking>;
  private isNetlify: boolean;

  constructor() {
    this.users = new Map();
    this.preBookings = new Map();
    this.movieBookings = new Map();
    // Check if running in Netlify environment
    this.isNetlify = process.env.NETLIFY === 'true';
    console.log(`Storage initialized. Running in Netlify: ${this.isNetlify}`);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPreBooking(insertPreBooking: InsertPreBooking): Promise<PreBooking> {
    try {
      console.log("Creating pre-booking with data:", JSON.stringify(insertPreBooking, null, 2));
      
      // Validate required fields
      if (!insertPreBooking.movieTitle) throw new Error("movieTitle is required");
      if (!insertPreBooking.moviePoster) throw new Error("moviePoster is required");
      if (!insertPreBooking.ticketCount) throw new Error("ticketCount is required");
      if (!insertPreBooking.selectedTheaters || !Array.isArray(insertPreBooking.selectedTheaters) || insertPreBooking.selectedTheaters.length === 0) {
        throw new Error("selectedTheaters must be a non-empty array");
      }
      if (!insertPreBooking.seatPreference) throw new Error("seatPreference is required");
      if (!insertPreBooking.seatRowPreference) throw new Error("seatRowPreference is required");
      if (!insertPreBooking.timeRange) throw new Error("timeRange is required");
      if (!insertPreBooking.selectedDates || !Array.isArray(insertPreBooking.selectedDates) || insertPreBooking.selectedDates.length === 0) {
        throw new Error("selectedDates must be a non-empty array");
      }
      if (!insertPreBooking.upiId) throw new Error("upiId is required");
      
      const id = randomUUID();
      const preBooking: PreBooking = {
        ...insertPreBooking,
        id,
        status: "pending",
        createdAt: new Date(),
        matchDetails: null,
        userLocation: insertPreBooking.userLocation || null,
      };
      
      console.log("Saving pre-booking:", JSON.stringify(preBooking, null, 2));
      this.preBookings.set(id, preBooking);
      return preBooking;
    } catch (error) {
      console.error("Error in createPreBooking:", error);
      throw error;
    }
  }

  async getPreBookings(): Promise<PreBooking[]> {
    return Array.from(this.preBookings.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updatePreBookingStatus(id: string, status: string, matchDetails?: any): Promise<PreBooking | undefined> {
    const preBooking = this.preBookings.get(id);
    if (preBooking) {
      const updated = { ...preBooking, status, matchDetails };
      this.preBookings.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async createMovieBooking(insertMovieBooking: InsertMovieBooking): Promise<MovieBooking> {
    const id = randomUUID();
    const movieBooking: MovieBooking = {
      ...insertMovieBooking,
      id,
      isBookingOpen: insertMovieBooking.isBookingOpen ?? false,
      createdAt: new Date(),
    };
    this.movieBookings.set(insertMovieBooking.movieTitle, movieBooking);
    return movieBooking;
  }

  async getMovieBooking(movieTitle: string): Promise<MovieBooking | undefined> {
    return this.movieBookings.get(movieTitle);
  }

  async updateMovieBookingStatus(movieTitle: string, isOpen: boolean): Promise<MovieBooking | undefined> {
    const movieBooking = this.movieBookings.get(movieTitle);
    if (movieBooking) {
      const updated = { ...movieBooking, isBookingOpen: isOpen };
      this.movieBookings.set(movieTitle, updated);
      return updated;
    }
    return undefined;
  }

  async getOpenMovieBookings(): Promise<MovieBooking[]> {
    return Array.from(this.movieBookings.values()).filter(booking => booking.isBookingOpen);
  }
}

// Database-backed storage implementation for Netlify
export class DbStorage implements IStorage {
  private db: any;

  constructor(db: any) {
    this.db = db;
    console.log('Database storage initialized');
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const users = await this.db.query.users.findMany({
        where: (users: any, { eq }: any) => eq(users.id, id)
      });
      return users[0];
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const users = await this.db.query.users.findMany({
        where: (users: any, { eq }: any) => eq(users.username, username)
      });
      return users[0];
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await this.db.insert(schema.users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async createPreBooking(insertPreBooking: InsertPreBooking): Promise<PreBooking> {
    try {
      console.log("Creating pre-booking with data:", JSON.stringify(insertPreBooking, null, 2));
      
      // Validate required fields
      if (!insertPreBooking.movieTitle) throw new Error("movieTitle is required");
      if (!insertPreBooking.moviePoster) throw new Error("moviePoster is required");
      if (!insertPreBooking.ticketCount) throw new Error("ticketCount is required");
      if (!insertPreBooking.selectedTheaters || !Array.isArray(insertPreBooking.selectedTheaters) || insertPreBooking.selectedTheaters.length === 0) {
        throw new Error("selectedTheaters must be a non-empty array");
      }
      if (!insertPreBooking.seatPreference) throw new Error("seatPreference is required");
      if (!insertPreBooking.seatRowPreference) throw new Error("seatRowPreference is required");
      if (!insertPreBooking.timeRange) throw new Error("timeRange is required");
      if (!insertPreBooking.selectedDates || !Array.isArray(insertPreBooking.selectedDates) || insertPreBooking.selectedDates.length === 0) {
        throw new Error("selectedDates must be a non-empty array");
      }
      if (!insertPreBooking.upiId) throw new Error("upiId is required");
      
      const preBookingData = {
        ...insertPreBooking,
        status: "pending",
        userLocation: insertPreBooking.userLocation || null,
        matchDetails: null
      };
      
      console.log("Saving pre-booking to database:", JSON.stringify(preBookingData, null, 2));
      const result = await this.db.insert(schema.preBookings).values(preBookingData).returning();
      return result[0];
    } catch (error) {
      console.error("Error in createPreBooking:", error);
      throw error;
    }
  }

  async getPreBookings(): Promise<PreBooking[]> {
    try {
      const preBookings = await this.db.query.preBookings.findMany({
        orderBy: (preBookings: any, { desc }: any) => [desc(preBookings.createdAt)]
      });
      return preBookings;
    } catch (error) {
      console.error('Error getting pre-bookings:', error);
      return [];
    }
  }

  async updatePreBookingStatus(id: string, status: string, matchDetails?: any): Promise<PreBooking | undefined> {
    try {
      const result = await this.db
        .update(schema.preBookings)
        .set({ status, matchDetails })
        .where(({ id: preBookingId }: any, { eq }: any) => eq(preBookingId, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating pre-booking status:', error);
      return undefined;
    }
  }

  async createMovieBooking(insertMovieBooking: InsertMovieBooking): Promise<MovieBooking> {
    try {
      const result = await this.db.insert(schema.movieBookings).values(insertMovieBooking).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating movie booking:', error);
      throw error;
    }
  }

  async getMovieBooking(movieTitle: string): Promise<MovieBooking | undefined> {
    try {
      const movieBookings = await this.db.query.movieBookings.findMany({
        where: (movieBookings: any, { eq }: any) => eq(movieBookings.movieTitle, movieTitle)
      });
      return movieBookings[0];
    } catch (error) {
      console.error('Error getting movie booking:', error);
      return undefined;
    }
  }

  async updateMovieBookingStatus(movieTitle: string, isOpen: boolean): Promise<MovieBooking | undefined> {
    try {
      const result = await this.db
        .update(schema.movieBookings)
        .set({ isBookingOpen: isOpen })
        .where(({ movieTitle: title }: any, { eq }: any) => eq(title, movieTitle))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating movie booking status:', error);
      return undefined;
    }
  }

  async getOpenMovieBookings(): Promise<MovieBooking[]> {
    try {
      const movieBookings = await this.db.query.movieBookings.findMany({
        where: (movieBookings: any, { eq }: any) => eq(movieBookings.isBookingOpen, true)
      });
      return movieBookings;
    } catch (error) {
      console.error('Error getting open movie bookings:', error);
      return [];
    }
  }
}

// Import database connection
import { getDatabase } from './database';

// Create appropriate storage based on environment
let storage: IStorage;

if (process.env.NETLIFY === 'true') {
  console.log('Running in Netlify environment, using database storage');
  const db = getDatabase();
  storage = new DbStorage(db);
} else {
  console.log('Running in local environment, using memory storage');
  storage = new MemStorage();
}

export { storage };
