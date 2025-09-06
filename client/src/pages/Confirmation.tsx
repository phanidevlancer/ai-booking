import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Confirmation() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-card rounded-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-4" data-testid="confirmation-title">
          Pre-Booking Confirmed!
        </h1>
        <p className="text-muted-foreground mb-8" data-testid="confirmation-message">
          Your pre-booking is confirmed! We'll notify you once seats are found for your preferred showtimes.
        </p>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Pre-booking Fee (per ticket):</span>
            <span className="font-medium text-primary">₹50 each</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <Link href="/dashboard" className="flex-1">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium"
              data-testid="button-view-prebookings"
            >
              View My Pre-Bookings
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button 
              variant="secondary"
              className="w-full py-3 font-medium"
              data-testid="button-back-home"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
