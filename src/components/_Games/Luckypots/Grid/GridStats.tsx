import { User, Users, Zap, Calendar, Coins } from "lucide-react";
import { useTranslations } from "next-intl";

import UserLink from "@/components/UserLink";
import { type Luckypot } from "@/types/luckypot/luckypot";
import { getShortAddress } from "@/utils/address";
// import { formatTimestamp } from "@/utils/date";
import { tokenValue } from "@/utils/formatters";
import { getLuckypotPrizeToken } from "@/utils/prizeUtils";

const GridStats = ({ item }: { item: Luckypot }) => {
    const t = useTranslations("luckypot");
    const token = getLuckypotPrizeToken(item);

    return (
        <div className="flex flex-row items-center gap-4 text-xs text-gray-400 shrink-0 mr-4">
            {/* Funder */}
            <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-gray-500" />
                <UserLink
                    className="flex-grow-0 ml-0 pl-0 items-center hover:underline"
                    textClassName="max-w-20 text-xs text-gray-400 font-medium"
                    size={{ width: 12, height: 12 }}
                    id={item.funder?.id}
                    name={item.funder?.name || getShortAddress(item.funder?.id)}
                    address={item.funder?.id}
                    avatar={item.funder?.avatar}
                    verify={item.funder?.verify}
                    showIcon={true}
                    showName={true}
                />
            </div>

            {/* Participants */}
            <div className="flex items-center gap-1" title={t("stat.participants")}>
                <Users className="w-3 h-3 text-gray-500" />
                <span>{item.participants || 0}</span>
            </div>

            {/* Sponsor Amount */}
            <div className="flex items-center gap-1" title={t("stat.sponsors")}>
                <Coins className="w-3 h-3 text-gray-500" />
                <span>
                    {tokenValue(item.sponsorAmount || 0, 18)}
                </span>
            </div>

            {/* Power Cost */}
            <div className="flex items-center gap-1" title={t("stat.power_cost")}>
                <Zap className="w-3 h-3 text-gray-500" />
                <span>
                    {tokenValue(item.powerUnit || 0, 18)}
                </span>
            </div>

            {/* Event Time (Start - End) */}
            <div className="flex items-center gap-1 hidden md:flex" title="Start - End Time">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span className="whitespace-nowrap">
                    {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}
                </span>
            </div>
        </div>
    );
};

export default GridStats;
