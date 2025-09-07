import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { CITIES } from "@/data/theaters";
import { useState } from "react";

interface CitySelectorProps {
  selectedCities: string[];
  onSelectCity: (cityValue: string) => void;
}

export default function CitySelector({ selectedCities, onSelectCity }: CitySelectorProps) {
  const selectedCity = selectedCities[0] || "";
  const [isDetecting, setIsDetecting] = useState(false);
  
  const handleAutoDetect = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    
    setIsDetecting(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use a reverse geocoding service to get city from coordinates
          // For demo purposes, we'll simulate detection based on common coordinates
          let detectedCity = "Hyderabad"; // Default fallback
          
          // Simple coordinate-based city detection (approximate)
          if (latitude >= 12.8 && latitude <= 13.2 && longitude >= 77.4 && longitude <= 77.8) {
            detectedCity = "Bangalore";
          } else if (latitude >= 18.8 && latitude <= 19.3 && longitude >= 72.7 && longitude <= 73.2) {
            detectedCity = "Mumbai";
          } else if (latitude >= 17.2 && latitude <= 17.6 && longitude >= 78.2 && longitude <= 78.7) {
            detectedCity = "Hyderabad";
          }
          
          onSelectCity(detectedCity);
        } catch (error) {
          console.error("Error detecting location:", error);
          alert("Could not detect your location. Please select manually.");
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Location access denied. Please select your city manually.");
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };
  
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
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAutoDetect}
        disabled={isDetecting}
        className="flex items-center gap-2 text-xs"
      >
        <Navigation className={`w-3 h-3 ${isDetecting ? 'animate-spin' : ''}`} />
        {isDetecting ? 'Detecting...' : 'Auto Detect'}
      </Button>
    </div>
  );
}