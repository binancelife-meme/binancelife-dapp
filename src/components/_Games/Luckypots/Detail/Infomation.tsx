import { Clock, Coins, Trophy, Users, Zap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatEther } from "viem";

import AppLink from "@/components/AppLink";
import CountDown from "@/components/CountDown";
import CryptoCurrency from "@/components/CryptoCurrency";
import UserLink from "@/components/UserLink";
import { AppConfig } from "@/config";
import { chains } from "@/constants/chains";
import { LuckypotStatus, type Luckypot } from "@/types";
import { tokenValue } from "@/utils/formatters";
import { getLuckypotPrizeToken } from "@/utils/prizeUtils";


const Infomation = ({ item }: { item: Luckypot }) => {
  const token = getLuckypotPrizeToken(item);
  const chain = chains.find((it) => it.id == AppConfig.chainId);
  const prizeUrl = item.prizeToken ? `${chain?.blockExplorers?.default.url}/address/${item.prizeToken.address}` : "";
  const powerUnit = formatEther(BigInt(item?.powerUnit || "0"));
  const t = useTranslations("luckypot.infomation");

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Creator */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between gap-2">
          <AppLink className="text-3xl font-bold text-foreground" href={prizeUrl}>
            <CryptoCurrency
              token={token.name!}
              value={token.value}
              display="Crypto"
              showSuffix={true}
              endContent={<span className="text-xs text-gray-400 font-medium"> #{item.luckypotId}</span>}
            />
          </AppLink>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <Clock className="w-4 h-4 text-green-400" />
            {item?.status == LuckypotStatus.ONGOING ? (
              <CountDown
                className="text-lg font-bold text-white bg-transparent p-0"
                extStyles={{
                  running: "text-white",
                  outdate: "text-gray-500",
                }}
                eventTime={item?.endTime}
                showOutdate={true}
              />
            ) : (
              <span className="text-lg font-bold text-gray-500">{t('ended')}</span>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center justify-start gap-3 text-sm text-gray-400">
          <span className="text-pm">{t('creator')}</span>
          <UserLink
            className="flex-grow-0 ml-0 pl-0 items-center"
            textClassName="max-w-40 text-pm text-primary"
            id={item.funder?.id}
            name={item.funder?.name}
            address={item.funder?.id}
            avatar={item.funder?.avatar}
            verify={item.funder?.verify}
            showIcon={true}
            showName={true}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-[#18181b] rounded-2xl border border-white/5">
        {/* Prize Pool */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{t('pool_value')}</span>
          </div>
          <CryptoCurrency
            className="text-2xl font-bold text-yellow-400"
            token={token.name!}
            value={token.value}
            display="USD"
            showSuffix={true}
          />
        </div>

        {/* Participants */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Users className="w-4 h-4 text-blue-400" />
            <span>{t('participants')}</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {item.participants || 0} <span className="text-sm text-gray-500 font-normal">{t('people')}</span>
          </div>
        </div>

        {/* Sponsorship Total */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Trophy className="w-4 h-4 text-orange-400" />
            <span>{t('total_sponsored')}</span>
          </div>
          <div className="text-xl font-bold text-white">
            <CryptoCurrency
              token={token.name!}
              value={tokenValue(Number(item.sponsorAmount || 0), 18).toFixed(2)}
              display="Crypto"
              showSuffix={true}
            />
          </div>
        </div>

        {/* Power Cost */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>{t('power_cost')}</span>
          </div>
          <div className="text-xl font-bold text-white">
            {powerUnit || 0} <span className="text-sm text-gray-500 font-normal">{t('per_ticket')}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Infomation;
