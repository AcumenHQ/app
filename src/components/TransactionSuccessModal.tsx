"use client";

import { useState, useEffect } from "react";
import { getExplorerUrl, getChainName as getChainNameFromConstants } from "@/config";

interface TransactionSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    txHash: string;
    chainId: string;
    amount: string;
    token: string;
}

export const TransactionSuccessModal = ({
    isOpen,
    onClose,
    txHash,
    chainId,
    amount,
    token
}: TransactionSuccessModalProps) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Use shared constants for explorer URL and chain name
    const explorerUrl = getExplorerUrl(chainId, txHash);
    const chainName = getChainNameFromConstants(chainId);

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-card border border-border rounded-xl sm:rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-200 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">
                        Withdrawal Successful!
                    </h2>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                        Your withdrawal has been processed
                    </p>

                    {/* Transaction Details */}
                    <div className="bg-muted/50 rounded-lg p-4 mb-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Amount:</span>
                                <span className="text-sm font-medium text-card-foreground">
                                    {amount} {token.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Network:</span>
                                <span className="text-sm font-medium text-card-foreground">
                                    {chainName}
                                </span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-muted-foreground">Transaction:</span>
                                <span className="text-sm font-mono text-card-foreground break-all ml-2">
                                    {txHash.slice(0, 6)}...{txHash.slice(-4)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* View on Explorer Button */}
                    <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-primary text-primary-foreground font-medium py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2 mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View on Explorer
                    </a>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="w-full border border-border text-card-foreground font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

