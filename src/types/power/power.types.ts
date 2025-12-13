import { Token } from "../luckypot";
import { User } from "../user";

export type StakeRecord = {
  id: string;
  user: User | { id: string };
  token: string;
  type: string;
  amount: string;
  txHash: string;
  timestamp: number;
};

export type UserStake = {
  id: string;
  user: User | { id: string };
  token: Token;
  staked: string;
  unstaked: string;
  staking: string;
  claimedPowers: string;
};

export type LockRecord = {
  id: string;
  user: User | { id: string };
  token: Token;
  amount: string;
  unlockTime: number;
  powers: string;
  lockIndex: number;
  txHash: string;
  timestamp: number;
  active: boolean;
  unlockTxHash?: string;
  unlockTimestamp?: number;
};

export type UserLockStat = {
  id: string;
  user: User | { id: string };
  token: Token;
  locked: string;
  unlocked: string;
  locking: string;
  powers: string;
};

export type UserPower = {
  id: string;
  user: User | { id: string };
  token: Token;
  balance: string;
  totalCredit: string;
  totalDebit: string;
};