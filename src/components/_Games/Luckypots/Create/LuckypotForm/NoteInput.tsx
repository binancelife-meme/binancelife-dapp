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
  const { note } = watch();

  const [isOption, setIsOption] = useState(!isEmpty(note));

  return (
    <fieldset>
      <Checkbox isSelected={isOption} onValueChange={setIsOption}>
        <Tips
          startContent={t("note")}
          placement="bottom-start"
          text={
            <div>
              <p>Optional.</p>
              <p>Add a description on-chain.</p>
              <p>Max 250 characters.</p>
            </div>
          }
        />
      </Checkbox>
      <Spacer y={2} />
      <AnimatePresence>
        {isOption && <Textarea {...register("note")} placeholder="Optional" />}
      </AnimatePresence>
    </fieldset>
  );
};

export default NoteInput;
