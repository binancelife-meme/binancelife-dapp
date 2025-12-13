import { User } from "../user";

import { Luckypot } from "./luckypot";

export type LuckypotSponsorRecord = {
  id: string;
  user: User;
  luckypot: Luckypot;
  sponsorAmount: string;
  note?: string;
  createdAt: number;
  txHash?: string;
};

export type LuckypotSponsor = {
  id: string;
  user: User;
  luckypot: Luckypot;
  sponsorAmount: string;
};
