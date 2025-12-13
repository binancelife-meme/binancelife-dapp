"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { isEmpty } from "lodash";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useWindowSize } from "@/hooks/useWindowSize";
import { useRouter, usePathname } from "@/libs/i18nNavigation";
import { cn } from "@/utils/cn";
import { paramsToObject } from "@/utils/queryParams";

import SortFilter from "./SortFilter";
import StatusFilter from "./StatusFilter";


type props = {
  className?: string;
  visibility?: {
    category: boolean;
    chainId: boolean;
    status: boolean;
    sort: boolean;
  };
  onChange?: any;
};

const Filters = ({
  className,
  visibility = { category: true, chainId: true, status: true, sort: true },
  onChange,
}: props) => {
  const router = useRouter();
  const t = useTranslations("luckypot");
  const [visibleFields, setVisibleFields] = useState(false);
  const { isMobile } = useWindowSize();
  const path = usePathname();
  const { push } = useRouter();

  const [fields, setFields] = useState(
    paramsToObject<Record<string, any>>(useSearchParams())
  );

  const handleOnChange = (key: string, data: any) => {
    const param: Record<string, any> = { ...fields };

    param[key] = !isEmpty(data) ? Array.from(data).join(",") : null;

    const filterParam = Object.keys(param)
      .filter((key) => param[key] != null)
      .reduce((acc, key) => acc + `&${key}=` + `${param[key]}`, "");

    push(`${path}?${filterParam}`);

    setFields(param);
    onChange && onChange(param);
  };

  return (
    <div
      className={cn(
        "relative flex flex-row items-center gap-1",
        className
      )}
    >
      <div className="flex-grow flex-shrink-0 py-3 items-start justify-start">
        <div className="text-2xl font-bold">{t("title")}</div>
        <span className="text-sm text-foreground-800">
          {t("desc_list")}
        </span>
      </div>
      <Button
        onPress={() => router.push("/luck/create")}
        size="lg"
        color="primary"
      >
        {t("create")}
      </Button>
      <div className="max-md:visible max-md:absolute max-md:top-5 max-md:right-2 text-foreground-600">
        {isMobile &&
          (visibleFields ? (
            <Icon
              height={32}
              width={32}
              icon="mage:filter-fill"
              onClick={() => setVisibleFields(!visibleFields)}
            />
          ) : (
            <Icon
              height={32}
              width={32}
              icon="mage:filter"
              onClick={() => setVisibleFields(!visibleFields)}
            />
          ))}
      </div>
      <div
        className={cn(
          "flex flex-shrink-0 items-center justify-start gap-2 max-md:mt-1 max-md:flex-col max-md:hidden",
          { ["max-md:flex"]: visibleFields }
        )}
      >
        {visibility.status ? (
          <StatusFilter
            className="item"
            onChange={(data: any) => handleOnChange("status", data)}
          />
        ) : (
          ""
        )}
        {visibility.sort ? (
          <SortFilter
            className="item"
            onChange={(data: any) => handleOnChange("sort", data)}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Filters;
