import { ethers, WebSocketProvider } from 'ethers';
import { TOKEN_ADDRESSES, ERC20_BALANCE_ABI, getWebSocketRpcUrl } from './chainConstants';
import { fetchEthPrice } from './index';

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
    chainId: string = '84532' // Default to Base Sepolia testnet
): Promise<WalletBalanceData> {
    // Note: Solana (chainId '101') uses a different protocol and cannot be fetched with ethers.js
    // Solana requires @solana/web3.js library for balance fetching
    if (chainId === '101') {
        console.warn('Solana balance fetching not implemented with ethers.js');
        // Return zero balance for Solana
        return {
            portfolio: 0,
            cash: 0,
            tokens: {
                usdc: 0,
                usdt: 0,
            },
        };
    }

    if (!address || !ethers.isAddress(address)) {
        throw new Error('Invalid wallet address');
    }

    // Create provider based on chainId - use WebSocket RPC endpoints
    const rpcUrl = getWebSocketRpcUrl(chainId);
    const provider = new WebSocketProvider(rpcUrl);

    try {
        // Fetch native ETH balance
        const ethBalance = await provider.getBalance(address);
        const ethBalanceFormatted = parseFloat(ethers.formatEther(ethBalance));

        // Fetch USDC and USDT balances
        const tokens = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES] || TOKEN_ADDRESSES['84532'];

        let usdcBalance = 0;
        let usdtBalance = 0;

        if (tokens.USDC) {
            try {
                // Normalize token address to proper checksum format
                const normalizedUsdcAddress = ethers.getAddress(tokens.USDC);
                const usdcContract = new ethers.Contract(normalizedUsdcAddress, ERC20_BALANCE_ABI, provider);
                const usdcRawBalance = await usdcContract.balanceOf(address);
                const decimals = await usdcContract.decimals();
                usdcBalance = parseFloat(ethers.formatUnits(usdcRawBalance, decimals));
            } catch (error) {
                console.error('Error fetching USDC balance:', error);
            }
        }

        if (tokens.USDT) {
            try {
                // Normalize token address to proper checksum format
                const normalizedUsdtAddress = ethers.getAddress(tokens.USDT);
                const usdtContract = new ethers.Contract(normalizedUsdtAddress, ERC20_BALANCE_ABI, provider);
                const usdtRawBalance = await usdtContract.balanceOf(address);
                const decimals = await usdtContract.decimals();
                usdtBalance = parseFloat(ethers.formatUnits(usdtRawBalance, decimals));
            } catch (error) {
                console.error('Error fetching USDT balance:', error);
            }
        }

        // Calculate portfolio value with real ETH price
        const ethPrice = await fetchEthPrice();
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
    } finally {
        // Close WebSocket connection to prevent memory leaks
        if (provider) {
            provider.destroy();
        }
    }
}

