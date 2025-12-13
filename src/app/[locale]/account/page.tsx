"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import WalletConnector from "@/components/WalletConnector";
import { useRouter } from "@/libs/i18nNavigation";

export default function Account() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.replace(`/account/${address}`);
    }
  }, [address, router]);

  if (isConnected) {
    // Loading
    return <Loading />
  }
  return <Layout><WalletConnector /></Layout>;
}
