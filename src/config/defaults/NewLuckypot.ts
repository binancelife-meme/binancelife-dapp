import { ChainId } from "@/constants";
import { POWER_TOKENS } from "@/constants/tokens/defaultToken";
import { LuckypotStatus } from "@/types/luckypot/luckypot";
import { LuckypotCreateInputs } from "@/types/luckypot/luckypot.inputs";

import { AppConfig } from "../AppConfig";

export const NewLuckypot: LuckypotCreateInputs | any = {
  status: LuckypotStatus.CREATED,
  useSqrtTickets: true,
  maxPerUser: 0,
  powerToken: POWER_TOKENS[AppConfig.chainId as ChainId][0],
  prizeToken: "",
  prizeAmount: 0,
  note: "",
};
