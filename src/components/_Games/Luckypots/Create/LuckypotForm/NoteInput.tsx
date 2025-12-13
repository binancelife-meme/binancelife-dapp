import { Checkbox, Spacer, Textarea } from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import Tips from "@/components/Tips";

const NoteInput = (opt: any) => {
  const { register, watch } = useFormContext();
  const t = useTranslations("luckypotCreate");
  const tBuy = useTranslations("luckypotBuy");
  const { note } = watch();

  const [isOption, setIsOption] = useState(!isEmpty(note));

  return (
    <fieldset>
      <div className="flex flex-row items-center">
        <Checkbox isSelected={isOption} onValueChange={setIsOption} />
        <Tips
          startContent={t("note")}
          placement="bottom-start"
          text={
            <div>
                <p>{tBuy('pay_comment.optional')}</p>
                <p>{tBuy('pay_comment.desc')}</p>
                <p>{tBuy('pay_comment.max_chars')}</p>
              </div>
          }
        />
      </div>
      <Spacer y={2} />
      <AnimatePresence>
        {isOption && <Textarea {...register("note")} placeholder={tBuy('pay_comment.placeholder')} />}
      </AnimatePresence>
    </fieldset>
  );
};

export default NoteInput;
