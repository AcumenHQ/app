'use client'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import React, { type ReactNode } from 'react'

// 0. Setup queryClient
const queryClient = new QueryClient()

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID

if (!projectId) {
    throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID environment variable is required. Get your project ID from https://dashboard.reown.com')
}

// 2. Create a metadata object
const metadata = {
    name: 'Acumen',
    description: 'Acumen Prediction and Education Platform',
    url: 'https://acumen.com',
    icons: ['https://acumen.com/logo.png']
}

// 3. Set the networks
const networks = [mainnet, sepolia]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true
})

export const config = wagmiAdapter.wagmiConfig

const appKitInstance = createAppKit({
    adapters: [wagmiAdapter],
    networks: networks as any,
    projectId,
    metadata,
    features: {
        analytics: false
    }
})

export const appKit = appKitInstance

export function WalletProvider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default WalletProvider