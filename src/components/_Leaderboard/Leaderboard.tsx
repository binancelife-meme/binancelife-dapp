"use client";

import {
  Card,
  CardBody,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  Trophy,
  Medal,
  Crown,
  Zap,
  Gift,
  Heart,
  Flag,
  Lock,
  Pickaxe
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { InitiatorLeaderboard } from "./InitiatorLeaderboard";
import { LockingLeaderboard } from "./LockingLeaderboard";
import { PowerLeaderboard } from "./PowerLeaderboard";
import { SponsorshipLeaderboard } from "./SponsorshipLeaderboard";
import { StakingLeaderboard } from "./StakingLeaderboard";
import { WinningLeaderboard } from "./WinningLeaderboard";

const Leaderboard = () => {
  const t = useTranslations("leaderboard");
  const [activeTab, setActiveTab] = useState<string>("winning");

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300 fill-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500 w-6 text-center">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50";
      case 2: return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50";
      case 3: return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50";
      default: return "bg-white/5 border-white/10 hover:bg-white/10";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-4 px-4">
      {/* Header */}
      <div className="flex flex-row gap-2 items-center justify-center text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400">{t("full_title")}</h1>
      </div>

      {/* Main Content */}
      <Card className="bg-[#121212] border border-white/10 w-full">
        <CardBody className="p-0">
          <Tabs
            aria-label="Leaderboard Categories"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            variant="underlined"
            classNames={{
              panel: 'p-0',
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-white/10 px-4 overflow-x-auto no-scrollbar",
              cursor: "w-full bg-yellow-400",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-yellow-400 text-gray-400 text-sm sm:text-base font-medium whitespace-nowrap"
            }}
          >
            <Tab
              key="sponsorship"
              title={
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{t("tabs.sponsorship")}</span>
                </div>
              }
            >
              <SponsorshipLeaderboard getRankIcon={getRankIcon} getRankColor={getRankColor} />
            </Tab>
            <Tab
              key="winning"
              title={
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  <span>{t("tabs.winning")}</span>
                </div>
              }
            >
              <WinningLeaderboard getRankIcon={getRankIcon} getRankColor={getRankColor} />
            </Tab>
            <Tab
              key="initiator"
              title={
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  <span>{t("tabs.initiator")}</span>
                </div>
              }
            >
              <InitiatorLeaderboard getRankIcon={getRankIcon} getRankColor={getRankColor} />
            </Tab>
            <Tab
              key="locking"
              title={
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>{t("tabs.locking")}</span>
                </div>
              }
            >
              <LockingLeaderboard getRankIcon={getRankIcon} getRankColor={getRankColor} />
            </Tab>
            <Tab
              key="staking"
              title={
                <div className="flex items-center gap-2">
                  <Pickaxe className="w-4 h-4" />
                  <span>{t("tabs.staking")}</span>
                </div>
              }
            >
              <StakingLeaderboard getRankIcon={getRankIcon} getRankColor={getRankColor} />
            </Tab>
            <Tab
              key="power"
              title={
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>{t("tabs.power")}</span>
                </div>
              }
            >
              <PowerLeaderboard getRankIcon={getRankIcon} getRankColor={getRankColor} />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default Leaderboard;
