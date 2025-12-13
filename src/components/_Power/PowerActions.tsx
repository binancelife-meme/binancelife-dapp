"use client";
import { Tabs, Tab } from "@heroui/react";
import { Pickaxe, Lock, Info } from "lucide-react";
import { useTranslations } from "next-intl";

import PowerLocking from "./PowerLocking";
import PowerStaking from "./PowerStaking";

const PowerActions = () => {
  const t = useTranslations("power");

  return (
    <div className="w-full mt-6">
      <Tabs
        aria-label="Power Options"
        color="primary"
        variant="solid"
        classNames={{
          // tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-yellow-400",
          // tab: "max-w-fit px-0 h-12",
          // tabContent: "group-data-[selected=true]:text-yellow-400 text-gray-400 text-base"
        }}
      >
        <Tab
          key="staking"
          title={
            <div className="flex items-center gap-2">
              <Pickaxe size={18} />
              <span>{t("tabs.staking")}</span>
            </div>
          }
        >
          <div className="pt-0">
            <PowerStaking />
          </div>
        </Tab>
        <Tab
          key="locking"
          title={
            <div className="flex items-center gap-2">
              <Lock size={18} />
              <span>{t("tabs.locking")}</span>
            </div>
          }
        >
          <div className="pt-0">
            <PowerLocking />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PowerActions;
