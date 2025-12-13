
import JoinStateItem from "@/components/_Games/Luckypots/Card/JoinStateItem";
import Image from "@/components/AppImage";
import ChainIcon from "@/components/Chains/ChainIcon";
import CountDown from "@/components/CountDown";
import { AppConfig } from "@/config";
import type { Luckypot } from "@/types";
import { getLuckypotPrizeToken } from "@/utils/prizeUtils";

const Prizes = ({ item, joinState }: { item: Luckypot; joinState: any }) => {

  const token = getLuckypotPrizeToken(item);
  return (
    <>
      <div className="relative rounded-2xl overflow-hidden shadow-lg w-full aspect-square">
        <Image
          className="w-full h-full object-contain"
          src={token.image}
          alt={item?.title}
        />
        <JoinStateItem
          className="z-10 flex flex-row items-center absolute top-3 right-3 w-auto h-auto text-sm text-primary bg-white font-semibold px-2 rounded-xl"
          state={joinState}
        />
        <ChainIcon
          className="z-10 absolute top-3 left-3 w-auto h-auto"
          chainId={AppConfig.chainId}
          size={{ width: "36", height: "36" }}
        />
        <CountDown
          className="z-10 flex flex-row items-center absolute bottom-3 right-3 w-auto h-4 text-sm font-semibold text-center px-3 py-0 rounded-xl bg-warning text-foreground"
          extStyles={{
            running: "bg-green text-foreground",
            outdate: "bg-gray",
          }}
          eventTime={item?.endTime}
        />
      </div>
    </>
  );
};

export default Prizes;
