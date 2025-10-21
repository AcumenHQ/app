import { useAccount, useDisconnect } from 'wagmi'
import { useWalletPreferences } from '@/stores/walletStore'

export const useWalletIntegration = () => {
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()

    const {
        setCurrency,
        setShowBalance,
    } = useWalletPreferences()

    // Handle disconnect
    const handleDisconnect = async () => {
        try {
            await disconnect()
        } catch (error) {
            console.error('Failed to disconnect wallet:', error)
        }
    }

    return {
        isConnected,
        address,
        handleDisconnect,
    }
}
