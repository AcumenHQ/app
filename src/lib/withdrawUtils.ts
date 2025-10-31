import { ethers } from 'ethers';
import { TOKEN_ADDRESSES, ERC20_TRANSFER_ABI, getExplorerUrl as getExplorerUrlFromConstants } from './chainConstants';

// Re-export for backward compatibility
export { getExplorerUrlFromConstants as getExplorerUrl };

/**
 * Send ERC20 token transfer transaction
 */
export async function sendTokenTransfer(
    signer: ethers.Signer,
    tokenSymbol: 'USDC' | 'USDT',
    to: string,
    amount: string,
    chainId: string
): Promise<string> {
    const tokenAddress = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]?.[tokenSymbol];

    if (!tokenAddress) {
        throw new Error(`Token ${tokenSymbol} not supported on chain ${chainId}`);
    }

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_TRANSFER_ABI, signer);

    // Get token decimals
    const decimals = await tokenContract.decimals();

    // Convert amount to token units
    const amountInWei = ethers.parseUnits(amount, decimals);

    // Send transfer transaction
    const tx = await tokenContract.transfer(to, amountInWei);

    // Wait for transaction confirmation
    await tx.wait();

    return tx.hash;
}

