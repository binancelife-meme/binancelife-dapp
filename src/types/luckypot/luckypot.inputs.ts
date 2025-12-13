import { Token } from "@/constants";

export type LuckypotCreateInputs = {
  startTime: BigInt;
  endTime: BigInt;
  maxPerUser: BigInt;
  powerToken: Token;
  powerUnit: BigInt;
  prizeToken: string;
  prizeAmount: BigInt;
  useSqrtTickets: boolean;
  note: string;
};