'use client'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import {
    mainnet,
    sepolia,
    mintSepoliaTestnet,
    solana,
    solanaDevnet,
    solanaTestnet,
    polygon,
    polygonMumbai,
    arbitrum,
    arbitrumSepolia,
    optimism,
    optimismSepolia,
    base,
    baseSepolia,
    bsc,
    bscTestnet,
    avalanche,
    avalancheFuji,
    AppKitNetwork
} from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import React, { type ReactNode } from 'react'

const queryClient = new QueryClient()

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID

if (!projectId) {
    throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID environment variable is required. Get your project ID from https://dashboard.reown.com')
}

const metadata = {
    name: 'Acumen',
    description: 'Acumen Prediction and Education Platform',
    url: 'http://localhost:3000',
    icons: ['https://acumen.com/logo.png']
}

const networks: AppKitNetwork[] = [
    // Ethereum
    mainnet,
    sepolia,
    mintSepoliaTestnet,

    // Solana
    solana,
    solanaDevnet,
    solanaTestnet,

    // Polygon
    polygon,
    polygonMumbai,

    // Arbitrum
    arbitrum,
    arbitrumSepolia,

    // Optimism
    optimism,
    optimismSepolia,

    // Base
    base,
    baseSepolia,

    // BSC
    bsc,
    bscTestnet,

    // Avalanche
    avalanche,
    avalancheFuji
]

const wagmiAdapter = new WagmiAdapter({
    networks: networks,
    projectId,
    ssr: true
})

const solanaAdapter = new SolanaAdapter()

export const config = wagmiAdapter.wagmiConfig

const appKitInstance = createAppKit({
    adapters: [wagmiAdapter, solanaAdapter],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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