"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAccount, useSignMessage } from "wagmi";

import { AppConfig } from "@/config";
import { useNotify } from "@/hooks";
import { User } from "@/types";

interface AuthContextType {
  isConnected: boolean;
  account: User | null;
  open: () => void;
  signIn: (
    message: string,
    signature: string
  ) => Promise<{ state: boolean; message?: string; data?: any }>;
  logout: () => void;
  updateAccount: (account: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthModal = ({
  account,
  address,
  isOpen,
  onClose,
  onSignIn,
}: {
  account?: any;
  address?: string;
  isOpen: boolean;
  onOpen?: any;
  onClose?: any;
  onSignIn?: any;
}) => {
  const t = useTranslations("auth");

  return (
    <>
      <Modal
        placement="center"
        isDismissable={false}
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          header: "bg-background-800 flex flex-row items-center gap-2",
          body: "bg-background-800",
        }}
      >
        <ModalContent>
          <ModalHeader>{t("sign_in_to", { name: AppConfig.name })}</ModalHeader>
          <ModalBody>
            <SignButton
              account={account}
              address={address}
              onSignIn={onSignIn}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export const SignButton = ({
  label,
  account,
  address,
  onSignIn,
}: {
  label?: string;
  account?: any;
  address?: string;
  onSignIn?: any;
}) => {
  const t = useTranslations("auth");
  const { isConnected } = useAccount();
  const {
    data: signMessageData,
    isSuccess,
    isPending,
    signMessage,
  } = useSignMessage();

  const [message] = useState(
    t("sign_message_content", {
      name: AppConfig.name,
      timestamp: new Date().getTime(),
    })
  );

  useEffect(() => {
    if (isSuccess) {
      // login
      onSignIn && onSignIn(message, signMessageData);
    }
  }, [isSuccess, onSignIn, message, signMessageData]);

  useEffect(() => {
    if (account) {
      signMessage({ message });
    }
  }, [account, signMessage, message]);

  useEffect(() => {
    if (!account) {
      signMessage({ message });
    }
  }, [isConnected, account, signMessage, message]);

  return (
    <Button
      className="mb-5 animate-pulse"
      color="primary"
      isDisabled={isPending}
      isLoading={isPending}
      onClick={() => {
        signMessage({ message });
      }}
    >
      {isPending
        ? t("sign_button_pending")
        : label ?? t("sign_button_label")}
    </Button>
  );
};

const storeKey = "signedAccount";
const loadAccount = () => {
  if (typeof localStorage != 'undefined') {
    const json = localStorage.getItem(storeKey);
    if (json) {
      return JSON.parse(json);
    }
  }
  return null;
};
const storeAccount = (account: User | null) => {
  if (typeof localStorage != 'undefined') {
    if (account) {
      localStorage.setItem(storeKey, JSON.stringify(account));
    } else {
      localStorage.removeItem(storeKey);
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected, isDisconnected, chainId, address } = useAccount();
  const [account, setAccount] = useState<User | null>(loadAccount());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { notifyError } = useNotify();
  const t = useTranslations("auth");

  const onSignIn = async (message: string, signature: string) => {
    const rsp = await signIn(message, signature);
    if (rsp.state) {
      onClose();
    } else {
      notifyError({
        title: t("sign_in_failed"),
        message: rsp.message,
      });
    }
  };

  const signIn = async (message: string, signature: string) => {
    try {
      // Send signature and account to the backend to verify
      const dto = {
        chainId: chainId,
        address: address,
        message: message,
        signature: signature,
        referral: localStorage.getItem("referralCode") ?? "",
      };

      const rsp = await fetch(`${AppConfig.apiHost}/api/account/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (rsp.ok) {
        const data = await rsp.json();
        if (data.state) {
          setAccount(data.data);
          storeAccount(data.data);
        }
        if (data.data.referrer) {
          localStorage.removeItem("referralCode");
        }
        return data;
      } else {
        console.error("Sign in failed");
        storeAccount(null);
        return { state: false, message: "Sign in failed" };
      }
    } catch (error) {
      console.error("User denied account access");
      storeAccount(null);
      return { state: false, message: "User denied account access" };
    }
  };

  const open = () => {
    onOpen();
  };

  const logout = () => {
    setAccount(null);
    storeAccount(null);
  };

  const updateAccount = (account: User) => {
    setAccount(account);
    storeAccount(account);
  };

  useEffect(() => {
    if (isConnected == true) {
      if (
        account == null ||
        account.id.toLocaleLowerCase() != address?.toLocaleLowerCase()
      ) {
        onOpen();
      }
    }
  }, [isConnected, address, account, onOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isDisconnected && account) {
        logout();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isDisconnected, account]);

  return (
    <AuthContext.Provider
      value={{ isConnected, account, open, signIn, logout, updateAccount }}
    >
      {children}
      <AuthModal
        account={account}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        onSignIn={onSignIn}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
