import { Spinner } from "@heroui/react";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { formatEther } from "viem";

import GridHeader from "@/components/_Games/Luckypots/Grid/GridHeader";
import AppLink from "@/components/AppLink";
import NoData from "@/components/Error/NoData";
import ServerError from "@/components/Error/ServerError";
import LoadMore from "@/components/LoadMore";
import { AppConfig } from "@/config";
import { useUserLuckypotSponsorsAggQuery } from "@/hooks";
import { LuckypotSponsor } from "@/types";

interface SponsoredRecordsProps {
  userId: string;
}

const SponsoredRecords = ({ userId }: SponsoredRecordsProps) => {
  const t = useTranslations();

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    queryError,
  } = useUserLuckypotSponsorsAggQuery({
    chainId: AppConfig.chainId,
    user: userId,
    orderBy: "id",
    orderDirection: "desc",
  });

  const items = data?.pages
    .flatMap((it: any) => it.data)
    .filter((it: any) => !isEmpty(it));

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner color="warning" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      <ServerError error={error?.message || queryError} />
      {!isLoading &&
        (items?.length ? (
          items.map((item: LuckypotSponsor) => (
            <div key={item.id} className="p-3 sm:p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0">
              <div className="flex justify-between items-start gap-3">
                <AppLink
                  className="flex gap-3 sm:gap-4 flex-1 overflow-hidden border-0 text-foreground"
                  href={`/luck/${item.luckypot.luckypotId}` || "/"}
                >
                  {/* Left Section: Image and Basic Info */}
                  <GridHeader item={item.luckypot} />
                </AppLink>

                {/* Right Section: Ticket Info and Action Button */}
                <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0">
                  <span className="text-sm font-bold text-yellow-400">
                    +{formatEther(BigInt(item.sponsorAmount))} {item.luckypot.prizeToken?.symbol}
                  </span>
                </div>
              </div>
            </div>
          )
          )) : (
          <NoData visible={!error && !queryError} />))}

      <LoadMore
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

export default SponsoredRecords;
