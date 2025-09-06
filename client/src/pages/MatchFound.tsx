import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import type { PreBooking } from "@shared/schema";

export default function MatchFound() {
  const [, params] = useRoute("/match/:preBookingId");
  const [, setLocation] = useLocation();
  const preBookingId = params?.preBookingId || "";

  const { data: preBookings = [] } = useQuery<PreBooking[]>({
    queryKey: ["/api/prebookings"],
  });

  const booking = preBookings.find(b => b.id === preBookingId);

  if (!booking || booking.status !== "match_found") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Match Not Found</h1>
          <p className="text-muted-foreground">The requested booking match could not be found.</p>
          <Button 
            onClick={() => setLocation("/dashboard")}
            className="mt-4"
            data-testid="button-back-dashboard"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const matchDetails = booking.matchDetails as any;

  const handleConfirmBooking = () => {
    // Generate a booking ID and redirect to final confirmation
    const bookingId = "BK" + Date.now().toString().slice(-8);
    setLocation(`/final-confirmation/${bookingId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/dashboard")}
          className="mb-4"
          data-testid="button-back-dashboard"
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold mb-2" data-testid="match-found-title">
          Perfect Match Found!
        </h1>
        <p className="text-muted-foreground">We found seats that match your preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seat Map Section */}
        <div className="bg-card rounded-lg p-6">
          <h3 className="font-semibold mb-4">Seat Map</h3>
          <div className="bg-secondary rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="h-8 bg-primary/20 rounded mb-4 flex items-center justify-center text-sm">
                SCREEN
              </div>
            </div>
            <div className="grid grid-cols-10 gap-1 text-xs">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`h-6 rounded ${
                    i >= 2 && i < 2 + booking.ticketCount ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Your Seats</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-muted rounded"></div>
                <span>Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6">
            <h3 className="font-semibold mb-4">Booking Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Movie:</span>
                <span className="font-medium" data-testid="match-movie-title">
                  {booking.movieTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Theater:</span>
                <span className="font-medium">{matchDetails.theater}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {new Date(matchDetails.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{matchDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats:</span>
                <span className="font-medium">{matchDetails.seats.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h3 className="font-semibold mb-4">Price Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Tickets ({booking.ticketCount}x ₹220)
                </span>
                <span>₹{matchDetails.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span>₹{matchDetails.serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pre-booking Fee (Paid)</span>
                <span className="text-green-400">-₹{booking.ticketCount * 50}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span data-testid="match-total-price">₹{matchDetails.total}</span>
              </div>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="bg-card rounded-lg p-6 text-center">
            <h3 className="font-semibold mb-4">Quick Booking QR</h3>
            <div className="flex justify-center mb-4">
              <QRCodeSVG 
                value={`booking-quick-link-${booking.id}`}
                size={128}
                data-testid="booking-qr-code"
              />
            </div>
            <p className="text-sm text-muted-foreground">Scan to complete booking on mobile</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleConfirmBooking}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 font-semibold"
              data-testid="button-pay-confirm"
            >
              Pay & Confirm Booking
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="secondary"
                className="py-3 font-medium"
                data-testid="button-not-interested"
              >
                Not Interested
              </Button>
              <Button 
                variant="secondary"
                className="py-3 font-medium"
                data-testid="button-try-other-theaters"
              >
                Try Other Theaters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
