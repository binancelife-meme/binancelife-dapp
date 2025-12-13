import { ChainId } from '../../chains'

import { ERC20Token } from './constants'

export const CAKE_MAINNET = new ERC20Token(
  ChainId.BNB,
  '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  18,
  'CAKE',
  'PancakeSwap Token',
  'https://pancakeswap.finance/',
)

export const CAKE_TESTNET = new ERC20Token(
  ChainId.BNB_TESTNET,
  '0x8d008B313C1d6C7fE2982F62d32Da7507cF43551',
  18,
  'CAKE',
  'PancakeSwap Token',
  'https://pancakeswap.finance/',
)

export const USDC_BSC = new ERC20Token(
  ChainId.BNB,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'Binance-Peg USD Coin',
  'https://www.centre.io/usdc',
)

export const USDC_TESTNET = new ERC20Token(
  ChainId.BNB_TESTNET,
  '0x64544969ed7EBf5f083679233325356EbE738930',
  18,
  'USDC',
  'Binance-Peg USD Coin',
  'https://www.centre.io/usdc',
)

export const USDT_BSC = new ERC20Token(
  ChainId.BNB,
  '0x55d398326f99059fF775485246999027B3197955',
  18,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const BUSD_BSC = new ERC20Token(
  ChainId.BNB,
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
)

export const BUSD_TESTNET = new ERC20Token(
  ChainId.BNB_TESTNET,
  '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
)

export const BUSD = {
  [ChainId.BNB]: BUSD_BSC,
  [ChainId.BNB_TESTNET]: BUSD_TESTNET,
}

export const CAKE = {

  [ChainId.BNB]: CAKE_MAINNET,
  [ChainId.BNB_TESTNET]: CAKE_TESTNET,
}

export const USDC = {
  [ChainId.BNB]: USDC_BSC,
  [ChainId.BNB_TESTNET]: USDC_TESTNET,
}

export const USDT = {
  [ChainId.BNB]: USDT_BSC,
  [ChainId.LOCALHOST]: new ERC20Token(
    ChainId.LOCALHOST,
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    18,
    'USDT',
    'Tether USD',
  ),
}

export const STABLE_COIN = {
  [ChainId.BNB]: USDT[ChainId.BNB],
  [ChainId.BNB_TESTNET]: BUSD[ChainId.BNB_TESTNET],
  [ChainId.LOCALHOST]: USDT[ChainId.LOCALHOST],
} satisfies Record<ChainId, ERC20Token>
