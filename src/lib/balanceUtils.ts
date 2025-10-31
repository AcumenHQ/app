import { ethers } from 'ethers';

// ERC20 token contract addresses (mainnet)
const TOKEN_ADDRESSES = {
    // Ethereum Mainnet
    '1': {
        USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
    // Base
    '8453': {
        USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    },
    // BNB Chain
    '56': {
        USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        USDT: '0x55d398326f99059fF775485246999027B3197955',
    },
    // Polygon
    '137': {
        USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    },
};

// ERC20 ABI for balanceOf
const ERC20_ABI = [
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function',
    },
];

export interface TokenBalance {
    usdc: number;
    usdt: number;
    eth?: number;
    sol?: number;
}

export interface WalletBalanceData {
    portfolio: number;
    cash: number;
    tokens: TokenBalance;
}

/**
 * Fetch wallet balance using ethers.js
 */
export async function fetchWalletBalance(
    address: string,
    chainId: string = '1'
): Promise<WalletBalanceData> {
    if (!address || !ethers.isAddress(address)) {
        throw new Error('Invalid wallet address');
    }

    // Create provider based on chainId - use public RPC endpoints
    const providers: Record<string, string> = {
        '1': 'https://eth.llamarpc.com', // Ethereum Mainnet
        '8453': 'https://mainnet.base.org', // Base
        '56': 'https://bsc-dataseed1.binance.org', // BNB Chain
        '137': 'https://polygon-rpc.com', // Polygon
    };

    const rpcUrl = providers[chainId] || providers['1'];
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    try {
        // Fetch native ETH balance
        const ethBalance = await provider.getBalance(address);
        const ethBalanceFormatted = parseFloat(ethers.formatEther(ethBalance));

        // Fetch USDC and USDT balances
        const tokens = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES] || TOKEN_ADDRESSES['1'];

        let usdcBalance = 0;
        let usdtBalance = 0;

        if (tokens.USDC) {
            try {
                const usdcContract = new ethers.Contract(tokens.USDC, ERC20_ABI, provider);
                const usdcRawBalance = await usdcContract.balanceOf(address);
                const decimals = await usdcContract.decimals();
                usdcBalance = parseFloat(ethers.formatUnits(usdcRawBalance, decimals));
            } catch (error) {
                console.error('Error fetching USDC balance:', error);
            }
        }

        if (tokens.USDT) {
            try {
                const usdtContract = new ethers.Contract(tokens.USDT, ERC20_ABI, provider);
                const usdtRawBalance = await usdtContract.balanceOf(address);
                const decimals = await usdtContract.decimals();
                usdtBalance = parseFloat(ethers.formatUnits(usdtRawBalance, decimals));
            } catch (error) {
                console.error('Error fetching USDT balance:', error);
            }
        }

        // Calculate portfolio value (simplified - in production, fetch token prices)
        const ethPrice = 2500; // Mock ETH price - replace with actual price fetch
        const portfolioValue = (usdcBalance + usdtBalance) + (ethBalanceFormatted * ethPrice);

        return {
            portfolio: portfolioValue,
            cash: usdcBalance + usdtBalance, // Available cash
            tokens: {
                usdc: usdcBalance,
                usdt: usdtBalance,
                eth: ethBalanceFormatted,
            },
        };
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        throw error;
    }
}

