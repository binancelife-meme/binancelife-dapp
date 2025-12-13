import { Link } from "@heroui/react";
import { Icon } from "@iconify/react";

const socialMedia = [
  {
    SocialIcon: <Icon icon="ri:twitter-x-line" width={26} />,
    url: "https://twitter.com/0xSeasonsRich",
  },
  {
    SocialIcon: <Icon icon="la:telegram-plane" width={28} />,
    url: "https://t.me/BinanceLifeMeme",
  },
  {
    SocialIcon: <Icon icon="fe:github" width={28} />,
    url: "https://github.com/binancelife-meme",
  },
];

const SocialMedia = ({ className }: { className?: any }) => {
  return (
    <div className={className}>
      {socialMedia?.map(({ SocialIcon, url }, index) => (
        <Link key={index} href={url} target="_blank" className="text-foreground-800">
          {SocialIcon}
        </Link>
      ))}
    </div>
  );
};

export default SocialMedia;