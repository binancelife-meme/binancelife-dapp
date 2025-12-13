import { isEmpty } from "lodash";
import { Coins, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

import UserLink from "@/components/UserLink";
import { AppConfig } from "@/config";
import { useRefetchContext } from "@/context/RefetchContext";
import { useLuckypotSponsorsQuery } from "@/hooks";
import { LuckypotDetailListQueryOpts, type Luckypot } from "@/types";
import { getShortAddress } from "@/utils/address";
import { cn } from "@/utils/cn";

const SponsorsList = ({ item, className }: { item: Luckypot; className?: string }) => {
  const t = useTranslations("luckypot");
  const [filters] = useState<LuckypotDetailListQueryOpts>({
    id: `${item.id}`,
    chainId: AppConfig.chainId,
    orderBy: "sponsorAmount",
    orderDirection: "desc",
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

  return (
    <div className={cn("flex flex-col gap-4 bg-[#18181b] border border-white/5 rounded-2xl p-4 sm:p-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span>{t("sponsor.list")}</span>
        </h3>
        <div className="flex items-center gap-1 text-sm text-yellow-400">
          <Coins className="w-4 h-4" />
          <span className="font-bold">{formatEther(BigInt(item.sponsorAmount || 0))} {item.prizeToken?.symbol}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items && items.map((sponsor: any, index: number) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-all",
              index < 3 ? "bg-[#27272a] border border-[#F0B90B]/30" : "bg-[#27272a] border border-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold",
                  index === 0 ? "bg-yellow-400 text-black" :
                    index === 1 ? "bg-gray-300 text-black" :
                      index === 2 ? "bg-orange-600 text-white" : "bg-white/10 text-gray-400"
                )}
              >
                {index + 1}
              </div>
              <div className="flex items-center gap-2">
                <UserLink
                  className="justify-start min-h-[32px] items-center"
                  textWrapperClassName="flex flex-col"
                  textClassName="whitespace-nowrap text-ellipsis overflow-hidden max-w-32"
                  id={sponsor.user?.id}
                  name={sponsor.user?.name || getShortAddress(sponsor.user?.id)}
                  address={sponsor.user?.id}
                  avatar={sponsor.user?.avatar}
                  showIcon={true}
                  showName={true}
                  size={{ width: 32, height: 32 }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-yellow-400">
              +{formatEther(BigInt(sponsor.sponsorAmount))} {item.prizeToken?.symbol}
            </span>
          </div>
        ))}
        {(!items || items.length === 0) && (
          <div className="text-center py-8 text-gray-500 text-sm">
            {t("sponsor.no_sponsors_yet")}
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorsList;
