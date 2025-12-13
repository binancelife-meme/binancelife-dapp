# BinanceLife DApp

Binance Life Community • On-chain Exclusive Prize Draw • A New Meme Experience

## Introduction

BinanceLife is a Web3-powered community platform inspired by the meme culture surrounding Binance co-founder He Yi's playful remark. It's a "Fair-to-Win" gaming and social hub where the community can participate in on-chain lucky draws, staking, and social interactions with complete transparency and fairness.

## Key Features

### 1. Fair-to-Win Mechanics
- **Trustless & Permissionless**: Built on smart contracts, ensuring no central authority controls the outcome.
- **Binance VRF**: Utilizes Binance Verifiable Random Function for provably fair random number generation in draws.
- **No Platform Fees**: The platform takes 0% cut. 100% of sponsorships go directly into the prize pools.

### 2. Core Modules
- **Luck (八方来财)**:
  - Participate in various "Luckypots" (prize pools) using "Power".
  - Prizes include tokens (USDT, BNB, etc.) and NFTs.
  - Transparent draw history and winner verification.
- **Power (灵力)**:
  - The core utility resource of the platform.
  - **Staking**: Stake assets to earn Power continuously.
  - **Locking**: Lock assets for a fixed period to get an instant Power boost.
- **Leaderboard**:
  - Global rankings for winnings, sponsorships, and power accumulation.
  - Track top users, KOLs, and active sponsors.

### 3. Community & Social
- **Profile System**: Customizable user profiles with avatars (NFT/Image) and nicknames.
- **Referral System**: Invite friends to earn rewards and grow the community.
- **Meme Culture**: Deeply integrated with the "Binance Life" meme ecosystem.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **UI Library**: HeroUI, Lucide React, Framer Motion (Animations)
- **Web3 Integration**: Wagmi, Viem, RainbowKit
- **Internationalization**: next-intl (English & Chinese support)
- **State Management**: React Context, React Query

## Repository Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── _Games/          # Game-specific components (Luckypots, etc.)
│   ├── _Power/          # Power staking/locking components
│   ├── _Home/           # Landing page components
│   └── ...
├── config/              # App configuration (Chain ID, API hosts)
├── constants/           # Contracts, ABIs, and static data
├── context/             # Global state providers
├── hooks/               # Custom React hooks (Wagmi, API, etc.)
├── libs/                # Third-party library configurations
├── locales/             # i18n JSON files (en, zh)
├── styles/              # Global CSS and Tailwind directives
├── types/               # TypeScript interfaces
└── utils/               # Helper functions (Formatting, Validation)
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Yarn

### Installation

```bash
yarn install
```

### Development

Run the development server:

```bash
yarn dev
# Open http://localhost:3000
```

Run with HTTPS (required for some Web3 wallet features locally):

```bash
yarn dev:https
# Open https://localhost:3000
```

### Configuration

Edit `src/config/AppConfig.ts` to customize:
- Chain ID (Testnet/Mainnet)
- API Endpoints
- Wallet Connect Project ID

## Smart Contracts

The platform interacts with several core contracts:
- **LuckypotContract**: Manages prize pools and draws.
- **PowerContract**: Handles Staking and Locking logic.
- **TokenContract**: The native ecosystem token (if applicable).

(See `src/constants/contracts/address.ts` for deployed addresses)

## License

This project is open-source and available under the [MIT License](LICENSE).

---

*BinanceLife - Inject a trace of power, start your Binance Life.*
