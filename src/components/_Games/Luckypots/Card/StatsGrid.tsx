import { Star, Users, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

import { type Luckypot } from "@/types/luckypot/luckypot";
import { tokenValue } from "@/utils/formatters";

const StatsGrid = ({ item }: { item: Luckypot }) => {
  const t = useTranslations("luckypot");
  return (
    <div className="px-4 sm:px-6 w-full mb-4">
      <div className="grid grid-cols-3 gap-2 w-full">
        {/* Participants */}
        <div className="flex flex-col items-center justify-center p-2 bg-black/20 rounded-lg border border-yellow-400/10">
          <Users className="w-4 h-4 text-yellow-400 mb-1" />
          <span className="text-lg font-bold text-white">
            {item.participants || 0}
          </span>
          <span className="text-[10px] text-gray-400">{t("stat.participants")}</span>
        </div>

        {/* Sponsors Count */}
        <div className="flex flex-col items-center justify-center p-2 bg-black/20 rounded-lg border border-yellow-400/10">
          <Star className="w-4 h-4 text-yellow-400 mb-1" />
          <span className="text-lg font-bold text-white">
            {tokenValue(item.sponsorAmount || 0, 18)}
          </span>
          <span className="text-[10px] text-gray-400">{t("stat.sponsors")}</span>
        </div>

        {/* Power Cost */}
        <div className="flex flex-col items-center justify-center p-2 bg-black/20 rounded-lg border border-yellow-400/10">
          <Zap className="w-4 h-4 text-yellow-400 mb-1" />
          <span className="text-lg font-bold text-white">
            {tokenValue(item.powerUnit || 0, 18)}
          </span>
          <span className="text-[10px] text-gray-400">{t("stat.power_cost")}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
