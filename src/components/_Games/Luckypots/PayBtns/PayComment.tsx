import { Checkbox, Spacer, Textarea } from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import Tips from "@/components/Tips";

const PayComment = ({
  comment,
  setComment,
  className,
}: {
  comment: any;
  setComment?: any;
  className?: any;
}) => {
  const t = useTranslations("luckypotBuy.pay_comment");
  const [isAddComment, setIsAddComment] = useState(false);
  return (
    <div className={className || "flex gap-1"}>
      <fieldset className="w-[60%] max-md:w-full">
        <div className="flex flex-row items-center">
          <Checkbox isSelected={isAddComment} onValueChange={setIsAddComment} />
          <Tips
            className="text-foreground-800 text-sm"
            startContent={t('tips_title')}
            placement="bottom-start"
            text={
              <div>
                <p>{t('optional')}</p>
                <p>{t('desc')}</p>
                <p>{t('max_chars')}</p>
              </div>
            }
          />
        </div>
        <Spacer y={2} />
        <AnimatePresence>
          {isAddComment && (
            <Textarea
              placeholder={t('placeholder')}
              value={comment}
              onValueChange={setComment}
            />
          )}
        </AnimatePresence>
      </fieldset>
    </div>
  );
};

export default PayComment;
