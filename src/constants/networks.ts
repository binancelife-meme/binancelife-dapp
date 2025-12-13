import { isBrowser } from '@/utils/isBrowser'

const infuraId = isBrowser()
  ? process.env.NEXT_PUBLIC_INFURA_ID
  : process.env.PRE_RENDER_INFURA_ID

export enum NetworkName {
  localhost = 'localhost',
  mainnet = 'mainnet',
  goerli = 'goerli',
  bnb = 'bsc',
  bnbTest = 'bscTest',
  avalanche = 'avalanche',
  avalancheFuji = 'avalancheFuji'
}
  

type NetworkInfo = {
  name: NetworkName
  label: string
  token?: string
  color: string
  chainId: number
  blockExplorer: string
  rpcUrl: string
  faucet?: string
  price?: number
  gasPrice?: number
  mainnet?: boolean
}

let hostname = 'localhost'
if (typeof window !== 'undefined') {
  hostname = window.location.hostname
}

export const NETWORKS: Record<number, NetworkInfo> = {
  1337: {
    name: NetworkName.localhost,
    label: 'Local Host',
    color: '#666666',
    chainId: 1337,
    blockExplorer: '',
    rpcUrl: `http://${hostname}:8545`,
    mainnet: false,
  },
  1: {
    name: NetworkName.mainnet,
    label: 'Ethereum Mainnet',
    color: '#ff8b9e',
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://etherscan.io/',
    mainnet: true,
  },
  5: {
    name: NetworkName.goerli,
    label: 'Goerli',
    color: '#0975F6',
    chainId: 5,
    faucet: 'https://goerli-faucet.slock.it/',
    blockExplorer: 'https://goerli.etherscan.io/',
    rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
    mainnet: false,
  },
  56: {
    name: NetworkName.bnb,
    label: 'BNB Chain',
    color: '#0975F6',
    chainId: 56,
    faucet: '',
    blockExplorer: 'https://bscscan.io/',
    rpcUrl: `https://rpc.ankr.com/bsc`,
    mainnet: true,
  },
  97: {
    name: NetworkName.bnbTest,
    label: 'BNB Chain Testnet',
    color: '#0975F6',
    chainId: 56,
    faucet: '',
    blockExplorer: 'https://testnet.bscscan.com',
    rpcUrl: `https://data-seed-prebsc-1-s1.binance.org:8545`,
    mainnet: false,
  },
}

export const NETWORKS_BY_NAME = Object.values(NETWORKS).reduce(
  (acc, curr) => ({
    ...acc,
    [curr.name]: curr,
  }),
  {} as Record<NetworkName, NetworkInfo>,
)

export const getNetworks = Object.values(NETWORKS).filter(it=>it.mainnet == (process.env.NODE_ENV == 'production')).reduce(
  (acc, curr) => ({
    ...acc,
    [curr.name]: curr,
  }),
  {} as Record<NetworkName, NetworkInfo>);