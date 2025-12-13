import { Button } from "@heroui/react";

import AppImage from "@/components/AppImage";
import ChainIcon from "@/components/Chains/ChainIcon";
import { DurationLabel } from "@/components/CountDown";
import CryptoCurrency from "@/components/CryptoCurrency";
import { VerifyIcon } from "@/components/Icons";
// import VerifyIcon from "@/components/_Games/Luckypots/Card/VerifyIcon";
import { Currency, getCurrencyLogoUrls } from "@/constants";
import { getTokenBannerByName } from "@/constants/tokens/tokenBanner";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

const CryptoPreview = ({
  endTime,
  currency,
  amount,
  className,
  onClear,
}: {
  endTime?: any;
  currency?: Currency;
  amount?: any;
  className?: any;
  onClear?: any;
}) => {
  const t = useTranslations("form");
  return (
    <div
      className={cn(
        `flex flex-col rounded-2xl border border-divider bg-background-700`,
        className
      )}
      aria-hidden="true"
    >
      <div className="flex flex-col flex-grow p-0 m-0 border-0 text-foreground">
        <div className="flex w-56 h-56 items-center justify-center relative border-b border-divider rounded-xl">
          <AppImage
            className={
              "w-full h-auto relative object-cover items-center justify-items-center"
            }
            src={getTokenBannerByName(currency?.symbol!)}
            fallbackSrc={getCurrencyLogoUrls(currency)[0]}
            alt={currency?.name}
            isZoomed={false}
          />
          <ChainIcon
            className="z-10 absolute top-2 left-2 w-auto h-auto"
            chainId={currency?.chainId}
          />
          {endTime && (
            <DurationLabel
              className="z-10 flex flex-row items-center absolute bottom-2 right-2 w-auto h-4 text-ps text-center px-3 py-0 rounded-xl bg-warning text-foreground"
              eventTime={endTime}
            />
          )}
          <Button
            title="Clear selection"
            size="sm"
            variant="flat"
            isIconOnly
            className="absolute top-2 right-2 z-10"
            onClick={onClear}
          >
            X
          </Button>
        </div>
        <div className="flex flex-row items-center justify-center mt-2">
          <span className="text-pm">
            {amount} {currency?.symbol}
          </span>
          <VerifyIcon verifyed={true} />
        </div>
        <CryptoCurrency
          className="flex flex-row text-center justify-center text-pl font-bold pt-2 pb-1"
          token={currency?.symbol!}
          value={amount}
          display="USD"
          showSuffix={true}
        />
      </div>
      <Button
        size="lg"
        color="primary"
        className={cn(
          "flex flex-col justify-center p-1 py-2 rounded-xl rounded-tl-none rounded-tr-none"
        )}
      >
        <div className="flex flex-col text-center py-2">
          <div className="text-pl font-semibold">
            <span>{t("btn_play")}</span>
          </div>
        </div>
      </Button>
    </div>
  );
};

export default CryptoPreview;
