import { Chip, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";

import GridHeader from "@/components/_Games/Luckypots/Grid/GridHeader";
import AppLink from "@/components/AppLink";
import CountDown from "@/components/CountDown";
import NoData from "@/components/Error/NoData";
import ServerError from "@/components/Error/ServerError";
import LoadMore from "@/components/LoadMore";
import { AppConfig } from "@/config";
import { chains } from "@/constants/chains";
import { useUserLuckypotActivitiesQuery } from "@/hooks/data/useLuckypotQuery";
import type { LuckypotActivity } from "@/types/luckypot";

interface ParticipatedRecordsProps {
  userId: string;
}

const ParticipatedRecords = ({ userId }: ParticipatedRecordsProps) => {
  const t = useTranslations();
  const chain = chains.find((it) => it.id == AppConfig.chainId);
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    queryError,
    refetch,
  } = useUserLuckypotActivitiesQuery({
    chainId: AppConfig.chainId,
    user: userId,
    orderBy: "createdAt",
    orderDirection: "desc",
  });

  // @ts-ignore ignore
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
          items.map((item: LuckypotActivity) => (
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
                  <AppLink
                    className="text-primary text-sm"
                    href={`${chain?.blockExplorers?.default.url}/tx/${item.txHash}`}
                  >
                    <CountDown eventTime={item.createdAt} showOutdate={true} />
                    <Icon
                      className="text-primary-500"
                      icon="fluent:share-16-regular"
                      width={18}
                    />
                  </AppLink>
                  <Chip size="sm" radius="sm" className="text-xs mr-1">
                    {item.ticketCount == 1
                      ? item.currentSize
                      : `${item.currentSize - item.ticketCount + 1} ~ ${item.currentSize}`}
                  </Chip>
                </div>
              </div>
            </div>
          )
          )) : (
          <NoData visible={!error && !queryError} />
        ))}

      <LoadMore
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

export default ParticipatedRecords;
