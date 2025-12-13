import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { zeroAddress } from "viem";
import { getAddress } from "viem/utils";

import { ChainCoinIcon } from "@/components/Chains/ChainIcon";
import { Currency, Token } from "@/constants/tokens";
import { PrizeType, LuckypotPrize } from "@/types";
import { Native } from "@/types/token/native";

import CryptoPreview from "./CryptoPreview";
import SelectTokens from "./SelectTokens";

const loadCurrency = (chainId: number, item?: LuckypotPrize) => {
  if (item) {
    let currency: Currency =
      item.standard == "Navite"
        ? Native.onChain(chainId)
        : new Token(
            chainId,
            getAddress(item.token!),
            item.decimals!,
            item.name!,
            item.name
          );
    return currency;
  }
};

const loadPrize = (currency: Currency, amount: any) => {
  const item: LuckypotPrize = {
    name: currency.symbol,
    standard: currency.isNative ? "Navite" : "ERC20",
    prizeType: currency.isNative ? PrizeType.NATIVE : PrizeType.TOKEN,
    token: currency.isNative ? zeroAddress: currency.wrapped.address,
    decimals: currency.decimals,
    amount: amount,
  };
  return item;
};

const CryptoSelector = ({
  chainId,
  prize,
  endTime,
  setValue,
}: {
  chainId?: any;
  prize?: LuckypotPrize;
  endTime?: any;
  setValue?: any;
}) => {
  const t = useTranslations("luckypotCreate");
  const [selectedToken, setSelectedToken] = useState<Currency | undefined>(
    loadCurrency(chainId, prize)
  );

  const onSelectToken = (currency: Currency, amount: string) => {
    setSelectedToken(currency);

    setValue("prize", loadPrize(currency, amount), { shouldDirty: true });
  };

  const CryptoSelectButton = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
      <>
        <Button
          variant="flat"
          className="flex flex-col h-60 px-4 py-12 gap-4 w-40 min-w-32"
          onPress={onOpen}
        >
          <ChainCoinIcon
            chainId={chainId}
            size={{ width: "56", height: "56" }}
          />
          <span className="text-pl font-semibold">{t("prize_select")}</span>
          <div className="h-8">
            <Icon width="28" height="28" icon="basil:add-outline" />
          </div>
        </Button>
        <Modal
          backdrop="opaque"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          classNames={{
            backdrop: "bg-black/50 backdrop-blur-sm",
            base: "border border-dashed border-divider",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {t("prize_select")}
                </ModalHeader>
                <ModalBody>
                  <SelectTokens
                    chainId={chainId}
                    onClose={onClose}
                    onSelect={onSelectToken}
                  />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };

  return (
    <>
      {selectedToken ? (
        <CryptoPreview
          currency={selectedToken}
          amount={prize?.amount}
          endTime={endTime}
          onClear={() => setSelectedToken(undefined)}
        />
      ) : (
        <CryptoSelectButton />
      )}
    </>
  );
};

export default CryptoSelector;
