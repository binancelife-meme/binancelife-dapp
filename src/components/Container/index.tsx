import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

const Container = ({
  className,
  children,
}: {
  className?: any;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "w-full px-4 pt-5 pb-5 max-md:px-2",
        className
      )}
    >
      <div className="mx-auto flex flex-col w-full max-w-[1176px]">
        {children}
      </div>
    </div>
  );
};

export default Container;
