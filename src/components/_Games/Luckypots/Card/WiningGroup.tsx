

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

import UserLink from "@/components/UserLink";
import { Luckypot } from "@/types";
import { cn } from "@/utils/cn";
import { tokenValue } from "@/utils/formatters";
import { getLuckypotPrizeToken } from "@/utils/prizeUtils";

import PrizeNumber from "./PrizeNumber";

interface WiningGroupProps {
  item: Luckypot;
  t: any;
  className?: string;
  defaultExpandedIndex?: number;
  size?: "sm" | "md" | "lg";
}

const WiningGroup = ({
  item,
  t,
  className,
  defaultExpandedIndex = 0,
  size = "md"
}: WiningGroupProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(defaultExpandedIndex);
  
  const token = getLuckypotPrizeToken(item);
  const prizeAmounts = item.prizeAmounts || [];
  const winners = item.winners || [];
  const drawNumbers = item.drawNumbers || [];

  if (!drawNumbers || drawNumbers.length === 0) return null;

  return (
    <div className={cn("flex w-full overflow-hidden items-center", className)}>
      <div className="flex w-full justify-end gap-2 relative h-[42px]">
      {drawNumbers.map((num, idx) => {
        if (idx > 3) return null; // Only show top 4 prizes
        
        const amount = Number(prizeAmounts[idx] || 0n);
        const winner = winners[idx];
        const prizeValue = tokenValue(amount, 18).toLocaleString();
        const isExpanded = expandedIndex === idx;
        
        return (
          <motion.div 
            key={idx}
            layout
            initial={false}
            animate={{
              width: isExpanded ? "auto" : "auto",
              flexGrow: isExpanded ? 1 : 0,
              flexShrink: isExpanded ? 0 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5
            }}
            className={cn(
              "flex items-center cursor-pointer rounded-lg overflow-hidden relative group shrink-0",
              isExpanded 
                ? "bg-gray/10 border border-white/10 z-10" 
                : "hover:opacity-100 hover:z-20 bg-black/20 border border-transparent"
            )}
            style={{
              // Use negative margin to create the stacked effect
              marginLeft: idx === 0 ? 0 : isExpanded ? 8 : -12,
              zIndex: isExpanded ? 30 : 20 - idx,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedIndex(isExpanded ? null : idx);
            }}
          >
            <div className={cn(
              "flex items-center h-full transition-all duration-300",
              isExpanded ? "px-1 pr-3 py-1" : "p-0"
            )}>
              {/* Icon & Number Badge */}
              <motion.div layout="position" className="shrink-0 relative z-10">
                <PrizeNumber 
                  level={idx} 
                  number={num} 
                  size={size}
                  className={cn(
                    "shrink-0 transition-shadow duration-300", 
                    !isExpanded && "shadow-lg shadow-black/50"
                  )} 
                />
              </motion.div>

              {/* Expandable Details */}
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ 
                      opacity: 1, 
                      width: "auto",
                      transition: { duration: 0.2, delay: 0.1 }
                    }}
                    exit={{ 
                      opacity: 0, 
                      width: 0,
                      transition: { duration: 0.1 } 
                    }}
                    className="flex items-center gap-3 ml-2 overflow-hidden whitespace-nowrap"
                  >
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <div className="flex items-baseline gap-0.5">
                        <span className="font-mono font-bold text-white text-xs">{prizeValue}</span>
                        <span className="text-[8px] text-gray-500">{token.name}</span>
                      </div>
                    </div>

                    <div className="w-px h-6 bg-white/10 shrink-0" />

                    <div className="shrink-0">
                      {winner ? (
                        <UserLink
                          textClassName="text-gray-300 font-medium text-[10px]"
                          id={winner.id}
                          address={winner.id}
                          name={winner.name}
                          avatar={winner.avatar}
                          showIcon={true}
                          showName={true}
                          size={{ width: 14, height: 14 }}
                        />
                      ) : (
                        <span className="text-gray-600 italic text-[9px]">{t("winner.unclaimed")}</span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
      </div>
    </div>
  );
};

export default WiningGroup;
