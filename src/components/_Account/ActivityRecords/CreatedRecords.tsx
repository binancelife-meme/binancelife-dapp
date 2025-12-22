import { Spinner } from "@heroui/react";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";

import LuckypotGrid from "@/components/_Games/Luckypots/Grid";
import NoData from "@/components/Error/NoData";
import LoadMore from "@/components/LoadMore";
import { AppConfig } from "@/config/AppConfig";
import { useLuckypotQuery } from "@/hooks/data/useLuckypotQuery";


interface CreatedRecordsProps {
  userId: string;
}

const CreatedRecords = ({ userId }: CreatedRecordsProps) => {
  const t = useTranslations();

  const {
    data,
    error,
    queryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useLuckypotQuery({
    chainIds: `${AppConfig.chainId}`,
    funder: userId,
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });


  const items = data?.pages
    .flatMap((it: any) => it.data)
    .filter((it: any) => !isEmpty(it))
    .sort((a: any, b: any) => a.status - b.status);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner color="warning" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-3 w-full">

      {(!isLoading) &&

        (items?.length ? (
          items.map((x: any, index: number) => (
            <LuckypotGrid
              className="w-full snap-start"
              key={index}
              item={x}
              linkPrefix="luck"
            />
          ))
        ) : (
          <NoData visible={!error && !queryError} />
        ))}
      <LoadMore
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

export default CreatedRecords;
