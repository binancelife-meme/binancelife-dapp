import { Metadata } from "next";

import LuckypotList from "@/components/_Games/Luckypots/List";
import Layout from "@/components/Layout";
import { LuckypotStatus, PrizeType } from "@/types/luckypot";

export const metadata: Metadata = {
  title:
    "Luckypots - Luck Awaits at Every Draw, Every Ticket Holds a Chance | BinanceLife",
};

// Mock data for Luckypots
const MOCK_LUCKYPOTS = [
  {
    id: "mock-1",
    luckypotId: 1001,
    status: LuckypotStatus.ONGOING,
    title: "100 USDT Prize Pool",
    prizeToken: {
      symbol: "USDT",
      name: "Tether USD",
      decimals: 18,
    },
    prizeAmount: 100,
    powerToken: {
      symbol: "BNB",
      decimals: 18,
    },
    powerUnit: 0.01,
    totalTickets: 1000,
    participants: 450,
    startTime: Date.now(),
    endTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    sponsorAmount: 2.5,
    prizeType: PrizeType.TOKEN,
    createdAt: Date.now(),
    txHash: "0x...",
    useSqrtTickets: false,
    maxPerUser: 100,
  },
  {
    id: "mock-2",
    luckypotId: 1002,
    status: LuckypotStatus.ONGOING,
    title: "Bored Ape NFT #4521",
    prizeToken: {
      symbol: "BAYC",
      name: "Bored Ape Yacht Club",
      decimals: 0,
      metadata: {
        image: "https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&dpr=1&w=1000",
      }
    },
    prizeAmount: 1,
    powerToken: {
      symbol: "ETH",
      decimals: 18,
    },
    powerUnit: 0.05,
    totalTickets: 500,
    participants: 120,
    startTime: Date.now() - 24 * 60 * 60 * 1000,
    endTime: Date.now() + 2 * 60 * 60 * 1000, // 2 hours from now
    sponsorAmount: 5.0,
    prizeType: PrizeType.NFT,
    createdAt: Date.now(),
    txHash: "0x...",
    useSqrtTickets: true,
    maxPerUser: 10,
  },
  {
    id: "mock-3",
    luckypotId: 1003,
    status: LuckypotStatus.DRAWING,
    title: "50 BNB Grand Prize",
    prizeToken: {
      symbol: "BNB",
      name: "Binance Coin",
      decimals: 18,
    },
    prizeAmount: 50,
    powerToken: {
      symbol: "USDT",
      decimals: 18,
    },
    powerUnit: 10,
    totalTickets: 2000,
    participants: 1800,
    startTime: Date.now() - 48 * 60 * 60 * 1000,
    endTime: Date.now() - 1 * 60 * 1000, // Just ended
    sponsorAmount: 10.5,
    prizeType: PrizeType.NATIVE,
    createdAt: Date.now(),
    txHash: "0x...",
    useSqrtTickets: false,
    maxPerUser: 50,
  },
  {
    id: "mock-4",
    luckypotId: 1004,
    status: LuckypotStatus.ENDED,
    title: "Weekly 1000 USDT",
    prizeToken: {
      symbol: "USDT",
      name: "Tether USD",
      decimals: 18,
    },
    prizeAmount: 1000,
    powerToken: {
      symbol: "BNB",
      decimals: 18,
    },
    powerUnit: 0.1,
    totalTickets: 5000,
    participants: 4900,
    startTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
    endTime: Date.now() - 2 * 24 * 60 * 60 * 1000, // Ended 2 days ago
    sponsorAmount: 15.0,
    prizeType: PrizeType.TOKEN,
    createdAt: Date.now(),
    txHash: "0x...",
    useSqrtTickets: true,
    maxPerUser: 200,
    winners: [
      {
        id: "winner-1",
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        name: "LuckyWinner",
        avatar: "https://i.pravatar.cc/150?u=1",
      }
    ],
    prizeAmounts: [1000],
    drawNumbers: [1234]
  },
  {
    id: "mock-5",
    luckypotId: 1005,
    status: LuckypotStatus.ONGOING,
    title: "CryptoPunks #7804",
    prizeToken: {
      symbol: "PUNK",
      name: "CryptoPunks",
      decimals: 0,
      metadata: {
        image: "https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&dpr=1&w=1000",
      }
    },
    prizeAmount: 1,
    powerToken: {
      symbol: "ETH",
      decimals: 18,
    },
    powerUnit: 0.1,
    totalTickets: 100,
    participants: 15,
    startTime: Date.now(),
    endTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    sponsorAmount: 20.0,
    prizeType: PrizeType.NFT,
    createdAt: Date.now(),
    txHash: "0x...",
    useSqrtTickets: true,
    maxPerUser: 5,
  },
];

export default function Luckypots() {
  return <Layout> <LuckypotList  /></Layout>;
}
