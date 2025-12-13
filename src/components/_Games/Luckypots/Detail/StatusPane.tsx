import { Button, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import AppLink from "@/components/AppLink";
import { FirstPrizeBag, FourthPrizeBag, SecondPrizeBag, ThirdPrizeBag } from "@/components/Icons";
import UserLink from "@/components/UserLink";
import { AppConfig } from "@/config/AppConfig";
import { chains } from "@/constants/chains";
import { getDeploysByName } from "@/constants/contracts/address";
import { ContractNames } from "@/constants/contracts/names";
import { useRefetchContext } from "@/context/RefetchContext";
import { useContractAbi } from "@/hooks/useContractAbi";
import { LuckypotStatus, getLuckypotStatus, type Luckypot } from "@/types/luckypot";
import { cn } from "@/utils/cn";
import { tokenValue } from "@/utils/formatters";

const StatusPane = ({ item }: { item: Luckypot }) => {
  const t = useTranslations("luckypot.detail.status");
  const { address } = useAccount();
  const chain = chains.find((it) => it.id == AppConfig.chainId);
  const status = getLuckypotStatus(item);
  const { triggerRefetch } = useRefetchContext();

  // Contract setup
  const contractInfo = getDeploysByName(`${AppConfig.chainId}`, ContractNames.LuckypotContract);
  const abi = useContractAbi(AppConfig.chainId, contractInfo?.address);

  // Contract Interactions
  const { data: hash, isPending, writeContract, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      toast.success(t("action_success"));
      setTimeout(() => triggerRefetch("luckypot"), 2000);
    }
  }, [isConfirmed, t, triggerRefetch]);

  useEffect(() => {
      if (writeError) {
          toast.error(writeError.message);
      }
  }, [writeError]);

  const handleCancel = () => {
    writeContract({
      address: contractInfo?.address as `0x${string}`,
      abi,
      functionName: "cancel",
      args: [BigInt(item.luckypotId)],
    });
  };

  const handleClose = () => {
    writeContract({
        address: contractInfo?.address as `0x${string}`,
        abi,
        functionName: "close",
        args: [BigInt(item.luckypotId)],
    });
  };

  // Conditions for Cancel/Close buttons
  const isCreator = item.funder?.id?.toLowerCase() === address?.toLowerCase();
  const hasParticipants = item.participants > 0;
  // Created within 5 minutes (300 seconds)
  const isRecent = (Date.now() / 1000) - item.startTime < 300;
  
  // Show cancel if: Created status, is creator, recent, no participants
  const canCancel = status === LuckypotStatus.ONGOING && isCreator && isRecent && !hasParticipants;
  
  // Show close/refund if: Failed status (expired with no participants) - actually contract logic might differ slightly,
  // but usually "close" is used to manually trigger end/refund if conditions met.
  // Based on user request: "If activity expired (no participants), show retrieve button -> close method"
  // Assuming "expired" means current time > endTime
  const isExpired = (Date.now() / 1000) > item.endTime;
  const canClose = status === LuckypotStatus.ONGOING && isExpired && !hasParticipants;

  if (status == LuckypotStatus.ONGOING) {
      if (canCancel) {
          return (
              <div className="flex flex-col gap-2 p-4 bg-[#18181b] border border-white/5 rounded-2xl">
                  <div className="text-gray-400 text-sm mb-2">{t("cancel_desc")}</div>
                  <Button 
                      color="danger" 
                      variant="flat" 
                      onPress={handleCancel}
                      isLoading={isPending || isConfirming}
                  >
                      {t("cancel_btn")}
                  </Button>
              </div>
          );
      }
      if (canClose) {
        return (
            <div className="flex flex-col gap-2 p-4 bg-[#18181b] border border-white/5 rounded-2xl">
                <div className="text-gray-400 text-sm mb-2">{t("close_desc")}</div>
                <Button 
                    color="warning" 
                    variant="flat" 
                    onPress={handleClose}
                    isLoading={isPending || isConfirming}
                >
                    {t("close_btn")}
                </Button>
            </div>
        );
      }
      return <></>;
  }

  if (status == LuckypotStatus.CREATED)
    return (
      <div className="flex justify-center items-center bg-[#18181b] border border-white/5 py-6 rounded-2xl">
        <span className="cancel text-gray-400 font-medium">{t('creating')}</span>
      </div>
    );

  if (status == LuckypotStatus.CANCELLED)
    return (
      <div className="flex justify-center items-center bg-[#18181b] border border-white/5 py-6 rounded-2xl">
        <span className="text-gray-400 font-medium">{t('canceled')}</span>
      </div>
    );
  if (status == LuckypotStatus.FAILED)
    return (
      <div className="flex justify-center items-center bg-[#18181b] border border-white/5 py-6 rounded-2xl">
        <span className="text-red-400 font-medium">{t('failed')}</span>
      </div>
    );

  if (status == LuckypotStatus.DRAWING)
    return (
      <div
        className={cn(
          "flex flex-row justify-center items-center bg-[#18181b] border border-[#F0B90B]/30 gap-3 py-6 rounded-2xl shadow-[0_0_20px_rgba(240,185,11,0.1)]",
          [
            {
              "animate-pulse": status == LuckypotStatus.DRAWING,
            },
          ]
        )}
      >
        <span className="text-[#F0B90B] font-bold text-lg">{t('drawing')}</span>
        <Spinner size="sm" color="warning" />
      </div>
    );

  if (status == LuckypotStatus.ENDED && item.drawNumbers && item.prizeAmounts) {
    const ranks = [
      { label: t('grand_prize'), rank: 1, color: "warning", icon: <FirstPrizeBag />, text: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
      { label: t('second_prize'), rank: 2, color: "default", icon: <SecondPrizeBag />, text: "text-gray-300", bg: "bg-gray-500/10 border-gray-500/20" },
      { label: t('third_prize'), rank: 3, color: "danger", icon: <ThirdPrizeBag />, text: "text-amber-600", bg: "bg-amber-500/10 border-amber-500/20" },
      { label: t('consolation'), rank: 4, color: "primary", icon: <FourthPrizeBag />, text: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" }
    ];

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{t('winning_results')}</h3>
          {item.endEvent?.txHash && item.endEvent?.createdAt && (
            <AppLink
              href={`${chain?.blockExplorers?.default.url}/tx/${item.endEvent?.txHash}`}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>{t('draw_tx')} {new Date(item.endEvent.createdAt * 1000).toLocaleString()}</span>
              <Icon height={16} icon="fluent:share-16-regular" width={16} />
            </AppLink>
          )}
        </div>

        <div className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#18181b]">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 p-3 bg-white/5 text-xs text-gray-400 font-medium uppercase tracking-wider border-b border-white/5">
            <div className="col-span-1">{t('rank')}</div>
            <div className="col-span-3 text-center">{t('winning_no')}</div>
            <div className="col-span-3 text-right">{t('prize')}</div>
            <div className="col-span-5 text-right">{t('winner')}</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {ranks.map((rankInfo, index) => {
              const winner = item.winners && item.winners.length > index ? item.winners[index] : null;
              const drawNumber = item.drawNumbers && item.drawNumbers.length > index ? item.drawNumbers[index] : null;
              const prizeAmount = item.prizeAmounts && item.prizeAmounts.length > index ? item.prizeAmounts[index] : 0;

              return (
                <div key={index} className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/5 transition-colors">
                  {/* Rank */}
                  <div className="col-span-1 flex items-center gap-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${rankInfo.bg} ${rankInfo.text}`}>
                      {rankInfo.icon}
                    </div>
                  </div>

                  {/* Winning No */}
                  <div className="col-span-3 flex justify-center">
                    <span className="font-mono font-bold text-white tracking-widest bg-black/40 px-2 py-1 rounded border border-white/10">
                      {drawNumber}
                    </span>
                  </div>


                  {/* Prize */}
                  <div className="col-span-3 text-right">
                    <div className="font-mono font-bold text-white">
                      {tokenValue(prizeAmount,18).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-500">BNB</div>
                  </div>

                  {/* Winner */}
                  <div className="col-span-5 flex justify-end">
                    {winner ? (
                      <div className="flex items-center gap-2">
                        <UserLink
                          textClassName="text-white font-medium text-sm"
                          id={winner.id}
                          name={winner.name}
                          avatar={winner.avatar}
                          showIcon={true}
                          showName={true}
                          size={{ width: 24, height: 24 }}
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">{t('unclaimed')}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  return <></>;
};

export default StatusPane;
