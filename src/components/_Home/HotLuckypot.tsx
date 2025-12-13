"use client";

import "@/styles/slick.scss";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import { useRefetchContext } from "@/context/RefetchContext";
import { useLuckypotQuery } from "@/hooks/data";
import { useRouter } from "@/libs/i18nNavigation";

import Caption from "./Caption";
import CardSlider from "./LuckypotCardSlider";

const HotLuckypot = () => {
  const t = useTranslations("luckypot");

  const { address: walletAddress } = useAccount();
  const { data, isLoading, refetch } = useLuckypotQuery(
    {
      first: 20,
      // status: LuckypotStatus.ONGOING,
      orderBy: "endTime",
      orderDirection: "asc",
    },
    walletAddress
  );

  // Use effect to refetch when triggers.payment changes
  const { triggers } = useRefetchContext();
  useEffect(() => {
    if (triggers.payment !== undefined) {
      refetch();
    }
  }, [triggers.payment, refetch]);

  const cryptos = data?.pages
    .flatMap((it: any) => {
      if (it.state == true) {
        return it.data;
      } else {
        return [];
      }
    })
    .filter((it: any) => !isEmpty(it))
    .sort((a: any, b: any) => a.status - b.status);

  const router = useRouter();
  return (
    <>
      <Caption
        title={t("title")}
        desc={t("desc")}
        more="/luckypot"
        moreTitle={t("more")}
        endContent={
          <Button
            size="sm"
            color="primary"
            startContent={<Icon width="20" height="20" icon="ic:round-add" />}
            onPress={() => {
              router.push("/luck/create");
            }}
          >
            {t("create")}
          </Button>
        }
      />
      <CardSlider
        className="luckypot-slider"
        items={cryptos}
        title="Crypto"
        isLoading={isLoading}
      />
    </>
  );
};

export default HotLuckypot;
