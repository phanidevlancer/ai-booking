import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import TheaterSelector from "@/components/TheaterSelector";
import TicketCounter from "@/components/TicketCounter";
import TimeRangeSlider from "@/components/TimeRangeSlider";
import DateSelector from "@/components/DateSelector";
import { MOVIES } from "@/data/movies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertPreBooking } from "@shared/schema";

export default function PreBookForm() {
  const [, params] = useRoute("/prebook/:movieTitle");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const movieTitle = params?.movieTitle ? decodeURIComponent(params.movieTitle) : "";
  const movie = MOVIES.find(m => m.title === movieTitle);

  const [selectedTheaters, setSelectedTheaters] = useState<string[]>([]);
  const [ticketCount, setTicketCount] = useState(2);
  const [seatPreference, setSeatPreference] = useState("adjacent");
  const [timeRange, setTimeRange] = useState(18);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [upiId, setUpiId] = useState("");

  const createPreBookingMutation = useMutation({
    mutationFn: async (data: InsertPreBooking) => {
      const response = await apiRequest("POST", "/api/prebookings", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Pre-booking submitted!",
        description: "Your AI pre-booking request has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/prebookings"] });
      setLocation("/confirmation");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create pre-booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggleTheater = (theaterName: string) => {
    setSelectedTheaters(prev => 
      prev.includes(theaterName) 
        ? prev.filter(t => t !== theaterName)
        : [...prev, theaterName]
    );
  };

  const handleChangeTicketCount = (delta: number) => {
    setTicketCount(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleToggleDate = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!movie) {
      toast({
        title: "Error",
        description: "Movie not found",
        variant: "destructive",
      });
      return;
    }

    if (selectedTheaters.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one theater",
        variant: "destructive",
      });
      return;
    }

    if (selectedDates.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one date",
        variant: "destructive",
      });
      return;
    }

    if (!upiId.trim()) {
      toast({
        title: "Error",
        description: "Please enter your UPI ID",
        variant: "destructive",
      });
      return;
    }

    const formatTime = (value: number) => {
      const hour = Math.floor(value);
      const minute = (value % 1) * 60;
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    const preBookingData: InsertPreBooking = {
      movieTitle: movie.title,
      moviePoster: movie.poster,
      ticketCount,
      selectedTheaters,
      seatPreference,
      timeRange: formatTime(timeRange),
      selectedDates,
      upiId: upiId.trim(),
    };

    createPreBookingMutation.mutate(preBookingData);
  };

  if (!movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <p className="text-muted-foreground">The requested movie could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-4"
          data-testid="button-back"
        >
          ← Back to Movies
        </Button>
        <div className="flex items-center space-x-4 mb-6">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-20 h-28 object-cover rounded-lg"
            data-testid="selected-movie-poster"
          />
          <div>
            <h1 className="text-2xl font-bold" data-testid="selected-movie-title">
              {movie.title}
            </h1>
            <p className="text-muted-foreground">AI Pre-Booking Form</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 space-y-8">
        <TheaterSelector
          selectedTheaters={selectedTheaters}
          onToggleTheater={handleToggleTheater}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TicketCounter
            ticketCount={ticketCount}
            onChangeTicketCount={handleChangeTicketCount}
          />

          <div>
            <label className="block text-sm font-medium mb-4">Seat Preference</label>
            <RadioGroup 
              value={seatPreference} 
              onValueChange={setSeatPreference}
              data-testid="seat-preference-group"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adjacent" id="adjacent" data-testid="radio-adjacent" />
                <Label htmlFor="adjacent">Adjacent seats only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="split" id="split" data-testid="radio-split" />
                <Label htmlFor="split">Allow split seating</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <TimeRangeSlider
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />

        <DateSelector
          selectedDates={selectedDates}
          onToggleDate={handleToggleDate}
        />

        <div>
          <label className="block text-sm font-medium mb-4">UPI ID</label>
          <Input
            type="text"
            placeholder="example@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full"
            data-testid="input-upi-id"
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold"
            disabled={createPreBookingMutation.isPending}
            data-testid="button-submit-prebook"
          >
            {createPreBookingMutation.isPending 
              ? "Processing..." 
              : `Pay Pre-Booking Fee - ₹${ticketCount * 50}`
            }
          </Button>
        </div>
      </form>
    </div>
  );
}
