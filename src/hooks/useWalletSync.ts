"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { useUserStore } from "@/stores/userStore";

/**
 * Hook that automatically syncs the user store with wallet connection state
 * - Loads user data when wallet connects (both Ethereum and Solana)
 * - Resets user data when wallet disconnects
 */
export function useWalletSync() {
  // Use Wagmi for Ethereum chains
  const {
    address: ethAddress,
    isConnected: ethConnected,
    isConnecting: ethConnecting,
  } = useAccount();

  // Use AppKit for universal wallet support (including Solana)
  const {
    address: appKitAddress,
    isConnected: appKitConnected,
    caipAddress,
  } = useAppKitAccount();

  const { loadUserData, resetUser, profile } = useUserStore();

  // Determine which connection to use
  const address = ethAddress || appKitAddress;
  const isConnected = ethConnected || appKitConnected;
  const isConnecting = ethConnecting;

  useEffect(() => {
    if (isConnected && address) {
      // Only load user data if we don't already have it for this address
      if (!profile || profile.address !== address) {
        loadUserData(address);
      }
    } else if (!isConnected && !isConnecting) {
      // Reset user data when wallet disconnects
      resetUser();
    }
  }, [address, isConnected, isConnecting, loadUserData, resetUser, profile]);

  return {
    address,
    isConnected,
    isConnecting,
    caipAddress, // CAIP address for multi-chain support
  };
}
