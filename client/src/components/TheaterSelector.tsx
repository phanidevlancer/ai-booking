import { THEATERS, Theater } from "@/data/theaters";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

interface TheaterSelectorProps {
  selectedTheaters: string[];
  onToggleTheater: (theaterName: string) => void;
  selectedCities: string[];
}

// Group theaters by chain/brand for better organization
const groupTheatersByChain = (theaters: Theater[]) => {
  const groups: { [key: string]: Theater[] } = {};
  
  theaters.forEach(theater => {
    let chain = "Others";
    if (theater.name.includes("PVR")) chain = "PVR Cinemas";
    else if (theater.name.includes("INOX")) chain = "INOX";
    else if (theater.name.includes("AMB")) chain = "AMB Cinemas";
    else if (theater.name.includes("Cinepolis")) chain = "Cinepolis";
    else if (theater.name.includes("Asian")) chain = "Asian Cinemas";
    else if (theater.name.includes("Prasads")) chain = "Prasads";
    else if (theater.name.includes("MovieMax")) chain = "MovieMax";
    else if (theater.name.includes("Miraj")) chain = "Miraj Cinemas";
    else if (theater.name.includes("Innovative")) chain = "Innovative";
    else if (theater.name.includes("Rajhans")) chain = "Rajhans Cinemas";
    
    if (!groups[chain]) groups[chain] = [];
    groups[chain].push(theater);
  });
  
  return groups;
};

export default function TheaterSelector({ selectedTheaters, onToggleTheater, selectedCities }: TheaterSelectorProps) {
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const [showAll, setShowAll] = useState(false);
  
  // Filter theaters based on selected cities
  const filteredTheaters = selectedCities.length > 0 
    ? THEATERS.filter(theater => selectedCities.includes(theater.city))
    : THEATERS;
  
  const theaterGroups = groupTheatersByChain(filteredTheaters);
  const totalSelected = selectedTheaters.length;
  const totalAvailable = filteredTheaters.length;
  
  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };
  
  const selectAllInGroup = (groupTheaters: typeof THEATERS) => {
    groupTheaters.forEach(theater => {
      if (!selectedTheaters.includes(theater.name)) {
        onToggleTheater(theater.name);
      }
    });
  };
  
  const deselectAllInGroup = (groupTheaters: typeof THEATERS) => {
    groupTheaters.forEach(theater => {
      if (selectedTheaters.includes(theater.name)) {
        onToggleTheater(theater.name);
      }
    });
  };
  
  const isGroupFullySelected = (groupTheaters: typeof THEATERS) => {
    return groupTheaters.every(theater => selectedTheaters.includes(theater.name));
  };
  
  const getGroupSelectedCount = (groupTheaters: typeof THEATERS) => {
    return groupTheaters.filter(theater => selectedTheaters.includes(theater.name)).length;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium">
          Select Theaters {totalSelected > 0 && (
            <span className="text-primary font-semibold">({totalSelected} selected)</span>
          )}
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="text-xs"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              Show Less
            </>
          ) : (
            <>              <ChevronDown className="w-3 h-3 mr-1" />              Show All ({totalAvailable})            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-3">
        {Object.entries(theaterGroups).map(([groupName, groupTheaters]) => {
          const isExpanded = expandedGroups[groupName] || showAll;
          const selectedCount = getGroupSelectedCount(groupTheaters);
          const isFullySelected = isGroupFullySelected(groupTheaters);
          
          return (
            <div key={groupName} className="border border-border rounded-lg overflow-hidden">
              {/* Group Header */}
              <div 
                className="bg-muted/30 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleGroup(groupName)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-sm">{groupName}</h3>
                    <span className="text-xs text-muted-foreground">
                      ({groupTheaters.length} theaters)
                    </span>
                    {selectedCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                        {selectedCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFullySelected) {
                          deselectAllInGroup(groupTheaters);
                        } else {
                          selectAllInGroup(groupTheaters);
                        }
                      }}
                    >
                      {isFullySelected ? 'Deselect All' : 'Select All'}
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Group Theaters */}
              {isExpanded && (
                <div className="p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {groupTheaters.map((theater) => (
                      <div
                        key={theater.name}
                        className={`theater-option border border-border rounded-md p-2 cursor-pointer transition-all hover:shadow-sm ${
                          selectedTheaters.includes(theater.name) 
                            ? 'selected bg-primary/10 border-primary' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => onToggleTheater(theater.name)}
                        data-testid={`theater-option-${theater.name.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{theater.name}</h4>
                            <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{theater.location}</span>
                            </div>
                          </div>
                          <div 
                            className={`w-4 h-4 border border-border rounded theater-checkbox flex-shrink-0 ml-2 ${
                              selectedTheaters.includes(theater.name) ? 'bg-primary border-primary' : 'bg-transparent'
                            }`}
                            data-testid={`theater-checkbox-${theater.name.replace(/\s+/g, '-').toLowerCase()}`}
                          >
                            {selectedTheaters.includes(theater.name) && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {totalSelected > 0 && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Selected {totalSelected} theater{totalSelected !== 1 ? 's' : ''}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6 px-2 text-primary hover:text-primary"
              onClick={() => {
                selectedTheaters.forEach(theaterName => {
                  onToggleTheater(theaterName);
                });
              }}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
