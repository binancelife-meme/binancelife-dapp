"use client";


import { HeroUIProvider } from "@heroui/system";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  type Locale
} from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { WalletAvatar } from "@/components/Avatar/WalletAvatar";
import { AppConfig } from "@/config";
import MomentConfig from "@/constants/momentjs";
import { AmountDisplayProvider } from "@/context/AmountDisplayContext";
import { AuthProvider } from "@/context/AuthContext";
import { CryptoPriceProvider } from "@/context/CryptoPrice/CryptoPriceProvider";
import ReactQueryProvider from "@/context/ReactQueryProvider";
import { RefetchProvider } from "@/context/RefetchContext";
import { RouteProvider } from "@/context/RouteContext";
import { useDidMount } from "@/hooks/useDidMount";
import { useRouter } from "@/libs/i18nNavigation";
import { config } from "@/wagmi";

export function Providers({
  locale,
  children,
}: {
  locale?: Locale;
  children: ReactNode;
}) {
  const router = useRouter();

  const didMount = useDidMount();

  const appInfo = {
    appName: "BinanceLife",
  };

  MomentConfig();

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider
          attribute="class"
          defaultTheme={"dark"}
          enableColorScheme={true}
        >
          <RouteProvider>
            <QueryClientProvider client={queryClient}>
              {didMount && (
                <AuthProvider>
                  <RainbowKitProvider
                    modalSize="compact"
                    appInfo={appInfo}
                    locale={locale}
                    theme={{
                      darkMode: darkTheme(),
                      lightMode: lightTheme(),
                    }}
                    avatar={WalletAvatar}
                    initialChain={AppConfig.chainId}
                  >
                    <ReactQueryProvider>
                      <RefetchProvider>
                        <CryptoPriceProvider>
                          <AmountDisplayProvider>
                             {children}
                          </AmountDisplayProvider>
                        </CryptoPriceProvider>
                      </RefetchProvider>
                    </ReactQueryProvider>
                  </RainbowKitProvider>
                </AuthProvider>
              )}
            </QueryClientProvider>
          </RouteProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </WagmiProvider>
  );
}
