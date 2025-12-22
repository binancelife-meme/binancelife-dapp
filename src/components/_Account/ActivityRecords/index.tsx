"use client";

import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import {
  Flag, // Won
  Heart, // Participated
  Trophy, // Created (Initiated)
  Users
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import CreatedRecords from "./CreatedRecords";
import ParticipatedRecords from "./ParticipatedRecords";
import SponsoredRecords from "./SponsoredRecords";
import WonRecords from "./WonRecords";

const ActivityRecords = ({ userId }: { userId: string }) => {
  const t = useTranslations("account");
  const [activeTab, setActiveTab] = useState<string>("participated");

  return (
    <Card className="bg-[#121212] border border-white/10 w-full">
      <CardBody className="p-0">
        <Tabs
          aria-label="Activity Options"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-white/10 px-4 overflow-x-auto no-scrollbar",
            cursor: "w-full bg-yellow-400",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-yellow-400 text-gray-400 text-sm sm:text-base font-medium whitespace-nowrap"
          }}
          selectedKey={activeTab}
          onSelectionChange={(key) => {
            setActiveTab(key as string);
          }}
        >

          <Tab
            key="participated"
            title={
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{t('tabs.participated')}</span>
              </div>
            }
          >
            <ParticipatedRecords userId={userId} />
          </Tab>
          <Tab
            key="won"
            title={
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>{t('tabs.won')}</span>
              </div>
            }
          >
            <WonRecords userId={userId} />
          </Tab>
          <Tab
            key="sponsored"
            title={
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>{t('tabs.sponsored')}</span>
              </div>
            }
          >
            <SponsoredRecords userId={userId} />
          </Tab>
          <Tab
            key="created"
            title={
              <div className="flex items-center space-x-2">
                <Flag className="w-4 h-4" />
                <span>{t('tabs.created')}</span>
              </div>
            }
          >
            <CreatedRecords userId={userId} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default ActivityRecords;
