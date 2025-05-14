
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ size = "md", className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          "font-bold relative flex items-center", 
          size === "sm" && "text-xl",
          size === "md" && "text-2xl",
          size === "lg" && "text-4xl",
        )}
      >
        <span className="text-indomie-red font-bold">Tolaram</span>
        <span className="text-indomie-dark ml-1 font-medium">Feedback</span>
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indomie-red via-blue-400 to-indomie-red"></div>
      </div>
    </div>
  );
}
