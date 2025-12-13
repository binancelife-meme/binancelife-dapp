import {
  Button,
  Input,
  Chip, Card,
  CardBody
} from "@heroui/react";
import {
  Pickaxe,
  TrendingUp,
  AlertCircle,
  Wallet,
  History,
  Zap
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { erc20Abi, parseEther } from "viem";
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt, useReadContract, usePublicClient } from "wagmi";

import { AppConfig } from "@/config";
import { ChainId } from "@/constants/chains";
import { getDeploysByName } from "@/constants/contracts/address";
import { ContractNames } from "@/constants/contracts/names";
import { POWER_TOKENS } from "@/constants/tokens/defaultToken";
import { usePowerStakeRecordQuery, usePowerStakeStatQuery } from "@/hooks/data/usePowerQuery";
import { useContractAbi } from "@/hooks/useContractAbi";
import usePowerPendingRewards from "@/hooks/usePowerPendingRewards";
import { tokenValue } from "@/utils/formatters";

const PowerStaking = () => {
  const t = useTranslations("powerStaking");
  const { address } = useAccount();
  const chainId = AppConfig.chainId as ChainId;
  const powerToken = POWER_TOKENS[chainId]?.[0];
  const publicClient = usePublicClient();

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

  const { data: userStakeStats, refetch: refetchUserStakeStats } = usePowerStakeStatQuery({
    chainId: AppConfig.chainId,
    user: address as `0x${string}`,
    token: powerToken?.address as `0x${string}`,
  });
  const userStakeStatData = userStakeStats?.data;

  const { balance: pendingPower, refetch: refetchPendingPower } = usePowerPendingRewards(powerToken?.address as `0x${string}`);

  const { data: stakes, refetch: refetchStakes, fetchNextPage, hasNextPage, isFetchingNextPage } = usePowerStakeRecordQuery({
    chainId: AppConfig.chainId,
    user: address as `0x${string}`,
    token: powerToken?.address as `0x${string}`,
    orderBy: "timestamp",
    orderDirection: "desc",
    first: 10
  });
  const [stakeAmount, setStakeAmount] = useState("");
  const [pendingStakeAmount, setPendingStakeAmount] = useState<string | null>(null);
  const approveHandledRef = useRef<string | null>(null);

  // Write Contracts
  const {
    writeContract: writeStake,
    data: stakeHash,
    isPending: isStakePending
  } = useWriteContract();

  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApprovePending
  } = useWriteContract();

  const {
    writeContract: writeUnstake,
    data: unstakeHash,
    isPending: isUnstakePending
  } = useWriteContract();

  const {
    writeContract: writeClaim,
    data: claimHash,
    isPending: isClaimPending
  } = useWriteContract();

  // Transaction Receipts
  const { isSuccess: isStakeSuccess, isLoading: isStakeConfirming } = useWaitForTransactionReceipt({ hash: stakeHash });
  const { 
    isSuccess: isApproveSuccess, 
    isLoading: isApproveConfirming,
    isError: isApproveReceiptError 
  } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: isUnstakeSuccess, isLoading: isUnstakeConfirming } = useWaitForTransactionReceipt({ hash: unstakeHash });
  const { isSuccess: isClaimSuccess, isLoading: isClaimConfirming } = useWaitForTransactionReceipt({ hash: claimHash });

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

  // Helper to execute stake
  const executeStake = async (amount: string) => {
    if (!luckyPowerMinerAbi || !powerToken?.address || !contractInfo?.address) return;
    const amountWei = parseEther(amount);

    // Simulate transaction
    try {
      if (!publicClient) {
        toast.error(t("action.error_public_client"));
        return;
      }
      await publicClient.simulateContract({
        address: contractInfo?.address as `0x${string}`,
        abi: luckyPowerMinerAbi,
        functionName: "stake",
        args: [powerToken.address, amountWei],
        account: address,
      });
    } catch (error: any) {
      console.error("Simulation error:", error);
      const errorMessage = error?.shortMessage || error?.message || t("action.error_simulation");
      toast.error(`${t("action.error_simulation")}: ${errorMessage}`);
      return;
    }

    writeStake({
      address: contractInfo?.address as `0x${string}`,
      abi: luckyPowerMinerAbi,
      functionName: "stake",
      args: [powerToken.address, amountWei],
      chainId
    });
  };

  // Effects
  useEffect(() => {
    if (isStakeSuccess) {
      toast.success(t("action.success_stake"));
      setStakeAmount("");
      refetchStakes();
      refetchAllowance();
      refetchUserStakeStats();
      refetchPendingPower();
    }
  }, [isStakeSuccess, refetchStakes, refetchAllowance, refetchUserStakeStats, refetchPendingPower, t]);

  useEffect(() => {
    if (isApproveSuccess && approveHash && approveHandledRef.current !== approveHash) {
      approveHandledRef.current = approveHash;
      toast.success(t("action.success_approve"));
      refetchAllowance();
      if (pendingStakeAmount) {
        executeStake(pendingStakeAmount);
        setPendingStakeAmount(null);
      }
    }
  }, [isApproveSuccess, approveHash, refetchAllowance, t, pendingStakeAmount]);

  useEffect(() => {
    if (isApproveReceiptError) {
      setPendingStakeAmount(null);
    }
  }, [isApproveReceiptError]);

  useEffect(() => {
    if (isUnstakeSuccess) {
      toast.success(t("action.success_unstake"));
      refetchStakes();
      refetchUserStakeStats();
      refetchPendingPower();
    }
  }, [isUnstakeSuccess, refetchStakes, refetchUserStakeStats, refetchPendingPower, t]);

  useEffect(() => {
    if (isClaimSuccess) {
      toast.success(t("action.success_claim"));
      refetchStakes();
      refetchUserStakeStats();
      refetchPendingPower();
    }
  }, [isClaimSuccess, refetchStakes, refetchUserStakeStats, refetchPendingPower, t]);

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
        setPendingStakeAmount(null);
      }
    });
  };

  const handleStake = async () => {
    if (!stakeAmount || !luckyPowerMinerAbi || !powerToken?.address) return;
    const amountWei = parseEther(stakeAmount);

    if (!allowance || allowance < amountWei) {
      setPendingStakeAmount(stakeAmount);
      handleApprove(stakeAmount);
      return;
    }

    executeStake(stakeAmount);
  };

  const handleClaim = async () => {
    if (!luckyPowerMinerAbi || !powerToken?.address) return;
    if (!pendingPower || (pendingPower as bigint) === 0n) {
      toast.error(t("action.error_no_claimable"));
      return;
    }

    try {
      if (!publicClient) {
        toast.error(t("action.error_public_client"));
        return;
      }
      await publicClient.simulateContract({
        address: contractInfo?.address as `0x${string}`,
        abi: luckyPowerMinerAbi,
        functionName: "claim",
        args: [powerToken.address],
        account: address,
      });
    } catch (error: any) {
      const errorMessage = error?.shortMessage || error?.message || t("action.error_simulation");
      toast.error(`${t("action.error_simulation")}: ${errorMessage}`);
      return;
    }

    writeClaim({
      address: contractInfo?.address as `0x${string}`,
      abi: luckyPowerMinerAbi,
      functionName: "claim",
      args: [powerToken.address],
      chainId
    });
  };

  const handleUnstakeAll = async () => {
    if (!userStakeStatData || Number(userStakeStatData.staking) <= 0) {
      toast.error(t("action.error_no_staked"));
      return;
    }
    if (!luckyPowerMinerAbi || !powerToken?.address) return;

    const amountWei = (userStakeStatData.staking);

    try {
      if (!publicClient) {
        toast.error(t("action.error_public_client"));
        return;
      }
      await publicClient.simulateContract({
        address: contractInfo?.address as `0x${string}`,
        abi: luckyPowerMinerAbi,
        functionName: "unstake",
        args: [powerToken.address, amountWei],
        account: address,
      });
    } catch (error: any) {
      const errorMessage = error?.shortMessage || error?.message || t("action.error_simulation");
      toast.error(`${t("action.error_simulation")}: ${errorMessage} ${userStakeStatData.staking}`);
      return;
    }

    writeUnstake({
      address: contractInfo?.address as `0x${string}`,
      abi: luckyPowerMinerAbi,
      functionName: "unstake",
      args: [powerToken.address, amountWei],
      chainId
    });
  };

  const handleMaxStake = () => {
    if (balanceData) {
      setStakeAmount(balanceData.formatted);
    }
  };

  const handlePercentStake = (percent: number) => {
    if (balanceData) {
      const amount = Number(balanceData.formatted) * percent;
      setStakeAmount(amount.toString());
    }
  };

  const items = stakes?.pages?.flatMap((page: any) => page.data) || [];

  return (
    <Card className="bg-white/5 border border-white/10 p-2 h-full">
      <CardBody>
        <div className="flex items-center gap-2 mb-6">
          <Pickaxe className="w-5 h-5 text-yellow-400" />
          <span className="text-xl font-bold text-white">{t("title")}</span>
        </div>

        <div className="flex flex-col gap-8">
          {/* Action Panel */}
          <div className="flex flex-col gap-6">


            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-gray-400 px-1">
                <span>{t("action.stake_amount")}</span>
                <div className="flex items-center gap-1">
                  <Wallet className="w-3 h-3" />
                  <span>{t("action.available")}: {balanceData ? Number(balanceData.formatted).toLocaleString() : "0.00"} {powerToken?.symbol}</span>
                </div>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                value={stakeAmount}
                onValueChange={setStakeAmount}
                classNames={{
                  inputWrapper: "bg-white/5 border-white/10 hover:bg-white/10",
                  input: "text-white text-lg font-mono",
                }}
                endContent={
                  <div className="flex min-w-[120px] justify-end items-center gap-2">
                    <span
                      className="text-xs text-yellow-400 cursor-pointer hover:underline"
                      onClick={handleMaxStake}
                    >
                      {t("action.max")}
                    </span>
                    <span className="text-gray-400 text-sm">{powerToken?.symbol}</span>
                  </div>
                }
              />
              <div className="flex gap-2 text-xs text-gray-500 px-1">
                <AlertCircle className="w-3 h-3" />
                <span>{t("action.tips")}</span>
              </div>
              <div className="flex gap-2 mt-1">
                {[0.1, 0.25, 0.5, 1].map((percent) => (
                  <Button
                    key={percent}
                    size="sm"
                    variant="flat"
                    className="flex-1 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={() => handlePercentStake(percent)}
                  >
                    {percent * 100}%
                  </Button>
                ))}
              </div>
            </div>

            {Number(stakeAmount) > 0 &&
              <div className="bg-yellow-400/10 p-4 rounded-xl border border-yellow-400/20">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-bold">{t("action.preview_mining")}</span>
                </div>
                <div className="text-3xl font-bold text-white font-mono">
                  {stakeAmount ? (Number(stakeAmount) * 0.2).toLocaleString() : "0"}
                  <span className="text-sm text-gray-400 ml-2 font-normal">{t("action.power_per_day")}</span>
                </div>
              </div>
            }

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-yellow-400 text-black font-bold shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                onClick={handleStake}
                isLoading={isStakePending || isStakeConfirming || isApprovePending || isApproveConfirming}
              >
                {isApprovePending || isApproveConfirming ? t("action.approve_loading") :
                  isStakePending || isStakeConfirming ? t("action.stake_loading") :
                    (allowance && stakeAmount && allowance < parseEther(stakeAmount)) ? t("action.approve") : t("action.stake")}
              </Button>
            </div>
          </div>

          {/* My Staking Group */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4 text-white">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="font-bold">{t("my_staking.title")}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">{t("my_staking.total_staked")}</span>
                <span className="text-lg font-bold text-white font-mono">{tokenValue(userStakeStatData?.staked || "0", 18).toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">{t("my_staking.current_staked")}</span>
                <span className="text-lg font-bold text-white font-mono">{tokenValue(userStakeStatData?.staking || "0", 18).toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">{t("my_staking.claimed_power")}</span>
                <span className="text-lg font-bold text-white font-mono">{tokenValue(userStakeStatData?.claimedPowers || "0", 18).toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">{t("my_staking.pending_power")}</span>
                <span className="text-lg font-bold text-yellow-400 font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {tokenValue(Number(pendingPower), 18).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                size="sm"
                className="flex-1 bg-white/10 text-white font-bold border border-white/20"
                onClick={handleUnstakeAll}
                isLoading={isUnstakePending || isUnstakeConfirming}
              >
                {isUnstakePending || isUnstakeConfirming ? t("action.unstake_loading") : t("action.unstake")}
              </Button>
              <Button
                size="sm"
                variant="flat"
                className="flex-1 bg-green-500/20 text-green-400 font-bold border border-green-500/30"
                onClick={handleClaim}
                isLoading={isClaimPending || isClaimConfirming}
              >
                {isClaimPending || isClaimConfirming ? t("action.claim_loading") : t("action.claim")}
              </Button>
            </div>
          </div>

          {/* History Panel */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <History className="w-5 h-5 text-gray-400" />
              <span className="font-bold">{t("history.title")}</span>
            </div>

            <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {items && items.length > 0 ? (
                <>
                  {items.map((stake: any, idx: number) => stake && (
                    <div key={idx} className="relative bg-white/5 rounded-xl p-4 border border-white/10 group hover:border-yellow-400/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Pickaxe className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white font-mono">{tokenValue(stake.amount, 18).toLocaleString()} {powerToken?.symbol}</div>
                            <Chip size="sm" color={stake.type === "STAKE" ? "success" : "danger"} variant="flat" className="h-5 text-xs">{stake.type}</Chip>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">{new Date(stake.timestamp * 1000).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {hasNextPage && (
                    <Button
                      variant="flat"
                      className="w-full text-gray-400 hover:text-white"
                      isLoading={isFetchingNextPage}
                      onClick={() => fetchNextPage()}
                    >
                      {t("history.load_more")}
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                  <Pickaxe className="w-12 h-12 mb-3 opacity-20" />
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

export default PowerStaking;
