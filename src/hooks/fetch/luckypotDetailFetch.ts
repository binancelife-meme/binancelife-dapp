import { AppConfig } from "@/config";
import type { LuckypotDetailQueryOpts } from "@/types";
import { formatQueryParams } from "@/utils/queryParams";

export async function luckypotDetailFetch(opts: LuckypotDetailQueryOpts) {
  try {
    const data = await fetch(
      `${AppConfig.apiHost}/api/luckypot/${opts.chainId}/${
        opts.id
      }?${formatQueryParams({})}`
    );
    return data && (await data.json());
  } catch (ex) {
    return {
      data: null,
    };
  }
}
