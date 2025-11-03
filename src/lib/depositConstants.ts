import type { DepositChainInfo, DepositTokenInfo } from "@/types/types";
import { CHAIN_NAMES, EIP155_CHAIN_IDS, CHAIN_IDS } from "@/config";

export const DEPOSIT_CHAINS: DepositChainInfo[] = [
    { id: "ethereum", name: CHAIN_NAMES[CHAIN_IDS.ETHEREUM_SEPOLIA], chainId: EIP155_CHAIN_IDS.ETHEREUM_SEPOLIA },
    { id: "base", name: CHAIN_NAMES[CHAIN_IDS.BASE_SEPOLIA], chainId: EIP155_CHAIN_IDS.BASE_SEPOLIA },
    { id: "polygon-amoy", name: CHAIN_NAMES[CHAIN_IDS.POLYGON_AMOY], chainId: EIP155_CHAIN_IDS.POLYGON_AMOY },
    { id: "bnb", name: CHAIN_NAMES[CHAIN_IDS.BNB_TESTNET], chainId: EIP155_CHAIN_IDS.BNB_TESTNET },
    { id: "solana-devnet", name: CHAIN_NAMES[CHAIN_IDS.SOLANA_DEVNET], chainId: EIP155_CHAIN_IDS.SOLANA_DEVNET },
];

export const DEPOSIT_TOKENS: DepositTokenInfo[] = [
    { id: "usdc", name: "USD Coin", symbol: "USDC" },
    { id: "usdt", name: "Tether", symbol: "USDT" },
];

