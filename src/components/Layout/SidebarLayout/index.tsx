"use client";

import {
  Button,
  ScrollShadow,
  Spacer,
  useDisclosure,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarBrand,
  NavbarMenuToggle,
  useDisclosure as useMenuDisclosure
} from "@heroui/react";
import { Icon } from "@iconify/react";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import AppLink from "@/components/AppLink";
import { DarkModeButton } from "@/components/DarkModeButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileNavMenu from "@/components/Layout/MobileNavMenu";
import TopNavMenu from "@/components/Layout/TopNavMenu";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Logo, LogoText } from "@/components/Logo";
import { MenuItem, MenuItems as items } from "@/components/Menu";
import ScrollToTop from "@/components/ScrollToTop";
import SettingButton from "@/components/Settings/SettingButton";
import WalletConnectButton from "@/components/WalletConnector/WalletConnectButton";
import { AppConfig } from "@/config";
import { isTestnet } from "@/constants";
import { useWindowSize } from "@/hooks/useWindowSize";
import { usePathname } from "@/libs/i18nNavigation";
import { cn } from "@/utils/cn";

import SidebarDrawer from "./SidebarDrawer";
import Sidebar from "./SidebarNav";



/**
 *  This example requires installing the `usehooks-ts` package:
 * `npm install usehooks-ts`
 *
 * import {useMediaQuery} from "usehooks-ts";
 *
 * 💡 TIP: You can use the usePathname hook from Next.js App Router to get the current pathname
 * and use it as the active key for the Sidebar component.
 *
 * ```tsx
 * import {usePathname} from "next/navigation";
 *
 * const pathname = usePathname();
 * const currentPath = pathname.split("/")?.[1]
 *
 * <Sidebar defaultSelectedKey="home" selectedKeys={[currentPath]} />
 * ```
 */
export default function SidebarLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  let currentPath = pathname.split("/")?.[1] || "home";
  const currentMenu = MenuItem(currentPath);
  if (currentMenu && currentMenu.key != currentPath) {
    currentPath = currentMenu.key;
  }
  const { isMobile, isTablet, isDesktop } = useWindowSize();
  const { isOpen, onOpen, onClose, onOpenChange } = useMenuDisclosure();

  // New top navigation layout
  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* Top Navigation */}
      <div className="sticky z-50 top-0 w-full h-16">
        <Navbar isBordered className="bg-[#09090b]/80 border-white/5 backdrop-blur-md" maxWidth="2xl">
          {isMobile && (
            <NavbarBrand>
              <AppLink href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center">
                  <Logo size={48} className="text-background" />
                </div>
                <div className="group-hover:transform group-hover:scale-105 transition-transform duration-300">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    币安人生
                  </h1>
                  <p className="text-[10px] sm:text-xs text-yellow-400/70 leading-tight font-medium">
                    <span className="text-yellow-300">Binance Life</span>
                  </p>
                  {isTestnet(AppConfig.chainId) && <div className="absolute normal-case top-[-10px] right-0 h-3 text-start leading-3 text-[8px] text-foreground bg-warning rounded-md py-0 px-2">Testnet</div>}
                </div>
              </AppLink>

            </NavbarBrand>
          )}

          {!isMobile && (
            <NavbarBrand>
              <AppLink href="/" className="flex items-center gap-2">
                <div className="group-hover:transform group-hover:scale-105 transition-transform duration-300">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    币安人生
                  </h1>
                  <p className="text-[10px] sm:text-xs text-yellow-400/70 leading-tight font-medium">
                    <span className="text-yellow-300">Binance Life</span>
                  </p>
                  {isTestnet(AppConfig.chainId) && <div className="absolute normal-case top-[-10px] right-0 h-3 text-start leading-3 text-[8px] text-foreground bg-warning rounded-md py-0 px-2">Testnet</div>}
                </div>
              </AppLink>
            </NavbarBrand>
          )}

          <TopNavMenu />

          {!isMobile && (
            <NavbarContent justify="end" className="gap-2 pr-4">
              <NavbarItem>
                <LocaleSwitcher />
              </NavbarItem>
              <NavbarItem>
                <WalletConnectButton />
              </NavbarItem>
            </NavbarContent>
          )}

          {isMobile && (
            <NavbarContent justify="end">
              <NavbarMenuToggle
                aria-label={isOpen ? "Close menu" : "Open menu"}
                onPress={onOpenChange}
              />
            </NavbarContent>
          )}

          {isMobile && <MobileNavMenu isMenuOpen={isOpen} onMenuClose={onClose} />}
        </Navbar>

        {isMobile && (
          <div className="flex justify-end items-center gap-2 p-2 border-b border-divider bg-background">
            <LocaleSwitcher />
            <WalletConnectButton />
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-grow w-full mx-auto bg-[#09090b]">
        <div className="w-full max-w-7xl mx-auto py-6">
          {children}
        </div>
      </main>

      <Footer />
      <ScrollToTop />
      <Toaster />
    </div>
  );
}
