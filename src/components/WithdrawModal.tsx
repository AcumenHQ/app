"use client";

import { useState, useEffect, useRef } from "react";
import { usePrivy, useWallets, useSendTransaction } from "@privy-io/react-auth";
import { useUserStore } from "@/stores/userStore";
import type { WithdrawModalProps, DepositChain, DepositToken } from "@/types/types";
import { DEPOSIT_CHAINS, DEPOSIT_TOKENS } from "@/lib/depositConstants";
import { TransactionSuccessModal } from "@/components/TransactionSuccessModal";
import { TOKEN_ADDRESSES, ERC20_TRANSFER_ABI, ERC20_BALANCE_ABI, getWebSocketRpcUrl } from "@/lib/chainConstants";
import { ethers, WebSocketProvider } from 'ethers';

export const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
    const { authenticated, user } = usePrivy();
    const { wallets } = useWallets();
    const { sendTransaction } = useSendTransaction();
    const { walletBalance, profile, loadWalletBalance } = useUserStore();
    const [isClosing, setIsClosing] = useState(false);
    const [amount, setAmount] = useState("");
    const [selectedChain, setSelectedChain] = useState<DepositChain | null>("base");
    const [selectedToken, setSelectedToken] = useState<DepositToken | null>("usdc");
    const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);
    const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
    const [withdrawAddress, setWithdrawAddress] = useState("");
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [chainId, setChainId] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load balance when chain or token changes
    useEffect(() => {
        if (authenticated && selectedChain && profile?.virtualAddress) {
            const chainIdMap: Record<string, string> = {
                'ethereum': '11155111',
                'base': '84532',
                'polygon-amoy': '80002',
                'bnb': '97',
                'solana-devnet': '101',
            };
            const numericChainId = chainIdMap[selectedChain] || '84532';
            loadWalletBalance(profile.id, profile.virtualAddress, numericChainId);
        }
    }, [authenticated, selectedChain, selectedToken, profile?.virtualAddress, profile?.id, loadWalletBalance]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsChainDropdownOpen(false);
                setIsTokenDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!isOpen) return null;

    const handleClose = () => {
        if (showSuccessModal) {
            setShowSuccessModal(false);
            return;
        }
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setAmount("");
            setWithdrawAddress("");
            setSelectedChain("base");
            setSelectedToken("usdc");
            setIsChainDropdownOpen(false);
            setIsTokenDropdownOpen(false);
            onClose();
        }, 200);
    };

    const handleUseConnectedWallet = () => {
        const connectedAddress = user?.wallet?.address;
        if (connectedAddress) {
            setWithdrawAddress(connectedAddress);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            return;
        }
        // Validate address based on chain
        const isEvmChain = selectedChain && selectedChain !== "solana-devnet";
        const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/;
        const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
        const isValidAddress = isEvmChain
            ? withdrawAddress.match(evmAddressRegex)
            : withdrawAddress.match(solanaAddressRegex);

        if (!withdrawAddress || !isValidAddress || !selectedChain || !selectedToken) {
            return;
        }

        setIsWithdrawing(true);
        try {
            // Map selected chain to chain ID
            const chainIdMap: Record<string, string> = {
                'ethereum': '11155111',
                'base': '84532',
                'polygon-amoy': '80002',
                'bnb': '97',
            };
            const numericChainId = chainIdMap[selectedChain] || '84532';

            // Find embedded wallet
            const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
            if (!embeddedWallet) {
                throw new Error('No embedded wallet found');
            }

            // Switch to correct chain if needed
            const chainIdNumber = parseInt(numericChainId, 10);
            try {
                await embeddedWallet.switchChain(chainIdNumber);
            } catch (switchError) {
                console.warn('Chain switch error (may already be on correct chain):', switchError);
            }

            // Get token contract address and normalize to proper checksum format
            const rawTokenAddress = TOKEN_ADDRESSES[numericChainId as keyof typeof TOKEN_ADDRESSES]?.[selectedToken.toUpperCase() as 'USDC' | 'USDT'];
            if (!rawTokenAddress) {
                throw new Error(`Token ${selectedToken} not supported on chain ${numericChainId}`);
            }
            const tokenAddress = ethers.getAddress(rawTokenAddress);

            // Get token decimals from contract
            const rpcUrl = getWebSocketRpcUrl(numericChainId);
            const provider = new WebSocketProvider(rpcUrl);
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_BALANCE_ABI, provider);
            const decimalsResult = await tokenContract.decimals();
            // Convert BigInt to number if needed
            const decimals = typeof decimalsResult === 'bigint' ? Number(decimalsResult) : decimalsResult;
            provider.destroy(); // Clean up WebSocket connection

            // Create contract interface for encoding
            const iface = new ethers.Interface(ERC20_TRANSFER_ABI);

            // Encode amount with correct decimals using ethers.parseUnits which handles decimals properly
            const amountInWei = ethers.parseUnits(amount, decimals);

            // Encode the transfer function call
            const data = iface.encodeFunctionData('transfer', [withdrawAddress, amountInWei]);

            // Send transaction using Privy - value is 0 for token transfers (only contract call)
            const response = await sendTransaction({
                to: tokenAddress,
                data: data,
                value: '0x0', // Token transfers don't send ETH, just call contract
            }, {
                address: embeddedWallet.address,
            });

            setTxHash(response.hash);
            setChainId(numericChainId);
            setShowSuccessModal(true);
            setIsWithdrawing(false);

            // Reload balance after a short delay
            if (profile?.virtualAddress) {
                setTimeout(() => {
                    loadWalletBalance(profile.id, profile.virtualAddress, numericChainId);
                }, 3000);
            }
        } catch (error) {
            console.error("Withdrawal failed:", error);
            alert(error instanceof Error ? error.message : "Withdrawal failed. Please try again.");
            setIsWithdrawing(false);
        }
    };

    const getChainIcon = (chainId: DepositChain) => {
        switch (chainId) {
            case "bnb":
                return (
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                            <path d="M16 0l2.5 8.668L16 11.583l-2.5-2.915L16 0zM23.762 3.986l-2.223 7.691-2.08-2.08-2.5 8.668-2.5-8.668-2.08 2.08-2.223-7.691h11.606z" />
                        </svg>
                    </div>
                );
            case "ethereum":
                return (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                            <path d="M12 0L5.91 12.147l6.09.353V24l-6.09-12.147L12 0z" />
                            <path d="M12 0l6.09 12.147L12 12.5v11.5l6.09-12.147L12 0z" />
                        </svg>
                    </div>
                );
            case "base":
                return (
                    <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">B</span>
                    </div>
                );
            case "polygon-amoy":
                return (
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                        <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                            <path d="M16 0l2.5 8.668L16 11.583l-2.5-2.915L16 0zM23.762 3.986l-2.223 7.691-2.08-2.08-2.5 8.668-2.5-8.668-2.08 2.08-2.223-7.691h11.606z" />
                        </svg>
                    </div>
                );
            case "solana-devnet":
                return (
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">S</span>
                    </div>
                );
        }
    };

    const getTokenIcon = (tokenId: DepositToken) => {
        switch (tokenId) {
            case "usdc":
                return (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">$</span>
                    </div>
                );
            case "usdt":
                return (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">₮</span>
                    </div>
                );
        }
    };

    const availableBalance = walletBalance?.tokens[selectedToken || "usdc"] || 0;
    const maxAmount = availableBalance.toString();

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-card border border-border rounded-xl sm:rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-200 max-h-[95vh] overflow-y-auto ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex-1 text-center">
                            <h2 className="text-xl font-bold text-card-foreground">Withdraw</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Available: {availableBalance.toFixed(2)} {selectedToken?.toUpperCase()}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <svg
                                className="w-5 h-5 text-muted-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    {!authenticated ? (
                        <div className="space-y-4">
                            <p className="text-sm text-card-foreground text-center py-4">
                                Please connect your wallet to withdraw funds
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Amount Input */}
                            <div>
                                <label className="text-sm font-medium text-card-foreground mb-2 block">
                                    Amount
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        max={maxAmount}
                                        step="0.01"
                                        min="0"
                                        className="w-full p-3 bg-muted border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-20"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <button
                                            onClick={() => setAmount(maxAmount)}
                                            className="text-xs text-primary hover:underline cursor-pointer"
                                        >
                                            Max
                                        </button>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {selectedToken?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-muted-foreground">
                                        Available: {availableBalance.toFixed(2)} {selectedToken?.toUpperCase()}
                                    </span>
                                    {parseFloat(amount) > availableBalance && (
                                        <span className="text-xs text-destructive">
                                            Insufficient balance
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Token and Chain Selection */}
                            <div className="grid grid-cols-2 gap-4" ref={dropdownRef}>
                                {/* Supported Token */}
                                <div className="relative">
                                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                                        Supported token
                                    </label>
                                    <button
                                        onClick={() => {
                                            setIsTokenDropdownOpen(!isTokenDropdownOpen);
                                            setIsChainDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between p-3 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-2">
                                            {selectedToken && getTokenIcon(selectedToken)}
                                            <span className="font-medium text-card-foreground">
                                                {DEPOSIT_TOKENS.find(t => t.id === selectedToken)?.symbol}
                                            </span>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 text-muted-foreground transition-transform ${isTokenDropdownOpen ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isTokenDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">
                                            {DEPOSIT_TOKENS.map((token) => (
                                                <button
                                                    key={token.id}
                                                    onClick={() => {
                                                        setSelectedToken(token.id);
                                                        setAmount("");
                                                        setIsTokenDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center space-x-2 p-3 hover:bg-muted transition-colors cursor-pointer"
                                                >
                                                    {getTokenIcon(token.id)}
                                                    <span className="font-medium text-card-foreground">{token.symbol}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Supported Chain */}
                                <div className="relative">
                                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                                        Supported chain
                                    </label>
                                    <button
                                        onClick={() => {
                                            setIsChainDropdownOpen(!isChainDropdownOpen);
                                            setIsTokenDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between p-3 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-2">
                                            {selectedChain && getChainIcon(selectedChain)}
                                            <span className="font-medium text-card-foreground">
                                                {DEPOSIT_CHAINS.find(c => c.id === selectedChain)?.name}
                                            </span>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 text-muted-foreground transition-transform ${isChainDropdownOpen ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isChainDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">
                                            {DEPOSIT_CHAINS.map((chain) => (
                                                <button
                                                    key={chain.id}
                                                    onClick={() => {
                                                        setSelectedChain(chain.id);
                                                        setIsChainDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center space-x-2 p-3 hover:bg-muted transition-colors cursor-pointer"
                                                >
                                                    {getChainIcon(chain.id)}
                                                    <span className="font-medium text-card-foreground">{chain.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Withdrawal Address */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-card-foreground">
                                        Withdrawal Address
                                    </label>
                                    {user?.wallet?.address && (
                                        <button
                                            onClick={handleUseConnectedWallet}
                                            className="text-xs text-primary hover:underline cursor-pointer"
                                        >
                                            Use connected wallet
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={withdrawAddress}
                                    onChange={(e) => setWithdrawAddress(e.target.value)}
                                    placeholder={selectedChain === "solana-devnet" ? "Enter Solana address..." : "0x..."}
                                    className="w-full p-3 bg-muted border border-border rounded-lg text-card-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Enter the wallet address where you want to receive funds
                                </p>
                            </div>

                            {/* Withdraw Button */}
                            <button
                                onClick={handleWithdraw}
                                disabled={isWithdrawing || !amount || !withdrawAddress || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
                                className="w-full bg-primary text-primary-foreground font-medium py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isWithdrawing ? "Processing..." : "Withdraw"}
                            </button>

                            {/* Info */}
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">
                                    Withdrawals may take a few minutes to process. Please ensure the address is correct.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Modal */}
            <TransactionSuccessModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    handleClose();
                }}
                txHash={txHash}
                chainId={chainId}
                amount={amount}
                token={selectedToken || "usdc"}
            />
        </div>
    );
};

