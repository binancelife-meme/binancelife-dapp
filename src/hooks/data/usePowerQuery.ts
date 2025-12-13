import axios from "axios";
import { useInfiniteQuery, useQuery, type UseInfiniteQueryOptions } from "react-query";

import { AppConfig } from "@/config";
import { formatApiRsp } from "@/types/api.rsp";
import type { LockRecord, StakeRecord, UserLockStat, UserPower, UserStake } from "@/types/power";
import type { LockRecordQueryOpts, StakeRecordQueryOpts, UserLockStatListQueryOpts, UserLockStatQueryOpts, UserPowerQueryOpts, UserStakeQueryOpts, UserStakeListQueryOpts } from "@/types/power/power.query";
import { formatQueryParams } from "@/utils/queryParams";

export function usePowerStatsQuery(
  opts: UserPowerQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    UserPower[],
    Error,
    UserPower[],
    UserPower[],
    readonly [string, UserPowerQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["powerStats", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<UserPower[]>(
            `${AppConfig.apiHost}/api/power/stats?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
      },
      {
        enabled: !!opts.chainId,
        staleTime: 60 * 1000,
        ...reactQueryOptions,
        getNextPageParam: (lastPage) => {
          // @ts-ignore ignore
          if (lastPage.hasNext == true) {
            // @ts-ignore ignore
            return (lastPage.page + 1) * first;
          } else {
            return false;
          }
        },
      }
    )
  );
}

export function usePowerStakeRecordQuery(
  opts: StakeRecordQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    StakeRecord[],
    Error,
    StakeRecord[],
    StakeRecord[],
    readonly [string, StakeRecordQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["powerStakeRecords", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<StakeRecord[]>(
            `${AppConfig.apiHost}/api/power/stake/records?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
      },
      {
        enabled: !!opts.chainId,
        staleTime: 60 * 1000,
        ...reactQueryOptions,
        getNextPageParam: (lastPage) => {
          // @ts-ignore ignore
          if (lastPage.hasNext == true) {
            // @ts-ignore ignore
            return (lastPage.page + 1) * first;
          } else {
            return false;
          }
        },
      }
    )
  );
}

export function usePowerStakeStatsQuery(
  opts: UserStakeListQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    UserStake[],
    Error,
    UserStake[],
    UserStake[],
    readonly [string, UserStakeListQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["powerStakeStats", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<UserStake[]>(
            `${AppConfig.apiHost}/api/power/stake/stats?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
      },
      {
        enabled: !!opts.chainId,
        staleTime: 60 * 1000,
        ...reactQueryOptions,
        getNextPageParam: (lastPage) => {
          // @ts-ignore ignore
          if (lastPage.hasNext == true) {
            // @ts-ignore ignore
            return (lastPage.page + 1) * first;
          } else {
            return false;
          }
        },
      }
    )
  );
}

export function usePowerStakeStatQuery(opts: UserStakeQueryOpts) {
  return formatApiRsp(
    useQuery(["powerStakeStat", opts], async () => {
      return axios
        .get<UserStake>(
          `${AppConfig.apiHost}/api/power/stake/stat?${formatQueryParams(opts)}`
        )
        .then((res) => res.data);
    }, {
      enabled: !!opts.chainId && !!opts.user && !!opts.token,
      staleTime: 60 * 1000,
    })
  );
}

export function usePowerLockRecordQuery(
  opts: LockRecordQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    LockRecord[],
    Error,
    LockRecord[],
    LockRecord[],
    readonly [string, LockRecordQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["powerLockRecords", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<LockRecord[]>(
            `${AppConfig.apiHost}/api/power/lock/records?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
      },
      {
        enabled: !!opts.chainId,
        staleTime: 60 * 1000,
        ...reactQueryOptions,
        getNextPageParam: (lastPage) => {
          // @ts-ignore ignore
          if (lastPage.hasNext == true) {
            // @ts-ignore ignore
            return (lastPage.page + 1) * first;
          } else {
            return false;
          }
        },
      }
    )
  );
}

export function usePowerLockStatsQuery(
  opts: UserLockStatListQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    UserLockStat[],
    Error,
    UserLockStat[],
    UserLockStat[],
    readonly [string, UserLockStatListQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["powerLockStats", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<UserLockStat[]>(
            `${AppConfig.apiHost}/api/power/lock/stats?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
      },
      {
        enabled: !!opts.chainId,
        staleTime: 60 * 1000,
        ...reactQueryOptions,
        getNextPageParam: (lastPage) => {
          // @ts-ignore ignore
          if (lastPage.hasNext == true) {
            // @ts-ignore ignore
            return (lastPage.page + 1) * first;
          } else {
            return false;
          }
        },
      }
    )
  );
}

export function usePowerLockStatQuery(opts: UserLockStatQueryOpts) {
  return formatApiRsp(
    useQuery(["powerLockStat", opts], async () => {
      return axios
        .get<UserLockStat>(
          `${AppConfig.apiHost}/api/power/lock/stat?${formatQueryParams(opts)}`
        )
        .then((res) => res.data);
    }, {
      enabled: !!opts.chainId && !!opts.user && !!opts.token,
      staleTime: 60 * 1000,
    })
  );
}