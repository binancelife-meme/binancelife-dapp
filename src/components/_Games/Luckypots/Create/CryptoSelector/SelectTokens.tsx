import { Button, Input, Spacer } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getAddress, zeroAddress } from "viem";

import AppImage from "@/components/AppImage";
import { ChainCoinIcon } from "@/components/Chains";
import CryptoCurrency from "@/components/CryptoCurrency";
import { ChainId } from "@/constants/chains";
import { Currency, Token, getTokenLogoURL } from "@/constants/tokens";
import { SUGGESTED_BASES } from "@/constants/tokens/defaultToken";
import useNativeCurrency from "@/hooks/useNativeCurrency";
import {
  useNativeAndTokenBalance
} from "@/hooks/useTokenBalance";


export default function SelectTokens({
  chainId,
  selectedCurrency,
  onSelect,
  onClose,
}: {
  chainId?: ChainId;
  selectedCurrency?: Currency;
  onSelect: (currency: Currency, amount: string) => void;
  onClose: any;
}) {
  const native = useNativeCurrency();

  const [selectedToken, setSelectedToken] = useState(selectedCurrency);
  const [amount, setAmount] = useState("");

  const { balance, isBalanceLoading } = useNativeAndTokenBalance(
    selectedToken
      ? selectedToken?.isNative
        ? zeroAddress
        : getAddress(selectedToken?.address!)
      : zeroAddress
  );

  const applyButtonEnable = true; //selectedToken && Number(amount) > 0 && Number(amount) <= Number(balance);

  const t = useTranslations("luckypotCreate");
  return (
    <div className="flex flex-col gap-4">
      {/* Select tokens */}
      <div className="text-base">{t("prize_select")}</div>
      <div className="flex flex-row flex-wrap gap-2">
        {/* Native token  */}
        <Button
          onClick={() => {
            setSelectedToken(native);
          }}
          variant={selectedToken?.isNative ? "bordered" : "flat"}
          color={selectedToken?.isNative ? "primary" : "default"}
          disabled={selectedToken?.isNative}
          startContent={
            <ChainCoinIcon
              className="w-6 min-w-6 rounded-full"
              chainId={chainId}
            />
          }
        >
          {native.symbol}
        </Button>
        {/* ERC20 token  */}
        {(chainId ? SUGGESTED_BASES[chainId] || [] : []).map((token: Token) => {
          const selected = selectedToken?.equals(token);
          return (
            <Button
              key={`buttonBase#${token.address}`}
              onClick={() => {
                setSelectedToken(token);
              }}
              variant={selected ? "bordered" : "flat"}
              color={selected ? "primary" : "default"}
              disabled={selected}
              startContent={
                <AppImage
                  className="w-6 min-w-6 rounded-full"
                  src={getTokenLogoURL(token)}
                />
              }
            >
              {token.symbol}
            </Button>
          );
        })}
      </div>

      {/* Amount  */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <span>{t("prize_amount")}</span>
          <span className="text-sm">
            {t("balance")}:
            <>{isBalanceLoading ? "Loading" : balance ? balance : "0"}</>
          </span>
        </div>
        <Input
          size="lg"
          name="amount"
          type="number"
          placeholder={t("prize_amount")}
          variant="flat"
          value={amount}
          onValueChange={setAmount}
          endContent={
            <Button size="sm" onClick={() => setAmount(balance)}>
              MAX
            </Button>
          }
          description={
            selectedToken &&
            Number(amount) > 0 && (
              <CryptoCurrency
                className="text-sm mb-1 px-2"
                token={`${selectedToken?.symbol}`}
                value={amount}
                display="USD"
                showSuffix={true}
                startContent={"≈"}
              />
            )
          }
        />
      </div>
      <div className="flex justify-end">
        <Button
          className="w-32"
          size="md"
          color={"primary"}
          isDisabled={!applyButtonEnable}
          onClick={() => {
            onSelect(selectedToken!, amount);
            onClose();
          }}
        >
          {t("btn.apply")}
        </Button>
      </div>
      <Spacer y={2} />
    </div>
  );
}
