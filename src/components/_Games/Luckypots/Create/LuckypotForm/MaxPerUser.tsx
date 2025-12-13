import { Checkbox, Input, Spacer } from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import Tips from "@/components/Tips";


const MaxPerUser = () => {
  const { register, watch } = useFormContext();
  const t = useTranslations("luckypotCreate");
  const { maxPerUser } = watch();

  const [isOption, setIsOption] = useState(maxPerUser ?? 0 > 0);

  return (
    <fieldset>
      <Checkbox isSelected={isOption} onValueChange={setIsOption}>
        {t("maxPerUser")}
      </Checkbox>
      <Spacer y={2} />
      <AnimatePresence>
        {isOption && (
          <Input
            {...register("maxPerUser", { required: true })}
            size="lg"
            type="number"
            labelPlacement="outside"
            placeholder= {t("maxPerUserTip")}
            classNames={{
              label: "!text-foreground-700 !text-pm",
            }}
            variant="flat"
            defaultValue="0"
          />
        )}
      </AnimatePresence>
    </fieldset>
  );
};

export default MaxPerUser;
