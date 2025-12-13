
import { Select, SelectItem } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { StatusOptions } from "@/constants/selectOptions";

const StatusFilter = ({
  className,
  placeholder,
  onChange,
}: {
  className?: string;
  placeholder?: string;
  value?: any;
  setValue?: any;
  options?: any;
  onChange?: any;
}) => {
  const t = useTranslations("luckypot");
  const query = useSearchParams();
  const [values, setValues] = useState(
    new Set(query.get("status") ? query.get("status")?.split(",") : [''])
  );

  return (
    <Select
      size="sm"
      className="min-w-40"
      label={t("filter.status")}
      labelPlacement="outside-left"
      selectedKeys={values}
      placeholder={placeholder || "All Status"}
      onSelectionChange={(newValue: any) => {
        setValues(newValue);
        onChange && onChange(newValue);
      }}
    >
      {StatusOptions.map((item) => (
        <SelectItem key={item.value}>
          {t(`filter.status_options.${item.value}`)}
        </SelectItem>
      ))}
    </Select>
  );
};

export default StatusFilter;
