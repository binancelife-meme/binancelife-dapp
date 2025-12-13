import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader, Card,
  CardBody,
  Link
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { parseEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

import { AppConfig } from "@/config";
import { ChainId } from "@/constants/chains";
import { bscTestnetTokens } from "@/constants/tokens/chains";

// Minimal ABI for mint function
const mintAbi = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;

interface FaucetModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FaucetModal = ({ isOpen, onOpenChange }: FaucetModalProps) => {
  const t = useTranslations("faucet");
  const t2 = useTranslations("settings");
  const { address } = useAccount();
  const chainId = AppConfig.chainId as ChainId;

  // Contract interactions
  const { writeContract: writeMintLife, data: mintLifeHash, isPending: isMintLifePending } = useWriteContract();
  const { writeContract: writeMintUsdt, data: mintUsdtHash, isPending: isMintUsdtPending } = useWriteContract();

  const { isSuccess: isMintLifeSuccess } = useWaitForTransactionReceipt({ hash: mintLifeHash });
  const { isSuccess: isMintUsdtSuccess } = useWaitForTransactionReceipt({ hash: mintUsdtHash });

  useEffect(() => {
    if (isMintLifeSuccess) toast.success(t("success"));
  }, [isMintLifeSuccess, t]);

  useEffect(() => {
    if (isMintUsdtSuccess) toast.success(t("success"));
  }, [isMintUsdtSuccess, t]);

  const handleMintLife = () => {
    if (!address) {
      toast.error(t2("connect_button"));
      return;
    }
    writeMintLife({
      address: bscTestnetTokens["币安人生"].address as `0x${string}`,
      abi: mintAbi,
      functionName: "mint",
      args: [address, parseEther("10000")],
      chainId
    });
  };

  const handleMintUsdt = () => {
    if (!address) {
      toast.error(t2("connect_button"));
      return;
    }
    writeMintUsdt({
      address: bscTestnetTokens.usdt.address as `0x${string}`,
      abi: mintAbi,
      functionName: "mint",
      args: [address, parseEther("10000")],
      chainId
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-[#09090b] border border-white/10",
        header: "border-b border-white/10",
        body: "py-6",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-xl font-bold">{t("title")}</span>
              <span className="text-sm font-normal text-default-500">{t("desc")}</span>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                {/* BNB Faucet */}
                <Card className="bg-white/5 border border-white/10">
                  <CardBody className="flex flex-row items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-yellow-500">BNB</span>
                      <span className="text-xs text-default-500">{t("bnb_testnet")}</span>
                    </div>
                    <Button
                      as={Link}
                      href="https://www.bnbchain.org/en/testnet-faucet"
                      isExternal
                      size="sm"
                      className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50"
                      endContent={<Icon icon="lucide:external-link" />}
                    >
                      {t("view_faucet")}
                    </Button>
                  </CardBody>
                </Card>

                {/* Binance Life Faucet */}
                <Card className="bg-white/5 border border-white/10">
                  <CardBody className="flex flex-row items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#F0B90B]">Binance Life</span>
                      <span className="text-xs text-default-500">{t("binance_life")}</span>
                    </div>
                    <Button
                      size="sm"
                      isLoading={isMintLifePending}
                      onPress={handleMintLife}
                      className="bg-[#F0B90B]/20 text-[#F0B90B] border border-[#F0B90B]/50"
                      startContent={!isMintLifePending && <Icon icon="lucide:coins" />}
                    >
                      {t("claim")} 10000
                    </Button>
                  </CardBody>
                </Card>

                {/* USDT Faucet */}
                <Card className="bg-white/5 border border-white/10">
                  <CardBody className="flex flex-row items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-green-500">USDT</span>
                      <span className="text-xs text-default-500">{t("usdt")}</span>
                    </div>
                    <Button
                      size="sm"
                      isLoading={isMintUsdtPending}
                      onPress={handleMintUsdt}
                      className="bg-green-500/20 text-green-500 border border-green-500/50"
                      startContent={!isMintUsdtPending && <Icon icon="lucide:dollar-sign" />}
                    >
                      {t("claim")} 10000
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
