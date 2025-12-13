import { Button, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";

import { useAuth } from "@/context/AuthContext";

import ProfileEditModal from "./ProfileEditModal";

const ProfileEditButton = ({ id, className }: { id: string; className?: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account } = useAuth();
  const { address } = useAccount();
  const t = useTranslations("profile");
  if (
    account &&
    address &&
    account.id.toLowerCase() == address.toLocaleLowerCase() &&
    id.toLocaleLowerCase()==address.toLocaleLowerCase()
  ) {
    return (
      <>
        <Button
          className={className}
          title={t("edit_button_title")}
          isIconOnly
          variant="light"
          size="md"
          onClick={onOpen}
          startContent={<Icon icon={"flowbite:edit-outline"} className="text-foreground-800" width={22} />}
        ></Button>
        <ProfileEditModal isOpen={isOpen} onClose={onClose} />
      </>
    );
  } else {
    return <></>;
  }
};

export default ProfileEditButton;
