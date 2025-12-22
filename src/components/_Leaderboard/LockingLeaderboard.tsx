import { Spinner } from "@heroui/react";
import React from "react";

import { AppConfig } from "@/config";
import { usePowerLockStatsQuery } from "@/hooks/data/usePowerQuery";
import { tokenValue } from "@/utils/formatters";

import { LeaderboardList } from "./LeaderboardList";

interface LockingLeaderboardProps {
  getRankIcon: (rank: number) => React.ReactNode;
  getRankColor: (rank: number) => string;
}

export const LockingLeaderboard = ({ getRankIcon, getRankColor }: LockingLeaderboardProps) => {
  const { data, isLoading } = usePowerLockStatsQuery({
    chainId: AppConfig.chainId,
    orderBy: "locking",
    orderDirection: "desc",
    first: 20
  });

  const formattedData = data?.pages.flatMap((page: any) => page.data).filter((item: any) => item && item.locked > 0).map((item: any) => ({
    ...item,
    score: tokenValue(item.locking || "0", 18).toLocaleString(),
    unit: item.token?.symbol || ''
  })) || [];

  if (isLoading) {
    return <div className="flex justify-center p-8"><Spinner color="warning" /></div>;
  }

  return (
    <LeaderboardList
      data={formattedData}
      type="locking"
      getRankIcon={getRankIcon}
      getRankColor={getRankColor}
    />
  );
};
