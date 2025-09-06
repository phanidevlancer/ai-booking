import { THEATERS } from "@/data/theaters";

interface TheaterSelectorProps {
  selectedTheaters: string[];
  onToggleTheater: (theaterName: string) => void;
}

export default function TheaterSelector({ selectedTheaters, onToggleTheater }: TheaterSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-4">Select Theaters</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {THEATERS.map((theater) => (
          <div
            key={theater.name}
            className={`theater-option border border-border rounded-lg p-4 cursor-pointer ${
              selectedTheaters.includes(theater.name) ? 'selected' : ''
            }`}
            onClick={() => onToggleTheater(theater.name)}
            data-testid={`theater-option-${theater.name.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{theater.name}</h4>
                <p className="text-sm text-muted-foreground">{theater.location}</p>
              </div>
              <div 
                className={`w-4 h-4 border border-border rounded theater-checkbox ${
                  selectedTheaters.includes(theater.name) ? 'bg-primary' : 'bg-transparent'
                }`}
                data-testid={`theater-checkbox-${theater.name.replace(/\s+/g, '-').toLowerCase()}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
