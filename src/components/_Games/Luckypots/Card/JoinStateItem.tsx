import { Icon } from "@iconify/react";
import React from "react";


import Loading from "@/components/Loading";
import type { JoinState } from "@/types/luckypot/luckypot";


const JoinStateItem = ({
  state,
  className,
}: {
  state?: JoinState;
  className?: any;
}) => {
  let icon;

  switch (state) {
    case "Joined":
      icon = (
        <Icon
          height={16}
          icon="la:check-circle"
          width={16}
          className="text-primary"
        />
      );
      break;
    case "Pending":
      icon = <Loading size={{ width: 12, height: 12 }} />;
      break;
  }
  return (
    <>
      {icon ? (
        <div className={className}>
          <span>{state}</span> {icon}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default JoinStateItem;
