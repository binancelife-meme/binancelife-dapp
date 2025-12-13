import { User } from "../user";

export type LuckypotTicket = {
  id: string;
  user: User;
  ticketId: string;
  ticketCount: number;
  currentSize: number;
  usePoints: string;
  note?: string;
  createdAt: number;
  txHash?: string;
};
