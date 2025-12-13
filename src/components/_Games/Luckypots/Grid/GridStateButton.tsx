
import { Button, Spinner, useDisclosure, Chip } from "@heroui/react";
import { useTranslations } from "next-intl";

import { getLuckypotStatus, LuckypotStatus, type Luckypot } from "@/types/luckypot";
import { cn } from "@/utils/cn";

import LuckypotPayModal from "../PayModal";

// 假设我们有这些 hook 或函数来处理取消、领奖和退款逻辑
// 如果没有，这里暂时留空或使用 placeholder 函数
const useCancelLuckypot = () => ({ cancel: () => console.log("Cancel") });
const useClaimPrize = () => ({ claim: () => console.log("Claim") });
const useRefundSponsorship = () => ({ refund: () => console.log("Refund") });

const GridStateButton = ({ item }: { item: Luckypot }) => {
  const t = useTranslations("luckypot");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cancel } = useCancelLuckypot();
  const { claim } = useClaimPrize();
  const { refund } = useRefundSponsorship();

  const status = getLuckypotStatus(item);
  const participants = item.participants || 0;
  const isFunder = false; // TODO: Check if current user is funder
  const isWinner = false; // TODO: Check if current user is winner
  const isSponsor = false; // TODO: Check if current user is sponsor

  // Logic for displaying buttons
  if (status === LuckypotStatus.ONGOING) {
      if (participants === 0 && isFunder) { // 没人参与且是创建者，显示取消
          return (
              <Chip size="sm" color="danger" variant="flat" onClick={cancel} className="cursor-pointer h-4 sm:h-5 text-[10px]">
                  {t("state.cancel")}
              </Chip>
          );
      }
      return (
        <>
          <Chip
            size="sm"
            color="primary"
            variant="flat"
            onClick={onOpen}
            className="cursor-pointer h-4 sm:h-5 text-[10px]"
          >
            {StateJoinNow(t("state.play"))}
          </Chip>
          <LuckypotPayModal item={item} isOpen={isOpen} onClose={onClose} />
        </>
      );
  }

  if (status === LuckypotStatus.DRAWING) {
      return (
        <Chip size="sm" color="default" variant="flat" className="h-4 sm:h-5 text-[10px]">
            {StateDrawing(t("state.drawing"))}
        </Chip>
      );
  }
  
  if (status === LuckypotStatus.ENDED) {
      if (isWinner) {
           // TODO: check if claimed
           const claimed = false;
           if (!claimed) {
               return (
                <Chip size="sm" color="success" variant="flat" onClick={claim} className="cursor-pointer h-4 sm:h-5 text-[10px]">
                    {t("state.claim")}
                </Chip>
               );
           }
      }
      return <Chip size="sm" color="default" variant="flat" className="h-4 sm:h-5 text-[10px]">{t("state.ended")}</Chip>;
  }

  if (status === LuckypotStatus.CANCELLED) {
       if (isSponsor) {
            // TODO: check if refunded
            const refunded = false; 
            if (!refunded) {
                return (
                    <Chip size="sm" color="warning" variant="flat" onClick={refund} className="cursor-pointer h-4 sm:h-5 text-[10px]">
                        {t("state.refund")}
                    </Chip>
                );
            }
       }
       return <Chip size="sm" color="default" variant="flat" className="h-4 sm:h-5 text-[10px]">{t("state.canceled")}</Chip>;
  }
  
  if (status === LuckypotStatus.FAILED) {
      return <Chip size="sm" color="danger" variant="flat" className="h-4 sm:h-5 text-[10px]">{t("state.failed")}</Chip>;
  }

  return <></>;
};

const StateJoinNow = (text: string) => {
  return (
    <div className="flex flex-col text-center">
      <span>{text}</span>
    </div>
  );
};

const StateDrawing = (text: string) => {
  return (
    <div className="flex flex-row gap-1 animate-rainbow-border items-center justify-center">
      <span>{text}</span>
      <Spinner size="sm" classNames={{ wrapper: "w-3 h-3" }} />
    </div>
  );
};

export default GridStateButton;
