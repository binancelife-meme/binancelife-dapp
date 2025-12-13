export type StakeRecordQueryOpts = {
  chainId: number;
  token?: string;
  user?: string;
  orderBy?: string;
  orderDirection?: string;
  first?: number;
  skip?: number;
};

export type UserStakeQueryOpts = {
  chainId: number;
  user: string;
  token: string;
};

export type UserStakeListQueryOpts = {
  chainId: number;
  user?: string;
  token?: string;
  orderBy?: string;
  orderDirection?: string;
  first?: number;
  skip?: number;
};

export type LockRecordQueryOpts = {
  chainId: number;
  token?: string;
  user?: string;
  active?: number;
  orderBy?: string;
  orderDirection?: string;
  first?: number;
  skip?: number;
};

export type UserLockStatQueryOpts = {
  chainId: number;
  user: string;
  token: string;
};

export type UserLockStatListQueryOpts = {
  chainId: number;
  user?: string;
  token?: string;
  orderBy?: string;
  orderDirection?: string;
  first?: number;
  skip?: number;
};

export type UserPowerQueryOpts = {
  chainId: number;
  user?: string;
  token?: string;
  orderBy?: string;
  orderDirection?: string;
  first?: number;
  skip?: number;
};