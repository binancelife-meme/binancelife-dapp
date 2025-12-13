"use client";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { Info, Lock, Pickaxe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";

import PowerActions from "./PowerActions";
import UserPower from "./UserPower";

const LuckyPower = () => {
  const t = useTranslations('power')
  const { address: walletAddress } = useAccount();
  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400">
            {t('title')}
          </h1>
          <Popover placement="bottom" showArrow={true}>
            <PopoverTrigger>
              <Button isIconOnly size="sm" variant="light" className="min-w-0 w-6 h-6 data-[hover=true]:bg-transparent">
                <Info className="w-5 h-5 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-neutral-900 border border-neutral-800 p-0">
              <div className="w-[300px] sm:w-[360px] p-4 space-y-4">
                {/* Staking Hint */}
                <div className="flex gap-3 items-start text-left">
                  <div className="p-2 bg-yellow-400/10 rounded-lg shrink-0 mt-1">
                    <Pickaxe className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-bold text-yellow-400 mb-1 text-sm">{t("hints.staking.title")}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{t("hints.staking.description")}</p>
                  </div>
                </div>
                
                <div className="h-px bg-white/10 w-full" />
                
                {/* Locking Hint */}
                <div className="flex gap-3 items-start text-left">
                  <div className="p-2 bg-purple-500/10 rounded-lg shrink-0 mt-1">
                    <Lock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-bold text-purple-400 mb-1 text-sm">{t("hints.locking.title")}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{t("hints.locking.description")}</p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-6">{t('subtitle')}</p>
      </div>
      <UserPower walletAddress={walletAddress ?? ""} />
      <PowerActions />
    </div>
  );
};

export default LuckyPower;
