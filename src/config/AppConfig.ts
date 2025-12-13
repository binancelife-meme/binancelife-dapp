// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: "BinanceLife",
  host: process.env.NEXT_PUBLIC_HOST,
  apiHost: process.env.NEXT_PUBLIC_API_HOST,
  chainId: Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN || '1337'),
  ipfsGateway: "https://violet-accurate-chipmunk-191.mypinata.cloud",
};
