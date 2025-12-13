import { User } from "../user";

import { Luckypot } from "./luckypot";

export type LuckypotActivity = {
  id: string;
  user: User;
  luckypot: Luckypot;
  ticketId: number;
  ticketCount: number;
  currentSize: number;
  cost: number;
  note?: string;
  createdAt: string;
  txHash?: string;
};
