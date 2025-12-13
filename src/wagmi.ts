'use client';

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  okxWallet,
  binanceWallet,
  oneKeyWallet, walletConnectWallet,
  trustWallet,
  ledgerWallet,
  coin98Wallet
} from "@rainbow-me/rainbowkit/wallets";
import {
  bsc,
  bscTestnet,
  localhost,
} from "wagmi/chains";

import { AppConfig } from "./config";
import { uxuyWallet } from "./wallets/uxuyWallet";

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!alchemyApiKey || !walletConnectProjectId) {
  throw new Error("Some ENV variables are not defined");
}

const config = getDefaultConfig({
  appName: AppConfig.name,
  appIcon: "/img/logo.svg",
  projectId: walletConnectProjectId,
  // @ts-ignore ignore
  chains: [
    ...(process.env.NODE_ENV === "production"
      ? [{
        ...bsc,
      }, {
        ...bscTestnet,
        name: "BNB Testnet",
      }]
      : [{
        ...bscTestnet,
        name: "BNB Testnet",
      },
        // {
        //   ...localhost,
        //   rpcUrls: {
        //     default: {
        //       http: ["http://localhost:8545"],
        //     },
        //   },
        //   blockExplorers: {
        //     default: {
        //       name: "localhost",
        //       url: "http://localhost",
        //     },
        //   },
        //   id: 1337,
        //   nativeCurrency: {
        //     name: "BNB",
        //     symbol: "BNB",
        //     decimals: 18,
        //   },
        //   testnet: true,
        // },
      ]),
  ],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [binanceWallet, okxWallet, metaMaskWallet, walletConnectWallet],
    },
    {
      groupName: "More",
      wallets: [
        uxuyWallet,
        oneKeyWallet,
        ledgerWallet,
        trustWallet,
        coin98Wallet
      ],
    },
  ],
  ssr: true,
});

const { chains } = config;

export { config, chains };
