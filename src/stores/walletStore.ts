import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WalletPreferences } from '@/types/types'

export const useWalletPreferences = create<WalletPreferences>()(
    persist(
        (set) => ({
            // Initial state
            preferredWallet: null,
            autoConnect: true,
            showBalance: true,
            currency: 'ETH',
            gasPrice: 'standard',
            slippageTolerance: 0.5,

            // Actions
            setPreferredWallet: (wallet) => set({ preferredWallet: wallet }),
            setAutoConnect: (auto) => set({ autoConnect: auto }),
            setShowBalance: (show) => set({ showBalance: show }),
            setCurrency: (currency) => set({ currency }),
            setGasPrice: (gasPrice) => set({ gasPrice }),
            setSlippageTolerance: (slippage) => set({ slippageTolerance: slippage }),
        }),
        {
            name: 'acumen-wallet-preferences',
        }
    )
)
