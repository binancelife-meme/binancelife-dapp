"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import React from "react";

import AppLink from "@/components/AppLink";

const AuditSection = () => {
  const t = useTranslations("audit");

  const auditors = [
    { name: "Grok", icon: "simple-icons:x", color: "text-white" },
    { name: "GPT-5", icon: "simple-icons:openai", color: "text-green-400" },
    { name: "DeepSeek", icon: "simple-icons:deepseek", color: "text-blue-400" },
  ];

  return (
    <div className="w-full py-10 bg-[#09090b]/50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Text Info */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#F0B90B]">
            <Icon icon="solar:shield-check-bold-duotone" width={24} />
            <h3 className="text-lg font-bold">{t("title")}</h3>
          </div>
          <p className="text-gray-400 text-sm max-w-md">
            {t("description")}
          </p>
        </div>

        {/* Center: Logos */}
        <div className="flex items-center gap-6 opacity-80">
          {auditors.map((auditor) => (
            <div key={auditor.name} className="flex flex-col items-center gap-2 group">
              <div className={`p-3 rounded-full bg-white/5 border border-white/5 group-hover:border-[#F0B90B]/30 transition-colors ${auditor.color}`}>
                 {auditor.name === "DeepSeek" ? (
                   <Icon icon="game-icons:shark-fin" width={24} />
                 ) : (
                   <Icon icon={auditor.icon} width={24} />
                 )}
              </div>
              <span className="text-[10px] text-gray-500 font-mono uppercase">{auditor.name}</span>
            </div>
          ))}
        </div>

        {/* Right: Report Link */}
        <div>
          <Button
            as={AppLink}
            href="https://github.com/binancelife-meme/binancelife-docs/blob/main/README-zh.md"
            variant="flat"
            target="_blank"
            className="bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
            endContent={<Icon icon="solar:arrow-right-up-linear" />}
          >
            {t("view_report")}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default AuditSection;
