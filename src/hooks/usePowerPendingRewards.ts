import { useMemo } from "react";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { AppConfig } from "@/config";
import { getDeploysByName } from "@/constants/contracts/address";
import { ContractNames } from "@/constants/contracts/names";

import { useContractAbi } from "./useContractAbi";

export const usePowerPendingRewards = (tokenAddress: Address) => {
  const { address: account } = useAccount();
  const chainId = AppConfig.chainId;
  const powerContractInfo = getDeploysByName(
    `${chainId}`,
    ContractNames.LuckyPowerMiner
  );
  const abi = useContractAbi(chainId, powerContractInfo?.address);
  const { data, status, refetch, ...rest } = useReadContract({
    chainId: chainId,
    abi: abi,
    address: powerContractInfo?.address as Address,
    functionName: "pendingPowers",
    args: [account!, tokenAddress],
    query: {
      enabled: !!account && !!tokenAddress,
      refetchInterval: 5000,
    },
  });

  return {
    ...rest,
    refetch,
    fetchStatus: status,
    balance: (typeof data !== "undefined" && data !== null ? BigInt(data.toString()) : 0n),
  };
};

export default usePowerPendingRewards;
