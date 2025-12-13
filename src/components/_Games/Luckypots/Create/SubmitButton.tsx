import { Button } from "@heroui/react";

import { cn } from "@/utils/cn";

const SubmitButton = ({
  className,
  isLoading,
  label,
}: {
  className?: any;
  isLoading?: boolean;
  label?: string;
}) => {
  return (
    <Button
      size="lg"
      className={cn("mt-3 w-[70%] max-md:w-full", className)}
      color="primary"
      type="submit"
      isLoading={isLoading}
    >
      {label ? label : "Create"}
    </Button>
  );
};

export default SubmitButton;
