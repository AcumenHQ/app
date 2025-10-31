import type { DepositChainInfo, DepositTokenInfo } from "@/types/types";

export const DEPOSIT_CHAINS: DepositChainInfo[] = [
    { id: "ethereum", name: "Ethereum", chainId: "eip155:1" },
    { id: "base", name: "Base Sepolia", chainId: "eip155:84532" },
    { id: "polygon-amoy", name: "Polygon Amoy", chainId: "eip155:80002" },
    { id: "bnb", name: "Bnb Chain Testnet", chainId: "eip155:97" },
    { id: "solana-devnet", name: "Solana Devnet", chainId: "solana:101" },
];

export const DEPOSIT_TOKENS: DepositTokenInfo[] = [
    { id: "usdc", name: "USD Coin", symbol: "USDC" },
    { id: "usdt", name: "Tether", symbol: "USDT" },
];

