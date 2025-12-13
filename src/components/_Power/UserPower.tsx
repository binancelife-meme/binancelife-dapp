"use client";

import { Card, CardBody } from "@heroui/react";
import { Lock, Pickaxe, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatEther } from "viem";

import { AppConfig } from "@/config";
import { ChainId } from "@/constants/chains";
import { POWER_TOKENS } from "@/constants/tokens/defaultToken";
import { usePowerLockStatQuery, usePowerStakeStatQuery } from "@/hooks/data/usePowerQuery";
import usePowerBalance from "@/hooks/usePowerBalance";

const UserPower = ({ walletAddress }: { walletAddress: string }) => {
  const t = useTranslations('power')
  const chainId = AppConfig.chainId as ChainId;
  const powerToken = POWER_TOKENS[chainId]?.[0]; // 币安人生
  const { balance: powerBalance } = usePowerBalance(powerToken?.address, walletAddress as `0x${string}`);

  // Fetch stakeStat
  const { data: stakeStat } = usePowerStakeStatQuery({
    chainId: AppConfig.chainId,
    user: walletAddress as `0x${string}`,
    token: powerToken?.address as `0x${string}`,
  });

  // Fetch lockStat
  const { data: lockStat } = usePowerLockStatQuery({
    chainId: AppConfig.chainId,
    user: walletAddress as `0x${string}`,
    token: powerToken?.address as `0x${string}`,
  });

  const cards = [
    {
      title: t("cards.power_title"),
      value: formatEther(powerBalance) || "0",
      icon: Zap,
      color: "text-yellow-400",
      bg: "bg-yellow-400/20",
      suffix: ""
    },
    {
      title: t("cards.stake_title"),
      value: formatEther(stakeStat?.data?.staking || 0) || "0",
      icon: Pickaxe,
      color: "text-blue-400",
      bg: "bg-blue-400/20",
      suffix: t("cards.suffix_binancelife")
    },
    {
      title: t("cards.lock_title"),
      value: formatEther(lockStat?.data?.locking || 0) || "0",
      icon: Lock,
      color: "text-purple-400",
      bg: "bg-purple-400/20",
      suffix: t("cards.suffix_binancelife")
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="bg-white/5 border border-white/10">
          <CardBody className="flex flex-row items-center gap-4 p-4">
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400 font-medium">{card.title}</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold font-mono ${card.color}`}>
                  {Number(card.value).toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">{card.suffix}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default UserPower;
