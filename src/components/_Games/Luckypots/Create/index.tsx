"use client";

import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Address, parseEther, zeroAddress } from "viem";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";


import AppLink from "@/components/AppLink";
import Container from "@/components/Container";
import WalletConnector from "@/components/WalletConnector";
import { AppConfig } from "@/config";
import { NewLuckypot } from "@/config/defaults/NewLuckypot";
import { getDeploysByName } from "@/constants/contracts/address";
import { ContractNames } from "@/constants/contracts/names";
import { useNotify, useWindowSize } from "@/hooks";
import { useContractAbi } from "@/hooks/useContractAbi";
import useTokenApproval from "@/hooks/useTokenApproval";
import { useRouter } from "@/libs/i18nNavigation";
import { LuckypotPrize, PrizeType } from "@/types/luckypot";
import { chains } from "@/wagmi";

import LuckypotForm from "./LuckypotForm";
import LuckypotGuide from "./LuckypotGuide";
import SelectPrize from "./SelectPrize";
import SubmitButton from "./SubmitButton";
import Summary from "./Summary";

const CreateLuckypotPage = (props: { chain?: string }) => {
  const storeKey = `createLuckypot`;

  const { isMobile } = useWindowSize();
  const t = useTranslations("luckypotCreate");
  const router = useRouter();
  const { notifyError, notifySuccess } = useNotify();
  const [btnLoadings, setBtnLoadings] = useState<boolean>(false);
  const [btnLabel, setBtnLabel] = useState(t("btn.submit"));

  const methods = useForm(); // form hooks
  const { handleSubmit, reset, watch } = methods;
  const { prize: selectedPrize } = watch();

  // network connect status
  const { isConnected, chainId: connectedChainId, address: walletAddress } = useAccount();
  const chainId = AppConfig.chainId;

  // luckypot contract interaction
  const contractInfo = getDeploysByName(
    `${chainId}`,
    ContractNames.LuckypotContract
  );
  const abi = useContractAbi(chainId, contractInfo?.address);
  const { data: hash, error, isError, writeContract } = useWriteContract({});
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash,
    });

  const publicClient = usePublicClient();
  const { data: gameInfo, error: gameInfoError, status: gameInfoStatus, refetch: refetchGameInfo } = useReadContract({
    chainId: chainId,
    abi: abi,
    address: contractInfo?.address as Address,
    functionName: "gameInfo",
    query: {
      enabled: !!abi && !!contractInfo?.address,
      refetchOnMount: true,
    },
  });
  useEffect(() => {
    if (!!abi && !!contractInfo?.address && gameInfoStatus === "pending") {
      refetchGameInfo();
    }
  }, [abi, contractInfo?.address, gameInfoStatus, refetchGameInfo]);
  useEffect(() => {
    if (publicClient && contractInfo?.address) {
      publicClient.getCode({ address: contractInfo?.address as Address }).then((code) => {
        if (!code || code === "0x") {
          console.error("No contract code at address", contractInfo?.address);
        }
      }).catch((ex) => {
        console.error("getCode error", ex);
      });
    }
  }, [publicClient, contractInfo?.address]);

  const {
    approveToken,
    approveNFT,
    isApprovedForAll,
    allowance,
    refetchAllowance,
    hash: approvalHash,
    isPending: isApproveing,
    isSuccess: isApproved,
    error: approveError,
  } = useTokenApproval(selectedPrize?.token, contractInfo?.address);

  const resetInputs = useCallback(() => {
    localStorage && localStorage.removeItem(storeKey);
    reset(NewLuckypot);
  }, [reset, storeKey]);

  const getContractInputs = (data: any) => {
    const prize = data.prize as LuckypotPrize;

    return [
      BigInt(Math.floor(new Date().getTime() / 1000) + 60),
      BigInt(Math.floor(new Date(data.endTime).getTime() / 1000)),
      BigInt(Number(data.maxPerUser || 0)),
      (data.powerToken.address) as Address,
      parseEther(data.powerUnit || "0"),
      (prize.token ?? zeroAddress) as Address,
      prize.amount ? parseEther(prize.amount!) : 0n,
      true,
      data.note ?? "",
    ];
  };

  const validateFormData = (data: any) => {
    if (!isConnected || !walletAddress) {
      notifyError({ title: t("error.invalid_form"), message: t("error.wallet_not_connected") });
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));
      return false;
    }
    if (!abi || !contractInfo?.address) {
      notifyError({ title: t("error.invalid_form"), message: t("error.contract_not_ready") });
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));
      return false;
    }
    const prize = data.prize as LuckypotPrize;
    if (!prize) {
      notifyError({ title: t("error.invalid_form"), message: t("error.select_prize") });
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));
      return false;
    }
    const amt = Number(prize.amount || 0);
    if (!amt || amt <= 0) {
      notifyError({ title: t("error.invalid_form"), message: t("error.invalid_prize_amount") });
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));
      return false;
    }

    if ((data.powerToken?.address ?? zeroAddress) == zeroAddress) {
      notifyError({ title: t("error.invalid_form"), message: t("error.invalid_power_token") });
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));
      return false;
    }

    const unit = Number(data.powerUnit || 0);
    if (!unit || unit <= 0) {
      notifyError({ title: t("error.invalid_form"), message: t("error.invalid_power_unit") });
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));
      return false;
    }
    if (!data.endTime) {
      notifyError({ title: t("error.invalid_form"), message: t("error.end_date_required") });
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));
      return false;
    }
    const endTs = new Date(data.endTime).getTime();
    if (!endTs || endTs <= Date.now()) {
      notifyError({ title: t("error.invalid_form"), message: t("error.end_date_in_future") });
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));
      return false;
    }

    return true;
  };

  const sendLuckypotTx = useCallback(async () => {
    setBtnLabel(t("btn.confirm"));
    const data = methods.getValues();
    const args = getContractInputs(data);
    const defaultCreateFee = parseEther("0.01");
    const createFee = (gameInfo as any)?.[4] ?? defaultCreateFee;

    const txValue =
      data.prize?.prizeType == PrizeType.NATIVE
        ? (parseEther(data.prize.amount) + createFee)
        : createFee;
    try {
      if (publicClient && walletAddress) {
        await publicClient.simulateContract({
          account: walletAddress,
          address: contractInfo?.address as Address,
          abi: abi,
          functionName: "create",
          args,
          value: txValue,
        });
      }
    } catch (ex: any) {
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));
      const msg = ex?.shortMessage || ex?.details || ex?.message || String(ex);
      notifyError({ title: t("error.transaction_fail"), message: msg });
      return;
    }
    writeContract({
      chainId: chainId,
      address: contractInfo?.address as Address,
      abi: abi,
      functionName: "create",
      args: args,
      value: txValue,
    });
  }, [abi, chainId, contractInfo?.address, gameInfo, methods, notifyError, publicClient, t, walletAddress, writeContract]);

  /**
   * Submit datas
   * @param data
   */
  const onSubmit = async (data: any) => {
    setBtnLoadings(true);
    const valid = validateFormData(data);
    if (!valid) {
      return;
    }
    const prize = data.prize as LuckypotPrize;
    if (prize) {
      switch (prize.prizeType) {
        case PrizeType.TOKEN:
          if ((allowance ?? 0) < parseEther(prize.amount!)) {
            setBtnLabel(t("btn.approval"));
            approveToken(parseEther(prize.amount!));
          } else {
            await sendLuckypotTx();
          }
          break;
        case PrizeType.NFT:
          if ((isApprovedForAll ?? false) == false) {
            setBtnLabel(t("btn.approval"));
            approveNFT();
          } else {
            await sendLuckypotTx();
          }
          break;
        default:
          await sendLuckypotTx();
          break;
      }
    }
  };

  /**
   *  Approval Contract transaction hook
   */
  useEffect(() => {
    if (isApproved) {
      refetchAllowance();
      sendLuckypotTx();
    }

    if (approveError) {
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));
      console.error(approveError);
      // @ts-ignore ignore
      approveError.cause?.code != 4001 &&
        notifyError({
          title: t("error.approval_fail"),
          // @ts-ignore ignore
          message:
            approveError.details ||
            approveError.shortMessage ||
            approveError.message ||
            approveError,
        });
    }
  }, [
    approvalHash,
    isApproveing,
    isApproved,
    approveError,
    notifyError,
    notifySuccess,
    refetchAllowance,
    sendLuckypotTx,
    t,
  ]);

  /**
   *  Luckypot Contract transaction hook
   */
  useEffect(() => {
    if (isConfirmed) {
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));
      const chain = chains.find((it) => it.id == chainId);
      notifySuccess({
        title: t("success.transaction_success"),
        message: (
          <div className="flex flex-col gap-2">
            <span className="font-bold">Luckypot created successfully! </span>
            <AppLink
              className="gap-1"
              href={`${chain?.blockExplorers?.default.url}/tx/${hash}`}
            >
              <span className="text-primary whitespace-nowrap text-ellipsis overflow-hidden max-w-64">
                {t("btn.view_tx")}
              </span>
              <Icon height={18} icon="fluent:share-16-regular" width={18} />
            </AppLink>
          </div>
        ),
        duration: 0,
      });

      resetInputs();

      setTimeout(() => {
        router.push("/luck");
      }, 3000);
    }

    if (isError && error) {
      setBtnLoadings(false);
      setBtnLabel(t("btn.submit"));

      // @ts-ignore ignore
      error.cause?.code != 4001 &&
        notifyError({
          title: t("error.transaction_fail"),
          // @ts-ignore ignore
          message: error.details || error.shortMessage || error.message || error,
        });
    }
  }, [
    hash,
    isConfirming,
    isConfirmed,
    isError,
    error,
    notifyError,
    notifySuccess,
    chainId,
    resetInputs,
    router,
    t,
  ]);

  /**
   * load from localStorage
   */
  useEffect(() => {
    try {
      if (localStorage) {
        const formData = localStorage.getItem(storeKey);
        if (formData) {
          reset(JSON.parse(formData));
        } else {
          reset(NewLuckypot);
        }
      }
    } catch (ex) {
      resetInputs();
    }
  }, [reset, resetInputs, storeKey]);

  /**
   *  save to localStorage
   */
  useEffect(() => {
    if (localStorage) {
      const formData = JSON.stringify(methods.getValues());
      localStorage.setItem(storeKey, formData);
    }
  }, [methods, storeKey]);

  // Need wallet connected
  if (!isConnected) {
    return (
      <Container>
        <div className="text-2xl font-bold mb-4">{t("name")}</div>
        <div className="h-[50dvh] flex flex-col items-center justify-center">
          <Card className="w-[50%] max-md:w-[90%] bg-background-700">
            <CardBody>
              <WalletConnector />
            </CardBody>
          </Card>
        </div>
      </Container>
    );
  }

  // Form layout
  return (
    <FormProvider {...methods}>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-h5 font-bold mb-6">{t("name")}</div>
          <div className="grid grid-cols-[40%,1fr] max-md:grid-cols-[100%] gap-4">
            {isMobile ? (
              <>
                <SelectPrize chainId={chainId} />
                <LuckypotForm chainId={chainId} />
                <Summary />
                <SubmitButton isLoading={btnLoadings} label={btnLabel} />
                <LuckypotGuide />
              </>
            ) : (
              <>
                <div className="col-start-1 flex flex-col gap-4">
                  <SelectPrize chainId={chainId} />
                  <LuckypotGuide />
                </div>
                <div className="col-start-2 flex flex-col gap-6">
                  <LuckypotForm chainId={chainId} className="max-w-[70%]" />
                  <Summary />
                  <SubmitButton isLoading={btnLoadings} label={btnLabel} />
                </div>
              </>
            )}
          </div>
        </form>
      </Container>
    </FormProvider>
  );
};

export default CreateLuckypotPage;
