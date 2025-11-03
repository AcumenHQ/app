"use client";

import { useState, useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useUserStore } from "@/stores/userStore";
import { CopyAddress } from "@/components/CopyAddress";
import type { DepositModalProps, DepositChain, DepositToken } from "@/types/types";
import { DEPOSIT_CHAINS, DEPOSIT_TOKENS } from "@/lib/depositConstants";
import { DEPOSIT_CHAIN_TO_NUMERIC } from "@/config";
import { QRCodeSVG } from "qrcode.react";

export const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
    const { authenticated, user } = usePrivy();
    const { profile, walletBalance, loadWalletBalance } = useUserStore();
    const [isClosing, setIsClosing] = useState(false);
    const [step, setStep] = useState<"initial" | "transfer">("initial");
    const [selectedChain, setSelectedChain] = useState<DepositChain | null>("base");
    const [selectedToken, setSelectedToken] = useState<DepositToken | null>("usdc");
    const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
    const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load balance when chain changes (not token, since we fetch both USDC and USDT together)
    useEffect(() => {
        if (authenticated && selectedChain && profile?.virtualAddress) {
            const numericChainId = DEPOSIT_CHAIN_TO_NUMERIC[selectedChain] || '84532';
            loadWalletBalance(profile.id, profile.virtualAddress, numericChainId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticated, selectedChain, profile?.virtualAddress, profile?.id]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsTokenDropdownOpen(false);
                setIsChainDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setStep("initial");
            setSelectedChain("base");
            setSelectedToken("usdc");
            setIsTokenDropdownOpen(false);
            setIsChainDropdownOpen(false);
            setCopied(false);
            onClose();
        }, 200);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleTransferCrypto = () => {
        setStep("transfer");
    };

    const getDepositAddress = () => {
        if (!selectedChain || !selectedToken || !profile?.depositAddresses) return null;
        const chain = DEPOSIT_CHAINS.find(c => c.id === selectedChain);
        if (!chain) return null;
        const chainId = chain.chainId;
        const address = profile.depositAddresses[chainId]?.[selectedToken];
        // If token-specific address not found, try to use the chain's default EVM/Solana address
        if (!address && selectedChain !== "solana-devnet") {
            // For EVM chains, use the default EVM address
            return profile.virtualAddress;
        } else if (!address && selectedChain === "solana-devnet") {
            // For Solana, use the separate Solana address field
            return profile.solanaAddress;
        }
        return address;
    };

    const depositAddress = getDepositAddress();

    // Get the current chain's balance for the selected token
    const getCurrentChainBalance = () => {
        if (!selectedChain || !selectedToken || !walletBalance?.chains) return 0;
        const numericChainId = DEPOSIT_CHAIN_TO_NUMERIC[selectedChain] || '84532';
        const chainBalance = walletBalance.chains[numericChainId];
        if (!chainBalance) return 0;
        return chainBalance[selectedToken] || 0;
    };

    const currentChainBalance = getCurrentChainBalance();

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
                        {step === "transfer" && (
                            <button
                                onClick={() => {
                                    setStep("initial");
                                    setSelectedChain("base");
                                    setSelectedToken("usdc");
                                    setIsTokenDropdownOpen(false);
                                    setIsChainDropdownOpen(false);
                                }}
                                className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <div className="flex-1 text-center">
                            <h2 className="text-xl font-bold text-card-foreground">
                                {step === "initial" ? "Deposit" : "Transfer Crypto"}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {step === "initial" ? (
                                    <>Available: ${walletBalance?.portfolio.toFixed(2) || "0.00"} Total</>
                                ) : (
                                    <>Available: ${currentChainBalance.toFixed(2)} {selectedToken ? selectedToken.toUpperCase() : ""}</>
                                )}
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
                                Please connect your wallet to deposit funds
                            </p>
                        </div>
                    ) : step === "initial" ? (
                        <div>
                            <button
                                onClick={handleTransferCrypto}
                                className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                            >
                                <div className="flex items-center space-x-3">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                    <div className="text-left">
                                        <div className="font-medium text-card-foreground">Transfer Crypto</div>
                                        <div className="text-sm text-muted-foreground">No limit • Instant</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
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
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-card-foreground">
                                            Supported chain
                                        </label>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-muted-foreground">Min $3</span>
                                            <svg className="w-3 h-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
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

                            {/* QR Code and Deposit Address */}
                            {selectedChain && selectedToken && depositAddress && (
                                <div className="space-y-4">
                                    {/* QR Code */}
                                    <div className="flex justify-center">
                                        <div className="relative p-4 bg-white rounded-lg inline-block">
                                            <QRCodeSVG
                                                value={depositAddress}
                                                size={200}
                                                level="H"
                                                includeMargin={false}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-white rounded-lg p-2">
                                                    {getChainIcon(selectedChain)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Deposit Address */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-card-foreground">
                                                Your deposit address
                                            </label>
                                            <button className="text-xs text-primary hover:underline cursor-pointer">
                                                Terms apply
                                            </button>
                                        </div>
                                        <div className="bg-muted border border-border rounded-lg p-3 mb-3">
                                            <code className="text-sm font-mono text-card-foreground break-all">
                                                {depositAddress}
                                            </code>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    if (navigator.clipboard && window.isSecureContext) {
                                                        await navigator.clipboard.writeText(depositAddress);
                                                    } else {
                                                        // Fallback for older browsers
                                                        const textArea = document.createElement("textarea");
                                                        textArea.value = depositAddress;
                                                        textArea.style.position = "fixed";
                                                        textArea.style.left = "-999999px";
                                                        document.body.appendChild(textArea);
                                                        textArea.focus();
                                                        textArea.select();
                                                        document.execCommand("copy");
                                                        textArea.remove();
                                                    }
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                } catch (error) {
                                                    console.error("Failed to copy:", error);
                                                }
                                            }}
                                            className="w-full flex items-center justify-center gap-2 bg-muted border border-border rounded-lg p-3 hover:bg-muted/80 transition-colors cursor-pointer"
                                        >
                                            {copied ? (
                                                <>
                                                    <svg
                                                        className="w-4 h-4 text-green-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    <span className="text-sm font-medium text-green-500">Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg
                                                        className="w-4 h-4 text-muted-foreground"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <span className="text-sm font-medium text-card-foreground">Copy address</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
