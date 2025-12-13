import { User } from "../user";

export type ClaimPrizeRecord = {
  id: string;
  luckypot: { id: string };
  user: User;
  prizeToken?: string;
  prizeAmount?: string;
  winPlace?: number;
  createdAt: number;
  txHash: string;
};