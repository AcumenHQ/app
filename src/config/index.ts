/**
 * Central configuration for blockchain chains, tokens, RPC URLs, and contract addresses
 * All chain-related constants should be sourced from here for consistency
 * and easy environment variable overrides
 */

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

// Supported tokens
export const SUPPORTED_TOKENS = process.env.SUPPORTED_TOKENS || 'usdc,usdt';
export const SUPPORTED_TOKENS_ARRAY = SUPPORTED_TOKENS.split(',').map(token => token.trim()).filter(Boolean) as string[];

// Supported chain IDs (numeric format)
export const CHAIN_IDS = {
    ETHEREUM_SEPOLIA: process.env.NEXT_PUBLIC_CHAIN_ID_ETH_SEPOLIA || '11155111',
    BASE_SEPOLIA: process.env.NEXT_PUBLIC_CHAIN_ID_BASE_SEPOLIA || '84532',
    POLYGON_AMOY: process.env.NEXT_PUBLIC_CHAIN_ID_POLYGON_AMOY || '80002',
    BNB_TESTNET: process.env.NEXT_PUBLIC_CHAIN_ID_BNB_TESTNET || '97',
    SOLANA_DEVNET: process.env.NEXT_PUBLIC_CHAIN_ID_SOLANA_DEVNET || '101',
} as const;

// Chain names mapping
export const CHAIN_NAMES: Record<string, string> = {
    [CHAIN_IDS.ETHEREUM_SEPOLIA]: 'Ethereum Sepolia',
    [CHAIN_IDS.BASE_SEPOLIA]: 'Base Sepolia',
    [CHAIN_IDS.POLYGON_AMOY]: 'Polygon Amoy',
    [CHAIN_IDS.BNB_TESTNET]: 'BNB Testnet',
    [CHAIN_IDS.SOLANA_DEVNET]: 'Solana Devnet',
};

// EIP155 chain IDs (format: eip155:chainId)
export const EIP155_CHAIN_IDS = {
    ETHEREUM_SEPOLIA: `eip155:${CHAIN_IDS.ETHEREUM_SEPOLIA}`,
    BASE_SEPOLIA: `eip155:${CHAIN_IDS.BASE_SEPOLIA}`,
    POLYGON_AMOY: `eip155:${CHAIN_IDS.POLYGON_AMOY}`,
    BNB_TESTNET: `eip155:${CHAIN_IDS.BNB_TESTNET}`,
    SOLANA_DEVNET: `solana:${CHAIN_IDS.SOLANA_DEVNET}`,
} as const;

// HTTP RPC URLs with environment variable overrides and fallbacks
export const RPC_URLS: Record<string, string> = {
    [CHAIN_IDS.ETHEREUM_SEPOLIA]: process.env.NEXT_PUBLIC_RPC_ETH_SEPOLIA ||
        (alchemyApiKey ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}` : 'https://sepolia.infura.io'),
    [CHAIN_IDS.BASE_SEPOLIA]: process.env.NEXT_PUBLIC_RPC_BASE_SEPOLIA ||
        (alchemyApiKey ? `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}` : 'https://sepolia.base.org'),
    [CHAIN_IDS.POLYGON_AMOY]: process.env.NEXT_PUBLIC_RPC_POLYGON_AMOY ||
        (alchemyApiKey ? `https://polygon-amoy.g.alchemy.com/v2/${alchemyApiKey}` : 'https://rpc-amoy.polygon.technology'),
    [CHAIN_IDS.BNB_TESTNET]: process.env.NEXT_PUBLIC_RPC_BNB_TESTNET ||
        (alchemyApiKey ? `https://bnb-testnet.g.alchemy.com/v2/${alchemyApiKey}` : 'https://data-seed-prebsc-1-s1.binance.org:8545'),
    [CHAIN_IDS.SOLANA_DEVNET]: process.env.NEXT_PUBLIC_RPC_SOLANA_DEVNET ||
        (alchemyApiKey ? `https://solana-devnet.g.alchemy.com/v2/${alchemyApiKey}` : 'https://api.devnet.solana.com'),
};

// WebSocket RPC URLs for real-time updates
export const WS_RPC_URLS: Record<string, string> = {
    [CHAIN_IDS.ETHEREUM_SEPOLIA]: process.env.NEXT_PUBLIC_WS_RPC_ETH_SEPOLIA ||
        (alchemyApiKey ? `wss://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}` : 'wss://eth-sepolia.public.blastapi.io'),
    [CHAIN_IDS.BASE_SEPOLIA]: process.env.NEXT_PUBLIC_WS_RPC_BASE_SEPOLIA ||
        (alchemyApiKey ? `wss://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}` : 'wss://base-sepolia.publicnode.com'),
    [CHAIN_IDS.POLYGON_AMOY]: process.env.NEXT_PUBLIC_WS_RPC_POLYGON_AMOY ||
        (alchemyApiKey ? `wss://polygon-amoy.g.alchemy.com/v2/${alchemyApiKey}` : 'wss://polygon-amoy.publicnode.com'),
    [CHAIN_IDS.BNB_TESTNET]: process.env.NEXT_PUBLIC_WS_RPC_BNB_TESTNET ||
        (alchemyApiKey ? `wss://bnb-testnet.g.alchemy.com/v2/${alchemyApiKey}` : 'wss://bsc-testnet.publicnode.com'),
    [CHAIN_IDS.SOLANA_DEVNET]: process.env.NEXT_PUBLIC_WS_RPC_SOLANA_DEVNET ||
        (alchemyApiKey ? `wss://solana-devnet.g.alchemy.com/v2/${alchemyApiKey}` : 'wss://api.devnet.solana.com'),
};

