import { LuckypotStatus } from "@/types/luckypot/luckypot";
import { LuckypotCreateInputs } from "@/types/luckypot/luckypot.inputs";

export const NewLuckypot: LuckypotCreateInputs | any = {
  status: LuckypotStatus.CREATED,
  useSqrtTickets: true,
  maxPerUser: 0,
  note: "",
};
