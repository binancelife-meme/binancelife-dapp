import { Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";
import { formatEther } from "viem";

import { AppConfig } from "@/config";
import { usePowerStatsQuery } from "@/hooks/data/usePowerQuery";

import { LeaderboardList } from "./LeaderboardList";

interface PowerLeaderboardProps {
  getRankIcon: (rank: number) => React.ReactNode;
  getRankColor: (rank: number) => string;
}

export const PowerLeaderboard = ({ getRankIcon, getRankColor }: PowerLeaderboardProps) => {
  const t = useTranslations("leaderboard");
  const { data, isLoading } = usePowerStatsQuery({
    chainId: AppConfig.chainId,
    orderBy: "balance",
    orderDirection: "desc",
    first: 20
  });

  const formattedData = data?.pages.flatMap((page: any) => page.data).filter((item: any) => item && item.balance > 0).map((item: any) => ({
    ...item,
    score: item?.balance ? Number(formatEther(BigInt(item.balance))).toLocaleString() : "0",
    unit: t("power")
  })) || [];

  if (isLoading) {
    return <div className="flex justify-center p-8"><Spinner color="warning" /></div>;
  }

  return (
    <LeaderboardList
      data={formattedData}
      type="power"
      getRankIcon={getRankIcon}
      getRankColor={getRankColor}
    />
  );
};
