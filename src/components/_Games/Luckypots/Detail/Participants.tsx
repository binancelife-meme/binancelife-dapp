import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import NoData from "@/components/Error/NoData";
import ServerError from "@/components/Error/ServerError";
import LoadMore from "@/components/LoadMore";
import UserLink from "@/components/UserLink";
import { AppConfig } from "@/config/AppConfig";
import { useRefetchContext } from "@/context/RefetchContext";
import { useLuckypotParticipantsQuery } from "@/hooks/data";
import type { Luckypot, LuckypotDetailListQueryOpts } from "@/types";
import type { LuckypotParticipant } from "@/types/luckypot/luckypot.participant";
import { getShortAddress } from "@/utils/address";
import { cn } from "@/utils/cn";

import { SkeletonEventItems } from "./loading";

const Participants = ({ item }: { item: Luckypot }) => {
  const t = useTranslations("luckypot.detail.participants");
  const [filters] = useState<LuckypotDetailListQueryOpts>({
    id: `${item.id}`,
    chainId: AppConfig.chainId,
    orderBy: "totalTickets",
    orderDirection: "desc",
  });
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    queryError,
  } = useLuckypotParticipantsQuery(filters);

  // Use effect to refetch when triggers.payment changes
  const { triggers } = useRefetchContext();
  useEffect(() => {
    if (triggers.payment !== undefined) {
      refetch();
    }
  }, [triggers.payment, refetch]);

  // @ts-ignore ignore
  const items = data?.pages
    .flatMap((it: any) => it.data)
    .filter((it: any) => !isEmpty(it));

  return (
    <div className="flex flex-col max-h-[400px] overflow-y-auto">
      <ServerError error={error?.message || queryError} />
      {isLoading && SkeletonEventItems}
      {!isLoading &&
        (items?.length ? (
          items.map((x: LuckypotParticipant, index: number) => (
            <div
              key={index}
              className={cn(
                "flex items-center relative justify-between border-b border-white/5 h-20 py-2 px-2 hover:bg-white/5 transition-colors",
                [{ "border-none": index == items.length - 1 }]
              )}
            >
              <UserLink
                className="justify-start min-h-[48px]"
                textWrapperClassName="flex flex-row ml-2"
                textClassName="whitespace-nowrap text-ellipsis overflow-hidden max-w-32"
                id={x.user?.id}
                name={x.user?.name || getShortAddress(x.user?.id)}
                address={x.user?.id}
                avatar={x.user?.avatar}
                showIcon={true}
                showName={true}
                size={{ width: 48, height: 48 }}
              ></UserLink>
              <div className="text-primary">
                <div>{x.ticketCount} {t('tickets')}</div>
              </div>
              {/* {item.winners?.find((it: any) => it && it.id == x.user.id) ? (
                <IconReward className="z-10 absolute top-2 right-2" />
              ) : (
                <></>
              )} */}
            </div>
          ))
        ) : (
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

export default Participants;
