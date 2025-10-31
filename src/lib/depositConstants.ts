import type { DepositChainInfo, DepositTokenInfo } from "@/types/types";

export const DEPOSIT_CHAINS: DepositChainInfo[] = [
    { id: "ethereum", name: "Ethereum", chainId: "eip155:1" },
    { id: "base", name: "Base", chainId: "eip155:8453" },
    { id: "bnb", name: "BNB", chainId: "eip155:56" },
    { id: "solana", name: "Solana", chainId: "solana:101" },
];

export const DEPOSIT_TOKENS: DepositTokenInfo[] = [
    { id: "usdc", name: "USD Coin", symbol: "USDC" },
    { id: "usdt", name: "Tether", symbol: "USDT" },
];

