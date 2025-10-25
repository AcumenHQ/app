"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useUserStore } from "@/stores/userStore";

/**
 * Hook that automatically syncs the user store with wallet connection state
 * - Loads user data when wallet connects
 * - Resets user data when wallet disconnects
 */
export function useWalletSync() {
  const { address, isConnected, isConnecting } = useAccount();
  const { loadUserData, resetUser, profile } = useUserStore();

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
  };
}
