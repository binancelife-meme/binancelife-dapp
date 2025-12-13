"use client";

import { Button } from "@heroui/react";
import { isEmpty } from "lodash";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";


import LuckypotCard from "@/components/_Games/Luckypots/Card";
import Filters from "@/components/_Games/Luckypots/Filters";
import Container from "@/components/Container";
import NoData from "@/components/Error/NoData";
import ServerError from "@/components/Error/ServerError";
import { useRefetchContext } from "@/context/RefetchContext";
import { useLuckypotQuery } from "@/hooks/data";
import { LuckypotQueryOpts } from "@/types/luckypot/luckypot.query";
import { paramsToObject } from "@/utils/queryParams";

import LuckypotListLoading from "./loading";

const LuckypotList = () => {
  const [filters, setFilters] = useState<Record<string, any>>({
    ...paramsToObject<LuckypotQueryOpts>(useSearchParams()),
    orderBy: "endTime",
    orderDirection: "asc",
  });

  const { address: walletAddress } = useAccount();

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    queryError,
  } = useLuckypotQuery(filters, walletAddress);

  const onFilter = (params: Record<string, any>) => {
    setFilters(params);
  };

  // Use effect to refetch when triggers.payment changes
  const { triggers } = useRefetchContext();
  useEffect(() => {
    if (triggers.payment !== undefined) {
      refetch();
    }
  }, [triggers.payment, refetch]);

  const items = data?.pages
    .flatMap((it: any) => it.data)
    .filter((it: any) => !isEmpty(it))
    .sort((a: any, b: any) => a.status - b.status);

  return (
    <>
      <Container>
        <Filters onChange={onFilter} />
        <ServerError
          className="p-5 pl-1"
          error={error?.message || queryError}
        />

        <div className="grid mt-3 w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {isLoading && <LuckypotListLoading />}
          {(!isLoading) &&
            !queryError &&
            (items?.length ? (
              items.map((x: any, index: number) => (
                <LuckypotCard
                  className="w-full snap-start"
                  key={index}
                  item={x}
                  linkPrefix="luck"
                />
              ))
            ) : (
              <NoData visible={!error && !queryError} />
            ))}
          {hasNextPage && (
            <div className="loadmore">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading more..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default LuckypotList;
