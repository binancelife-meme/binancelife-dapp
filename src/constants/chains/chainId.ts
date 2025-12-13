export enum ChainId {
  BNB = 56,
  BNB_TESTNET = 97,
  LOCALHOST = 1337
}

export const testnetChainIds = [
  ChainId.BNB_TESTNET,
  ChainId.LOCALHOST
]

export const isTestnet = (chainId: number) => {
  return testnetChainIds.includes(chainId);
}