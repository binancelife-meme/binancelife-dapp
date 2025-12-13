import { Luckypot, LuckypotStatus } from "./luckypot";

export const TEN_MINS = 10 * 60 * 1000;
export const TWO_MINS = 2 * 60 * 1000;
export const getLuckypotStatus = (item: Luckypot) => {
  if (item.status == LuckypotStatus.ONGOING) {
    if (item.endTime < new Date().getTime() + TWO_MINS) {
      return LuckypotStatus.FAILED;
    }
  }
  return item.status;
};
