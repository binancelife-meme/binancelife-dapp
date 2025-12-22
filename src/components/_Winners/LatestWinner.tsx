"use client";

import { Button, Spinner } from "@heroui/react";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";

import AppLink from "@/components/AppLink";
import { AppConfig } from "@/config/AppConfig";
import { useLuckypotQuery } from "@/hooks/data/useLuckypotQuery";
import { Luckypot, LuckypotStatus } from "@/types";
import { cn } from "@/utils/cn";

import WiningGroup from "../_Games/Luckypots/Card/WiningGroup";
import GridHeader from "../_Games/Luckypots/Grid/GridHeader";
import GridPrizeInfo from "../_Games/Luckypots/Grid/GridPrizeInfo";
import Caption from "../_Home/Caption";


const WinnerCard = ({ luckypot, t }: { luckypot: Luckypot, t: any }) => {

  const getCardGradient = () => {
    return "hover:bg-white/5 border-b border-white/5 last:border-b-0";
  };

  return (
    <div
      className={cn(
        `w-full transition-colors`,
        getCardGradient(),
      )}
      aria-hidden="true"
    >
      <div className="flex justify-between items-start gap-3 p-3 sm:p-4">
        <AppLink
          className="flex gap-3 sm:gap-4 flex-1 overflow-hidden border-0 text-foreground"
          href={`/luck/${luckypot.luckypotId}` || "/"}
        >
           {/* Left Section: Image and Basic Info */}
           <GridHeader item={luckypot} />
        </AppLink>

        {/* Right Section: Prize Info and Action Button */}
        <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0">
             <GridPrizeInfo item={luckypot} />
        </div>
      </div>

      {/* Winning Numbers at Bottom Right */}
      <div className="flex justify-end px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="w-full sm:w-auto overflow-hidden">
          {luckypot.prizeAmounts && luckypot.prizeAmounts.length > 0 ? (
            <div className="flex justify-end">
              <WiningGroup 
                item={luckypot} 
                t={t}
                className="justify-end"
              />
            </div>
          ) : (
            <div className="text-right text-gray-500 text-xs">
              {t("winner.no_winners")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LatestWinner = () => {
  const t = useTranslations();
  const { address: walletAddress } = useAccount();
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    queryError,
  } = useLuckypotQuery({
    chainIds: `${AppConfig.chainId}`, 
    status: LuckypotStatus.ENDED,
    orderBy: "endTime",
    orderDirection: "desc",
  }, walletAddress);

  const items = data?.pages
    .flatMap((it: any) => it.data)
    .filter((it: any) => !isEmpty(it));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <Caption
          title={t("games.list.latest_winner")}
          className={"p-0"}
        />
      </div>

      <div className="flex flex-col gap-4">
        {items?.map((luckypot: Luckypot) => (
          <div key={luckypot.id} className="bg-[#18181b] rounded-2xl border border-white/5 overflow-hidden">
            <WinnerCard 
              luckypot={luckypot} 
              t={t} 
            />
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Spinner size="sm" />
          </div>
        )}

        {!isLoading && hasNextPage && (
          <Button
            variant="flat"
            className="w-full bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl"
            isLoading={isFetchingNextPage}
            onPress={() => fetchNextPage()}
          >
            {t("winner.load_more")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LatestWinner;
