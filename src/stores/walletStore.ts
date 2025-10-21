import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WalletPreferences {
    // User preferences for wallet interactions
    preferredWallet: string | null
    autoConnect: boolean
    showBalance: boolean
    currency: 'ETH' | 'USD' | 'EUR'

    // Transaction preferences
    gasPrice: 'slow' | 'standard' | 'fast'
    slippageTolerance: number

    // Actions
    setPreferredWallet: (wallet: string | null) => void
    setAutoConnect: (auto: boolean) => void
    setShowBalance: (show: boolean) => void
    setCurrency: (currency: 'ETH' | 'USD' | 'EUR') => void
    setGasPrice: (gasPrice: 'slow' | 'standard' | 'fast') => void
    setSlippageTolerance: (slippage: number) => void
}

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
