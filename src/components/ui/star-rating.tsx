
import React from "react";
import { cn } from "@/lib/utils";
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  label?: string;
  readOnly?: boolean;
  showValue?: boolean;
}

export function StarRating({
  value,
  onChange,
  max = 5,
  size = "md",
  color = "text-yellow-400",
  label,
  readOnly = false,
  showValue = false,
}: StarRatingProps) {
  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index + 1);
    }
  };

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-sm font-medium">{label}</span>}
      <div className="flex items-center gap-2">
        <div className="flex">
          {Array.from({ length: max }).map((_, index) => {
            const isActive = index < Math.floor(value);
            const isHalf = !isActive && index < Math.ceil(value) && value % 1 !== 0;

            return (
              <span
                key={index}
                className={cn(
                  "cursor-pointer transition-transform hover:scale-110",
                  readOnly && "cursor-default hover:scale-100"
                )}
                onClick={() => handleClick(index)}
                role={!readOnly ? "button" : undefined}
                tabIndex={!readOnly ? 0 : undefined}
                onKeyDown={!readOnly ? (e) => e.key === "Enter" && handleClick(index) : undefined}
              >
                {isHalf ? (
                  <StarHalf
                    className={cn(sizeClasses[size], color)}
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                ) : (
                  <Star
                    className={cn(sizeClasses[size], isActive ? color : "text-gray-300")}
                    fill={isActive ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                )}
              </span>
            );
          })}
        </div>
        {showValue && (
          <span className="text-xs font-medium text-gray-600">
            {Math.round(value)} / {max}
          </span>
        )}
      </div>
    </div>
  );
}
