import { Token } from "@/constants";

import { User } from "../user";

export type UserStat = {
  id: string;
  user: User;
  createCount: number;
  sponsorCount: number;
  joinCount: number;
  winCount: number;
};

export type UserTokenStat = {
  id: string;
  user: User;
  token: Token;
  createAmount: string;
  sponsorAmount: string;
  joinAmount: string;
  winAmount: string;
};
