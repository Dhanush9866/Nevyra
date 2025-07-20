import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", 
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"
];

export const LocationSelector = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [pincode, setPincode] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock: In a real app, you'd reverse geocode these coordinates
          setSelectedLocation("New York");
          setIsDetecting(false);
        },
        (error) => {
          console.error("Error detecting location:", error);
          setIsDetecting(false);
        }
      );
    } else {
      setIsDetecting(false);
    }
  };

  return (
    <div className="bg-muted/30 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Delivery Location:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <span className="text-muted-foreground">or</span>
            
            <Input
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-32"
            />
            
            <Button
              variant="outline"
              onClick={detectLocation}
              disabled={isDetecting}
              className="flex items-center space-x-2"
            >
              <Navigation className="h-4 w-4" />
              <span>{isDetecting ? "Detecting..." : "Detect"}</span>
            </Button>
          </div>
        </div>
        
        {selectedLocation && (
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              Delivering to: <span className="font-medium text-foreground">{selectedLocation}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};