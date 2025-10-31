"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const WalletConnectModal = ({
  isOpen,
  onClose,
  title = "Connect Your Wallet",
  message = "Please connect your wallet to place bets and start trading on predictions.",
}: WalletConnectModalProps) => {
  const { authenticated, login } = usePrivy();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  // Auto-close when wallet connects
  useEffect(() => {
    if (authenticated && isOpen) {
      handleClose();
    }
  }, [authenticated, isOpen, handleClose]);

  if (!isOpen) return null;

  const handleConnect = () => {
    login();
    handleClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
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
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-xl font-bold text-card-foreground leading-tight">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Secure & Decentralized
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors shrink-0 ml-2"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
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

          {/* Message */}
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-card-foreground leading-relaxed">
              {message}
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xs sm:text-sm font-semibold text-card-foreground mb-2.5 sm:mb-3">
              Why connect your wallet?
            </h3>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-card-foreground">
                  Place bets on predictions
                </span>
              </div>
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-card-foreground">
                  Track your positions
                </span>
              </div>
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-card-foreground">
                  Earn rewards & profits
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <button
              onClick={handleConnect}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base w-full"
            >
              Connect Wallet
            </button>
            <button
              onClick={handleClose}
              className="bg-muted hover:bg-muted/80 text-muted-foreground font-medium py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
            >
              Maybe Later
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-4 sm:mt-6 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                  <strong>Secure:</strong> Your wallet connection is encrypted
                  and never stored on our servers. You maintain full control of
                  your funds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
