import { useMemo } from "react";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { getDeploysByName } from "@/constants/contracts/address";
import { ContractNames } from "@/constants/contracts/names";

import { useContractAbi } from "./useContractAbi";

export const usePowerBalance = (tokenAddress: Address, account: Address) => {
  const { chainId } = useAccount();
  const powerContractInfo = getDeploysByName(
    `${chainId}`,
    ContractNames.LuckyPower
  );
  const abi = useContractAbi(chainId, powerContractInfo?.address);
  const { data, status, refetch, ...rest } = useReadContract({
    chainId: chainId,
    abi: abi,
    address: powerContractInfo?.address as Address,
    functionName: "balanceOf",
    args: [account!, tokenAddress],
    query: {
      enabled: !!account,
    },
  });

  return {
    ...rest,
    refetch,
    fetchStatus: status,
    balance: useMemo(
      () => (typeof data !== "undefined" && data !== null ? BigInt(data.toString()) : 0n),
      [data]
    ),
  };
};

export default usePowerBalance;
