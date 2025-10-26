import { useAccount, useDisconnect } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { useWalletPreferences } from "@/stores/walletStore";

export const useWalletIntegration = () => {
  // Use Wagmi for Ethereum chains
  const { address: ethAddress, isConnected: ethConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Use AppKit for universal wallet support (including Solana)
  const { address: appKitAddress, isConnected: appKitConnected } =
    useAppKitAccount();

  // Determine which connection to use
  const address = ethAddress || appKitAddress;
  const isConnected = ethConnected || appKitConnected;

  const { setCurrency, setShowBalance } = useWalletPreferences();

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return {
    isConnected,
    address,
    handleDisconnect,
  };
};
