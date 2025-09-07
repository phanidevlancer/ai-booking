interface DateSelectorProps {
  selectedDates: string[];
  onToggleDate: (date: string) => void;
  movieReleaseDate?: string;
  movie?: {
    releaseDate: string;
    pricingConfig: {
      [day: number]: number;
    };
  };
}

export default function DateSelector({ selectedDates, onToggleDate, movieReleaseDate, movie }: DateSelectorProps) {
  
  // Calculate pre-booking fee for a specific date
  const calculateFeeForDate = (dateStr: string): number => {
    if (!movie) return 50; // Default fee
    
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
  // Generate upcoming dates starting from movie release date
  const generateUpcomingDates = () => {
    const dates = [];
    const startDate = movieReleaseDate ? new Date(movieReleaseDate) : new Date();
    
    // If movie release date is in the past, start from today
    const today = new Date();
    const actualStartDate = startDate > today ? startDate : today;
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(actualStartDate);
      date.setDate(actualStartDate.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return dates;
  };

  const dates = generateUpcomingDates();
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-4">Select Dates</label>
      <div className="w-full">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayHeaders.map(day => (
            <div key={day} className="w-14 h-8 flex items-center justify-center text-xs text-muted-foreground font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {dates.map(({ date, day, month, fullDate }) => {
            const fee = calculateFeeForDate(date);
            return (
              <div
                key={date}
                className={`calendar-day w-14 h-16 flex flex-col items-center justify-center rounded-lg cursor-pointer text-xs border border-border transition-all duration-200 hover:shadow-md ${
                  selectedDates.includes(date) ? 'selected' : 'hover:bg-muted/50'
                }`}
                onClick={() => onToggleDate(date)}
                data-testid={`calendar-day-${date}`}
                title={`${fullDate} - Fee: ₹${fee} per ticket`}
              >
                <div className="text-xs text-muted-foreground leading-none">{month}</div>
                <div className="text-sm font-medium leading-none">{day}</div>
                <div className="text-xs text-green-600 font-semibold leading-none mt-1">₹{fee}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
