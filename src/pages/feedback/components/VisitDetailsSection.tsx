
import React from "react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface VisitDetailsSectionProps {
  date: Date;
  setDate: (date: Date) => void;
  location: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  detectLocation?: () => void;
  detectedLocation?: string | null;
  locationLoading?: boolean;
  locationError?: string | null;
  permissionGranted?: boolean;
}

export const VisitDetailsSection: React.FC<VisitDetailsSectionProps> = ({
  date,
  setDate,
  location,
  handleInputChange,
  detectLocation,
  detectedLocation,
  locationLoading,
  locationError,
  permissionGranted
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date of Visit</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              <span>Location</span>
            </Label>
            {detectLocation && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={detectLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Detecting...</>
                ) : (
                  <><MapPin className="h-3 w-3 mr-1" /> Detect my location</>
                )}
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              id="location"
              name="location"
              placeholder={detectedLocation ? "Location detected automatically" : "Enter your location (e.g., Ikeja)"}
              value={location}
              onChange={handleInputChange}
              className={detectedLocation ? "border-green-500 focus-visible:ring-green-500" : ""}
            />
            
            {locationError && (
              <div className="text-xs text-red-500">
                {locationError}. Please enter your location manually.
              </div>
            )}
            
            {detectedLocation && permissionGranted && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                Using detected location: {detectedLocation}
              </Badge>
            )}
            
            <p className="text-xs text-muted-foreground">
              We'll use your detected location if you grant permission, or you can enter it manually.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
