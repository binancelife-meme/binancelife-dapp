"use client";

import { useAccount } from "wagmi";

import Container from "@/components/Container";

import UserPower from "../_Power/UserPower";

import ActivityRecords from "./ActivityRecords";
import UserProfile from "./Profile/UserProfile";


const AccountPage = (props: { id: string }) => {

  const { address } = useAccount();

  return (
    <Container>
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 sm:gap-6 overflow-x-hidden pb-20 sm:pb-0">

        {/* Profile Header Card */}
        <UserProfile id={props.id} />

        {/* Stats Grid */}
        <UserPower walletAddress={address ?? ""} />

        {/* Activity Records */}
        <ActivityRecords userId={props.id} />

      </div>
    </Container>
  );
};

export default AccountPage;
