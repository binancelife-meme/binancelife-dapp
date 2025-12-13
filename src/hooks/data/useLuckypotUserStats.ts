import axios from "axios";
import { isEmpty } from "lodash";
import { useInfiniteQuery, useQuery, type UseInfiniteQueryOptions } from "react-query";

import { AppConfig } from "@/config";
import { formatApiRsp } from "@/types/api.rsp";
import type { LuckypotDetailQueryOpts, LuckypotDetailListQueryOpts } from "@/types/luckypot/luckypot.query";
import type { UserStat } from "@/types/luckypot/userstat";
import { formatQueryParams } from "@/utils/queryParams";

export function useLuckypotUserStatsQuery(
  opts: LuckypotDetailListQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    UserStat[],
    Error,
    UserStat[],
    UserStat[],
    readonly [string, LuckypotDetailListQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }
  return formatApiRsp(
    useInfiniteQuery(
      ["luckypotUserStats", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        return axios
          .get<UserStat[]>(
            `${AppConfig.apiHost}/api/luckypot/userStats?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
      },
      {
        staleTime: 60 * 1000,
        enabled: true,
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

export function useLuckypotUserStatQuery(opts: LuckypotDetailQueryOpts) {
  return formatApiRsp(
    useQuery(["luckypotUserStat", opts], async () => {
      return axios
        .get<UserStat>(
          `${AppConfig.apiHost}/api/luckypot/userStat/${opts.chainId}?${formatQueryParams({
            wallet: opts.id,
          })}`
        )
        .then((res) => res.data);
    }, {
      enabled: !isEmpty(opts.id),
      staleTime: 60 * 1000,
    })
  );
}