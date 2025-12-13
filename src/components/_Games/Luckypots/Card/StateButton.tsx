"use client";

import { Button, Spinner, useDisclosure } from "@heroui/react";
import { Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

import { getLuckypotStatus, LuckypotStatus, type Luckypot } from "@/types/luckypot";
import { cn } from "@/utils/cn";

import LuckypotPayModal from "../PayModal";

import WiningGroup from "./WiningGroup";


const StateButton = ({ item }: { item: Luckypot }) => {
  const t = useTranslations("luckypot");
  const { isOpen, onOpen, onClose } = useDisclosure();
  let element;

  const status = getLuckypotStatus(item);
  switch (status) {
    case LuckypotStatus.ONGOING:
      element = StateJoinNow(t("state.play"));
      break;
    case LuckypotStatus.CANCELLED:
      element = StateCanceled(t("state.canceled"));
      break;
    case LuckypotStatus.DRAWING:
      element = StateDrawing(t("state.drawing"));
      break;
    case LuckypotStatus.FAILED:
      element = StateFAILED(t("state.failed"));
      break;
    default:
      element = <></>;
      break;
  }

  if (status == LuckypotStatus.ENDED) {
    return <div
      className={cn(
        "w-full text-lg font-bold text-black rounded-xl h-auto py-2 bg-transparent data-[hover=true]:bg-transparent px-0"
      )}
    >
      <StateEnded item={item} t={t} />
    </div>
  }

  return (
    <>
      <Button
        size="lg"
        color={status == LuckypotStatus.ONGOING ? "primary" : "default"}
        onClick={status == LuckypotStatus.ONGOING ? onOpen : () => { }}
        className={cn(
          "w-full text-lg font-bold text-black rounded-xl"
        )}
      >
        {element}
      </Button>
      <LuckypotPayModal item={item} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const StateJoinNow = (text: string) => {
  return (
    <div className="flex flex-col text-center py-2">
      <span>{text}</span>
    </div>
  );
};

const StateDrawing = (text: string) => {
  return (
    <div className="flex flex-row gap-1 animate-rainbow-border">
      <span>{text}</span>
      <Spinner size="sm" />
    </div>
  );
};

const StateCanceled = (text: string) => {
  return (
    <div>
      <span>{text}</span>
    </div>
  );
};

const StateFAILED = (text: string) => {
  return (
    <div>
      <span>{text}</span>
    </div>
  );
};

const StateEnded = ({ item, t }: { item: Luckypot, t: any }) => {
  if (!item.drawNumbers || item.drawNumbers.length === 0) {
    return (
      <div>
        <span>{t("state.ended")}</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-row items-center justify-between gap-1 overflow-x-hidden no-scrollbar">
      <div className="flex items-center gap-1 shrink-0">
        <Trophy className="w-5 h-5 text-yellow-500" />
      </div>
      <div className="flex justify-end flex-grow justify-items-end">
        <WiningGroup
          item={item}
          t={t}
          defaultExpandedIndex={-1}
          className="flex justify-end"
        />
      </div>
    </div >
  );
};



export default StateButton;
