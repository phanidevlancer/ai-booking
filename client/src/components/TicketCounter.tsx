import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface TicketCounterProps {
  ticketCount: number;
  onChangeTicketCount: (delta: number) => void;
}

export default function TicketCounter({ ticketCount, onChangeTicketCount }: TicketCounterProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-4">Number of Tickets</label>
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          size="icon"
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission
            onChangeTicketCount(-1);
          }}
          disabled={ticketCount <= 1}
          data-testid="button-decrease-tickets"
          type="button" // Explicitly set button type to prevent form submission
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span 
          className="text-xl font-semibold min-w-8 text-center"
          data-testid="ticket-count-display"
        >
          {ticketCount}
        </span>
        <Button
          variant="secondary"
          size="icon"
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission
            onChangeTicketCount(1);
          }}
          disabled={ticketCount >= 10}
          data-testid="button-increase-tickets"
          type="button" // Explicitly set button type to prevent form submission
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
