"use client";

import { Skeleton } from "@heroui/react";

const LuckypotListLoading = ({ length }: { length?: number }) => {
  return (
    <>
      {Array.from({ length: length ?? 10 }, (_, index) => index + 1).map(
        (index: number) => (
          <div
            key={index}
            className={`space-y-5 border-divider border rounded-2xl `}
            aria-hidden="true"
          >
            <Skeleton className="rounded-xl">
              <div className="h-36 rounded-xl"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-full rounded-lg"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-full rounded-lg"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">
                <div className="h-3 w-full rounded-lg"></div>
              </Skeleton>
              <Skeleton className="w-full rounded-xl rounded-tl-none rounded-tr-none">
                <div className="h-12 w-full rounded-xl"></div>
              </Skeleton>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default LuckypotListLoading;
