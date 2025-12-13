import axios from "axios";
import { isEmpty } from "lodash";
import {
  useInfiniteQuery,
  useQuery,
  type UseInfiniteQueryOptions,
} from "react-query";

import { AppConfig } from "@/config";
import { formatApiRsp } from "@/types/api.rsp";
import {
  Luckypot,
  LuckypotDetailListQueryOpts,
  LuckypotDetailQueryOpts,
  LuckypotQueryOpts,
  LuckypotTicket,
  type LuckypotParticipant,
  type LuckypotActivity,
  TEN_MINS,
  ClaimPrizeRecord,
  LuckypotSponsorRecord,
  UserTokenStat,
  type LuckypotSponsor,
  UserLuckypotListQueryOpts,
} from "@/types/luckypot";
import { formatQueryParams } from "@/utils/queryParams";

const DEFAULT_STALE_TIME = 60 * 1000; // 60 seconds

const processLuckypotQueryOpt = (opt: any) => {
  if (opt.sort) {
    switch (opt.sort) {
      case "time-remaining":
      default:
        opt.orderBy = "endTime";
        opt.orderDirection = "asc";
        opt.endTime = new Date().getTime() + TEN_MINS;
        break;
      case "newest":
        opt.orderBy = "createdAt";
        opt.orderDirection = "desc";
        break;
      case "oldest":
        opt.orderBy = "createdAt";
        opt.orderDirection = "asc";
        break;
    }
  }
  return opt;
};

const getLuckypotJoinStatesQuerys = (
  wallet: string,
  luckypots: Luckypot[]
): { chainId: number; wallet: string; ids: string[] }[] => {
  const grouped = luckypots.reduce((acc, luckypot) => {
    const chainId = AppConfig.chainId;
    const { id } = luckypot;
    if (!acc[chainId]) {
      acc[chainId] = { chainId, wallet, ids: [] };
    }
    acc[chainId].ids.push(id);

    return acc;
  }, {} as { [key: number]: { chainId: number; wallet: string; ids: string[] } });

  return Object.values(grouped);
};

const getLuckypotJoinStates = async (
  subs: { chainId: number; wallet: string; ids: string[] }[]
) => {
  const subPromises: any[] = [];
  subs.forEach((sub) => {
    subPromises.push(
      axios
        .get(
          `${AppConfig.apiHost}/api/luckypot/joinstates?${formatQueryParams(
            sub
          )}`
        )
        .then((res) => res.data?.data)
    );
  });
  return Promise.all(subPromises);
};

const loadLuckypotJoinStates = async (rsp: any, walletAddress?: string) => {
  if (walletAddress && rsp.state && rsp.data) {
    const items = Array.isArray(rsp.data) ? rsp.data : [rsp.data];
    // fetch user's join-state
    const subQuerys = getLuckypotJoinStatesQuerys(walletAddress, items);

    const subItems: any = await getLuckypotJoinStates(subQuerys);

    if (subItems) {
      subItems
        .flatMap((sub: any) => sub)
        .forEach((joinstate: any) => {
          let item = items.find((luckypot: any) => luckypot.id == joinstate.id);
          if (item) {
            item.joinState = "Joined";
          }
        });
    }
  }
};

