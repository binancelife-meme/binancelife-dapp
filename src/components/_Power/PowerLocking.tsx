import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  RadioGroup,
  Radio,
  cn
} from "@heroui/react";
import { isEmpty } from "lodash";
import {
  Lock,
  Timer,
  Wallet,
  Zap,
  Clock
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { erc20Abi, formatEther, parseEther } from "viem";
import { useAccount, useBalance, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import CountDown from "@/components/CountDown";
import { AppConfig } from "@/config";
import { ChainId } from "@/constants/chains";
import { getDeploysByName } from "@/constants/contracts/address";
import { ContractNames } from "@/constants/contracts/names";
import { POWER_TOKENS } from "@/constants/tokens/defaultToken";
import { usePowerLockRecordQuery } from "@/hooks/data/usePowerQuery";
import { useContractAbi } from "@/hooks/useContractAbi";
import { tokenValue } from "@/utils/formatters";


const PowerLocking = () => {
  const t = useTranslations("powerLocking");
  const { address } = useAccount();
  const chainId = AppConfig.chainId as ChainId;
  const powerToken = POWER_TOKENS[chainId]?.[0];

  // Contract Info
  const contractInfo = getDeploysByName(
    `${chainId}`,
    ContractNames.LuckyPowerMiner
  );
  const luckyPowerMinerAbi = useContractAbi(chainId, contractInfo?.address);

  const { data: balanceData } = useBalance({
    address: address,
    token: powerToken?.address as `0x${string}`,
    chainId: chainId,
  });

  const { data: locks, refetch: refetchLocks } = usePowerLockRecordQuery({
    chainId,
    user: address,
    token: powerToken?.address as `0x${string}`,
    orderBy: "timestamp",
    orderDirection: "desc",
  });

  const [lockAmount, setLockAmount] = useState("");
  const [lockDuration, setLockDuration] = useState("3");
  const [pendingLockParams, setPendingLockParams] = useState<{ amount: string; duration: string } | null>(null);
  const approveHandledRef = useRef<string | null>(null);

  // Write Contracts
  const {
    writeContract: writeLock,
    data: lockHash,
    isPending: isLockPending
  } = useWriteContract();

  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApprovePending
  } = useWriteContract();

  const {
    writeContract: writeUnlock,
    data: unlockHash,
    isPending: isUnlockPending
  } = useWriteContract();

  // Transaction Receipts
  const { isSuccess: isLockSuccess, isLoading: isLockConfirming } = useWaitForTransactionReceipt({ hash: lockHash });
  const {
    isSuccess: isApproveSuccess,
    isLoading: isApproveConfirming,
    isError: isApproveReceiptError
  } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: isUnlockSuccess, isLoading: isUnlockConfirming } = useWaitForTransactionReceipt({ hash: unlockHash });

  // Read Allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: powerToken?.address as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address as `0x${string}`, contractInfo?.address as `0x${string}`],
    chainId,
    query: {
      enabled: !!address && !!powerToken?.address && !!contractInfo?.address,
    }
  });

  // Helper to execute lock
  const executeLock = (amount: string, duration: string) => {
    if (!luckyPowerMinerAbi || !powerToken?.address || !contractInfo?.address) return;
    const amountWei = parseEther(amount);
    const durationSeconds = BigInt(duration) * BigInt(86400);

    writeLock({
      address: contractInfo?.address as `0x${string}`,
      abi: luckyPowerMinerAbi,
      functionName: "lock",
      args: [powerToken.address, amountWei, durationSeconds],
      chainId
    });
  };

  // Effects
  useEffect(() => {
    if (isLockSuccess) {
      toast.success(t("action.success_lock"));
      setLockAmount("");
      refetchLocks();
      refetchAllowance();
    }
  }, [isLockSuccess, refetchLocks, refetchAllowance, t]);

  useEffect(() => {
    if (isApproveSuccess && approveHash && approveHandledRef.current !== approveHash) {
      approveHandledRef.current = approveHash;
      toast.success(t("action.success_approve"));
      refetchAllowance();
      if (pendingLockParams) {
        executeLock(pendingLockParams.amount, pendingLockParams.duration);
        setPendingLockParams(null);
      }
    }
  }, [isApproveSuccess, approveHash, refetchAllowance, t, pendingLockParams]);

  useEffect(() => {
    if (isApproveReceiptError) {
      setPendingLockParams(null);
    }
  }, [isApproveReceiptError]);

  useEffect(() => {
    if (isUnlockSuccess) {
      toast.success(t("action.success_unlock"));
      refetchLocks();
    }
  }, [isUnlockSuccess, refetchLocks, t]);

  // Actions
  const handleApprove = (amount: string) => {
    if (!powerToken?.address || !contractInfo?.address) return;
    writeApprove({
      address: powerToken.address as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [contractInfo?.address as `0x${string}`, parseEther(amount)],
      chainId
    }, {
      onError: () => {
        setPendingLockParams(null);
      }
    });
  };

  const handleLock = () => {
    if (!lockAmount || !luckyPowerMinerAbi || !powerToken?.address) return;

    const amountWei = parseEther(lockAmount);
    // const durationSeconds = BigInt(lockDuration) * BigInt(86400);

    if (!allowance || allowance < amountWei) {
      setPendingLockParams({ amount: lockAmount, duration: lockDuration });
      handleApprove(lockAmount);
      return;
    }

    executeLock(lockAmount, lockDuration);
  };

  const handleUnlock = (lockIndex: number) => {
    if (!luckyPowerMinerAbi || !powerToken?.address) return;

    writeUnlock({
      address: contractInfo?.address as `0x${string}`,
      abi: luckyPowerMinerAbi,
      functionName: "unlock",
      args: [powerToken.address, BigInt(lockIndex)],
      chainId
    });
  };

  const handleMaxLock = () => {
    if (balanceData) {
      setLockAmount(balanceData.formatted);
    }
  };


  const items = locks?.pages?.flatMap((page: any) => page.data).filter((it: any) => !isEmpty(it)) || [];

  const lockDurations = [
    { label: `3 ${t("duration_options.day")} (1.0x)`, value: "3", multiplier: 1.0 },
    { label: `7 ${t("duration_options.day")} (1.2x)`, value: "7", multiplier: 1.2 },
    { label: `30 ${t("duration_options.day")} (1.2x)`, value: "30", multiplier: 1.2 },
    { label: `90 ${t("duration_options.day")} (1.2x)`, value: "90", multiplier: 1.2 },
  ];

  const CustomRadio = (props: any) => {
    const { children, ...otherProps } = props;

    return (
      <Radio
        {...otherProps}
        classNames={{
          base: cn(
            "inline-flex m-0 bg-white/5 hover:bg-white/10 items-center justify-between",
            "flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-2 border-2 border-transparent",
            "data-[selected=true]:border-purple-400 data-[selected=true]:bg-purple-500/10"
          ),
          wrapper: "group-data-[selected=true]:border-purple-400",
          control: "bg-purple-500",
          labelWrapper: "w-full",
        }}
      >
        {children}
      </Radio>
    );
  };

  return (
    <Card className="bg-white/5 border border-white/10 p-2 h-full">
      <CardBody>
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-purple-400" />
          <span className="text-xl font-bold text-white">{t("title")}</span>
        </div>

        <div className="flex flex-col gap-8">
          {/* Action Panel */}
          <div className="flex flex-col gap-6">


            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-gray-400 px-1">
                  <span>{t("action.lock_amount")}</span>
                  <div className="flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    <span>{t("action.available")}: {balanceData ? Number(balanceData.formatted).toLocaleString() : "0.00"} {powerToken?.symbol || t("site.name")}</span>
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={lockAmount}
                  onValueChange={setLockAmount}
                  classNames={{
                    inputWrapper: "bg-white/5 border-white/10 hover:bg-white/10",
                    input: "text-white text-lg font-mono",
                  }}
                  endContent={
                    <div className="flex min-w-[120px] justify-end items-center gap-2">
                      <span
                        className="text-xs text-yellow-400 cursor-pointer hover:underline"
                        onClick={handleMaxLock}
                      >
                        {t("action.max")}
                      </span>
                      <span className="text-gray-400 text-sm">{powerToken?.symbol || t("site.name")}</span>
                    </div>
                  }
                />
              </div>

              <RadioGroup
                label={t("action.duration")}
                value={lockDuration}
                onValueChange={setLockDuration}
                classNames={{
                  label: "text-xs text-gray-400 px-1 mb-1",
                  wrapper: "grid grid-cols-2 gap-2"
                }}
              >
                {lockDurations.map((d) => (
                  <CustomRadio key={d.value} value={d.value}>
                    <div className="flex justify-between items-center w-full px-1">
                      <span className="text-sm font-bold text-white">{d.label.split('(')[0]}</span>
                      <Chip size="sm" color="warning" variant="flat" className="h-5 text-xs px-1">{d.label.split('(')[1].replace(')', '')}</Chip>
                    </div>
                  </CustomRadio>
                ))}
              </RadioGroup>
            </div>

            {Number(lockAmount) > 0 &&
              <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-bold">{t("action.preview_power")}</span>
                </div>
                <div className="text-3xl font-bold text-white font-mono">
                  {lockAmount ? (Number(lockAmount) * (lockDurations.find(d => d.value === lockDuration)?.multiplier || 1) * Number(lockDuration) / 3).toLocaleString() : "0"}
                  <span className="text-sm text-gray-400 ml-2 font-normal">{t("action.power")}</span>
                </div>
              </div>}

            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              onClick={handleLock}
              isLoading={isLockPending || isLockConfirming || isApprovePending || isApproveConfirming}
            >
              {isApprovePending || isApproveConfirming ? t("action.approve_loading") :
                isLockPending || isLockConfirming ? t("action.lock_loading") : t("action.confirm_lock")}
            </Button>
          </div>

          {/* History Panel */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <Timer className="w-5 h-5 text-gray-400" />
              <span className="font-bold">{t("history.title")}</span>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {address && items && items.length > 0 ? (
                items.map((lock: any, idx: number) => {
                  const isUnlocked = lock.unlockTxHash && lock.unlockTxHash !== "0x";
                  const unlockTime = Number(lock.unlockTime) * 1000;
                  const isExpired = Date.now() > unlockTime;
                  const canUnlock = !isUnlocked && isExpired;

                  return (
                    <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 relative overflow-hidden transition-all hover:bg-white/10">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                            <Lock className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">{t("history.locked_amount")}</span>
                              <div className="text-md font-bold text-white font-mono">
                                {tokenValue(lock?.amount, 18).toLocaleString()} {powerToken.symbol}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">{t("history.power_amount")}</span>
                              <div className="text-md font-bold text-yellow-400 font-mono">
                                {tokenValue(lock?.powers, 18).toLocaleString()}
                              </div>

                            </div>

                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-sm">
                          <Chip
                            size="sm"
                            color={isUnlocked ? "default" : canUnlock ? "success" : "warning"}
                            variant="flat"
                            className="h-6"
                          >
                            {isUnlocked
                              ? t("history.status.withdrawn")
                              : canUnlock
                                ? t("history.status.unlocked")
                                : t("history.status.locked")}
                          </Chip>

                          {!isUnlocked && canUnlock && (
                            <Button
                              size="sm"
                              color="success"
                              variant="solid"
                              className="h-7 min-w-[60px] px-3 font-bold"
                              onClick={() => handleUnlock(lock.lockIndex)}
                              isLoading={isUnlockPending || isUnlockConfirming}
                            >
                              {isUnlockPending || isUnlockConfirming
                                ? t("history.action.unlocking")
                                : t("history.action.unlock")}
                            </Button>
                          )}

                          <div className="flex items-center gap-2 mt-1">
                            <Chip size="sm" variant="flat" color="secondary" className="h-5 text-xs px-1">
                              {(lock.unlockTime - lock.timestamp) / (60 * 60 * 24)} {t("duration_options.day")}
                            </Chip>
                            <span className="text-xs text-gray-500">|</span>
                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <div className="font-mono text-gray-400">
                                {isUnlocked || isExpired ? (
                                  new Date(unlockTime).toLocaleDateString()
                                ) : (
                                  <CountDown eventTime={unlockTime} className="font-mono text-yellow-400 font-bold" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                  <Lock className="w-12 h-12 mb-3 opacity-20" />
                  <span className="text-sm">{t("history.no_records")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PowerLocking;
