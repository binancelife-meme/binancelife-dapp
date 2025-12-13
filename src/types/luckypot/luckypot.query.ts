export type LuckypotQueryOpts = {
  chainIds?: string;
  status?: number;
  endTime?: number;
  funder?: string;
  orderBy?: string;
  orderDirection?: string;
  sort?: string;
  first?: number;
  skip?: number;
};

export type LuckypotDetailQueryOpts = {
  id?: string;
  chainId?: number;
};

export type LuckypotDetailListQueryOpts = {
  id?: string;
  chainId?: number;
  wallet?: string;
  orderBy?: string;
  orderDirection?: string;
  first?: number;
  skip?: number;
};

export type UserLuckypotListQueryOpts = {
  chainId?: number;
  user?: string;
  orderBy?: string;
  orderDirection?: string;
  first?: number;
  skip?: number;
};