import { useTranslations } from "next-intl";
import React from "react";
import { formatEther } from "viem";

import CryptoCurrency from "@/components/CryptoCurrency";
import { type Luckypot } from "@/types/luckypot/luckypot";
import { getLuckypotPrizeToken } from "@/utils/prizeUtils";

const GridPrizeInfo = ({ item }: { item: Luckypot }) => {
  const t = useTranslations("luckypot");
  const token = getLuckypotPrizeToken(item);
  const totalAmount = item.prizeAmount ? BigInt(item.prizeAmount) + BigInt(item.sponsorAmount) : BigInt(item.sponsorAmount);
  
  return (
    <div className="font-bold text-yellow-400 text-sm sm:text-base">
        <CryptoCurrency
            className="text-yellow-400"
            token={token.name!}
            value={formatEther(totalAmount)}
            display="USD"
            showSuffix={true}
        />
    </div>
  );
};

export default GridPrizeInfo;
