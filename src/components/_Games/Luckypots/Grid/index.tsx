"use client";

import AppLink from "@/components/AppLink";
import { getLuckypotStatus } from "@/types/luckypot";
import { LuckypotStatus, type Luckypot } from "@/types/luckypot/luckypot";
import { cn } from "@/utils/cn";

import GridHeader from "./GridHeader";
import GridPrizeInfo from "./GridPrizeInfo";
import GridStateButton from "./GridStateButton";

const LuckypotGrid = ({
  className,
  item,
  linkPrefix,
}: {
  className?: string;
  item: Luckypot;
  linkPrefix: string;
}) => {
  const status = getLuckypotStatus(item);

  const getCardGradient = () => {
    return "hover:bg-white/5 border-b border-white/5 last:border-b-0";
  };

  return (
    <div
      className={cn(
        `w-full transition-colors`,
        getCardGradient(),
        className,
        {
          "animate-rainbow-border": status === LuckypotStatus.DRAWING,
        }
      )}
      aria-hidden="true"
    >
      <div className="flex justify-between items-start gap-3 p-3 sm:p-4">
        <AppLink
          className="flex gap-3 sm:gap-4 flex-1 overflow-hidden border-0 text-foreground"
          href={`/${linkPrefix}/${item.luckypotId}` || "/"}
        >
           {/* Left Section: Image and Basic Info */}
           <GridHeader item={item} />
        </AppLink>

        {/* Right Section: Prize Info and Action Button */}
        <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0">
             <GridPrizeInfo item={item} />
             <GridStateButton item={item} />
        </div>
      </div>
      
    </div>
  );
};

export default LuckypotGrid;
