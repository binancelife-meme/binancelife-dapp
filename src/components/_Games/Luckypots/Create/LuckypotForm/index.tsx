import { Input, DatePicker, RadioGroup, Chip, DateValue, Button } from "@heroui/react";
import {
  now,
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

import AppImage from "@/components/AppImage";
import CryptoCurrency from "@/components/CryptoCurrency";
import Logo from "@/components/Logo";
import Tips from "@/components/Tips";
import { ChainId } from "@/constants/chains";
import { getTokenLogoURL, Token } from "@/constants/tokens";
import { POWER_TOKENS } from "@/constants/tokens/defaultToken";
import { cn } from "@/utils/cn";

import CustomRadio from "./CustomRadio";
import MaxPerUser from "./MaxPerUser";
import NoteInput from "./NoteInput";


const LuckypotForm = ({
  className,
  chainId,
}: {
  className?: any;
  chainId: ChainId;
}) => {
  const t = useTranslations("luckypotCreate");
  const defaultToken = POWER_TOKENS[chainId][0];
  const [selectedToken, setSelectedToken] = useState(defaultToken);

  const {
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const { powerToken, powerUnit } = watch();
  const variant = "flat";

  useEffect(() => {
    if (!powerToken && defaultToken) {
      setValue(
        "powerToken",
        {
          address: defaultToken.address,
          name: defaultToken.name,
          symbol: defaultToken.symbol,
          decimals: defaultToken.decimals,
        },
        { shouldDirty: true }
      );
    }
  }, [powerToken, defaultToken, setValue]);

  useEffect(() => {
    if (powerUnit) {
      setValue("powerUnit", powerUnit, { shouldDirty: true });
    }
  }, [powerUnit, setValue]);

  return (
    <div className={cn("flex flex-col gap-6 px-4", className)}>
      <div className="hidden flex flex-col gap-2">
        <span className="text-foreground-800">{t("powerToken")}</span>
        <div className="flex flex-row items-center gap-2">

          <div className="flex flex-row flex-wrap gap-2">
            {(chainId ? POWER_TOKENS[chainId] || [] : []).map((token: Token) => {
              const selected = selectedToken?.equals(token);
              return (
                <Button
                  key={`buttonBase#${token.address}`}
                  onClick={() => {
                    setSelectedToken(token);
                    setValue(
                      "powerToken",
                      {
                        address: token.address,
                        name: token.name,
                        symbol: token.symbol,
                        decimals: token.decimals,
                      },
                      { shouldDirty: true }
                    );
                  }}
                  variant={selected ? "bordered" : "flat"}
                  color={selected ? "primary" : "default"}
                  disabled={selected}
                  startContent={
                    <AppImage
                      className="w-6 min-w-6 rounded-full"
                      src={getTokenLogoURL(token)}
                    />
                  }
                >
                  {token.symbol}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-row items-end gap-2">
        <Input
          {...register("powerUnit", { required: true })}
          size="lg"
          type="number"
          label={<span className="text-foreground-800">{t("powerUnit")}</span>}
          labelPlacement="outside-top"
          placeholder={t("powerUnit")}
          classNames={{
            label: "!text-pm",
          }}
          variant={variant}
          startContent={
            <Chip radius="sm" variant="light" startContent={<Logo />}>{powerToken?.symbol || "币安人生"}</Chip>
          }
          endContent={
            powerToken && powerUnit && (
              <CryptoCurrency
                className="text-ps text-foreground-700 px-2"
                token={`${powerToken?.symbol}`}
                value={powerUnit}
                display="USD"
                showSuffix={true}
                startContent={"≈"}
              />
            )
          }
        />
      </div>
      {/* End Date  */}
      <div className="flex flex-col gap-2">
        <Controller
          // {...register("endTime")}
          name="endTime"
          control={control}
          rules={{ required: true }}
          render={({ field: { name, value } }) => (
            <DatePicker
              name="endTime"
              size="lg"
              label={
                <Tips
                  startContent={
                    <span className="text-foreground-800">{t("endTime")}</span>
                  }
                  text={
                    <ul className="text-pm text-foreground-600 list-disc px-4">
                      <li>{t("endTimeTips.1")}</li>
                      <li>{t("endTimeTips.2")}</li>
                      <li>{t("endTimeTips.3")}</li>
                    </ul>
                  }
                />
              }
              labelPlacement="outside"
              minValue={now(getLocalTimeZone()).add({ minutes: 30 })} // min 30 minutes
              maxValue={now(getLocalTimeZone()).add({ days: 90 })} // max 90 days
              value={value ? parseAbsoluteToLocal(value) : null}
              onChange={(v: DateValue | null) => {
                if (v) {
                  const dv = v.toDate(getLocalTimeZone()); //local-timezone
                  setValue(name, dv.toISOString()); // utc
                }
              }}
              showMonthAndYearPickers
              granularity="minute"
              classNames={{
                label: "!text-foreground-700 !text-pm",
              }}
              CalendarBottomContent={
                <RadioGroup
                  aria-label="Date precision"
                  classNames={{
                    base: "w-full pb-2",
                    wrapper:
                      "-my-2.5 py-2.5 px-3 gap-1 max-w-[280px] overflow-x-scroll",
                  }}
                  orientation="horizontal"
                  onChange={(v: any) => {
                    const dv = now(getLocalTimeZone()).add({
                      hours: Number(v.target.defaultValue),
                    });
                    setValue(name, dv.toAbsoluteString()); // utc
                  }}
                >
                  <CustomRadio value="1">{t("durations.1h")}</CustomRadio>
                  <CustomRadio value="6">{t("durations.6h")}</CustomRadio>
                  <CustomRadio value="24">{t("durations.1d")}</CustomRadio>
                  <CustomRadio value="48">{t("durations.2d")}</CustomRadio>
                  <CustomRadio value="72">{t("durations.3d")}</CustomRadio>
                  <CustomRadio value="168">{t("durations.7d")}</CustomRadio>
                  <CustomRadio value="336">{t("durations.14d")}</CustomRadio>
                  <CustomRadio value="720">{t("durations.30d")}</CustomRadio>
                </RadioGroup>
              }
            />
          )}
        />
      </div>

      {/* Max Ticket Per User  */}
      <MaxPerUser />
      {/* Note */}
      <NoteInput />
    </div>
  );
};

export default LuckypotForm;
