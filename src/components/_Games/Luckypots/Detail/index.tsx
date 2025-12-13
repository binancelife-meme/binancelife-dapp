"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import Container from "@/components/Container";
import NoData from "@/components/Error/NoData";
import ServerError from "@/components/Error/ServerError";
import { AppConfig } from "@/config";
import { useRefetchContext } from "@/context/RefetchContext";
import { useLuckypotDetaiQuery, useWindowSize } from "@/hooks";


import LuckypotPayBtns from "../PayBtns";

import ClaimPrizes from "./ClaimPrizes";
import Description from "./Description";
import Events from "./Events";
import Infomation from "./Infomation";
import LuckypotDetailLoading from "./loading";
import Prizes from "./Prizes";
import SponsorshipPanel from "./SponsorshipPanel";
import StatusPane from "./StatusPane";



const LuckypotDetail = (props: {
  id: string;
  version?: string;
}) => {
  const { isMobile } = useWindowSize();
  const { address: walletAddress } = useAccount();
  const { data, isLoading, error, queryError, refetch } = useLuckypotDetaiQuery(
    {
      chainId: AppConfig.chainId,
      id: props.id,
    },
    walletAddress
  );

  // Use effect to refetch when triggers.payment changes
  const { triggers } = useRefetchContext();
  useEffect(() => {
    if (triggers.payment !== undefined) {
      refetch();
    }
  }, [triggers.payment, refetch]);

  // @ts-ignore ignore
  const item: any = data?.data;

  const [joinState, setJoinState] = useState(item?.joinState);

  /**
   * auto refresh data
   */
  useEffect(() => {
    if (item?.status > 0 && item?.status <= 2) {
      const timer = setInterval(refetch, 5000);
      return () => clearInterval(timer);
    }
  }, [item?.status, refetch]);

  return (
    <Container>
      <ServerError error={error?.message || queryError} />
      {isLoading && <LuckypotDetailLoading isMobile={isMobile} />}
      {!isLoading &&
        (item ? (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-8">
              {/* Left Column: Info & Content */}
              <div className="flex flex-col gap-6">
                {/* Header: Image + Basic Info */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-1/3 min-w-[240px]">
                    <Prizes
                      item={item}
                      joinState={item?.joinState || joinState}
                    />
                  </div>
                  <div className="flex-1">
                    <Infomation item={item} />
                  </div>
                </div>
                
                <Description item={item} />
                <Events item={item} />
              </div>

              {/* Right Column: Actions & Sponsorship */}
              <div className="flex flex-col gap-6 h-fit lg:sticky lg:top-24">
                <StatusPane item={item} />
                <ClaimPrizes item={item} />
                <LuckypotPayBtns item={item} setJoinState={setJoinState} />
                <SponsorshipPanel item={item} />
              </div>
            </div>

          </div>
        ) : (
          <NoData visible={!error && !queryError} />
        ))}
    </Container>
  );
};

export default LuckypotDetail;
