import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
} from "@heroui/react";

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
            <span className="text-white">参与活动</span>
            <Chip size="sm" className="bg-yellow-400 text-black font-bold">{item.title}</Chip>
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
