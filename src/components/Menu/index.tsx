"use client";

export const MenuItems = () => {
  return [
    {
      key: "home",
      href: "/",
      icon: "material-symbols-light:home",
      title: "home",
      className: "rounded-full"
    },
    {
      key: "luck",
      href: "/luck",
      icon: "lucide:coins",
      title: "luck",
      className: "rounded-full font-medium bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300",
    },
    {
      key: "power",
      href: "/power",
      icon: "iconoir:flash",
      title: "power",
      className: "rounded-full font-medium bg-blue-400/10 border border-blue-400/20 text-blue-400 hover:bg-blue-400/20 hover:border-blue-400/40 transition-all duration-300"
    },
    {
      key: "leaderboard",
      href: "/leaderboard",
      icon: "mdi:chart-bar",
      title: "leaderboard",
      className: "rounded-full font-medium bg-green-400/10 border border-green-400/20 text-green-400 hover:bg-green-400/20 hover:border-green-400/40 transition-all duration-300"
    },
    {
      key: "account",
      href: "/account",
      icon: "carbon:user-avatar",
      title: "account",
       className: "rounded-full font-medium bg-purple-400/10 border border-purple-400/20 text-purple-400 hover:bg-purple-400/20 hover:border-purple-400/40 transition-all duration-300"
    },
  ];
};

export const MenuItem = (key: string) => {
  return (
    MenuItems().find((it: any) => it.key == key) ||
    MenuItems().find((it: any) => it.items?.find((item: any) => item.key == key))
  );
};
