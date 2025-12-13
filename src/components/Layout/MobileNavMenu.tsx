"use client";

import {
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import React from "react";

import AppLink from "@/components/AppLink";
import { MenuItems } from "@/components/Menu";
import { usePathname } from "@/libs/i18nNavigation";
import { cn } from "@/utils/cn";

interface MobileNavMenuProps {
  isMenuOpen: boolean;
  onMenuClose: () => void;
}

export default function MobileNavMenu({ isMenuOpen, onMenuClose }: MobileNavMenuProps) {
  const t = useTranslations("menu");
  const pathname = usePathname();
  
  const currentPath = pathname.split("/")?.[1] || "home";
  const menuItems = MenuItems();

  const renderMobileMenuItem = (item: any) => {
    const isActive = currentPath === item.key;
    const baseClasses = cn(
      "w-full px-4 py-3 rounded-medium transition-colors text-left",
      {
        "bg-default-100 text-primary": isActive,
        "hover:bg-default-50": !isActive,
      }
    );

    if (item.items && item.items.length > 0) {
      return (
        <NavbarMenuItem key={item.key} className="w-full">
          <Accordion>
            <AccordionItem
              key={item.key}
              aria-label={t(item.title)}
              title={
                <div className="flex items-center gap-3">
                  {item.icon && <Icon icon={item.icon} width={20} />}
                  <span className="font-medium">{t(item.title)}</span>
                </div>
              }
              classNames={{
                base: baseClasses,
                title: "font-medium",
                content: "pl-4 pt-2 pb-3",
              }}
            >
              <div className="space-y-1 border-l border-default-200 pl-4">
                {item.items.map((subItem: any) => (
                  <AppLink
                    key={subItem.key}
                    href={subItem.href}
                    className={cn(
                      "block px-3 py-2 rounded-medium hover:bg-default-50 text-sm transition-colors",
                      currentPath === subItem.key ? "text-primary font-medium" : ""
                    )}
                    onClick={onMenuClose}
                  >
                    {t(subItem.title)}
                  </AppLink>
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        </NavbarMenuItem>
      );
    }

    return (
      <NavbarMenuItem key={item.key}>
        <AppLink
          href={item.href}
          className={baseClasses}
          onClick={onMenuClose}
        >
          <div className="flex items-center gap-3">
            {item.icon && <Icon icon={item.icon} width={20} />}
            <span className="font-medium">{t(item.title)}</span>
          </div>
        </AppLink>
      </NavbarMenuItem>
    );
  };

  return (
    <NavbarMenu className="pt-4 gap-2">
      {menuItems.map((item) => renderMobileMenuItem(item))}
    </NavbarMenu>
  );
}