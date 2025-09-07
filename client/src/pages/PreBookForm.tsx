import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import TheaterSelector from "@/components/TheaterSelector";
import CitySelector from "@/components/CitySelector";
import TicketCounter from "@/components/TicketCounter";
import { Slider } from "@/components/ui/slider";
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

  // Helper function to convert 24-hour format to 12-hour format
  const formatTo12Hour = (hour: number): string => {
    if (hour === 0) return "12:00 AM";
    if (hour === 12) return "12:00 PM";
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
  };

  const movieTitle = params?.movieTitle ? decodeURIComponent(params.movieTitle) : "";
  const movie = MOVIES.find(m => m.title === movieTitle);

  const [selectedTheaters, setSelectedTheaters] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>(["Hyderabad"]); // Default to Hyderabad
  const [ticketCount, setTicketCount] = useState(2);
  const [seatPreference, setSeatPreference] = useState("adjacent");
  const [seatRowPreference, setSeatRowPreference] = useState("any");
  const [timeRange, setTimeRange] = useState([9, 21]); // 9 AM to 9 PM
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [upiId, setUpiId] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const stickyContainerRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic pre-booking fee based on movie-specific pricing configuration
  const calculatePreBookingFee = (dateStr: string): number => {
    if (!movie) return 0;
    
    const selectedDate = new Date(dateStr + 'T00:00:00');
    const normalizedReleaseDate = new Date(movie.releaseDate + ' 00:00:00');
    
    const daysDiff = Math.floor((selectedDate.getTime() - normalizedReleaseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Use movie-specific pricing configuration
    const pricingConfig = movie.pricingConfig;
    
    // Find the appropriate price based on days difference
    if (pricingConfig[daysDiff] !== undefined) {
      return pricingConfig[daysDiff];
    }
    
    // If exact day not found, use the highest available day that's <= daysDiff
    const availableDays = Object.keys(pricingConfig).map(Number).sort((a, b) => b - a);
    for (const day of availableDays) {
      if (daysDiff >= day) {
        return pricingConfig[day];
      }
    }
    
    // Fallback to day 0 pricing if no match found
    return pricingConfig[0] || 50;
  };

  // Calculate total pre-booking fee for all selected dates
  const getTotalPreBookingFee = () => {
    if (!movie || selectedDates.length === 0) return 50; // Default minimum fee
    
    let maxFee = 0;
    selectedDates.forEach(dateStr => {
      const fee = calculatePreBookingFee(dateStr);
      maxFee = Math.max(maxFee, fee);
    });
    
    return maxFee;
  };

  const preBookingFee = getTotalPreBookingFee();
  const totalPreBookingFee = ticketCount * preBookingFee;



  // Handle scroll detection to auto-collapse breakdown
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (showBreakdown) {
        setShowBreakdown(false);
      }
      setIsScrolling(true);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [showBreakdown]);

  // Handle outside click detection to close breakdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showBreakdown && stickyContainerRef.current && !stickyContainerRef.current.contains(event.target as Node)) {
        setShowBreakdown(false);
      }
    };

    if (showBreakdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBreakdown]);



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

  const handleSelectCity = (cityValue: string) => {
    setSelectedCities([cityValue]); // Only allow single city selection
    // Clear selected theaters when city changes to avoid invalid selections
    setSelectedTheaters([]);
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

     // Log the data being submitted
    console.log("Submitting pre-booking with:", {
      movieTitle: movie.title,
      moviePoster: movie.poster,
      ticketCount,
      selectedTheaters,
      seatPreference,
      seatRowPreference,
      timeRange,
        formattedTimeRange: `${timeRange[0].toString().padStart(2, '0')}:00 - ${timeRange[1].toString().padStart(2, '0')}:00`,
      selectedDates,
      upiId: upiId.trim(),
    });

    try {
      // Ensure all required fields are present and properly formatted
      const preBookingData: InsertPreBooking = {
        movieTitle: movie.title,
        moviePoster: movie.poster,
        ticketCount,
        selectedTheaters: selectedTheaters.length > 0 ? selectedTheaters : [],
        seatPreference,
        seatRowPreference,
        timeRange: `${timeRange[0].toString().padStart(2, '0')}:00 - ${timeRange[1].toString().padStart(2, '0')}:00`,
        selectedDates: selectedDates.length > 0 ? selectedDates : [],
        upiId: upiId.trim(),
        userLocation,
      };

      // Additional validation
      if (!preBookingData.movieTitle) throw new Error("Movie title is required");
      if (!preBookingData.moviePoster) throw new Error("Movie poster is required");
      if (!preBookingData.selectedTheaters.length) throw new Error("Please select at least one theater");
      if (!preBookingData.selectedDates.length) throw new Error("Please select at least one date");
      if (!preBookingData.upiId) throw new Error("UPI ID is required");

      console.log("Final pre-booking data being sent to API:", JSON.stringify(preBookingData, null, 2));
      createPreBookingMutation.mutate(preBookingData);
    } catch (error) {
      console.error("Error preparing pre-booking data:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to prepare booking data",
        variant: "destructive",
      });
    }
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

      <form id="prebook-form" onSubmit={handleSubmit} className="bg-card rounded-lg p-6 space-y-8">
        <CitySelector
                selectedCities={selectedCities}
                onSelectCity={handleSelectCity}
              />
              
              <TheaterSelector
                selectedTheaters={selectedTheaters}
                onToggleTheater={handleToggleTheater}
                selectedCities={selectedCities}
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

        <div>
          <label className="block text-sm font-medium mb-4">Seat Row Preference</label>
          <Select value={seatRowPreference} onValueChange={setSeatRowPreference}>
            <SelectTrigger data-testid="seat-row-selector">
              <SelectValue placeholder="Select row preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="front">Front Rows (A-E)</SelectItem>
              <SelectItem value="middle">Middle Rows (F-L)</SelectItem>
              <SelectItem value="back">Back Rows (M-Z)</SelectItem>
              <SelectItem value="any">Any Row</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium">Preferred Time Range</label>
          <div className="px-4">
            <Slider
              value={timeRange}
              onValueChange={setTimeRange}
              max={24}
              min={0}
              step={1}
              className="w-full"
              data-testid="time-range-slider"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>12:00 AM</span>
              <span>12:00 PM</span>
              <span>11:59 PM</span>
            </div>
            <div className="text-center mt-3">
              <span className="text-sm text-muted-foreground">Selected: </span>
              <span className="font-medium" data-testid="time-range-display">
                {formatTo12Hour(timeRange[0])} - {formatTo12Hour(timeRange[1])}
              </span>
            </div>
          </div>
        </div>

        <DateSelector
          selectedDates={selectedDates}
          onToggleDate={handleToggleDate}
          movieReleaseDate={movie?.releaseDate}
          movie={movie}
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

      </form>
      
      {/* Sticky Pre-Pay Button with Breakdown */}
      <div ref={stickyContainerRef} className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-[100]">
        <div className="max-w-4xl mx-auto">
          {/* Collapsible Breakdown Section */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showBreakdown ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Movie:</span>
                    <span className="ml-2 font-medium">{movie?.title}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tickets:</span>
                    <span className="ml-2 font-medium">{ticketCount}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Dates:</span>
                    <span className="ml-2 font-medium">{selectedDates.length > 0 ? `${selectedDates.length} selected` : 'None'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <span className="ml-2 font-medium">{formatTo12Hour(timeRange[0])} - {formatTo12Hour(timeRange[1])}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Theaters:</span>
                    <span className="ml-2 font-medium">{selectedTheaters.length > 0 ? `${selectedTheaters.length} selected` : 'Any'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Seats:</span>
                    <span className="ml-2 font-medium">{seatPreference === 'adjacent' ? 'Adjacent' : 'Split OK'}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pre-booking Fee (per ticket):</span>
                    <span className="font-medium">₹{preBookingFee}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Fee ({ticketCount} tickets):</span>
                    <span className="text-primary">₹{totalPreBookingFee}</span>
                  </div>
                </div>
               </div>
             </div>
           </div>
          
          {/* Button Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <button
                 type="button"
                 onClick={() => setShowBreakdown(!showBreakdown)}
                 className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
               >
                 <span>Fee Breakdown</span>
                 <ChevronUp className={`h-4 w-4 transition-transform duration-300 ${
                   showBreakdown ? 'rotate-180' : 'rotate-0'
                 }`} />
               </button>
              <div className="text-sm text-muted-foreground">
                {ticketCount} tickets • {selectedDates.length} dates • {selectedTheaters.length > 0 ? `${selectedTheaters.length} theaters` : 'Any theater'}
              </div>
            </div>
            <Button 
              type="submit"
              form="prebook-form"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold shadow-lg"
              disabled={createPreBookingMutation.isPending}
              data-testid="button-submit-prebook"
            >
              {createPreBookingMutation.isPending 
                ? "Processing..." 
                : `Pay Pre-Booking Fee - ₹${totalPreBookingFee}`
              }
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom padding to prevent content from being hidden behind sticky button */}
       <div className="h-32"></div>
    </div>
  );
}
