import { Metadata } from "next";

import CreateLuckypotPage from "@/components/_Games/Luckypots/Create";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title:
    "Creating Luckypot | BinanceLife",
};

export default function CreateLuckypot() {
  return (
    <Layout>
      <CreateLuckypotPage />
    </Layout>
  );
}
