import axios from "axios";
import { useInfiniteQuery, type UseInfiniteQueryOptions } from "react-query";

import { AppConfig } from "@/config";
import { formatApiRsp } from "@/types/api.rsp";
import { formatQueryParams } from "@/utils/queryParams";

// Types
export interface ActivityItem {
  id: string;
  title: string;
  amount?: string;
  unit?: string;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  image?: string;
  participants?: number;
  winner?: string;
  // Winner specific fields
  roundId?: string;
  winningNumbers?: string[];
  rank?: 1 | 2 | 3 | 4;
  prizeAmount?: string;
}

export type ActivityType = 'created' | 'participated' | 'won' | 'sponsored';

export interface ActivityQueryOpts {
  chainId?: number;
  user?: string;
  type: ActivityType;
  first?: number;
  skip?: number;
}

// Hook
export function useUserActivityQuery(
  opts: ActivityQueryOpts,
  reactQueryOptions?: UseInfiniteQueryOptions<
    ActivityItem[],
    Error,
    ActivityItem[],
    ActivityItem[],
    readonly [string, ActivityQueryOpts]
  >
) {
  let first = opts.first || 10;
  if (first > 100) {
    first = 100;
  }

  return formatApiRsp(
    useInfiniteQuery(
      ["userActivity", opts],
      async ({ queryKey, pageParam }) => {
        const { ...evaluatedOpts } = queryKey[1];
        
        // NOTE: This is a mock implementation since the backend API might not be ready yet.
        // In a real scenario, this would call the actual API endpoint.
        // For now, we will simulate an API call that returns mock data matching the previous implementation.
        
        // Real API call would look like this:
        /*
        return axios
          .get<ActivityItem[]>(
            `${AppConfig.apiHost}/api/user/activity?${formatQueryParams({
              ...evaluatedOpts,
              skip: pageParam ?? 0,
              first: first,
            })}`
          )
          .then((res) => res.data);
        */

        // Mock Data Generation (matching previous implementation logic)
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        const skip = pageParam ?? 0;
        const type = evaluatedOpts.type;
        
        // Generate mock data
        const mockData = Array.from({ length: first }, (_, i) => {
          const index = skip + i;
          const status = Math.random() > 0.5 ? 'completed' : 'active';
          const baseDate = new Date();
          baseDate.setDate(baseDate.getDate() - index * 2);
          
          let title = "";
          let amount = "";
          let unit = "BNB";
          let winningNumbers: string[] = [];
          let rank: 1 | 2 | 3 | 4 = 1;
          let prizeAmount = "0";
    
          switch (type) {
            case 'created':
              title = `Community Event #${1000 + index}`;
              amount = (1 + index * 0.1).toFixed(2);
              break;
            case 'participated':
              title = `Lucky Draw #${500 + index}`;
              amount = "0.01";
              break;
            case 'won':
              title = `Grand Prize Pool #${200 + index}`;
              amount = (0.5 + index * 0.05).toFixed(3);
              winningNumbers = Array.from({length: 5}, () => Math.floor(Math.random() * 30 + 1).toString().padStart(2, '0'));
              rank = (index % 4 + 1) as 1 | 2 | 3 | 4;
              const basePrize = 10;
              if (rank === 1) prizeAmount = basePrize.toFixed(2);
              else if (rank === 2) prizeAmount = (basePrize * 0.1).toFixed(3);
              else if (rank === 3) prizeAmount = (basePrize * 0.06).toFixed(3);
              else prizeAmount = (basePrize * 0.04).toFixed(3);
              break;
            case 'sponsored':
              title = `Charity Fund #${100 + index}`;
              amount = (2 + index * 0.2).toFixed(2);
              break;
          }
    
          return {
            id: `act-${type}-${index}`,
            title,
            amount,
            unit,
            date: baseDate.toISOString().split('T')[0],
            status: status as any,
            participants: Math.floor(Math.random() * 100) + 10,
            image: `https://picsum.photos/seed/${type}${index}/200`,
            roundId: `202403${20 - index}`,
            winningNumbers,
            rank,
            prizeAmount: type === 'won' ? prizeAmount : amount
          };
        });
        
        return mockData;
      },
      {
        enabled: !!opts.user,
        staleTime: 60 * 1000,
        ...reactQueryOptions,
        getNextPageParam: (lastPage, allPages) => {
           // Mock infinite scroll logic: stop after 50 items
           const totalLoaded = allPages.length * first;
           if (totalLoaded < 50) {
             return totalLoaded;
           }
           return undefined;
        },
      }
    )
  );
}
