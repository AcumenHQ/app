"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePredictionStore } from "@/stores/predictionStore";
import Image from "next/image";
import Link from "next/link";
import type { Prediction } from "@/types/types";

export default function PredictionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { predictions, selectedPrediction, setSelectedPrediction } =
    usePredictionStore();
  const [activeTab, setActiveTab] = useState<
    "1H" | "6H" | "1D" | "1W" | "1M" | "ALL"
  >("ALL");
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(
    null,
  );
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [tradeAmount, setTradeAmount] = useState<string>("0.00");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Related predictions
  const relatedPredictions = [
    {
      id: "related-1",
      title: "Will the Government shutdown end by January 31?",
      percentage: 96,
      image: "/Artboard 1.PNG",
    },
    {
      id: "related-2",
      title: "Will the federal government be shut down for 30 or more days?",
      percentage: 95,
      image: "/Artboard 2.PNG",
    },
    {
      id: "related-3",
      title: "Will there be another US government shutdown by...",
      percentage: 12,
      image: "/Artboard 3.PNG",
    },
  ];

  useEffect(() => {
    if (id && predictions.length > 0) {
      const prediction = predictions.find((p) => p.id === id);
      if (prediction) {
        setSelectedPrediction(prediction);
      } else {
        // Create a mock prediction based on cardType
        const createMockPrediction = (cardType: string): Prediction => {
          const baseData = {
            id: id as string,
            description:
              "This market will resolve based on the specified outcome criteria.",
            category: "politics",
            endDate: new Date("2025-11-15"),
            outcome: "pending" as const,
            totalVolume: 2408048,
            liquidity: 500000,
            creator: "Acumen Market",
            createdAt: new Date("2024-10-01"),
            tags: ["government", "politics"],
            imageUrl: "/Artboard 1.PNG",
            isResolved: false,
            marketCap: 2408048,
            volume24h: 45000,
            priceChange24h: 2.5,
            participants: 1247,
            isFeatured: true,
            isVerified: true,
            difficulty: "medium" as const,
          };

          switch (cardType) {
            case "simple":
              return {
                ...baseData,
                title: "Will Bitcoin reach $100k by end of 2024?",
                cardType: "simple" as const,
                yesPrice: 65,
                noPrice: 35,
                overallChance: 65,
                category: "token",
              };

            case "multiple-options":
              return {
                ...baseData,
                title: "When will the Government shutdown end?",
                cardType: "multiple-options" as const,
                options: [
                  {
                    id: "1",
                    label: "October 23-26",
                    percentage: 1,
                    yesPrice: 0.2,
                    noPrice: 99.9,
                    volume: 560677,
                  },
                  {
                    id: "2",
                    label: "October 27-30",
                    percentage: 4,
                    yesPrice: 4.8,
                    noPrice: 95.9,
                    volume: 195296,
                  },
                  {
                    id: "3",
                    label: "October 31-November 3",
                    percentage: 10,
                    yesPrice: 10,
                    noPrice: 91,
                    volume: 150976,
                  },
                  {
                    id: "4",
                    label: "November 4-7",
                    percentage: 16,
                    yesPrice: 16.9,
                    noPrice: 84.5,
                    volume: 86279,
                  },
                  {
                    id: "5",
                    label: "November 8-11",
                    percentage: 9,
                    yesPrice: 10,
                    noPrice: 93,
                    volume: 65165,
                  },
                  {
                    id: "6",
                    label: "November 12-15",
                    percentage: 15,
                    yesPrice: 15,
                    noPrice: 86,
                    volume: 68135,
                  },
                  {
                    id: "7",
                    label: "November 16+",
                    percentage: 46,
                    yesPrice: 46.1,
                    noPrice: 54.0,
                    volume: 326676,
                  },
                ],
              };

            case "date-based":
              return {
                ...baseData,
                title: "Which month will Tesla stock hit $300?",
                cardType: "date-based" as const,
                category: "token",
                options: [
                  {
                    id: "1",
                    label: "November 2024",
                    percentage: 25,
                    yesPrice: 25,
                    noPrice: 75,
                    volume: 450000,
                  },
                  {
                    id: "2",
                    label: "December 2024",
                    percentage: 35,
                    yesPrice: 35,
                    noPrice: 65,
                    volume: 380000,
                  },
                  {
                    id: "3",
                    label: "January 2025",
                    percentage: 20,
                    yesPrice: 20,
                    noPrice: 80,
                    volume: 290000,
                  },
                  {
                    id: "4",
                    label: "February 2025 or later",
                    percentage: 20,
                    yesPrice: 20,
                    noPrice: 80,
                    volume: 180000,
                  },
                ],
              };

            case "range-based":
              return {
                ...baseData,
                title: "What will be the Super Bowl attendance?",
                cardType: "range-based" as const,
                category: "sports",
                options: [
                  {
                    id: "1",
                    label: "Under 65,000",
                    percentage: 15,
                    yesPrice: 15,
                    noPrice: 85,
                    volume: 120000,
                  },
                  {
                    id: "2",
                    label: "65,000 - 70,000",
                    percentage: 45,
                    yesPrice: 45,
                    noPrice: 55,
                    volume: 340000,
                  },
                  {
                    id: "3",
                    label: "70,000 - 75,000",
                    percentage: 30,
                    yesPrice: 30,
                    noPrice: 70,
                    volume: 280000,
                  },
                  {
                    id: "4",
                    label: "Over 75,000",
                    percentage: 10,
                    yesPrice: 10,
                    noPrice: 90,
                    volume: 90000,
                  },
                ],
              };

            default:
              return createMockPrediction("simple");
          }
        };

        // Determine cardType from URL or default to multiple-options for demo
        const cardType = "multiple-options"; // This would come from API in production
        const mockPrediction = createMockPrediction(cardType);
        setSelectedPrediction(mockPrediction);
      }
    }
  }, [id, predictions, setSelectedPrediction]);

  const handleTrade = (
    outcome: "yes" | "no",
    action: "buy" | "sell",
    optionId?: string,
  ) => {
    setSelectedOutcome(outcome);
    setTradeAction(action);
    if (optionId) {
      setSelectedOptionId(optionId);
    }
    // Don't open modal - trading happens in the panel
  };

  // Helper function to format price with proper decimals
  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return 0;
    return parseFloat(price.toFixed(3));
  };

  // Get current selected option for trading panel
  const getCurrentOption = () => {
    if (selectedPrediction?.cardType === "simple") {
      return {
        yesPrice: selectedPrediction.yesPrice || 0.2,
        noPrice: selectedPrediction.noPrice || 99.8,
      };
    }

    if (selectedOptionId && selectedPrediction?.options) {
      const option = selectedPrediction.options.find(
        (opt) => opt.id === selectedOptionId,
      );
      if (option) {
        return {
          yesPrice: option.yesPrice || 0.2,
          noPrice: option.noPrice || 99.8,
        };
      }
    }

    // Default to first option if none selected
    const firstOption = selectedPrediction?.options?.[0];
    return {
      yesPrice: firstOption?.yesPrice || 0.2,
      noPrice: firstOption?.noPrice || 99.8,
    };
  };

  // Get the label of the currently selected option
  const getSelectedOptionLabel = () => {
    if (selectedPrediction?.cardType === "simple") {
      return "Yes or No";
    }

    if (selectedOptionId && selectedPrediction?.options) {
      const option = selectedPrediction.options.find(
        (opt) => opt.id === selectedOptionId,
      );
      if (option) {
        return option.label;
      }
    }

    // Default to first option if none selected
    return selectedPrediction?.options?.[0]?.label || "First Option";
  };

  // Effect to set initial selected option for multiple options
  useEffect(() => {
    if (
      selectedPrediction?.cardType !== "simple" &&
      selectedPrediction?.options &&
      !selectedOptionId
    ) {
      setSelectedOptionId(selectedPrediction.options[0]?.id || null);
    }
  }, [selectedPrediction, selectedOptionId]);

  const renderSimpleOutcome = () => {
    if (!selectedPrediction?.yesPrice || !selectedPrediction?.noPrice)
      return null;

    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">OUTCOME</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>% CHANGE</span>
            <button>🔄</button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
          <div className="flex-1">
            <div className="font-medium mb-1">Yes or No</div>
            <div className="text-sm text-muted-foreground">
              ${selectedPrediction.totalVolume.toLocaleString()} Vol
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {selectedPrediction.overallChance ||
                  selectedPrediction.yesPrice}
                %
              </div>
              <div className="text-sm flex items-center text-green-500">
                ▲{selectedPrediction.priceChange24h}%
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedOutcome("yes")}
                className={`px-4 py-2 text-white rounded text-sm font-medium transition-colors ${
                  selectedOutcome === "yes"
                    ? "bg-green-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                Yes {formatPrice(selectedPrediction.yesPrice)}¢
              </button>
              <button
                onClick={() => setSelectedOutcome("no")}
                className={`px-4 py-2 text-white rounded text-sm font-medium transition-colors ${
                  selectedOutcome === "no"
                    ? "bg-red-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                No {formatPrice(selectedPrediction.noPrice)}¢
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMultipleOptionsOutcome = () => {
    if (!selectedPrediction?.options) return null;

    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">OUTCOME</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>% CHANGE</span>
            <button>🔄</button>
          </div>
        </div>

        <div className="space-y-3">
          {selectedPrediction.options.map((option, index) => (
            <div
              key={option.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium mb-1">{option.label}</div>
                <div className="text-sm text-muted-foreground">
                  ${option.volume.toLocaleString()} Vol
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{option.percentage}%</div>
                  <div className="text-sm flex items-center text-green-500">
                    ▲1%
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedOutcome("yes");
                      setSelectedOptionId(option.id);
                    }}
                    className={`px-4 py-2 text-white rounded text-sm font-medium transition-colors ${
                      selectedOutcome === "yes" &&
                      selectedOptionId === option.id
                        ? "bg-green-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    Yes {formatPrice(option.yesPrice)}¢
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOutcome("no");
                      setSelectedOptionId(option.id);
                    }}
                    className={`px-4 py-2 text-white rounded text-sm font-medium transition-colors ${
                      selectedOutcome === "no" && selectedOptionId === option.id
                        ? "bg-red-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    No {formatPrice(option.noPrice)}¢
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
          View resolved ▼
        </button>
      </div>
    );
  };

  const renderTradingPanel = () => {
    const firstOption = selectedPrediction?.options?.[0];
    const isSimple = selectedPrediction?.cardType === "simple";
    const currentOption = getCurrentOption();

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Header with Image and Title */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded overflow-hidden">
              <Image
                src={selectedPrediction?.imageUrl || "/Artboard 1.PNG"}
                alt={isSimple ? "Prediction" : getSelectedOptionLabel()}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-sm">
                {isSimple ? "Yes or No" : getSelectedOptionLabel()}
              </div>
            </div>
          </div>
        </div>

        {/* Buy/Sell Toggle */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setTradeAction("buy")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
              tradeAction === "buy"
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Buy
            {tradeAction === "buy" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>
            )}
          </button>
          <button
            onClick={() => setTradeAction("sell")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
              tradeAction === "sell"
                ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Sell
            {tradeAction === "sell" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
            )}
          </button>
        </div>

        {/* Trading Content */}
        <div className="p-4 space-y-4">
          {/* Outcome Selection */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Outcome
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedOutcome("yes")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                  selectedOutcome === "yes"
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800"
                }`}
              >
                <div className="font-medium">Yes</div>
                <div className="text-xs opacity-80">
                  {formatPrice(currentOption.yesPrice)}¢
                </div>
              </button>
              <button
                onClick={() => setSelectedOutcome("no")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                  selectedOutcome === "no"
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800"
                }`}
              >
                <div className="font-medium">No</div>
                <div className="text-xs opacity-80">
                  {formatPrice(currentOption.noPrice)}¢
                </div>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">
              Amount
            </div>
            <div className="relative">
              <input
                type="number"
                value={tradeAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  // Format to 2 decimal places
                  if (value && !isNaN(parseFloat(value))) {
                    const formatted = parseFloat(value).toFixed(2);
                    setTradeAmount(formatted);
                  } else {
                    setTradeAmount(value);
                  }
                }}
                className="w-full text-2xl font-bold text-center bg-transparent border border-border rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-muted-foreground pointer-events-none">
                $
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newAmount = (
                    parseFloat(tradeAmount || "0") + 1
                  ).toFixed(2);
                  setTradeAmount(newAmount);
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
              >
                +$1
              </button>
              <button
                onClick={() => {
                  const newAmount = (
                    parseFloat(tradeAmount || "0") + 20
                  ).toFixed(2);
                  setTradeAmount(newAmount);
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
              >
                +$20
              </button>
              <button
                onClick={() => {
                  const newAmount = (
                    parseFloat(tradeAmount || "0") + 100
                  ).toFixed(2);
                  setTradeAmount(newAmount);
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
              >
                +$100
              </button>
              <button
                onClick={() => setTradeAmount("1000.00")}
                className="flex-1 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
              >
                Max
              </button>
            </div>
          </div>

          {/* Trade Button */}
          <button
            onClick={() => {
            }}
            disabled={!selectedOutcome || parseFloat(tradeAmount || "0") <= 0}
            className={`w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              tradeAction === "buy"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {tradeAction === "buy" ? "Buy" : "Sell"}{" "}
            {selectedOutcome === "yes" ? "Yes" : "No"}
          </button>

          {/* Terms */}
          <div className="text-xs text-muted-foreground text-center">
            By trading, you agree to the{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (!selectedPrediction) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Markets
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image
                src={selectedPrediction.imageUrl || "/Artboard 1.PNG"}
                alt={selectedPrediction.title}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {selectedPrediction.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
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
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  ${selectedPrediction.totalVolume.toLocaleString()} Vol
                </span>
                <span>📅 Daily</span>
                <span>🔗</span>
                <span>🔖</span>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  PREDICTED
                </span>
                <span className="ml-2 text-primary font-medium">
                  {selectedPrediction.endDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  •
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Chart and Outcomes */}
            <div className="lg:col-span-2 space-y-6">
              {/* Chart Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                {/* Chart Placeholder */}
                <div className="h-64 bg-muted rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 200"
                  >
                    <defs>
                      <linearGradient
                        id="greenGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
                        <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
                      </linearGradient>
                    </defs>
                    {/* Green line (Yes) */}
                    <path
                      d="M 0 180 Q 50 170 100 150 T 200 120 T 300 100 T 400 80"
                      stroke="#22c55e"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M 0 180 Q 50 170 100 150 T 200 120 T 300 100 T 400 80 L 400 200 L 0 200 Z"
                      fill="url(#greenGradient)"
                    />
                    {/* Blue line (No) */}
                    <path
                      d="M 0 20 Q 50 30 100 50 T 200 80 T 300 100 T 400 120"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute top-4 right-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>
                          Yes{" "}
                          {selectedPrediction.cardType === "simple"
                            ? selectedPrediction.overallChance || 65
                            : 35}
                          %
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>
                          No{" "}
                          {selectedPrediction.cardType === "simple"
                            ? 100 - (selectedPrediction.overallChance || 65)
                            : 65}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(["1H", "6H", "1D", "1W", "1M", "ALL"] as const).map(
                      (period) => (
                        <button
                          key={period}
                          onClick={() => setActiveTab(period)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            activeTab === period
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {period}
                        </button>
                      ),
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded hover:bg-muted">📊</button>
                    <button className="p-2 rounded hover:bg-muted">📱</button>
                    <button className="p-2 rounded hover:bg-muted">⚙️</button>
                    <button className="p-2 rounded hover:bg-muted">🔧</button>
                  </div>
                </div>
              </div>

              {/* Dynamic Outcomes Section based on cardType */}
              {selectedPrediction.cardType === "simple"
                ? renderSimpleOutcome()
                : renderMultipleOptionsOutcome()}
            </div>

            {/* Right Column - Trading Panel and Related - Fixed Position */}
            <div className="sticky top-6 self-start space-y-6">
              {/* Trading Panel */}
              {renderTradingPanel()}

              {/* Related Predictions */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center gap-4 mb-4">
                  <button className="px-3 py-1 rounded bg-primary text-primary-foreground text-sm">
                    All
                  </button>
                  <button className="px-3 py-1 rounded text-muted-foreground hover:text-foreground text-sm">
                    Politics
                  </button>
                  <button className="px-3 py-1 rounded text-muted-foreground hover:text-foreground text-sm">
                    Trump
                  </button>
                  <button className="px-3 py-1 rounded text-muted-foreground hover:text-foreground text-sm">
                    Sports
                  </button>
                </div>

                <div className="space-y-3">
                  {relatedPredictions.map((related) => (
                    <div
                      key={related.id}
                      className="flex items-center gap-3 p-3 rounded hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/prediction/${related.id}`)}
                    >
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                        <Image
                          src={related.image}
                          alt={related.title}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {related.title}
                        </div>
                      </div>
                      <div className="font-bold text-lg">
                        {related.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Chart Section */}
          <div className="bg-card rounded-lg border border-border p-6">
            {/* Chart Placeholder */}
            <div className="h-64 bg-muted rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 200"
              >
                <defs>
                  <linearGradient
                    id="greenGradientMobile"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
                    <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
                  </linearGradient>
                </defs>
                {/* Green line (Yes) */}
                <path
                  d="M 0 180 Q 50 170 100 150 T 200 120 T 300 100 T 400 80"
                  stroke="#22c55e"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M 0 180 Q 50 170 100 150 T 200 120 T 300 100 T 400 80 L 400 200 L 0 200 Z"
                  fill="url(#greenGradientMobile)"
                />
                {/* Blue line (No) */}
                <path
                  d="M 0 20 Q 50 30 100 50 T 200 80 T 300 100 T 400 120"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
              <div className="absolute top-4 right-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>
                      Yes{" "}
                      {selectedPrediction.cardType === "simple"
                        ? selectedPrediction.overallChance || 65
                        : 35}
                      %
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>
                      No{" "}
                      {selectedPrediction.cardType === "simple"
                        ? 100 - (selectedPrediction.overallChance || 65)
                        : 65}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(["1H", "6H", "1D", "1W", "1M", "ALL"] as const).map(
                  (period) => (
                    <button
                      key={period}
                      onClick={() => setActiveTab(period)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        activeTab === period
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {period}
                    </button>
                  ),
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded hover:bg-muted">📊</button>
                <button className="p-2 rounded hover:bg-muted">📱</button>
                <button className="p-2 rounded hover:bg-muted">⚙️</button>
                <button className="p-2 rounded hover:bg-muted">🔧</button>
              </div>
            </div>
          </div>

          {/* Dynamic Outcomes Section based on cardType */}
          {selectedPrediction.cardType === "simple"
            ? renderSimpleOutcome()
            : renderMultipleOptionsOutcome()}

          {/* Trading Panel - Below outcomes on mobile */}
          {renderTradingPanel()}
        </div>
      </div>
    </div>
  );
}
