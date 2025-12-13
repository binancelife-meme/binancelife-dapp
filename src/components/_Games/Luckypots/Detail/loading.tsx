"use client";

import { Card, CardBody, Skeleton, Tab, Tabs } from "@heroui/react";

export const SkeletonPrizes = (
  <div className="rounded-2xl">
    <Skeleton className="rounded-xl">
      <div className="w-[25vw] h-[50vh] rounded-xl"></div>
    </Skeleton>
  </div>
);

export const SkeletonInfomation = (
  <div className="space-y-6">
    <Skeleton className="w-3/5 rounded-lg">
      <div className="h-6 w-full rounded-lg"></div>
    </Skeleton>
    <Skeleton className="w-2/5 rounded-lg">
      <div className="h-3 w-full rounded-lg"></div>
    </Skeleton>
    <Skeleton className="w-3/5 rounded-lg">
      <div className="h-3 w-full rounded-lg"></div>
    </Skeleton>
    <Skeleton className="w-2/5 rounded-lg">
      <div className="h-3 w-full rounded-lg"></div>
    </Skeleton>
  </div>
);

export const SkeletonPrices = (
  <>
    <div className="flex flex-col gap-6">
      <Skeleton className="w-full h-24 rounded-xl" />
      <Skeleton className="w-full h-24 rounded-xl" />
      <Skeleton className="w-full h-32 rounded-xl" />
    </div>
  </>
);

export const SkeletonEventItems = (
  <>
    {Array.from({ length: 4 }, (_, index) => index + 1).map((idx: number) => (
      <div
        key={idx}
        className="flex flex-row bg-background-700 items-center justify-between border-b border-divider p-4"
      >
        <Skeleton className="w-10 rounded-full">
          <div className="h-10 w-full rounded-full"></div>
        </Skeleton>
        <Skeleton className="w-1/5 rounded-full">
          <div className="h-8 w-full rounded-full"></div>
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-8 w-full rounded-lg"></div>
        </Skeleton>
      </div>
    ))}
  </>
);

export const SkeletonEvents = (
  <div className="flex-grow-1  ">
    <Tabs>
      <Tab key="activity" title="Activity">
        <Card>
          <CardBody className="bg-background-700">
            {SkeletonEventItems}
          </CardBody>
        </Card>
      </Tab>
      <Tab key="participants" title={`Paticipants`}>
        <Card>
          <CardBody className="bg-background-700">
            {SkeletonEventItems}
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  </div>
);

export const SkeletonRelateItems = (
  <>
    {Array.from({ length: 3 }, (_, index) => index + 1).map((idx) => (
      <div key={idx} className="rounded-2xl">
        <Skeleton className="rounded-2xl">
          <div className="h-56 w-56 rounded-2xl"></div>
        </Skeleton>
        <div className="mt-3 space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-full rounded-lg"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-full rounded-lg"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-full rounded-lg"></div>
          </Skeleton>
          <Skeleton className="w-full rounded-2xl rounded-tl-none rounded-tr-none">
            <div className="h-12 w-full rounded-2xl"></div>
          </Skeleton>
        </div>
      </div>
    ))}
  </>
);

export const SkeletonRelate = (
  <div className="flex flex-col justify-center items-center gap-2 p-4   rounded-2xl">
    <Skeleton className="w-2/5 rounded-lg">
      <div className="h-3 w-full rounded-lg"></div>
    </Skeleton>
    <div className="grid grid-cols-3 gap-3">{SkeletonRelateItems}</div>
  </div>
);

const LuckypotDetailLoading = ({ isMobile }: { isMobile?: boolean }) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-8">
        {/* Left Column: Info & Content */}
        <div className="flex flex-col gap-6">
          {/* Header: Image + Basic Info */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/3 min-w-[240px]">
              {SkeletonPrizes}
            </div>
            <div className="flex-1">
              {SkeletonInfomation}
            </div>
          </div>
          
          <Skeleton className="w-full h-48 rounded-xl" />
          {SkeletonEvents}
        </div>

        {/* Right Column: Actions & Sponsorship */}
        <div className="flex flex-col gap-6 h-fit lg:sticky lg:top-24">
          {SkeletonPrices}
          {SkeletonRelate}
        </div>
      </div>
    </div>
  );
};

export default LuckypotDetailLoading;
