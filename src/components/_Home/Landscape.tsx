"use client";

import { Button, Chip, Spacer, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { AppConfig } from "@/config";
import { ChainId } from "@/constants/chains";
import { useRouter } from "@/libs/i18nNavigation";

import { FloatingCoin, GlowEffect } from "../Animation/Animations";
import AppLink from "../AppLink";
import { BNBChainIcon } from "../Chains";

import { FaucetModal } from "./FaucetModal";
import { WealthGodAnimation, WealthGodAnimationHandles } from "./WealthGodAnimation";


const Landscape = () => {
  const t = useTranslations("home");
  const wealthGodRef = React.useRef<WealthGodAnimationHandles>(null);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showFaucet, setShowFaucet] = useState(false);

  useEffect(() => {
    // Only show on testnet
    setShowFaucet(AppConfig.chainId === ChainId.BNB_TESTNET);
  }, []);

  const handleTitleClick = () => {
    wealthGodRef.current?.triggerAnimation();
  };
  return (
    <div className="max-w-7xl relative rounded-3xl p-8 lg:p-12 border border-white/5 bg-[#09090b] overflow-hidden">
      <FaucetModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <FloatingCoin delay={0.5} duration={4} size="sm" />
      <FloatingCoin delay={1.2} duration={5} size="md" />
      <FloatingCoin delay={2.1} duration={3.5} size="lg" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(240,185,11,0.15),transparent_60%)] pointer-events-none"></div>
      <div className="flex flex-row">

        <div className="w-full flex-col relative z-10 text-center text-wrap">

          <h1
            className="text-4xl lg:text-6xl max-md:text-h6 mb-4 font-bold tracking-tight cursor-pointer"
            onClick={handleTitleClick}
          >
            {t.rich("title", { span: (children) => <span className='text-[#F0B90B] drop-shadow-[0_0_10px_rgba(240,185,11,0.5)]'>{children}</span> })}
          </h1>
          <Spacer y={2} />
          <h2 className="text-xl max-md:text-sm mb-4 text-foreground text-wrap">
            {t("sub_title")}
          </h2>
          <Spacer y={2} />
          <div className="flex gap-2 items-center justify-center flex-wrap">
            <Chip size="sm" radius='sm' className="bg-white/5 border border-white/10 text-gray-400" variant="solid">
              {t("fairness")}
            </Chip>
            <Chip size="sm" radius='sm' className="bg-white/5 border border-white/10 text-gray-400" variant="solid">
              {t("transparency")}
            </Chip>
            <Chip size="sm" radius='sm' className="bg-white/5 border border-white/10 text-gray-400" variant="solid">
              {t("trustless")}
            </Chip>
            <Chip size="sm" radius='sm' className="bg-white/5 border border-white/10 text-gray-400" variant="solid">
              {t("permissionless")}
            </Chip>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <WealthGodAnimation ref={wealthGodRef} />
      </div>
      <Spacer y={6} />
      <div className="flex flex-col md:flex-row gap-2 text-pm items-center justify-center">
        <div className="flex flex-row gap-3">
          <h2 className="text-foreground-800 text-ps">{t("powered_by")}</h2>
          <AppLink href="https://bnbchain.org">
            <Chip
              size="sm"
              className="border border-white/10 text-gray-400"
              variant="flat"
              startContent={<BNBChainIcon size={{ width: "18", height: "18" }} />}
            >
              BNB Chain
            </Chip>
          </AppLink>
          <AppLink href="https://oracle.binance.com/docs/vrf/overview">
            <Chip size="sm" className="bg-white/5 border border-white/10 text-gray-400" variant="flat">
              Binance VRF
            </Chip>
          </AppLink>
        </div>
      </div>
      <Spacer y={6} />
      <div className="flex flex-wrap justify-center gap-4">
        <GlowEffect color="yellow" intensity="normal">
          <Button
            size="lg"
            startContent={<Icon icon="lucide:zap" className="w-5 h-5" />}
           onPress={() => {
              router.push("/power");
            }}
            className="rounded-none px-8 text-lg font-bold bg-[#F0B90B] text-black border border-yellow-400 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(240,185,11,0.3)]"
          >
            {t("get_power")}
          </Button>
        </GlowEffect>
        <Button
          size="lg"
          variant="bordered"
          startContent={<Icon icon="solar:question-circle-bold-duotone" className="w-5 h-5" />}
          onPress={() => {
            router.push("/#faq");
          }}
          className="rounded-none px-6 text-lg font-medium text-gray-300 border-white/20 hover:bg-white/5 hover:text-white hover:border-white/40 transition-all"
        >
          {t("faq")}
        </Button>
        {showFaucet && (
          <Button
            size="lg"
            variant="bordered"
            startContent={<Icon icon="lucide:droplets" className="w-5 h-5" />}
            onPress={onOpen}
            className="rounded-none px-6 text-lg font-medium text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/50 transition-all"
          >
            {t("claim_test_tokens")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Landscape;
