"use client";

import AppLink from "@/components/AppLink";
import { getLuckypotStatus } from "@/types/luckypot";
import { LuckypotStatus, type Luckypot } from "@/types/luckypot/luckypot";
import { cn } from "@/utils/cn";

import Header from "./Header";
import PrizeInfo from "./PrizeInfo";
import SponsorsList from "./SponsorsList";
import StateButton from "./StateButton";
import StatsGrid from "./StatsGrid";

const LuckypotCard = ({
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
    return "bg-[#18181b] border border-white/5 hover:border-[#F0B90B]/50 transition-all duration-300";
  };

  return (
    <div
      className={cn(
        `w-full flex flex-col rounded-2xl`,
        getCardGradient(),
        className,
        {
          "border-2 animate-rainbow-border": status === LuckypotStatus.DRAWING,
        }
      )}
      aria-hidden="true"
    >
      <AppLink
        className="w-full flex flex-col flex-grow p-0 m-0 border-0 text-foreground"
        href={`/${linkPrefix}/${item.luckypotId}` || "/"}
      >
        <Header item={item} />
        <PrizeInfo item={item} />
        <StatsGrid item={item} />
        <SponsorsList item={item} />
        {/* <WinningNumbers item={item} /> */}

        {/* Time Left */}
        {/* {status === LuckypotStatus.ONGOING && (
          <div className="px-4 sm:px-6 w-full">
            <div className="w-full flex items-center justify-center p-2 bg-black/20 rounded-lg border border-yellow-400/10">
              <CountDown
                className="text-sm font-medium text-white"
                extStyles={{
                  running: "text-yellow-400",
                  outdate: "text-gray-400",
                }}
                eventTime={item.endTime}
              />
            </div>
          </div>
        )} */}
      </AppLink>

      {/* Footer Action Button */}
      <div className="p-4 w-full mt-auto">
        <StateButton item={item} />
      </div>
    </div>
  );
};

export default LuckypotCard;
