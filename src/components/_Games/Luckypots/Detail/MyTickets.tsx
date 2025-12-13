import { Icon } from "@iconify/react";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import AppLink from "@/components/AppLink";
import CountDown from "@/components/CountDown";
import NoData from "@/components/Error/NoData";
import ServerError from "@/components/Error/ServerError";
import LoadMore from "@/components/LoadMore";
import UserLink from "@/components/UserLink";
import WalletConnector from "@/components/WalletConnector";
import { AppConfig } from "@/config";
import { chains } from "@/constants/chains";
import { useRefetchContext } from "@/context/RefetchContext";
import { useLuckypotTicketsQuery } from "@/hooks/data";
import type {
  Luckypot,
  LuckypotDetailListQueryOpts,
  LuckypotTicket,
} from "@/types/luckypot";
import { getShortAddress } from "@/utils/address";
import { cn } from "@/utils/cn";

import { SkeletonEventItems } from "./loading";
import TicketNumbers from "./TicketNumbers";

const MyTickets = ({ item }: { item: Luckypot }) => {
  const t = useTranslations("luckypot.detail.my_tickets");
  const { isConnected, address: wallet } = useAccount();

  const chain = chains.find((it) => it.id == AppConfig.chainId);
  const [filters] = useState<LuckypotDetailListQueryOpts>({
    id: `${item.id}`,
    chainId: AppConfig.chainId,
    wallet: wallet,
    orderBy: "createdAt",
    orderDirection: "desc",
  });
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    queryError,
    refetch,
  } = useLuckypotTicketsQuery(filters);

  // Use effect to refetch when triggers.payment changes
  const { triggers } = useRefetchContext();
  useEffect(() => {
    if (triggers.payment !== undefined) {
      refetch();
    }
  }, [triggers.payment, refetch]);

  const items = data?.pages
    .flatMap((it: any) => it.data.tickets)
    .filter((it: any) => !isEmpty(it));
  const participant = data?.pages[0].data.participant;

  // Need wallet connected
  if (!isConnected) {
    return <WalletConnector />;
  }

  return (
    <div className="flex flex-col max-h-[400px] overflow-y-auto">
      <ServerError error={error?.message || queryError} />
      {isLoading && SkeletonEventItems}
      {!isLoading && participant && (
        <div
          className={cn(
            "flex flex-col items-center justify-between border-b border-white/5 h-20 py-2 px-2"
          )}
        >
          <div>
            {t('ticket_counts')} <span>{participant.ticketCount}</span>
          </div>
          <div>
            {t('your_chance')}{" "}
            <span>
              {((participant.ticketCount / item.totalTickets) * 100).toFixed(2)}
              %
            </span>
          </div>
        </div>
      )}
      {!isLoading &&
        (items?.length ? (
          items.map((x: LuckypotTicket, index: number) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between border-b border-white/5 h-20 py-2 px-2 hover:bg-white/5 transition-colors",
                [{ "border-none": index == items.length - 1 }]
              )}
            >
              <UserLink
                className="justify-start min-h-[48px]"
                textWrapperClassName="flex flex-col"
                textClassName="whitespace-nowrap text-ellipsis overflow-hidden max-w-32"
                id={x.user?.id}
                name={x.user?.name || getShortAddress(x.user?.id)}
                address={x.user?.id}
                avatar={x.user?.avatar}
                showIcon={true}
                showName={true}
                size={{ width: 48, height: 48 }}
              >
                <span className="flex flex-row gap-2 text-primary text-sm">
                  {x.ticketCount} {t('tickets')}
                </span>
              </UserLink>
              <div className="flex flex-col items-end gap-1">
                <AppLink
                  className="text-primary text-sm"
                  href={`${chain?.blockExplorers?.default.url}/tx/${x.txHash}`}
                >
                  <CountDown eventTime={x.createdAt} showOutdate={true} />
                  <Icon
                    className="text-primary-500"
                    icon="fluent:share-16-regular"
                    width={18}
                  />
                </AppLink>

                <TicketNumbers
                  currentSize={x.currentSize}
                  ticketCount={x.ticketCount}
                />
              </div>
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

export default MyTickets;
