import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { Coins, HeartHandshake } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { parseEther, parseUnits, zeroAddress } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import CryptoCurrency from "@/components/CryptoCurrency";
import { AppConfig } from "@/config";
import { getDeploysByName } from "@/constants/contracts/address";
import { ContractNames } from "@/constants/contracts/names";
import { useRefetchContext } from "@/context/RefetchContext";
import { useContractAbi } from "@/hooks/useContractAbi";
import { useNotify } from "@/hooks/useNotify";
import useTokenApproval from "@/hooks/useTokenApproval";
import { useNativeAndTokenBalance } from "@/hooks/useTokenBalance";
import { LuckypotStatus, type Luckypot } from "@/types";
import { tokenValue } from "@/utils/formatters";

const SponsorshipPanel = ({ item }: { item: Luckypot }) => {
  const t = useTranslations("luckypot.sponsor");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [amount, setAmount] = useState("");
  const { isConnected } = useAccount();
  const { notifySuccess, notifyError } = useNotify();
  const { triggerRefetch } = useRefetchContext();

  const { balance, isBalanceLoading } = useNativeAndTokenBalance(
    item.prizeToken?.address as `0x${string}` || zeroAddress,
    AppConfig.chainId
  );

  // Contract interaction setup (similar to PayBtns)
  const contractInfo = getDeploysByName(`${AppConfig.chainId}`, ContractNames.LuckypotContract);
  const abi = useContractAbi(AppConfig.chainId, contractInfo?.address);
  const { data: sponsorHash, isPending: isSponsorPending, writeContract } = useWriteContract();
  const [hasNotified, setHasNotified] = useState(false);

  const { isLoading: isSponsorConfirming, isSuccess: isSponsorSuccess } = useWaitForTransactionReceipt({
    hash: sponsorHash
  });

  const approval = useTokenApproval(item.prizeToken?.address, contractInfo?.address);
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approval.hash
  });

  // Refund Sponsor
  const { data: refundHash, isPending: isRefundPending, writeContract: writeRefund } = useWriteContract();
  const { isLoading: isRefundConfirming, isSuccess: isRefundSuccess } = useWaitForTransactionReceipt({
    hash: refundHash
  });

  useEffect(() => {
    if (isRefundSuccess) {
      notifySuccess({ title: t("success_refund"), message: t("success_refund") });
      setTimeout(() => triggerRefetch("payment"), 2000);
    }
  }, [isRefundSuccess, notifySuccess, triggerRefetch, t]);

  const handleRefund = () => {
    writeRefund({
      address: contractInfo?.address as `0x${string}`,
      abi,
      functionName: "claimSponsorRefund",
      args: [BigInt(item.luckypotId)],
    });
  };

  const showRefund = (item.status === LuckypotStatus.CANCELLED || item.status === LuckypotStatus.FAILED) && item.sponsorAmount > 0;

  useEffect(() => {
    if (isSponsorSuccess && !hasNotified) {
      notifySuccess({ title: t("success"), message: t("success") });
      onClose();
      setAmount("");
      setHasNotified(true);
      // refetch
      setTimeout(() => triggerRefetch("payment"), 2000);
    }
  }, [isSponsorSuccess, hasNotified, onClose, notifySuccess, triggerRefetch, t]);

  // Reset hasNotified when hash changes (new transaction)
  useEffect(() => {
    if (sponsorHash) {
      setHasNotified(false);
    }
  }, [sponsorHash]);

  const handleSponsor = () => {
    if (!amount || parseFloat(amount) <= 0) {
      notifyError({ title: t("error_amount"), message: t("error_amount") });
      return;
    }

    try {
      const decimals = item.prizeToken?.decimals ?? 18;
      const isNative = !item.prizeToken?.address || item.prizeToken?.address === zeroAddress;
      if (isNative) {
        const valueWei = parseEther(amount);
        writeContract({
          address: contractInfo?.address as `0x${string}`,
          abi,
          functionName: "sponsor",
          args: [item.luckypotId, valueWei, ''],
          value: valueWei,
        });
      } else {
        const valueWei = parseUnits(amount, decimals as number);
        const currentAllowance = BigInt(approval.allowance?.toString?.() ?? 0);
        if (currentAllowance < valueWei) {
          approval.approveToken(valueWei as bigint);
        } else {
          writeContract({
            address: contractInfo?.address as `0x${string}`,
            abi,
            functionName: "sponsor",
            args: [item.luckypotId, valueWei, ''],
          });
        }
      }
    } catch (err) {
      console.error(err);
      notifyError({ title: "Error", message: t("error_tx") });
    }
  };

  useEffect(() => {
    if (isApproveSuccess && amount) {
      const decimals = item.prizeToken?.decimals ?? 18;
      const valueWei = parseUnits(amount, decimals as number);
      writeContract({
        address: contractInfo?.address as `0x${string}`,
        abi,
        functionName: "sponsor",
        args: [item.luckypotId, valueWei, ''],
      });
    }
  }, [isApproveSuccess, amount, item.prizeToken?.decimals, item.luckypotId, writeContract, contractInfo?.address, abi]);

  if(item.status !== LuckypotStatus.ONGOING && !showRefund){
    return <></>
  }

  return (
    <>
      <div className="flex flex-col gap-4 bg-[#18181b] border border-[#F0B90B]/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(240,185,11,0.05)]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-white">{t("boost_title")}</h3>
            <p className="text-xs text-gray-400">{t("boost_desc")}</p>
          </div>
          <HeartHandshake className="w-8 h-8 text-yellow-400 opacity-80" />
        </div>

        {showRefund ? (
          <Button
            onPress={handleRefund}
            isLoading={isRefundPending || isRefundConfirming}
            className="w-full font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/20"
          >
            {t("refund_btn")}
          </Button>
        ) : (
          <Button
            onPress={onOpen}
            className="w-full font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg shadow-yellow-400/20"
          >
            {t("btn_sponsor")}
          </Button>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-[#1a1a1a] border border-yellow-400/20 text-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row gap-1">
                <span className="text-xl font-bold text-yellow-400">{t("modal_title")}</span>
                <CryptoCurrency
                  token={item.prizeToken?.symbol || "BNB"}
                  value={tokenValue(item.prizeAmount, 18)}
                  display="Crypto"
                  showSuffix={true}
                />
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 py-4">
                  <Input
                    type="number"
                    label={
                      <div className="flex flex-row justify-between">
                        <span>{t("amount_label")}</span>
                        <span className="text-sm">
                          {t("balance")}:
                          <>{isBalanceLoading ? "Loading" : balance ? balance : "0"}</>
                        </span>
                      </div>
                    }
                    labelPlacement="outside-top"
                    placeholder={t("placeholder")}
                    value={amount}
                    onValueChange={setAmount}
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-yellow-400/30 hover:border-yellow-400/60 focus-within:!border-yellow-400",
                      label: "text-gray-400",
                      input: "text-white"
                    }}
                    startContent={
                      <Coins className="text-yellow-400 w-4 h-4" />
                    }
                  />
                  <div className="text-xs text-gray-500">
                    {t("notice")}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("cancel")}
                </Button>
                <Button
                  className="bg-yellow-400 text-black font-bold"
                  onPress={handleSponsor}
                  isLoading={isSponsorPending || isSponsorConfirming || approval.isPending || isApproveConfirming}
                  isDisabled={!isConnected || !amount}
                >
                  {t("confirm")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SponsorshipPanel;
