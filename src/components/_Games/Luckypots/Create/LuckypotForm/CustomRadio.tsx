import { Radio } from "@heroui/react";

import { cn } from "@/utils/cn";

const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between",
          "cursor-pointer rounded-full border-2 border-default-200/60",
          "data-[selected=true]:border-primary"
        ),
        label: "text-tiny text-default-500",
        labelWrapper: "px-1 m-0",
        wrapper: "hidden",
      }}
    >
      {children}
    </Radio>
  );
};

export default CustomRadio;
