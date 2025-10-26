"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Prediction,
  PredictionOption,
  PredictionCardProps,
} from "@/types/types";
import { usePredictionStore } from "@/stores/predictionStore";
import { useWalletIntegration } from "@/hooks/useWalletIntegration";
import { CircularProgress } from "@/components/CircularProgress";
import { TradingModal } from "@/components/TradingModal";
import { WalletConnectModal } from "@/components/WalletConnectModal";

export const PredictionCard = ({ prediction }: PredictionCardProps) => {
  const router = useRouter();
  const { isConnected } = useWalletIntegration();
  const { placeBet, addToWatchlist, removeFromWatchlist, watchlist } =
    usePredictionStore();
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(
    null,
  );
  const [modalAction, setModalAction] = useState<"buy" | "sell">("buy");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const isWatched = watchlist.includes(prediction.id);
  const timeLeft = new Date(prediction.endDate).getTime() - Date.now();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or interactive elements
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.closest("button") ||
      target.closest("[data-interactive]")
    ) {
      return;
    }
    router.push(`/prediction/${prediction.id}`);
  };

  const handleBet = async (side: "yes" | "no", optionId?: string) => {
    if (!isConnected) {
      setIsWalletModalOpen(true);
      return;
    }

    // Open modal instead of directly placing bet
    setSelectedOutcome(side);
    setModalAction("buy");
    setIsModalOpen(true);
  };

  const handleSell = (side: "yes" | "no") => {
    setSelectedOutcome(side);
    setModalAction("sell");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOutcome(null);
  };

  const toggleWatchlist = () => {
    if (isWatched) {
      removeFromWatchlist(prediction.id);
    } else {
      addToWatchlist(prediction.id);
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}m`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(0)}k`;
    }
    return `$${volume}`;
  };

  const renderSimpleCard = () => (
    <div className="mt-3 sm:mt-4">
      <div className="flex space-x-2">
        <button
          onClick={() => handleBet("yes")}
          disabled={isPlacingBet}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded font-medium transition-colors"
        >
          {isPlacingBet ? "..." : "Yes"}
        </button>
        <button
          onClick={() => handleBet("no")}
          disabled={isPlacingBet}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded font-medium transition-colors"
        >
          {isPlacingBet ? "..." : "No"}
        </button>
      </div>
    </div>
  );

  const renderMultipleOptionsCard = () => (
    <div className="mb-3 sm:mb-4">
      <div className="max-h-10 sm:max-h-12 overflow-y-auto space-y-1 scrollbar-hide">
        {prediction.options?.map((option) => (
          <div key={option.id} className="space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-card-foreground truncate flex-1 mr-2">
                {option.label}
              </span>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm font-bold text-card-foreground">
                  {option.percentage}%
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleBet("yes", option.id)}
                    disabled={isPlacingBet}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white text-xs px-1.5 sm:px-2 py-1 rounded font-medium transition-colors"
                  >
                    {isPlacingBet ? "..." : "Yes"}
                  </button>
                  <button
                    onClick={() => handleBet("no", option.id)}
                    disabled={isPlacingBet}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white text-xs px-1.5 sm:px-2 py-1 rounded font-medium transition-colors"
                  >
                    {isPlacingBet ? "..." : "No"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCardContent = () => {
    switch (prediction.cardType) {
      case "simple":
        return renderSimpleCard();
      case "multiple-options":
      case "date-based":
      case "range-based":
        return renderMultipleOptionsCard();
      default:
        return renderSimpleCard();
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-card border border-border rounded-lg p-3 sm:p-4 hover:border-border/80 transition-all duration-200 min-h-[200px] sm:min-h-[220px] flex flex-col cursor-pointer"
      >
        {/* Header with icon, title and star */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
            {/* Category Icon */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              {prediction.category === "token" && (
                <span className="text-yellow-400 text-sm sm:text-lg">₿</span>
              )}
              {prediction.category === "politics" && (
                <span className="text-blue-400 text-sm sm:text-lg">🏛️</span>
              )}
              {prediction.category === "entertainment" && (
                <span className="text-pink-400 text-sm sm:text-lg">🎬</span>
              )}
              {prediction.category === "sports" && (
                <span className="text-green-400 text-sm sm:text-lg">⚽</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-medium text-card-foreground leading-tight line-clamp-2">
                {prediction.title}
              </h3>
            </div>
          </div>

          {/* Star button for watchlist */}
          <button
            onClick={toggleWatchlist}
            className={`p-1 rounded transition-colors shrink-0 ${
              isWatched
                ? "text-yellow-400"
                : "text-muted-foreground hover:text-yellow-400"
            }`}
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>

        {/* Dynamic Card Content */}
        <div className="grow">{renderCardContent()}</div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {formatVolume(prediction.totalVolume)} Vol.
            </span>
            {prediction.category === "politics" && (
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button className="text-muted-foreground hover:text-card-foreground transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </button>
            <button className="text-muted-foreground hover:text-card-foreground transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Trading Modal */}
      <TradingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        prediction={prediction}
        selectedOutcome={selectedOutcome}
        action={modalAction}
      />

      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        title="Connect Your Wallet"
        message="Please connect your wallet to place bets and start trading on predictions."
      />
    </>
  );
};
