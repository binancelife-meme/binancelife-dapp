import { formatEther, zeroAddress } from "viem";

import { CHAIN_CURRENCY } from "@/constants/currency";
import { getTokenBannerByName } from "@/constants/tokens/tokenBanner";
import { LuckypotTicket, type Luckypot } from "@/types";

export const getLuckypotPrizeToken = (item: Luckypot) => {
  let name, value, image;
  const tokenAddress = item.prizeToken?.address || zeroAddress;
  if (tokenAddress == zeroAddress) {
    name = CHAIN_CURRENCY["56"];
    value = formatEther(BigInt((item.prizeAmount || 0)!));
    image = getTokenBannerByName(name);
  }
  else {
    name = item.prizeToken.symbol;
    value = formatEther(BigInt(item.prizeAmount!));
    image = getTokenBannerByName(name ?? "");

  }
  return { name, value, image: image };
}

export const checkTicketWinner = (ticket: LuckypotTicket, drawNum: number) => {
  if (drawNum >= (ticket.currentSize - ticket.ticketCount + 1) && drawNum <= ticket.currentSize) {
    return true;
  }
  return false;
}

export const getTicketWinnerPlaces = (ticket: LuckypotTicket, drawNumbers: number[]) => {
  const winners: number[] = [];
  drawNumbers && drawNumbers.forEach((drawNum, index) => {
    if (checkTicketWinner(ticket, drawNum)) {
      winners.push(index + 1);
    }
  })
  return winners;
}
