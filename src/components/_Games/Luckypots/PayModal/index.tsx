import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
} from "@heroui/react";
import { useTranslations } from "next-intl";

import type { Luckypot } from "@/types/luckypot/luckypot";

import LuckypotPayBtns from "../PayBtns";


const LuckypotPayModal = ({
  item,
  isOpen,
  onClose,
}: {
  item: Luckypot;
  isOpen: boolean;
  onOpen?: any;
  onClose?: any;
}) => {
  const t = useTranslations("form");
  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          header: "bg-background-800 flex flex-row items-center gap-2 border-b border-white/10",
          body: "bg-background-800 p-0",
          // backdrop: "bg-background-500 backdrop-opacity-50"
        }}
      >
        <ModalContent>
          <ModalHeader>
            <span className="text-white">{t("btn_play")}</span>
            <Chip size="sm" className="bg-yellow-400 text-black font-bold">{item.title}<span className="text-xs text-gray-400 font-medium"> #{item.luckypotId}</span></Chip>
          </ModalHeader>
          <ModalBody>
            <LuckypotPayBtns item={item} className="!border-none !bg-transparent" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LuckypotPayModal;
