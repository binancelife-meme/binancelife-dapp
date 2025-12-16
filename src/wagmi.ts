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

import { AppConfig } from "./config";
import { chains } from "./constants/chains";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined");
}

export const config = getDefaultConfig({
  appName: AppConfig.name,
  appIcon: "/img/logo.svg",
  projectId: walletConnectProjectId,
  chains: chains as any,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [binanceWallet, okxWallet, metaMaskWallet, walletConnectWallet],
    },
    {
      groupName: "More",
      wallets: [
        oneKeyWallet,
        ledgerWallet,
        trustWallet,
        coin98Wallet
      ],
    },
  ],
  ssr: false,
});

export { chains };
