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

  constructor() {
    this.users = new Map();
    this.preBookings = new Map();
    this.movieBookings = new Map();
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
    const id = randomUUID();
    const preBooking: PreBooking = {
      ...insertPreBooking,
      id,
      status: "pending",
      createdAt: new Date(),
      matchDetails: null,
    };
    this.preBookings.set(id, preBooking);
    return preBooking;
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

export const storage = new MemStorage();
