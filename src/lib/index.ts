/**
 * Price fetching utilities for cryptocurrencies
 */

/**
 * Fetch the current Ethereum (ETH) price in USD from CoinGecko API
 * @returns Promise<number> The current ETH price in USD
 */
export async function fetchEthPrice(): Promise<number> {
    try {
        // Use CoinGecko free API - no API key required
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch ETH price: ${response.statusText}`);
        }

        const data = await response.json();
        const ethPrice = data?.ethereum?.usd;

        if (!ethPrice || typeof ethPrice !== 'number') {
            throw new Error('Invalid ETH price data received');
        }

        return ethPrice;
    } catch (error) {
        console.error('Error fetching ETH price:', error);
        // Fallback to a reasonable default price if API fails
        return 3000;
    }
}

/**
 * Fetch multiple token prices from CoinGecko API
 * @param tokenIds Array of CoinGecko token IDs (e.g., ['ethereum', 'usd-coin', 'tether'])
 * @returns Promise<Record<string, number>> Object mapping token IDs to USD prices
 */
export async function fetchTokenPrices(tokenIds: string[]): Promise<Record<string, number>> {
    try {
        const ids = tokenIds.join(',');
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch token prices: ${response.statusText}`);
        }

        const data = await response.json();
        const prices: Record<string, number> = {};

        for (const tokenId of tokenIds) {
            const price = data?.[tokenId]?.usd;
            if (price && typeof price === 'number') {
                prices[tokenId] = price;
            }
        }

        return prices;
    } catch (error) {
        console.error('Error fetching token prices:', error);
        return {};
    }
}

/**
 * Fetch MATIC (Polygon) price from CoinGecko API
 * @returns Promise<number> MATIC price in USD
 */
export async function fetchMaticPrice(): Promise<number> {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            console.warn(`CoinGecko API error: ${response.status} ${response.statusText}`);
            return 0.67; // Return fallback instead of throwing
        }

        const data = await response.json();

        // Check if CoinGecko returned an error status object
        if (data?.status) {
            console.warn('CoinGecko API rate limit or error:', data.status);
            return 0.67; // Return fallback instead of throwing
        }

        const maticPrice = data?.['matic-network']?.usd;

        if (!maticPrice || typeof maticPrice !== 'number') {
            console.warn('Invalid MATIC price data, using fallback');
            return 0.67; // Return fallback instead of throwing
        }

        return maticPrice;
    } catch (error) {
        console.error('Error fetching MATIC price:', error);
        // Fallback to a reasonable default price if API fails
        return 0.67;
    }
}

