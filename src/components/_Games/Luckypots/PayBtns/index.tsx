
import { Button, Input, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import BigNumber from "bignumber.js";
import { isEmpty } from "lodash";
import { HelpCircle, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { Address, formatEther, parseEther, zeroAddress } from "viem";
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import AppLink from "@/components/AppLink";
import WalletConnectButton from "@/components/WalletConnector/WalletConnectButton";
import { AppConfig } from "@/config";
import { ChainId } from "@/constants";
import { getDeploysByName } from "@/constants/contracts/address";
import { ContractNames } from "@/constants/contracts/names";
import { POWER_TOKENS } from "@/constants/tokens/defaultToken";
import { useRefetchContext } from "@/context/RefetchContext";
import { useNotify } from "@/hooks";
import { useCheckAndSwitchNetwork } from "@/hooks/useCheckAndSwitchNetwork";
import { useContractAbi } from "@/hooks/useContractAbi";
import usePowerBalance from "@/hooks/usePowerBalance";
import { getLuckypotStatus, Luckypot, LuckypotStatus } from "@/types";
import { tokenValue } from "@/utils/formatters";
import { chains } from "@/wagmi";

import PayComment from "./PayComment";


const LuckypotPayBtns = ({
  className,
  item,
  setJoinState,
}: {
  className?: string;
  item?: Luckypot;
  setJoinState?: any;
}) => {
  const tBuy = useTranslations("luckypotBuy");
  const tForm = useTranslations('form');
  const tPower = useTranslations('power');
  const status = getLuckypotStatus(item!);
  const action = status == LuckypotStatus.FAILED ? "close" : "entry";

  const { isConnected, address } = useAccount();
  const publicClient = usePublicClient();
  const { checkAndSwithNetwork } = useCheckAndSwitchNetwork(AppConfig.chainId);
  const { notifyError, notifySuccess } = useNotify();

  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { triggerRefetch } = useRefetchContext();
  const powerUnit = formatEther(BigInt(item?.powerUnit || "0"));

  const resetInputs = () => {
    setAmount("");
    setComment("");
  };

  const getPayValue = useCallback(() => {
    const tickets = BigNumber(amount ?? "0");
    const points = tickets.pow(2).multipliedBy(powerUnit);
    return points.toString();
  }, [amount, powerUnit]);

  const chain = chains.find((it) => it.id == AppConfig.chainId);
  // contract interaction
  const contractInfo = getDeploysByName(
    `${AppConfig.chainId}`,
    ContractNames.LuckypotContract
  );

  const chainId = AppConfig.chainId as ChainId;
  const powerToken = POWER_TOKENS[chainId]?.[0];
  const { balance: powerBalance } = usePowerBalance(powerToken?.address, address as Address);

  const abi = useContractAbi(AppConfig.chainId, contractInfo?.address);
  const { data: hash, error, isError, writeContract, writeContractAsync } = useWriteContract({});
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash,
    });
  
  const [hasNotified, setHasNotified] = useState(false);
  
  // Reset hasNotified when hash changes
  useEffect(() => {
    if (hash) {
      setHasNotified(false);
    }
  }, [hash]);

  /**
   * Submit handler
   * @param e
   * @returns
   */
  const handlePayment = async (e: any) => {
    if (!checkAndSwithNetwork(e)) {
      return;
    }
    if (btnLoading) {
      return;
    }

    if (isEmpty(amount)) {
      notifyError({
        title: tBuy('error_require_tickets_title'),
        message: tBuy('error_require_tickets_msg'),
      });
      return;
    }

    // btn loading state
    setBtnLoading(true);

    // send transaction
    const usePowers = parseEther(getPayValue());
    try {
      if (publicClient && address) {
        const { request } = await publicClient.simulateContract({
          account: address as Address,
          address: contractInfo?.address as Address,
          abi: abi,
          functionName: "entry",
          args: [
            item?.luckypotId!,
            usePowers,
            zeroAddress,
            comment,
          ],
        });
        writeContract(request);
      } else {
        writeContract({
          chainId: AppConfig.chainId,
          address: contractInfo?.address as Address,
          abi: abi,
          functionName: "entry",
          args: [
            item?.luckypotId!,
            usePowers,
            zeroAddress,
            comment,
          ],
        });
      }
    } catch (err: any) {
      setBtnLoading(false);
      const msg = (err?.shortMessage || err?.message || err?.error?.message || err?.cause?.message || '').toLowerCase();
      let uiMsg = tForm('tx_fail') + ' ' + msg;
      if (msg.includes('nonce too low')) uiMsg = tBuy('err_nonce_low');
      else if (msg.includes('insufficient funds')) uiMsg = tBuy('err_insufficient_funds');
      else if (msg.includes('user rejected')) uiMsg = tBuy('err_user_reject');
      else if (msg.includes('replacement transaction underpriced')) uiMsg = tBuy('err_underpriced');
      notifyError({
        title: tForm('tx_fail'),
        message: uiMsg,
      });
    }
  };

  /**
   * close luckypot
   * @param e
   * @returns
   */
  const handleClose = (e: any) => {
    if (!checkAndSwithNetwork(e)) {
      return;
    }

    // btn loading state
    setBtnLoading(true);

    // send transaction
    writeContract({
      chainId: AppConfig.chainId,
      address: contractInfo?.address as Address,
      abi: abi,
      functionName: "close",
      args: [item?.luckypotId!],
      value: 0n,
    });
  };

  useEffect(() => {
    if (action == "entry") {
      if (isConfirming) {
        setJoinState && setJoinState("Pending");
      }

      if (isConfirmed && !hasNotified) {
        setBtnLoading(false);
        setJoinState && setJoinState("Joined");
        setHasNotified(true);
        notifySuccess({
          title: tForm('tx_success'),
          message: (
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                {tBuy('success_detail', { amount, pay: getPayValue(), currency: powerToken?.symbol || '' })}
              </div>
              <AppLink
                className="gap-1"
                href={`${chain?.blockExplorers?.default.url}/tx/${hash}`}
              >
                <span className="text-primary whitespace-nowrap text-ellipsis overflow-hidden max-w-64">
                  {tForm('tx_view')}
                </span>
                <Icon height={18} icon="fluent:share-16-regular" width={18} />
              </AppLink>
            </div>
          ),
          duration: 0,
        });
        resetInputs();

        // refetch
        setTimeout(() => triggerRefetch("payment"), 5000);
      }

      if (isError && error && !hasNotified) {
        setBtnLoading(false);
        setJoinState && setJoinState(item?.joinState);
        setHasNotified(true);
        // @ts-ignore ignore
        error.cause?.code != 4001 &&
          notifyError({
            title: tForm('tx_fail'),
            message: (error as any)?.shortMessage || (error as any)?.message || (error as any)?.details,
          });
      }
    }

    if (action == "close") {
      if (isConfirmed && !hasNotified) {
        setBtnLoading(false);
        setHasNotified(true);
        notifySuccess({
          title: tForm('tx_success'),
          message: (
            <div className="flex flex-col">
              <div>{tBuy('closed_success')}</div>
              <AppLink
                className="gap-1"
                href={`${chain?.blockExplorers?.default.url}/tx/${hash}`}
              >
                <span className="text-primary whitespace-nowrap text-ellipsis overflow-hidden max-w-64">
                  {tForm('tx_view')}
                </span>
                <Icon height={18} icon="fluent:share-16-regular" width={18} />
              </AppLink>
            </div>
          ),
          duration: 0,
        });

        // refetch
        setTimeout(() => triggerRefetch("payment"), 5000);
      }

      if (isError && error && !hasNotified) {
        setBtnLoading(false);
        setHasNotified(true);
        // @ts-ignore ignore
        error.cause?.code != 4001 &&
          notifyError({
            title: tForm('tx_fail'),
            message: (error as any)?.shortMessage || (error as any)?.message || (error as any)?.details,
          });
      }
    }
  }, [
    action,
    hash,
    isConfirming,
    isConfirmed,
    isError,
    error,
    hasNotified,
    notifyError,
    notifySuccess,
    setJoinState,
    tBuy,
    tForm,
  ]);

  const getPriceOpts = () => {
    let m = [1, 2, 4, 8, 10, 20, 40, 50];
    return m;
  };

  const prices = getPriceOpts().map((it) => ({
    id: `p${it}`,
    recommend: it == 20,
    tickets: it,
  }));

  if (action == "close" && item?.funder?.id == address) {
    return (
      <Button
        size="md"
        radius="md"
        variant="shadow"
        className="px-6 w-full !shadow-inner-yellow bg-gradient-yellow text-white font-bold"
        isLoading={btnLoading}
        onClick={handleClose}
      >
        {btnLoading ? tForm('wallet_confirm') : tBuy('btn_close')}
      </Button>
    );
  }
  if (status != LuckypotStatus.ONGOING) return <></>;

  return (
    <div className="flex flex-col bg-[#18181b] gap-4 p-4 rounded-2xl border border-white/5">
      {/* Power Balance Display */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400 flex items-center gap-1">
          <Zap className="w-4 h-4 text-yellow-400" />
          {tBuy("current_power")}
        </span>
        <span className="font-bold text-yellow-400">
          {tokenValue(Number(powerBalance), 18).toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Input
          size="lg"
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={amount}
          onValueChange={setAmount}
          label={
            <div className="flex items-center gap-2">
              <span>{tBuy("input_tickets")}</span>
              <Tooltip
                content={
                  <div className="px-2 py-1">
                    <div className="font-bold mb-1">{tBuy('tooltip_title')}</div>
                    <div>{tBuy('tooltip_desc')}</div>
                    <div className="text-yellow-400 mt-1">
                      {tBuy('tooltip_formula')}
                    </div>
                  </div>
                }
              >
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              </Tooltip>
            </div>
          }
          labelPlacement="outside-top"
          placeholder={tBuy("input_placeholder")}
          classNames={{
            label: "!text-pm w-full text-white",
            mainWrapper: "w-full",
            inputWrapper: "bg-[#27272a] border-white/10 group-data-[focus=true]:border-yellow-400",
          }}
          variant="bordered"
          endContent={
            <div className="flex min-w-[60%] justify-end items-center gap-2">
              <span className="text-sm text-gray-400">{tBuy('cost')}:</span>
              <span className="text-yellow-400 font-bold">{getPayValue()} {tBuy("power")}</span>
            </div>
          }
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {prices &&
          prices?.length &&
          prices.map((x: any, index: number) => (
            <Button
              size="sm"
              key={x.id}
              variant="flat"
              className="bg-[#27272a] text-gray-300 hover:bg-[#3f3f46] border border-white/5"
              onClick={() => {
                setAmount(`${x.tickets}`);
              }}
            >
              {x.tickets} {tBuy("ticket_unit")}
            </Button>
          ))}
      </div>

      <PayComment comment={comment} setComment={setComment} />

      {Number(amount) > 0 && (
        <div className="text-xs text-yellow-400/90 bg-yellow-400/10 p-3 rounded-lg border border-yellow-400/20 flex flex-col gap-1">
          <div className="font-bold flex items-center gap-1">
            <Icon icon="solar:calculator-minimalistic-bold" />
            {tBuy('formula_title')}
          </div>
          <div className="font-mono pl-1">
            {tBuy('formula_calc', { amount, unit: powerUnit || '0', pay: getPayValue() })}
          </div>
          <div className="text-white/50 text-[10px] mt-1 border-t border-white/5 pt-2">
            <div className="mb-1">{tBuy('tooltip_formula')}</div>
            <div className="text-yellow-400/80 leading-relaxed">
              * {tBuy('why_title')}
              <br />
              {tBuy('why_desc')}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {isConnected == true ? (
          <Button
            size="lg"
            radius="md"
            variant="shadow"
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg shadow-lg shadow-yellow-500/20"
            isLoading={btnLoading}
            onClick={handlePayment}
          >
            {btnLoading ? tForm('wallet_confirm') : tForm("btn_play")}
          </Button>
        ) : (
          <div className="w-full">
            <WalletConnectButton />
          </div>
        )}
        <div className="text-center text-xs text-gray-500">
          {tBuy("tips_prefix")} <AppLink href="/power" className="text-yellow-400 hover:underline">{tBuy("tips_link")}</AppLink> {tBuy("tips_suffix")}
        </div>
      </div>
    </div>
  );
};

export default LuckypotPayBtns;