export function useLuckypotQuery(
  opts: LuckypotQueryOpts,
  walletAddress?: string,
  reactQueryOptions?: UseInfiniteQueryOptions<
    Luckypot[],
    Error,
    Luckypot[],
    Luckypot[],
    readonly [string, LuckypotQueryOpts, string?]
  >
) {
  let first = opts.first || 20;
  if (first > 100) {
    first = 100;
  }

  return formatApiRsp(
    useInfiniteQuery(
      ["luckypots", opts, walletAddress],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        processLuckypotQueryOpt(evaluatedOpts);

        return axios
          .get<Luckypot[]>(
            `${AppConfig.apiHost}/api/luckypot?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then(async (res) => {
            const rsp: any = res.data;
            await loadLuckypotJoinStates(rsp, walletAddress);
            return rsp;
          });
      },
      {
        staleTime: DEFAULT_STALE_TIME,
        ...reactQueryOptions,
        // Don't allow this function to be overwritten by reactQueryOptions
        getNextPageParam: (lastPage) => {
          // If the last page contains less than the expected page first,
          // it's safe to assume you're at the end.
          // @ts-ignore ignore
          // const totalPage = Math.ceil(lastPage.total / first) - 1;
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

export function useLuckypotDetaiQuery(
  opts: LuckypotDetailQueryOpts,
  walletAddress?: string
) {
  return formatApiRsp(
    useQuery(
      ["luckypotDetail", opts, walletAddress],
      async () => {
        return axios
          .get<Luckypot>(
            `${AppConfig.apiHost}/api/luckypot/${opts.chainId}/${opts.id}`
          )
          .then(async (res) => {
            const rsp: any = res.data;
            await loadLuckypotJoinStates(rsp, walletAddress);
            return rsp;
          });
      },
      {
        enabled: !isEmpty(opts.id),
        staleTime: DEFAULT_STALE_TIME,
      }
    )
  );
}

export function useLuckypotActivityQuery(
  opts: LuckypotDetailListQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    LuckypotActivity[],
    Error,
    LuckypotActivity[],
    LuckypotActivity[],
    readonly [string, LuckypotDetailListQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["luckypotActivity", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<LuckypotActivity[]>(
            `${AppConfig.apiHost}/api/luckypot/activity?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => {
            return res.data;
          });
      },
      {
        enabled: !isEmpty(opts.id),
        staleTime: DEFAULT_STALE_TIME,
        ...reactQueryOptions,
        // Don't allow this function to be overwritten by reactQueryOptions
        getNextPageParam: (lastPage) => {
          // If the last page contains less than the expected page first,
          // it's safe to assume you're at the end.

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

export function useUserLuckypotActivitiesQuery(
  opts: UserLuckypotListQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    LuckypotActivity[],
    Error,
    LuckypotActivity[],
    LuckypotActivity[],
    readonly [string, UserLuckypotListQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["userLuckypotActivities", opts], 
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<LuckypotActivity[]>(
            `${AppConfig.apiHost}/api/luckypot/user-activities?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => {
            return res.data;
          });
      },
      {
        enabled: !isEmpty(opts.user),
        staleTime: DEFAULT_STALE_TIME,
        ...reactQueryOptions,
        // Don't allow this function to be overwritten by reactQueryOptions
        getNextPageParam: (lastPage) => {
          // If the last page contains less than the expected page first,
          // it's safe to assume you're at the end.

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

export function useLuckypotParticipantsQuery(
  opts: LuckypotDetailListQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    LuckypotParticipant[],
    Error,
    LuckypotParticipant[],
    LuckypotParticipant[],
    readonly [string, LuckypotDetailListQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["luckypotParticipants", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<LuckypotParticipant[]>(
            `${AppConfig.apiHost}/api/luckypot/participants?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => {
            return res.data;
          });
      },
      {
        enabled: !isEmpty(opts.id),
        staleTime: DEFAULT_STALE_TIME,
        ...reactQueryOptions,
        // Don't allow this function to be overwritten by reactQueryOptions
        getNextPageParam: (lastPage) => {
          // If the last page contains less than the expected page first,
          // it's safe to assume you're at the end.

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

export function useLuckypotTicketsQuery(
  opts: LuckypotDetailListQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    LuckypotTicket[],
    Error,
    LuckypotTicket[],
    LuckypotTicket[],
    readonly [string, LuckypotDetailListQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["luckypotTickets", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<LuckypotTicket[]>(
            `${AppConfig.apiHost}/api/luckypot/tickets?${formatQueryParams({
              ...evaluatedOpts,
              wallet: opts.wallet,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => {
            return res.data;
          });
      },
      {
        enabled: !isEmpty(opts.id),
        staleTime: DEFAULT_STALE_TIME,
        ...reactQueryOptions,
        // Don't allow this function to be overwritten by reactQueryOptions
        getNextPageParam: (lastPage) => {
          // If the last page contains less than the expected page first,
          // it's safe to assume you're at the end.

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

export function useLuckypotClaimsQuery(
  opts: LuckypotDetailListQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    ClaimPrizeRecord[],
    Error,
    ClaimPrizeRecord[],
    ClaimPrizeRecord[],
    readonly [string, LuckypotDetailListQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["luckypotClaims", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<ClaimPrizeRecord[]>(
            `${AppConfig.apiHost}/api/luckypot/claims?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
      },
      {
        enabled: !isEmpty(opts.id),
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


export function useLuckypotSponsorsQuery(
  opts: LuckypotDetailListQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    LuckypotSponsorRecord[],
    Error,
    LuckypotSponsorRecord[],
    LuckypotSponsorRecord[],
    readonly [string, LuckypotDetailListQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["luckypotSponsors", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<LuckypotSponsorRecord[]>(
            `${AppConfig.apiHost}/api/luckypot/sponsors?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
      },
      {
        enabled: !isEmpty(opts.id),
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

export function useLuckypotSponsorsAggQuery(
  opts: LuckypotDetailListQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    LuckypotSponsor[],
    Error,
    LuckypotSponsor[],
    LuckypotSponsor[],
    readonly [string, LuckypotDetailListQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["luckypotSponsorsAgg", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<LuckypotSponsor[]>(
            `${AppConfig.apiHost}/api/luckypot/sponsorsAgg?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
      },
      {
        enabled: !isEmpty(opts.id),
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

export function useUserLuckypotSponsorsAggQuery(
  opts: UserLuckypotListQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    LuckypotSponsor[],
    Error,
    LuckypotSponsor[],
    LuckypotSponsor[],
    readonly [string, UserLuckypotListQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["userLuckypotSponsorsAgg", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<LuckypotSponsor[]>(
            `${AppConfig.apiHost}/api/luckypot/user-sponsorsAgg?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
      },
      {
        enabled: !isEmpty(opts.user),
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

export function useLuckypotUserTokenStatsQuery(
  opts: { chainId?: number; orderBy?: string; orderDirection?: string; first?: number; skip?: number },
  reactQueryOptions?: UseInfiniteQueryOptions<
    UserTokenStat[],
    Error,
    UserTokenStat[],
    UserTokenStat[],
    readonly [string, { chainId?: number; orderBy?: string; orderDirection?: string; first?: number; skip?: number }]
  >
) {
  let first = opts.first || 50;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["luckypotUserTokenStats", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<UserTokenStat[]>(
            `${AppConfig.apiHost}/api/luckypot/userTokenStats?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
      },
      {
        enabled: true,
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
