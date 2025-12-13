import { ERC20Token } from "@/types/token/token"

import { ChainId } from "../chains"

import { Token } from "./_base/token"
import { USDT, bscTokens, bscTestnetTokens } from "./chains"

// a list of tokens by chain
export type ChainMap<T> = {
    readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>


// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {

    [ChainId.BNB]: [bscTokens.usdt, bscTokens.usdc],
    [ChainId.BNB_TESTNET]: [bscTestnetTokens.usdt],
    [ChainId.LOCALHOST]: [USDT[ChainId.LOCALHOST]]
}

export const POWER_TOKENS: ChainTokenList = {
    [ChainId.BNB]: [bscTokens.币安人生],
    [ChainId.BNB_TESTNET]: [bscTestnetTokens.币安人生],
    [ChainId.LOCALHOST]: [new ERC20Token(
        ChainId.LOCALHOST,
        '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        18,
        '币安人生',
        '币安人生',
        'https://binancelife.meme/',
    )]
}