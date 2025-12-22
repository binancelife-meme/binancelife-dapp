import { ChainId } from '../../chains'

import { BUSD_BSC, CAKE_MAINNET, USDT_BSC } from './common'
import { ERC20Token, WBNB } from './constants'


export const bscTokens = {
  wbnb: WBNB[ChainId.BNB],
  // bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
  bnb: new ERC20Token(
    ChainId.BNB,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'BNB',
    'BNB',
    'https://www.binance.com/',
  ),
  cake: CAKE_MAINNET,
  busd: BUSD_BSC,
  usdt: USDT_BSC,
  btcb: new ERC20Token(
    ChainId.BNB,
    '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    18,
    'BTCB',
    'Binance BTC',
    'https://bitcoin.org/',
  ),
  ust: new ERC20Token(
    ChainId.BNB,
    '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
    18,
    'UST',
    'Wrapped UST Token',
    'https://mirror.finance/',
  ),
  eth: new ERC20Token(
    ChainId.BNB,
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    18,
    'ETH',
    'Binance-Peg Ethereum Token',
    'https://ethereum.org/en/',
  ),
  usdc: new ERC20Token(
    ChainId.BNB,
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    18,
    'USDC',
    'Binance-Peg USD Coin',
    'https://www.centre.io/usdc',
  ),
  u: new ERC20Token(
    ChainId.BNB,
    '0xce24439f2d9c6a2289f741120fe202248b666666',
    18,
    'U',
    'United Stables',
    'https://u.tech',
  ),
  币安人生: new ERC20Token(
    ChainId.BNB,
    '0x924fa68a0fc644485b8df8abfa0a41c2e7744444',
    18,
    '币安人生',
    '币安人生',
    'https://binancelife.meme/',
  ),
}