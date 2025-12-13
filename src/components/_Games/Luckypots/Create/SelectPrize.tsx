import { useFormContext } from "react-hook-form";

import { cn } from "@/utils/cn";

import CryptoSelector from "./CryptoSelector";

const SelectPrize = ({
  className,
  chainId,
}: {
  className?: any;
  chainId?: any;
}) => {
  const { setValue, watch } = useFormContext();

  const { endTime, prize } = watch();

  return (
    <div className={cn("flex flex-col gap-4 p-4 py-8 bg-background-800 border border-dashed border-divider rounded-2xl", className)}>
      <div className="grid grid-cols-1 gap-2 max-md:grid-cols-1 justify-items-center ">
        <CryptoSelector
          chainId={chainId}
          prize={prize}
          endTime={endTime}
          setValue={setValue}
        />
      </div>
    </div>
  );
};

export default SelectPrize;
