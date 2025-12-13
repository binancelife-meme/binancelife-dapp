import { Copy, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import Avatar from "@/components/Avatar";
import NoData from "@/components/Error/NoData";
import SocialLink, {
  SocialLinkType,
} from "@/components/SocialMedia/SocialLink";
import { useRefetchContext } from "@/context/RefetchContext";
import { useProfileQuery } from "@/hooks/data/useAccountQuery";
import { useNotify } from "@/hooks/useNotify";
import { getShortAddress } from "@/utils/address";

import { ProfileLoading } from "../loading";

import ProfileEditButton from "./Edit/ProfileEditButton";

const UserProfile = ({ id }: { id: string }) => {
  const { notifySuccess } = useNotify();
  const { data, isLoading, refetch } = useProfileQuery(id);
  const user = data?.state == true ? data.data : null;
  const t = useTranslations("form");
  const { triggers } = useRefetchContext();
  useEffect(() => {
    if (triggers.profile !== undefined) {
      refetch();
    }
  }, [triggers.profile, refetch]);

  if (isLoading || !user) {
    return <ProfileLoading />;
  }

  if (!user) {
    return <NoData />;
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(user?.id);
      notifySuccess({
        title: t("copy_address"),
        message: t("success"),
        duration: 3000,
      });
    } catch (err) { }
  };

  return (
    <div className="flex flex-col p-4 basis-0 min-w-[350px] max-md:min-w-min max-md:w-full max-md:mt-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex gap-2 items-center w-full relative">
        <Avatar size={{ width: 64, height: 64 }} src={user?.avatar} />
        <div className="flex flex-col justify-start self-stretch my-auto ml-2">
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{user?.name}</h1>
            <ProfileEditButton id={id} />
            <SocialLink
              type={SocialLinkType.TG}
              className={
                "flex gap-1 items-center rounded-md px-2 py-1"
              }
              textClassName={"text-foreground-800"}
              name={user?.tg}
              showText={true}
              showNotset={true}
              showEmpty={false}
            />
          </div>
          <div className="flex items-center justify-start gap-2 text-gray-400 py-1.5 w-fit mx-auto md:mx-0 cursor-pointer hover:bg-white/10 transition-colors" onClick={copyAddress}>
            <Wallet className="w-4 h-4" />
            <span className="font-mono text-sm">{getShortAddress(user.id)}</span>
            <Copy className="w-3 h-3 ml-1 opacity-50" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default UserProfile;
