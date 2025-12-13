import { User } from "../user";

export type RunType = string | "blockchain" | "platform";
export type PlayType = string | "luckypots" | "scratchers" | "flips" | "dices";
export type JoinState = "Joined" | "Pending" | "";
export enum LuckypotStatus {
  CREATED = 0, // the funder creates the luckypot
  ONGOING = 1, // the luckypot is open to enter
  DRAWING = 2, //  the luckypot is closed and requesting VRF
  ENDED = 3, // the luckypot is finished, and NFT and funds were transferred
  CANCELLED = 4, // the funder cancels the luckypot
  FAILED = 5, // no one join the luckypot and timeout
}

export enum PrizeType {
  NATIVE, // native token
  TOKEN, // ERC20
  NFT, // ERC721/ERC1155
}

export type PrizeStandard = "Navite" | "ERC20" | "ERC721" | "ERC1155";
export type LuckypotPrize = {
  prizeType: PrizeType;

  token?: string; // ERC20/ERC721/ERC1155 contract address
  tokenId?: string; // for NFT
  amount?: string; // number (can be a percentage, an id, an amount, etc. depending on the competition)

  name?: string; // ETH, USDT, Moonbird
  symbolOrCollection?: string; // USDT or CyptoPunk
  standard?: PrizeStandard;
  decimals?: number; // for Token
  value?: string; // NFT market value
  verify?: boolean;
};

export type TxEvent = {
  createdAt: number;
  txHash: string;
};

export class Token {
  address?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  tokenId?: string;
  tokenURI?: string;
  metadata?: TokenMetadata;
}

export class TokenMetadata {
  name?: string;
  image?: string;
  description?: string;
}

export type Luckypot = {
  id: string; // gloable indexed id

  luckypotId: number; // smartcontract luckypot id
  status: LuckypotStatus;

  useSqrtTickets: boolean;
  maxPerUser: number;
  startTime: number; // luckypot launch timestamp
  endTime: number; // luckypot deadline timestamp
  cancelTime?: number; // luckypot canceled timestamp
  closeTime?: number; // luckypot close/drawing timestamp
  finishTime?: number; // luckypot ended/picked winner timestamp

  funder?: User;

  prizeToken: Token;
  prizeAmount: number;
  sponsorAmount: number;

  powerToken: Token;
  powerUnit: number;

  totalTickets: number;
  participants: number;

  drawNumbers?: number[]; // win No.
  prizeAmounts?: number[]; // win amount
  prizeClaims?: boolean[]; // win claim status
  winners?: User[];

  // 100USDT, 10ETH, CryptoPunk
  title?: string;
  note?: string; // description
  image?: string;
  featured?: boolean;

  joinState?: JoinState;

  cancelEvent?: TxEvent;
  closeEvent?: TxEvent;
  endEvent?: TxEvent;

  createdAt: number;

  txHash: string;
};
