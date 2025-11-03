import { ethers, WebSocketProvider, JsonRpcProvider } from 'ethers';
import { TOKEN_ADDRESSES, ERC20_BALANCE_ABI, getWebSocketRpcUrl, RPC_URLS } from '@/config';
import { fetchEthPrice, fetchMaticPrice } from './index';
import type { WalletBalanceData, ChainBalance } from '@/types/types';
import { CHAIN_IDS } from '@/config';


/**
 * Fetch wallet balance using ethers.js
 */
export async function fetchWalletBalance(
    address: string,
    chainId: string = CHAIN_IDS.BASE_SEPOLIA as string
): Promise<WalletBalanceData> {
    // Note: Solana (chainId '101') uses a different protocol and cannot be fetched with ethers.js
    // Solana requires @solana/web3.js library for balance fetching
    if (chainId === CHAIN_IDS.SOLANA_DEVNET as string) {
        console.warn('Solana balance fetching not implemented with ethers.js');
        // Return zero balance for Solana
        return {
            portfolio: 0,
            cash: 0,
            chains: {
                [chainId]: {
                    usdc: 0,
                    usdt: 0,
                    sol: 0,
                    native: 0,
                }
            }
        };
    }

    if (!address || !ethers.isAddress(address)) {
        throw new Error('Invalid wallet address');
    }

    // Create provider based on chainId - use HTTP for balance fetching (more reliable)
    const httpRpcUrl = RPC_URLS[chainId];
    const wsRpcUrl = getWebSocketRpcUrl(chainId);
    // Use HTTP if available, fallback to WebSocket
    const rpcUrl = httpRpcUrl || wsRpcUrl;
    const provider = httpRpcUrl ? new JsonRpcProvider(rpcUrl) : new WebSocketProvider(rpcUrl);

    try {
        // Fetch native ETH balance
        const ethBalance = await provider.getBalance(address);
        const ethBalanceFormatted = parseFloat(ethers.formatEther(ethBalance));

        // Fetch USDC and USDT balances
        const tokens = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES] || TOKEN_ADDRESSES[CHAIN_IDS.BASE_SEPOLIA as string];

        let usdcBalance = 0;
        let usdtBalance = 0;

        if (tokens.USDC && ethers.isAddress(tokens.USDC)) {
            try {
                // Normalize token address to proper checksum format
                const normalizedUsdcAddress = ethers.getAddress(tokens.USDC);
                const usdcContract = new ethers.Contract(normalizedUsdcAddress, ERC20_BALANCE_ABI, provider);
                const usdcRawBalance = await usdcContract.balanceOf(address);
                const decimals = await usdcContract.decimals();
                usdcBalance = parseFloat(ethers.formatUnits(usdcRawBalance, decimals));
            } catch (error) {
                // Silently skip if token doesn't exist on chain or contract has issues
                console.warn(`USDC not available on chain ${chainId}`);
            }
        }

        if (tokens.USDT && ethers.isAddress(tokens.USDT)) {
            try {
                // Normalize token address to proper checksum format
                const normalizedUsdtAddress = ethers.getAddress(tokens.USDT);
                const usdtContract = new ethers.Contract(normalizedUsdtAddress, ERC20_BALANCE_ABI, provider);
                const usdtRawBalance = await usdtContract.balanceOf(address);
                const decimals = await usdtContract.decimals();
                usdtBalance = parseFloat(ethers.formatUnits(usdtRawBalance, decimals));
            } catch (error) {
                // Silently skip if token doesn't exist on chain or contract has issues
                console.warn(`USDT not available on chain ${chainId}`);
            }
        }

        // Calculate portfolio value with correct native token price
        let nativeTokenPrice = 0;
        const isPolygon = chainId === CHAIN_IDS.POLYGON_AMOY as string;

        try {
            if (isPolygon) {
                nativeTokenPrice = await fetchMaticPrice();
            } else {
                // For other EVM chains (Ethereum, Base, BNB), use ETH price
                nativeTokenPrice = await fetchEthPrice();
            }
        } catch (error) {
            console.warn('Failed to fetch native token price, using fallback:', error);
            // Use fallback prices
            nativeTokenPrice = isPolygon ? 0.67 : 3000;
        }

        const portfolioValue = (usdcBalance + usdtBalance) + (ethBalanceFormatted * nativeTokenPrice);

        return {
            portfolio: portfolioValue,
            cash: usdcBalance + usdtBalance, // Available cash
            chains: {
                [chainId]: {
                    usdc: usdcBalance,
                    usdt: usdtBalance,
                    eth: ethBalanceFormatted,
                    native: ethBalanceFormatted,
                }
            },
            // Legacy for backward compatibility
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
        if (provider && provider instanceof WebSocketProvider) {
            provider.destroy();
        }
    }
}

/**
 * Fetch balances across multiple chains
 */
export async function fetchAllChainBalances(
    address: string,
    chainIds: string[]
): Promise<WalletBalanceData> {
    const allChains: { [chainId: string]: ChainBalance } = {};
    let totalPortfolio = 0;
    let totalCash = 0;

    // Fetch balances for each chain in parallel
    const balancePromises = chainIds.map(async (chainId) => {
        try {
            const balance = await fetchWalletBalance(address, chainId);
            return { chainId, balance };
        } catch (error) {
            console.error(`Error fetching balance for chain ${chainId}:`, error);
            return {
                chainId,
                balance: {
                    portfolio: 0,
                    cash: 0,
                    chains: {
                        [chainId]: {
                            usdc: 0,
                            usdt: 0,
                            eth: 0,
                            sol: 0,
                            native: 0,
                        }
                    }
                }
            };
        }
    });

    const results = await Promise.all(balancePromises);

    // Aggregate balances
    results.forEach(({ chainId, balance }) => {
        allChains[chainId] = balance.chains[chainId];
        totalCash += balance.cash;
    });

    // Calculate correct totals with native token prices
    const { fetchEthPrice, fetchMaticPrice } = await import('./index');
    let ethPrice = 3000;
    let maticPrice = 0.67;

    try {
        ethPrice = await fetchEthPrice();
        maticPrice = await fetchMaticPrice();
    } catch (error) {
        console.error('Error fetching token prices in fetchAllChainBalances:', error);
    }

    Object.entries(allChains).forEach(([chainId, chain]) => {
        if (chain.native) {
            const isPolygon = chainId === CHAIN_IDS.POLYGON_AMOY as string;
            totalPortfolio += (chain.native * (isPolygon ? maticPrice : ethPrice));
        }
    });
    totalPortfolio += totalCash;

    return {
        portfolio: totalPortfolio,
        cash: totalCash,
        chains: allChains,
        // Legacy for backward compatibility - aggregate from all chains
        tokens: {
            usdc: results.reduce((sum, r) => sum + (r.balance.chains[r.chainId]?.usdc || 0), 0),
            usdt: results.reduce((sum, r) => sum + (r.balance.chains[r.chainId]?.usdt || 0), 0),
            eth: results.reduce((sum, r) => sum + (r.balance.chains[r.chainId]?.native || 0), 0),
            sol: results.reduce((sum, r) => sum + (r.balance.chains[r.chainId]?.sol || 0), 0),
        }
    };
}

