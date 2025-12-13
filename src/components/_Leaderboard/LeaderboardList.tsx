import { Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

import { getShortAddress } from "@/utils/address";

import UserLink from "../UserLink";


interface LeaderboardListProps {
  data: any[];
  type: 'winning' | 'sponsorship' | 'initiator' | 'locking' | 'staking' | 'power';
  getRankIcon: (rank: number) => React.ReactNode;
  getRankColor: (rank: number) => string;
}

export const LeaderboardList = ({ data, type, getRankIcon, getRankColor }: LeaderboardListProps) => {
  const t = useTranslations("leaderboard");
  const itmes = data || [];
  if (!itmes || itmes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed m-4">
        <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
          <Trophy className="w-8 h-8 opacity-20" />
        </div>
        <span className="text-sm font-medium">{t("no_data.title")}</span>
        <span className="text-xs text-gray-600 mt-1">{t("no_data.subtitle")}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {itmes.map((user: any, index: number) => {
        const rank = index + 1;
        return (
          <div
            key={user.id || index}
            className={`flex items-center justify-between p-3 hover:bg-white/5 border-b border-white/5 last:border-b-0 `}
          >
            <div className="flex items-center gap-3 sm:gap-4 flex-1 overflow-hidden">
              <div className="w-6 sm:w-8 flex justify-center flex-shrink-0">
                {getRankIcon(rank)}
              </div>

              <div className="relative flex-shrink-0">
                <UserLink
                  className={`justify-start min-h-[40px] items-center`}
                  textWrapperClassName="flex flex-col"
                  textClassName="items-center whitespace-nowrap text-ellipsis overflow-hidden max-w-32"
                  id={user.user?.id}
                  name={user.user?.name || getShortAddress(user.user?.id)}
                  address={user.user?.id}
                  avatar={user.user?.avatar}
                  showIcon={true}
                  showName={true}
                  size={{ width: 40, height: 40 }}
                ></UserLink>

                {rank <= 3 && (
                  <div className="absolute -bottom-0 -left-10 bg-yellow-400 text-black text-[10px] font-bold px-1.5 rounded-full border border-black">
                    {rank}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right flex-shrink-0 ml-2">
              <div className={`font-bold font-mono text-lg sm:text-xl ${rank <= 3 ? 'text-yellow-400' : 'text-white'}`}>
                {user.score}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500">
                {user.unit}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
