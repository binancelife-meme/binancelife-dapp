import { bsc, bscTestnet, localhost } from "wagmi/chains";

import { AppConfig } from "@/config";
import { ChainId } from "@/constants";

const currentChain =
  AppConfig.chainId === ChainId.BNB
    ? bsc
    : AppConfig.chainId === ChainId.BNB_TESTNET
    ? {
        ...bscTestnet,
        name: "BNB Testnet",
      }
    : {
        ...localhost,
        rpcUrls: {
          default: {
            http: ["http://localhost:8545"],
          },
        },
        blockExplorers: {
          default: {
            name: "localhost",
            url: "http://localhost",
          },
        },
        id: 1337,
        nativeCurrency: {
          name: "BNB",
          symbol: "BNB",
          decimals: 18,
        },
        testnet: true,
      };

export const chains = [currentChain];

