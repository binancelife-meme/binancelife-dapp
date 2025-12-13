export type CurrencyName = "USD" | "ETH" | "BNB" | "tBNB";
type CurrencySymbol = "US$" | "Ξ" | "BNB" | "tBNB";

export type CurrencyMetadata = {
  name: CurrencyName;
  symbol: CurrencySymbol;
  price?: any;
  chainId?: any;
};

export const CURRENCY_METADATA: Record<CurrencyName, CurrencyMetadata> = {
  USD: {
    name: "USD",
    symbol: "US$",
  },
  ETH: {
    name: "ETH",
    symbol: "Ξ",
    chainId: 1
  },
  BNB: {
    name: "BNB",
    symbol: "BNB",
    chainId: 56
  },
  tBNB: {
    name: "BNB",
    symbol: "BNB",
    chainId: 97
  }
};

export const CHAIN_CURRENCY: Record<string, string> = {
  "56": "BNB",
  "97": "BNB",
  "1337": "BNB"
}

export const PRECISION_USD = 2;
export const PRECISION_ETH = 4;
