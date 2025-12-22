import { Spinner } from "@heroui/react";

import { AppConfig } from "@/config";
import { usePowerStakeStatsQuery } from "@/hooks/data/usePowerQuery";
import { tokenValue } from "@/utils/formatters";

import { LeaderboardList } from "./LeaderboardList";

interface StakingLeaderboardProps {
  getRankIcon: (rank: number) => React.ReactNode;
  getRankColor: (rank: number) => string;
}

export const StakingLeaderboard = ({ getRankIcon, getRankColor }: StakingLeaderboardProps) => {
  const { data, isLoading } = usePowerStakeStatsQuery({
    chainId: AppConfig.chainId,
    orderBy: "staking",
    orderDirection: "desc",
    first: 20
  });

  const formattedData = data?.pages.flatMap((page: any) => page.data).filter((item: any) => item && item.staking > 0).map((item: any) => ({
    ...item,
    score: tokenValue(item.staking || "0", 18).toLocaleString(),
    unit: item.token?.symbol || ''
  })) || [];

  if (isLoading) {
    return <div className="flex justify-center p-8"><Spinner color="warning" /></div>;
  }

  return (
    <LeaderboardList
      data={formattedData}
      type="staking"
      getRankIcon={getRankIcon}
      getRankColor={getRankColor}
    />
  );
};
