import { Clock } from "lucide-react";
import React from "react";

import AppImage from "@/components/AppImage";
import CountDown from "@/components/CountDown";
import CryptoCurrency from "@/components/CryptoCurrency";
import { getLuckypotStatus } from "@/types/luckypot";
import { LuckypotStatus, type Luckypot } from "@/types/luckypot/luckypot";
import { getLuckypotPrizeToken } from "@/utils/prizeUtils";

import JoinStateItem from "../Card/JoinStateItem";

import GridStats from "./GridStats";


const GridHeader = ({ item }: { item: Luckypot }) => {
    const status = getLuckypotStatus(item);
    const isEndingSoon = item.endTime * 1000 - Date.now() < 3600000;
    const token = getLuckypotPrizeToken(item);

    return (
        <>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/10 relative">
                <AppImage
                    className={"w-full h-full object-cover"}
                    src={token.image}
                    alt={item.title}
                />
                {isEndingSoon && status === LuckypotStatus.ONGOING && (
                    <div className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full animate-pulse border border-white" />
                )}
            </div>
            <div className="flex-1">

                <h4 className="font-medium text-white mb-1 truncate text-sm sm:text-base flex items-center gap-2">
                    <CryptoCurrency
                        token={token.name!}
                        value={token.value}
                        display="Crypto"
                        showSuffix={true}
                        endContent={<span className="text-xs text-gray-400 font-medium"> #{item.luckypotId}</span>}
                    />
                    <JoinStateItem
                        className="flex flex-row items-center w-auto h-auto text-[10px] px-1 py-0 rounded-full border border-white/10 ml-auto sm:ml-2"
                        state={item.joinState}
                    />
                </h4>
                <div className="flex flex-row gap-2">
                    <GridStats item={item} />
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                            {item?.status == LuckypotStatus.ONGOING && (
                                <>
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <CountDown
                                        className="bg-transparent p-0"
                                        extStyles={{
                                            running: "text-gray-300",
                                            outdate: "text-gray-500",
                                        }}
                                        eventTime={item?.endTime}
                                        showOutdate={true}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default GridHeader;
