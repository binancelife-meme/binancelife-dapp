import { useTranslations } from "next-intl";
import React from "react";
import { formatEther } from "viem";

import CryptoCurrency from "@/components/CryptoCurrency";
import { type Luckypot } from "@/types/luckypot/luckypot";
import { getLuckypotPrizeToken } from "@/utils/prizeUtils";
import { tokenValue } from "@/utils/formatters";

const PrizeInfo = ({ item }: { item: Luckypot }) => {
  const t = useTranslations("luckypot");
  const token = getLuckypotPrizeToken(item);
  const totalAmount = item.prizeAmount ? Number(item.prizeAmount) + Number(item.sponsorAmount) : Number(item.sponsorAmount);
  return (
    <div className="px-4 sm:px-6 w-full">
      <div className="flex items-center space-x-3 w-full border-b border-t border-white/10 py-4 mb-4">

        <div className="flex flex-col items-center justify-center w-full">
          <span className="text-xs text-gray-400">{t("prize.total_amount")}</span>
          <div className="flex items-center space-x-1">
            <CryptoCurrency
              className="text-xl sm:text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text"
              token={token.name!}
              value={tokenValue(totalAmount, 18)}
              display="USD"
              showSuffix={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeInfo;
