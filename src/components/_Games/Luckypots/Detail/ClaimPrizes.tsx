"use client";

import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatUnits } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { FirstPrizeBag, FourthPrizeBag, SecondPrizeBag, ThirdPrizeBag } from "@/components/Icons";
import { AppConfig } from "@/config";
import { getDeploysByName } from "@/constants/contracts/address";
import { ContractNames } from "@/constants/contracts/names";
import { useLuckypotTicketsQuery } from "@/hooks/data";
import { useContractAbi } from "@/hooks/useContractAbi";
import type { Luckypot } from "@/types/luckypot";
import { getTicketWinnerPlaces } from "@/utils/prizeUtils";

import TicketNumbers from "./TicketNumbers";

const ClaimPrizes = ({ item }: { item: Luckypot }) => {
  const t = useTranslations();
  const { isConnected, address: wallet } = useAccount();

  // Contract setup
  const contractInfo = getDeploysByName(
    `${AppConfig.chainId}`,
    ContractNames.LuckypotContract
  );
  const abi = useContractAbi(AppConfig.chainId, contractInfo?.address);

  // States
  const [winningTickets, setWinningTickets] = useState<any[]>([]);
  const [totalWinAmount, setTotalWinAmount] = useState<bigint>(0n);
  const [claimed, setClaimed] = useState(false);

  // Fetch user tickets
  const { data: ticketsData, isLoading: ticketsLoading } = useLuckypotTicketsQuery(
    {
      id: `${item.id}`,
      chainId: AppConfig.chainId,
      wallet: wallet,
      first: 1000, // Fetch enough tickets
    },
    {
      enabled: isConnected && !!item.drawNumbers?.length && !claimed,
    }
  );

  // Process tickets to find winners
  useEffect(() => {
    if (!ticketsData || !item.drawNumbers || !item.prizeAmounts) return;

    const tickets = ticketsData.pages
      .flatMap((page: any) => page?.data?.tickets)
      .filter((t: any) => !isEmpty(t));

    const winners: any[] = [];
    let totalAmount = 0n;
    
    // Check if user has already claimed
    // Since we don't have a direct "user claimed" flag for the whole pot easily available without checking events or contract,
    // we rely on the component being unmounted/hidden by parent or checks here if possible.
    // But the requirement says "after claiming, hide component", so we manage `claimed` state.
    // Also `item.winners` contains users who have claimed.
    
    const hasClaimed = item.winners?.some(
        (w: any) => w && w.id.toLowerCase() === wallet?.toLowerCase()
    );
    
    if (hasClaimed) {
        setClaimed(true);
        return;
    }

    tickets.forEach((ticket: any) => {
      const winPlaces = getTicketWinnerPlaces(ticket, item.drawNumbers!);
      if (winPlaces.length > 0) {
        let ticketWinAmount = 0n;
        winPlaces.forEach((place) => {
          // place is 1-based index (1, 2, 3...)
          // prizeAmounts is 0-based array
          const amount = BigInt(item.prizeAmounts![place - 1] || 0);
          ticketWinAmount += amount;
        });
        
        winners.push({
          ticketId: ticket.ticketId,
          currentSize: ticket.currentSize,
          ticketCount: ticket.ticketCount,
          winPlaces,
          winAmount: ticketWinAmount,
        });
        totalAmount += ticketWinAmount;
      }
    });

    setWinningTickets(winners);
    setTotalWinAmount(totalAmount);
  }, [ticketsData, item.drawNumbers, item.prizeAmounts, wallet, item.winners]);

  // Contract Write
  const { 
    data: hash, 
    writeContract, 
    isPending: isWritePending,
    error: writeError 
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleClaim = () => {
    if (!contractInfo?.address || !abi || winningTickets.length === 0) return;

    const ticketIds = winningTickets.map(t => BigInt(t.ticketId));

    writeContract({
      address: contractInfo.address,
      abi,
      functionName: "claimPrizeByTickets",
      args: [BigInt(item.luckypotId), ticketIds],
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      toast.success(t("action.success_claim"));
      setClaimed(true);
    }
  }, [isConfirmed, t]);
  
  useEffect(() => {
      if (writeError) {
          toast.error(writeError.message);
      }
  }, [writeError]);

  if (!isConnected || claimed || winningTickets.length === 0) {
    return null;
  }

  if (ticketsLoading) {
      return <div className="flex justify-center p-4"><Spinner size="sm" /></div>;
  }
  const bagIcons = [FirstPrizeBag, SecondPrizeBag, ThirdPrizeBag, FourthPrizeBag]
  return (
    <Card className="w-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
      <CardBody className="gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-yellow-500">
            🎉 {t("luckypot.claim.congrats")}
          </h3>
          <div className="text-sm text-default-500">
            {t("luckypot.claim.you_won", { count: winningTickets.length })}
          </div>
          
          <div className="flex flex-col gap-2 my-2">
            {winningTickets.map((ticket) => (
               <div key={ticket.ticketId} className="flex justify-between items-center text-sm bg-black/20 p-2 rounded">
                  <div className="flex flex-row items-center gap-2">
                   <span>Ticket #{ticket.ticketId}</span>
                   <TicketNumbers currentSize={Number(ticket.currentSize)} ticketCount={ticket.ticketCount} />
                   </div>
                   <div className="flex gap-2">
                       {ticket.winPlaces.map((place: number) => (
                           <span key={place} className="text-yellow-400 font-bold">
                               {bagIcons[place - 1]({ size: 24 })}
                           </span>
                       ))}
                   </div>
               </div> 
            ))}
          </div>

          <div className="flex justify-between items-center mt-2 border-t border-white/10 pt-4">
            <div className="flex flex-col">
                <span className="text-sm text-default-500">{t("luckypot.claim.total_prize")}</span>
                <span className="text-xl font-bold text-yellow-500">
                    {formatUnits(totalWinAmount, 18)} {item.prizeToken?.symbol || "BNB"}
                </span>
            </div>
            
            <Button
              color="warning"
              variant="shadow"
              isLoading={isWritePending || isConfirming}
              onPress={handleClaim}
              className="font-bold"
            >
              {t("luckypot.claim.claim_btn")}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ClaimPrizes;
