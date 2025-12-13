import { Luckypot, LuckypotStatus, JoinState } from "@/types/luckypot";
import { User } from "@/types/user";

const mockFunder: User = {
  id: "0x1234567890123456789012345678901234567890",
  name: "Crypto King",
  avatar: "https://i.pravatar.cc/150?u=funder1",
  verify: true,
};

const mockWinner: User = {
  id: "0x0987654321098765432109876543210987654321",
  name: "Lucky Winner",
  avatar: "https://i.pravatar.cc/150?u=winner1",
  verify: false,
}

// NOTE: The `powerCost` field is added here to match the UI component's expectation.
// The canonical field in the `Luckypot` type is `powerUnit`.
export const mockLuckypots: (Luckypot & { powerCost?: number })[] = [
  {
    id: "1",
    luckypotId: 101,
    title: "10 BNB",
    note: "A high-stakes lottery for a chance to win 1 BNB. Are you feeling lucky?",
    status: LuckypotStatus.ONGOING,
    maxPerUser: 10,
    startTime: Date.now() - 3600 * 1000 * 2, // 2 hours ago
    endTime: Date.now() + 3600 * 1000 * 22, // 22 hours from now
    funder: mockFunder,
    prizeToken: {
      name: "BNB",
      symbol: "BNB",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    },
    prizeAmount: 100000000000000000,
    sponsorAmount: 1,
    powerToken: {
      name: "Power",
      symbol: "PWR",
    },
    powerUnit: 100,
    totalTickets: 1500,
    participants: 250,
    joinState: "Joined",
    createdAt: Date.now() - 3600 * 1000 * 2,
    txHash: "0xabc123...",
    powerCost: 100,
    useSqrtTickets: true,
  },
  {
    id: "2",
    luckypotId: 102,
    title: "1000 USDT",
    note: "Last chance to enter the Ethereum jackpot. Don't miss out!",
    status: LuckypotStatus.ONGOING,
    maxPerUser: 5,
    startTime: Date.now() - 3600 * 1000 * 24 * 2, // 2 days ago
    endTime: Date.now() + 3600 * 1000 * 1, // 30 minutes from now
    funder: {
      id: "0xabcdef1234567890abcdef1234567890abcdef12",
      name: "ETH Whale",
      avatar: "https://i.pravatar.cc/150?u=funder2",
      verify: true,
    },
    prizeToken: {
      name: "USDT",
      symbol: "USDT",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    },
    prizeAmount: 100000000000000000,
    sponsorAmount: 1,
    powerToken: {
      name: "Power",
      symbol: "PWR",
    },
    powerUnit: 50,
    totalTickets: 800,
    participants: 120,
    joinState: "Pending",
    createdAt: Date.now() - 3600 * 1000 * 24 * 2,
    txHash: "0xdef456...",
    powerCost: 50,
  },
  {
    id: "3",
    luckypotId: 103,
    title: "1 BNB",
    note: "To the moon! A massive SHIB giveaway for the community.",
    status: LuckypotStatus.ENDED,
    maxPerUser: 20,
    startTime: Date.now() - 3600 * 1000 * 72, // 3 days ago
    endTime: Date.now() - 3600 * 1000 * 24, // 1 day ago
    finishTime: Date.now() - 3600 * 1000 * 23,
    funder: mockFunder,
    drawNumbers: [190, 2012, 30, 3],
    prizeAmounts: [10000000000000000000000000,1000000000000000000000000,100000000000000000000000,10000000000000000000000],
    prizeToken: {
      name: "SHIB",
      symbol: "SHIB",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
    },
    prizeAmount: 10000000000000000000000000,
    sponsorAmount: 5000000,
    powerToken: {
      name: "Power",
      symbol: "PWR",
    },
    powerUnit: 10,
    totalTickets: 5000,
    participants: 1500,
    winners: [mockWinner],
    createdAt: Date.now() - 3600 * 1000 * 72,
    txHash: "0xghi789...",
    powerCost: 10,
  },
  {
    id: "4",
    luckypotId: 104,
    title: "2 BNB",
    note: "Much wow! Such prize! Win DOGE now!",
    status: LuckypotStatus.DRAWING,
    maxPerUser: 100,
    startTime: Date.now() - 3600 * 1000 * 48,
    endTime: Date.now() - 100,
    closeTime: Date.now() - 100,
    funder: {
      id: "0x987654321fedcba987654321fedcba9876543210",
      name: "Doge Father",
      avatar: "https://i.pravatar.cc/150?u=funder3",
      verify: false,
    },
    prizeToken: {
      name: "DOGE",
      symbol: "DOGE",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
    },
    prizeAmount: 5200000000000000000,
    sponsorAmount: 10000,
    powerToken: {
      name: "Power",
      symbol: "PWR",
    },
    powerUnit: 20,
    totalTickets: 2500,
    participants: 450,
    createdAt: Date.now() - 3600 * 1000 * 48,
    txHash: "0xjkl012...",
    powerCost: 20,
  },
];
