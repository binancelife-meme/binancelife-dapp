import {
  ConnectButton,
  RainbowKitProvider,
  darkTheme,
  lightTheme
} from "@rainbow-me/rainbowkit";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";

import { WalletAvatar } from "@/components/Avatar/WalletAvatar";
import { useProfileQuery } from "@/hooks/data/useAccountQuery";
import { getShortAddress } from "@/utils/address";

const WalletConnectButton = ({ label }: { label?: string }) => {
  const t = useTranslations("settings");
  const { theme } = useTheme();
  const { address } = useAccount();
  const { data: userProfile } = useProfileQuery(address || "");
  const user = userProfile?.state ? userProfile.data : null;

  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button onClick={openConnectModal} type="button" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors">
                      {label || t("connect_button")}
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} type="button" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md font-medium text-sm transition-colors">
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={openChainModal}
                      style={{ display: 'flex', alignItems: 'center' }}
                      type="button"
                      className="bg-accent/50 hover:bg-accent/70 text-accent-foreground px-3 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 20,
                            height: 20,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 20, height: 20 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>

                    <button onClick={openAccountModal} type="button" className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-md font-medium text-sm transition-colors flex flex-row items-center gap-2">
                      <WalletAvatar 
                        address={account.address} 
                        ensImage={account.ensAvatar} 
                        size={24} 
                      />
                      <div className="flex flex-col items-center gap-0 p-0 m-0">
                        <span className="text-sm font-medium">{user?.name || account.displayName}</span>
                      </div>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
};

export default WalletConnectButton;
