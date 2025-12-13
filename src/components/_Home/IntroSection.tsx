"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

import AppLink from "@/components/AppLink";
import { useNotify } from "@/hooks/useNotify";

const IntroSection = () => {
  const t = useTranslations("intro");
  const tShare = useTranslations("share");
  const { notifySuccess } = useNotify();
  const contractAddress = "0x924fa68a0fc644485b8df8abfa0a41c2e7744444";

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      notifySuccess({
        title: t("copied"),
        message: tShare("copy_success"),
        duration: 3000,
      });
    } catch (err) { }
  };
  return (
    <div className="w-full max-w-7xl mx-auto ">
      <div className="relative overflow-hidden rounded-3xl bg-[#18181b] border border-white/5 p-8 md:p-12">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#F0B90B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">

          {/* Left: Content */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {t("title")}
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
              {t("description")}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Button
                as={AppLink}
                href="https://web3.binance.com/token/bsc/0x924fa68a0fc644485b8df8abfa0a41c2e7744444"
                target="_blank"
                className="bg-[#F0B90B] text-black font-bold px-6 py-2 rounded-xl shadow-[0_0_15px_rgba(240,185,11,0.2)] hover:scale-105 transition-transform"
                startContent={<Icon icon="cryptocurrency:bnb" width={20} />}
              >
                {t("buy_button")}
              </Button>
              <Button
                as={AppLink}
                href="https://dexscreener.com/bsc/0x924fa68a0fc644485b8df8abfa0a41c2e7744444"
                target="_blank"
                variant="bordered"
                className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                startContent={<Icon icon="solar:chart-bold-duotone" width={20} />}
              >
                {t("chart_button")}
              </Button>
            </div>
          </div>

          {/* Right: Contract Address Card */}
          <div className="w-full md:w-auto flex-shrink-0">
            <div className="bg-[#09090b]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t("contract_address")}</span>
              <div
                onClick={copyAddress}
                className="group flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:border-[#F0B90B]/30 hover:bg-[#F0B90B]/5 transition-all w-full md:w-90 justify-between"
              >
                <code className="text-gray-300 font-mono text-sm truncate group-hover:text-[#F0B90B] transition-colors">
                  {contractAddress}
                </code>
                <Icon icon="solar:copy-bold-duotone" className="text-gray-500 group-hover:text-[#F0B90B] flex-shrink-0" width={18} />
              </div>
              <div className="text-[10px] text-gray-600">
                BNB Chain (BEP20)
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IntroSection;
