import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function FinalConfirmation() {
  const [, params] = useRoute("/final-confirmation/:bookingId");
  const [, setLocation] = useLocation();
  const bookingId = params?.bookingId || "";

  // Mock data for demonstration - in a real app this would come from the API
  const ticketData = {
    movieTitle: "Inside Out 2",
    moviePoster: "https://image.tmdb.org/t/p/w500/djhPTGoBsq0hwg5r3Iqh9CzRBY0.jpg",
    theater: "AMB Cinemas",
    location: "Gachibowli",
    date: "Dec 22, 2024",
    time: "3:00 PM",
    seats: ["J7", "J8", "J9"],
    total: 655,
  };

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download the e-ticket
    alert("E-ticket download would start here");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-card rounded-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2" data-testid="final-confirmation-title">
          Booking Confirmed!
        </h1>
        <p className="text-muted-foreground mb-8">
          Your e-ticket is ready. Show this at the theater entrance.
        </p>

        {/* E-Ticket */}
        <div className="bg-secondary rounded-lg p-6 mb-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg" data-testid="ticket-movie-title">
                {ticketData.movieTitle}
              </h3>
              <p className="text-muted-foreground">
                {ticketData.theater}, {ticketData.location}
              </p>
            </div>
            <img 
              src={ticketData.moviePoster}
              alt={ticketData.movieTitle}
              className="w-12 h-16 object-cover rounded"
              data-testid="ticket-movie-poster"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date & Time</p>
              <p className="font-medium" data-testid="ticket-datetime">
                {ticketData.date} • {ticketData.time}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Seats</p>
              <p className="font-medium" data-testid="ticket-seats">
                {ticketData.seats.join(', ')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Booking ID</p>
              <p className="font-medium" data-testid="ticket-booking-id">
                #{bookingId}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Paid</p>
              <p className="font-medium" data-testid="ticket-total">
                ₹{ticketData.total}
              </p>
            </div>
          </div>
        </div>

        {/* Final QR Code */}
        <div className="bg-background rounded-lg p-6 mb-6">
          <div className="flex justify-center mb-2">
            <QRCodeSVG 
              value={`ticket-entry-code-${bookingId}`}
              size={128}
              data-testid="entry-qr-code"
            />
          </div>
          <p className="text-sm text-muted-foreground">Entry QR Code</p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleDownloadTicket}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium"
            data-testid="button-download-ticket"
          >
            Download E-Ticket
          </Button>
          <Button 
            variant="secondary"
            onClick={() => setLocation("/")}
            className="w-full py-3 font-medium"
            data-testid="button-back-home"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
