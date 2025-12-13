import { useMemo } from "react";

import { cn } from "@/utils/cn";

interface TicketNumbersProps {
  currentSize: number;
  ticketCount: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function TicketNumbers({
  currentSize,
  ticketCount,
  size = "md",
  className,
}: TicketNumbersProps) {
  const ticketRange = useMemo(() => {
    if (Number(ticketCount) === 1) {
      return `${currentSize}`;
    }
    return `${currentSize - ticketCount + 1} ~ ${currentSize}`;
  }, [currentSize, ticketCount]);

  const sizeClasses = {
    sm: "text-[10px] h-5 px-1.5 min-w-[3rem]",
    md: "text-xs h-6 px-2.5 min-w-[4rem]",
    lg: "text-sm h-7 px-3.5 min-w-[5rem]",
  };

  const holeSizeClasses = {
    sm: "w-1.5 h-1.5 -left-[3px]",
    md: "w-2 h-2 -left-1",
    lg: "w-2.5 h-2.5 -left-[5px]",
  };
  
  const rightHoleSizeClasses = {
    sm: "w-1.5 h-1.5 -right-[3px]",
    md: "w-2 h-2 -right-1",
    lg: "w-2.5 h-2.5 -right-[5px]",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center font-mono font-medium bg-primary/10 text-primary border border-primary/20 rounded-[2px] select-none shadow-sm",
        sizeClasses[size],
        className
      )}
    >
      {/* Left hole */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 rounded-full bg-background border-r border-primary/20 box-content",
          holeSizeClasses[size]
        )}
      />
      
      {/* Right hole */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 rounded-full bg-background border-l border-primary/20 box-content",
          rightHoleSizeClasses[size]
        )}
      />

      <span className="tracking-tight leading-none">{ticketRange}</span>
    </div>
  );
}
