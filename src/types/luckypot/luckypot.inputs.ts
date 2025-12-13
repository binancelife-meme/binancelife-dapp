export type LuckypotCreateInputs = {
  startTime: BigInt;
  endTime: BigInt;
  maxPerUser: BigInt;
  powerToken: string;
  powerUnit: BigInt;
  prizeToken: string;
  prizeAmount: BigInt;
  useSqrtTickets: boolean;
  note: string;
};