/**
 * Shared constants for blockchain chains, tokens, RPC URLs, and explorers
 */

// ERC20 token contract addresses for testnets
export const TOKEN_ADDRESSES = {
    // Ethereum Sepolia (testnet)
    '11155111': {
        USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        USDT: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
    },
    // Base Sepolia (testnet)
    '84532': {
        USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        USDT: '0x2d82C4b9ff582d02CC89675f2D086Cb7953A555a',
    },
    // Polygon Amoy (testnet)
    '80002': {
        USDC: '0x41e94eb019c0762f9BFcf9Fb1E58725BfB0e7582',
        USDT: '0x6c5131734e5c40A504c18c26Fa96F8eBdbb0fF30',
    },
    // Solana Devnet - Note: Solana uses SPL tokens, not ERC20
    '101': {
        USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // Solana USDC (SPL)
        USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // Solana USDT (SPL)
    },
    // BNB Chain Testnet
    '97': {
        USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
        USDT: '0x2d82C4b9ff582d02CC89675f2D086Cb7953A555a',
    },
};

// ERC20 ABI fragments
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
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'VaINEXPAY0CJDQshulDHj';

// HTTP RPC URLs for different chains
export const RPC_URLS: Record<string, string> = {
    '11155111': `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`, // Ethereum Sepolia
    '84532': `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`, // Base Sepolia
    '80002': `https://polygon-amoy.g.alchemy.com/v2/${alchemyApiKey}`, // Polygon Amoy
    '97': `https://bnb-testnet.g.alchemy.com/v2/${alchemyApiKey}`, // BNB Testnet
    '101': `https://solana-devnet.g.alchemy.com/v2/${alchemyApiKey}`, // Solana Devnet
};

// WebSocket RPC URLs for different chains (for real-time updates)
export function getWebSocketRpcUrl(chainId: string): string {
    const wsProviders: Record<string, string> = {
        '11155111': `wss://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`, // Ethereum Sepolia testnet
        '84532': `wss://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`, // Base Sepolia testnet
        '80002': `wss://polygon-amoy.g.alchemy.com/v2/${alchemyApiKey}`, // Polygon Amoy testnet
        '101': `wss://solana-devnet.g.alchemy.com/v2/${alchemyApiKey}`, // Solana Devnet
        '97': `wss://bnb-testnet.g.alchemy.com/v2/${alchemyApiKey}`, // BNB Chain testnet
    };
    return wsProviders[chainId] || wsProviders['84532']; // Default to Base Sepolia
}

// Block explorer URLs
export const EXPLORER_URLS: Record<string, string> = {
    '11155111': 'https://sepolia.etherscan.io', // Ethereum Sepolia
    '84532': 'https://sepolia.basescan.org', // Base Sepolia
    '80002': 'https://amoy.polygonscan.com', // Polygon Amoy
    '97': 'https://testnet.bscscan.com', // BNB Testnet
    '101': 'https://explorer.solana.com/?cluster=devnet', // Solana Devnet
};

// Chain names
export const CHAIN_NAMES: Record<string, string> = {
    '11155111': 'Ethereum Sepolia',
    '84532': 'Base Sepolia',
    '80002': 'Polygon Amoy',
    '97': 'BNB Testnet',
    '101': 'Solana Devnet',
};

/**
 * Get chain name from chainId
 */
export function getChainName(chainId: string): string {
    return CHAIN_NAMES[chainId] || `Chain ${chainId}`;
}

/**
 * Get explorer URL for a transaction
 */
export function getExplorerUrl(chainId: string, txHash: string): string {
    const baseUrl = EXPLORER_URLS[chainId] || EXPLORER_URLS['84532'];
    return `${baseUrl}/tx/${txHash}`;
}

