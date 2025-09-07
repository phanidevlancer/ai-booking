import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { CITIES } from "@/data/theaters";

interface CitySelectorProps {
  selectedCities: string[];
  onSelectCity: (cityValue: string) => void;
}

export default function CitySelector({ selectedCities, onSelectCity }: CitySelectorProps) {
  const selectedCity = selectedCities[0] || "";
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <label className="text-sm font-medium">City:</label>
      </div>
      <Select value={selectedCity} onValueChange={onSelectCity}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a city" />
        </SelectTrigger>
        <SelectContent>
          {CITIES.map((city) => (
            <SelectItem key={city.value} value={city.value}>
              {city.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}