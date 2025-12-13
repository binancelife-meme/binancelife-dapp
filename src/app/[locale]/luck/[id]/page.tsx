// "use client";

import { Metadata } from "next";

import LuckypotDetail from "@/components/_Games/Luckypots/Detail";
import Layout from "@/components/Layout";
import { AppConfig } from "@/config";
import { luckypotDetailFetch } from "@/hooks/fetch/luckypotDetailFetch";

export async function generateMetadata(props: {
  params: { id: string; version?: string };
}): Promise<Metadata> {
  const rsp = await luckypotDetailFetch({
    chainId: AppConfig.chainId,
    id: props.params.id,
  });

  return {
    title: `Win ${rsp.data?.title} | BinanceLife`,
    twitter: {
      images: rsp.data?.image,
    },
  };
}

export default function Detail(props: {
  params: { id: string; version?: string };
}) {
  return (
    <Layout>
      <LuckypotDetail
        id={props.params.id}
        version={props.params.version}
      />
    </Layout>
  );
}
