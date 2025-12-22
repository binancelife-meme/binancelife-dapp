import { Spinner } from "@heroui/react";
import React from "react";

import { AppConfig } from "@/config";
import { useLuckypotUserTokenStatsQuery } from "@/hooks/data/useLuckypotQuery";
import { tokenValue } from "@/utils/formatters";

import { LeaderboardList } from "./LeaderboardList";

interface WinningLeaderboardProps {
  getRankIcon: (rank: number) => React.ReactNode;
  getRankColor: (rank: number) => string;
}

export const WinningLeaderboard = ({ getRankIcon, getRankColor }: WinningLeaderboardProps) => {
  const { data, isLoading } = useLuckypotUserTokenStatsQuery({
    chainId: AppConfig.chainId,
    orderBy: "winAmount",
    orderDirection: "desc",
    first: 20
  });

  const formattedData = data?.pages.flatMap((page: any) => page.data).filter((item: any) => item && item.winAmount > 0).map((item: any) => ({
    ...item,
    score: tokenValue(item.winAmount || "0", 18).toLocaleString(),
    unit: item.token?.symbol || 'BNB'
  })) || [];

  if (isLoading) {
    return <div className="flex justify-center p-8"><Spinner color="warning" /></div>;
  }

  return (
    <LeaderboardList
      data={formattedData}
      type="winning"
      getRankIcon={getRankIcon}
      getRankColor={getRankColor}
    />
  );
};
