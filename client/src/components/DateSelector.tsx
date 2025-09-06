interface DateSelectorProps {
  selectedDates: string[];
  onToggleDate: (date: string) => void;
}

export default function DateSelector({ selectedDates, onToggleDate }: DateSelectorProps) {
  // Generate upcoming dates for demonstration
  const generateUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    
    return dates;
  };

  const dates = generateUpcomingDates();
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <label className="block text-sm font-medium mb-4">Select Dates</label>
      <div className="grid grid-cols-7 gap-2 text-center mb-4">
        {dayHeaders.map(day => (
          <div key={day} className="text-xs text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {dates.map(({ date, day }) => (
          <div
            key={date}
            className={`calendar-day w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer text-sm border border-border ${
              selectedDates.includes(date) ? 'selected' : ''
            }`}
            onClick={() => onToggleDate(date)}
            data-testid={`calendar-day-${date}`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
