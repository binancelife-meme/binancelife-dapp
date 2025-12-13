
import { Select, SelectItem } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { SortOptions } from "@/constants/selectOptions";

const SortFilter = ({
  className,
  onChange,
}: {
  className?: string;
  options?: any;
  onChange?: any;
}) => {
  const t = useTranslations("luckypot");
  const query = useSearchParams();
  const [values, setValues] = useState(
    new Set(
      query.get("sort") ? query.get("sort")?.split(",") : ["time-remaining"]
    )
  );

  return (
    <Select
      size="sm"
      className="min-w-40"
      label={t("filter.sort")}
      labelPlacement="outside-left"
      selectedKeys={values}
      onSelectionChange={(newValue: any) => {
        setValues(newValue);
        onChange && onChange(newValue);
      }}
    >
      {SortOptions.map((item) => (
        <SelectItem key={item.value}>
          {t(`filter.sort_options.${item.value}`)}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SortFilter;
