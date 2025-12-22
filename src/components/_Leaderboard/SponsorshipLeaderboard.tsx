import { Spinner } from "@heroui/react";

import { AppConfig } from "@/config";
import { useLuckypotUserTokenStatsQuery } from "@/hooks/data/useLuckypotQuery";
import { tokenValue } from "@/utils/formatters";

import { LeaderboardList } from "./LeaderboardList";

interface SponsorshipLeaderboardProps {
  getRankIcon: (rank: number) => React.ReactNode;
  getRankColor: (rank: number) => string;
}

export const SponsorshipLeaderboard = ({ getRankIcon, getRankColor }: SponsorshipLeaderboardProps) => {
  const { data, isLoading } = useLuckypotUserTokenStatsQuery({
    chainId: AppConfig.chainId,
    orderBy: "sponsorAmount",
    orderDirection: "desc",
    first: 20
  });

  const formattedData = data?.pages.flatMap((page: any) => page.data).filter((item: any) => item && item.sponsorAmount > 0).map((item: any) => ({
    ...item,
    score: tokenValue(item.sponsorAmount || "0", 18).toLocaleString(),
    unit: item.token?.symbol || 'BNB'
  })) || [];

  if (isLoading) {
    return <div className="flex justify-center p-8"><Spinner color="warning" /></div>;
  }

  return (
    <LeaderboardList
      data={formattedData}
      type="sponsorship"
      getRankIcon={getRankIcon}
      getRankColor={getRankColor}
    />
  );
};