// Block explorer URLs
export const EXPLORER_URLS: Record<string, string> = {
    [CHAIN_IDS.ETHEREUM_SEPOLIA]: process.env.NEXT_PUBLIC_EXPLORER_ETH_SEPOLIA || 'https://sepolia.etherscan.io',
    [CHAIN_IDS.BASE_SEPOLIA]: process.env.NEXT_PUBLIC_EXPLORER_BASE_SEPOLIA || 'https://sepolia.basescan.org',
    [CHAIN_IDS.POLYGON_AMOY]: process.env.NEXT_PUBLIC_EXPLORER_POLYGON_AMOY || 'https://amoy.polygonscan.com',
    [CHAIN_IDS.BNB_TESTNET]: process.env.NEXT_PUBLIC_EXPLORER_BNB_TESTNET || 'https://testnet.bscscan.com',
    [CHAIN_IDS.SOLANA_DEVNET]: process.env.NEXT_PUBLIC_EXPLORER_SOLANA_DEVNET || 'https://explorer.solana.com/?cluster=devnet',
};

// Token contract addresses (can be overridden via env)
export const TOKEN_ADDRESSES: Record<string, { USDC: string; USDT: string }> = {
    [CHAIN_IDS.ETHEREUM_SEPOLIA]: {
        USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS_ETH_SEPOLIA || '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS_ETH_SEPOLIA || '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
    },
    [CHAIN_IDS.BASE_SEPOLIA]: {
        USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE_SEPOLIA || '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS_BASE_SEPOLIA || '0x2d82C4b9ff582d02CC89675f2D086Cb7953A555a',
    },
    [CHAIN_IDS.POLYGON_AMOY]: {
        USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS_POLYGON_AMOY || '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
        USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS_POLYGON_AMOY || '0x6C5131734E5C40a504c18c26fa96F8EBDbb0ff30',
    },
    [CHAIN_IDS.BNB_TESTNET]: {
        USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS_BNB_TESTNET || '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS_BNB_TESTNET || '0x2d82C4b9ff582d02CC89675f2D086Cb7953A555a',
    },
    [CHAIN_IDS.SOLANA_DEVNET]: {
        // Solana uses SPL tokens, not ERC20
        USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS_SOLANA_DEVNET || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS_SOLANA_DEVNET || 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    },
};

// Helper function to get WebSocket URL by chain ID
export function getWebSocketRpcUrl(chainId: string): string {
    return WS_RPC_URLS[chainId] || WS_RPC_URLS[CHAIN_IDS.BASE_SEPOLIA];
}

// Helper function to get chain name
export function getChainName(chainId: string): string {
    return CHAIN_NAMES[chainId] || `Chain ${chainId}`;
}

// Helper function to get explorer URL for a transaction
export function getExplorerUrl(chainId: string, txHash: string): string {
    const baseUrl = EXPLORER_URLS[chainId] || EXPLORER_URLS[CHAIN_IDS.BASE_SEPOLIA];
    return `${baseUrl}/tx/${txHash}`;
}

// Mapping from deposit chain IDs to numeric chain IDs (for balance fetching)
export const DEPOSIT_CHAIN_TO_NUMERIC: Record<string, string> = {
    'ethereum': CHAIN_IDS.ETHEREUM_SEPOLIA,
    'base': CHAIN_IDS.BASE_SEPOLIA,
    'polygon-amoy': CHAIN_IDS.POLYGON_AMOY,
    'bnb': CHAIN_IDS.BNB_TESTNET,
    'solana-devnet': CHAIN_IDS.SOLANA_DEVNET,
} as const;

// ERC20 ABI fragments (these don't need env overrides)
export const ERC20_ABI_FRAGMENTS = {
    balanceOf: {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
    },
    decimals: {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function',
    },
    transfer: {
        constant: false,
        inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function',
    },
};

// Complete ERC20 ABI for balance checking
export const ERC20_BALANCE_ABI = [
    ERC20_ABI_FRAGMENTS.balanceOf,
    ERC20_ABI_FRAGMENTS.decimals,
];

// Complete ERC20 ABI for transfers
export const ERC20_TRANSFER_ABI = [
    ERC20_ABI_FRAGMENTS.transfer,
    ERC20_ABI_FRAGMENTS.decimals,
];

