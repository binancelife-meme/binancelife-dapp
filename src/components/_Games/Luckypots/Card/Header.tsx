import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import AppImage from "@/components/AppImage";
import CountDown from "@/components/CountDown";
import CryptoCurrency from "@/components/CryptoCurrency";
import UserLink from "@/components/UserLink";
import { getLuckypotStatus } from "@/types/luckypot";
import { LuckypotStatus, type Luckypot } from "@/types/luckypot/luckypot";
import { getShortAddress } from "@/utils/address";
import { getLuckypotPrizeToken } from "@/utils/prizeUtils";

import JoinStateItem from "./JoinStateItem";

const Header = ({ item }: { item: Luckypot }) => {
    const t = useTranslations("luckypot.header");
    const status = getLuckypotStatus(item);
    const isEndingSoon = item.endTime * 1000 - Date.now() < 3600000;
    const token = getLuckypotPrizeToken(item);

    return (
        <>
            {/* Status Indicators */}
            <div className="absolute top-12 rounded-full right-3 z-20 flex space-x-2">
                {isEndingSoon && status === LuckypotStatus.ONGOING && (
                    <div className="flex items-center px-2 py-1 rounded-full bg-warning/20 text-warning text-xs border border-warning/50 animate-pulse">
                        <span className="mr-1">🔥</span>
                        {t("ending_soon")}
                    </div>
                )}
                <JoinStateItem
                    className="flex flex-row border border-white/20 bg-yellow-500/10 items-center w-auto h-auto text-xs px-2 py-1 rounded-full"
                    state={item.joinState}
                />
            </div>

            {/* Header Content */}
            <div className="flex px-4 items-center space-x-3 w-full">
                <div className="flex relative items-center justify-center w-20 h-20 rounded-full">
                    <AppImage
                        className={"flex w-full h-full object-cover"}
                        src={token.image}
                        alt={item.title}
                    />
                </div>
                <div className="flex flex-col items-start p-4 px-0 w-full pb-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors line-clamp-1">
                        <CryptoCurrency
                            token={token.name!}
                            value={token.value}
                            display="Crypto"
                            showSuffix={true}
                            endContent={<span className="text-xs text-gray-400 font-medium"> #{item.luckypotId}</span>}
                        />
                       
                    </h3>
                    {/* Funder Info */}
                    <div className="flex items-center space-x-1 mb-3 opacity-80 hover:opacity-100 transition-opacity z-10">
                        <span className="text-xs text-gray-400">{t("by")}</span>
                        <UserLink
                            className="flex-grow-0 ml-0 pl-0 items-center hover:underline"
                            textClassName="max-w-40 text-xs text-gray-300 font-medium"
                            size={{ width: 16, height: 16 }}
                            id={item.funder?.id}
                            name={item.funder?.name || getShortAddress(item.funder?.id)}
                            address={item.funder?.id}
                            avatar={item.funder?.avatar}
                            verify={item.funder?.verify}
                            showIcon={true}
                            showName={true}
                        />
                    </div>
                </div>
                <div className="absolute top-3 right-3 w-auto flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">

                    {item?.status == LuckypotStatus.ONGOING ? (
                        <>
                            <Clock className="w-4 h-4 text-green-400" />
                            <CountDown
                                className="text-ps text-white bg-transparent p-0"
                                extStyles={{
                                    running: "text-white",
                                    outdate: "text-gray-500",
                                }}
                                eventTime={item?.endTime}
                                showOutdate={true}
                            />
                        </>
                    ) : (
                        <span className="text-ps font-bold text-gray-500">{t("ended")}</span>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
