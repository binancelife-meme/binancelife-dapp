import { Image } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

import img from "@/public/img/logo.png";
import { IconSize, IconSvgProps } from "@/types/props";
import { cn } from "@/utils/cn";

export const Logo = (props: IconSvgProps) => {
  return <Image src={img.src} width={props.size || 32} alt="Logo" />;
};

export const LogoText = (className?: any) => {
  return (
    <div className={cn("flex flex-row text-lg relative uppercase", className)}>
      <span className="font-normal opacity-75">币安</span>
      <span className="font-bold opacity-90">人生</span>
    </div>
  );
};

export const LogoGray = ({
  size,
  className,
}: {
  size?: IconSize;
  className?: any;
}) => (
  // <Image
  //   src="/img/logo-gray.svg"
  //   width={size?.width}
  //   height={size?.height}
  //   className={className}
  //   alt="Logo Gray"
  // />
  <Icon icon={"lucide:coins"} width={size?.width || 32} height={size?.height || 32} />
);

export default Logo;
