"use client";

import {
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import React from "react";

import AppLink from "@/components/AppLink";
import { MenuItems } from "@/components/Menu";
import { usePathname } from "@/libs/i18nNavigation";
import { cn } from "@/utils/cn";

interface TopNavMenuProps {
  className?: string;
}

export default function TopNavMenu({ className }: TopNavMenuProps) {
  const t = useTranslations("menu");
  const pathname = usePathname();
  
  const currentPath = pathname.split("/")?.[1] || "home";
  const menuItems = MenuItems();

  const renderNavItem = (item: any) => {
    const isActive = currentPath === item.key;
    const baseClasses = cn(
      "px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium",
      {
        "bg-[#F0B90B] text-black font-bold shadow-[0_0_15px_rgba(240,185,11,0.3)]": isActive,
        "text-gray-400 hover:text-white hover:bg-white/5": !isActive,
      }
    );

    if (item.items && item.items.length > 0) {
      return (
        <Dropdown key={item.key}>
          <DropdownTrigger>
            <Button
              variant="light"
              className={baseClasses}
              startContent={item.icon && (
                <Icon icon={item.icon} width={18} />
              )}
              endContent={<Icon icon="mdi:chevron-down" width={16} />}
            >
              {t(item.title)}
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label={t(item.title)}
            className="bg-[#18181b] border border-white/5 rounded-xl p-2"
            itemClasses={{
              base: "data-[hover=true]:bg-white/5 data-[hover=true]:text-white text-gray-400",
            }}
          >
            {item.items.map((subItem: any) => (
              <DropdownItem key={subItem.key} textValue={t(subItem.title)}>
                <AppLink
                  href={subItem.href}
                  className="flex items-center gap-2 w-full px-2 py-1 rounded-lg"
                >
                  {t(subItem.title)}
                </AppLink>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      );
    }

    return (
      <NavbarItem key={item.key}>
        <AppLink
          href={item.href}
          className={cn(baseClasses, item.className)}
        >
          {item.icon && (
            <Icon icon={item.icon} width={18} className="mr-1" />
          )}
          {t(item.title)}
        </AppLink>
      </NavbarItem>
    );
  };

  return (
    <NavbarContent className={cn("gap-2", className)} justify="center">
      {menuItems.map((item) => renderNavItem(item))}
    </NavbarContent>
  );
}