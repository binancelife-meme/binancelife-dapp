import { ChainId } from "@/constants/chains/chainId";
import { ContractAddress } from "@/hooks/useContractAbi";

import { ContractNames } from "./names";

type AddressMapping = {
  [chainId in ChainId]?: {
    [contractName in ContractNames]?: ContractAddress;
  };
};

export const DeployAddress: AddressMapping = {
  [ChainId.LOCALHOST]: {
    [ContractNames.LuckypotContract]: {
      address: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    },
    [ContractNames.LuckyPower]: {
      address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    },
    [ContractNames.LuckyPowerMiner]: {
      address: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    },

  },
  [ChainId.BNB]: {
    [ContractNames.LuckypotContract]: {
      address: "",
    },
    [ContractNames.LuckyPower]: {
      address: "",
    },
    [ContractNames.LuckyPowerMiner]: {
      address: "",
    },
  },
  [ChainId.BNB_TESTNET]: {
    [ContractNames.LuckypotContract]: {
      address: "0x89488498B9c26fe2a9F83Fe096B308D823bdC7dC",
    },
    [ContractNames.LuckyPower]: {
      address: "0x73de61da53629DDefB17F7D035F47faE14743b60",
    },
    [ContractNames.LuckyPowerMiner]: {
      address: "0x5e9CDa0F6F7a151aC4C4319eFfa9b31868a7C51a",
    },
  },
};

export const getDeploysByName = (chainId: string, name?: ContractNames): any => {
  const contracts = DeployAddress[chainId as unknown as ChainId];
  if (!contracts || !name) {
    return undefined;
  }
  return {
    name: name as ContractNames,
    address: contracts[name]?.address,
    abi: name,
  };
};


export const getDeploysByAddress = (chainId: ChainId, address: string) => {
  const contracts = DeployAddress[chainId];
  if (!contracts) {
    return undefined;
  }

  for (const contractName in contracts) {
    if (contracts.hasOwnProperty(contractName)) {
      const contract = contracts[contractName as ContractNames];
      if (contract && contract.address === address) {
        return {
          name: contractName as ContractNames,
          address: contract.address,
          abi: contractName,
        };
      }
    }
  }

  return undefined;
};
