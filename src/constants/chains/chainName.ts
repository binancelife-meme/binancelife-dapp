import { ChainId } from "./chainId";

export const chainNames: Record<ChainId | number, string> = {
  [ChainId.BNB]: "bnb",
  [ChainId.BNB_TESTNET]: "bnb-testnet",
  [ChainId.LOCALHOST]: "localhost",
};

export const chainNameToChainId = Object.entries(chainNames).reduce(
  (acc, [chainId, chainName]) => {
    return {
      [chainName.toLocaleLowerCase()]: chainId as unknown as ChainId,
      ...acc,
    };
  },
  {} as Record<string, ChainId>
);

export const getChainIdByName = (name: string) => {
  return Number(chainNameToChainId[name.toLocaleLowerCase()]);
};

