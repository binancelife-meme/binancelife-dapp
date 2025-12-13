

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";

import AppLink from "@/components/AppLink";
import { Logo } from "@/components/Logo";
import SettingButton from "@/components/Settings/SettingButton";
import WalletConnectButton from "@/components/WalletConnector/WalletConnectButton";
import { AppConfig } from "@/config";
import { isTestnet } from "@/constants/chains";
import { useWindowSize } from "@/hooks";
import { useRouter, usePathname } from "@/libs/i18nNavigation";
import { cn } from "@/utils/cn";

import LocaleSwitcher from "../LocaleSwitcher";

const Header = () => {
  const t = useTranslations("menu");
  const router = useRouter();
  const path = usePathname();
  const { isMobile } = useWindowSize();

  return (
    <div className="flex gap-5 max-md:p-2 max-md:border-b max-md:border-divider justify-between w-full">
      <div className="flex gap-0 max-md:gap-2">
        <AppLink href="/" className={cn("hidden max-md:flex items-center gap-2 px-0", {})}>
          <div className="group-hover:transform group-hover:scale-105 transition-transform duration-300">
            <h1 className="text-lg sm:text-xs font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              币安人生
            </h1>
            <p className="text-[10px] sm:text-xs text-yellow-400/70 leading-tight font-medium">
              <span className="text-yellow-300">Binance Life</span>
            </p>
            {isTestnet(AppConfig.chainId) && <div className="absolute normal-case top-[-8px] right-0 h-3 text-start leading-3 text-[8px] bg-warning rounded-md py-0 px-2">Testnet</div>}
          </div>
        </AppLink>

        {path != "/" && !isMobile && (
          <Button
            onClick={() => {
              //length > 2, cuz i18n redirect
              if (window.history?.length && window.history.length > 2) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            variant="light"
            startContent={<Icon icon="ep:back" height={18} />}
          >
            Go Back
          </Button>
        )}
      </div>

      <div className="flex flex-row gap-2 pr-2">
        <LocaleSwitcher isCompact={true} />
        <WalletConnectButton />
      </div>
    </div>
  );
};

export default Header;
