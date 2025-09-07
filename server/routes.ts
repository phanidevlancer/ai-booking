import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPreBookingSchema, insertMovieBookingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all pre-bookings
  app.get("/api/prebookings", async (req, res) => {
    try {
      const preBookings = await storage.getPreBookings();
      res.json(preBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pre-bookings" });
    }
  });

  // Create a new pre-booking
  app.post("/api/prebookings", async (req, res) => {
    try {
      console.log("Received pre-booking request:", req.body);
      const data = insertPreBookingSchema.parse(req.body);
      console.log("Parsed data:", data);
      const preBooking = await storage.createPreBooking(data);
      console.log("Created pre-booking:", preBooking);
      res.json(preBooking);
    } catch (error) {
      console.error("Pre-booking creation error:", error);
      res.status(400).json({ message: "Invalid pre-booking data", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Update pre-booking status
  app.patch("/api/prebookings/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, matchDetails } = req.body;
      const updated = await storage.updatePreBookingStatus(id, status, matchDetails);
      if (!updated) {
        return res.status(404).json({ message: "Pre-booking not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update pre-booking" });
    }
  });

  // Create or update movie booking status
  app.post("/api/movie-bookings", async (req, res) => {
    try {
      const data = insertMovieBookingSchema.parse(req.body);
      const existing = await storage.getMovieBooking(data.movieTitle);
      
      if (existing) {
        const updated = await storage.updateMovieBookingStatus(data.movieTitle, data.isBookingOpen ?? false);
        res.json(updated);
      } else {
        const movieBooking = await storage.createMovieBooking(data);
        res.json(movieBooking);
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid movie booking data" });
    }
  });

  // Get movie booking status
  app.get("/api/movie-bookings/:movieTitle", async (req, res) => {
    try {
      const { movieTitle } = req.params;
      const movieBooking = await storage.getMovieBooking(decodeURIComponent(movieTitle));
      if (!movieBooking) {
        return res.status(404).json({ message: "Movie booking not found" });
      }
      res.json(movieBooking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movie booking" });
    }
  });

  // Get all open movie bookings
  app.get("/api/movie-bookings", async (req, res) => {
    try {
      const openBookings = await storage.getOpenMovieBookings();
      res.json(openBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch open bookings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
