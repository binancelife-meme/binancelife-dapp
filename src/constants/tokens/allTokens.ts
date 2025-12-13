import { ChainId } from '../chains'

import { bscTokens } from './chains/bsc'
import { bscTestnetTokens } from './chains/bscTestnet'

export const allTokens = {
    [ChainId.BNB]: bscTokens,
    [ChainId.BNB_TESTNET]: bscTestnetTokens,
    [ChainId.LOCALHOST]: []
}