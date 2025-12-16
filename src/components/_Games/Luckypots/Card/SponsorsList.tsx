import { isEmpty } from "lodash";
import { Coins } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

import UserLink from "@/components/UserLink";
import { AppConfig } from "@/config";
import { useRefetchContext } from "@/context/RefetchContext";
import { useLuckypotSponsorsQuery } from "@/hooks";
import { LuckypotDetailListQueryOpts } from "@/types";
import { type Luckypot } from "@/types/luckypot/luckypot";
import { getShortAddress } from "@/utils/address";

const SponsorsList = ({ item }: { item: Luckypot }) => {
  const t = useTranslations("luckypot");
  const [filters] = useState<LuckypotDetailListQueryOpts>({
    id: `${item.id}`,
    chainId: AppConfig.chainId,
    orderBy: "sponsorAmount",
    orderDirection: "desc",
    first: 3,
  });
  const {
    data,
    refetch,
  } = useLuckypotSponsorsQuery(filters);

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

  // if (!items || items.length === 0) {
  //   return null;
  // }

  const symbol = item.prizeToken?.symbol || "BNB";

  return (
    <div className="px-4 sm:px-6 w-full mb-4">
      <div className="w-full flex flex-col p-3 bg-black/20 rounded-lg border border-yellow-400/10 gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">{t("sponsor.top3")}</span>
          </div>
          <div className="text-right flex items-center space-x-1">
            <span className="text-xs text-gray-400">{t("sponsor.total")}</span>
            <Coins className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400">
              {item.sponsorAmount ? `${formatEther(BigInt(item.sponsorAmount))} ${symbol}` : `0 ${symbol}`}
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-1 w-full min-h-12">
          {items && items.length > 0 && items.slice(0, 3).map((sponsor: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs text-gray-300 w-full px-1"
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-black ${i === 0
                    ? "bg-yellow-400"
                    : i === 1
                      ? "bg-gray-300"
                      : "bg-orange-600"
                    }`}
                >
                  {i + 1}
                </div>
                <div className="flex items-center gap-1">
                  <UserLink
                    className="justify-start min-h-[16px] items-center"
                    textWrapperClassName="flex flex-col"
                    textClassName="whitespace-nowrap text-ellipsis overflow-hidden max-w-32"
                    id={sponsor.user?.id}
                    name={sponsor.user?.name || getShortAddress(sponsor.user?.id)}
                    address={sponsor.user?.id}
                    avatar={sponsor.user?.avatar}
                    showIcon={true}
                    showName={true}
                    size={{ width: 16, height: 16 }}
                  />
                </div>
              </div>
              <span className="text-yellow-400/80">{formatEther(BigInt(sponsor.sponsorAmount))} {symbol}</span>
            </div>
          ))}
          {(!items || items.length === 0) && (
            <div className="text-center py-4 text-gray-500 text-xs">
              {t("sponsor.no_sponsors_yet")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorsList;
