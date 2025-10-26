"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { usePredictionStore } from "@/stores/predictionStore";
import { useAccount } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { profile, stats, isLoadingProfile, isLoadingStats } = useUserStore();
  const { userPositions, getUserPositions } = usePredictionStore();
  const { address: ethAddress, isConnected: ethConnected } = useAccount();
  const { address: appKitAddress, isConnected: appKitConnected } =
    useAppKitAccount();
  const address = ethAddress || appKitAddress;
  const isConnected = ethConnected || appKitConnected;
  const [activeTab, setActiveTab] = useState<
    "overview" | "positions" | "history"
  >("overview");

  useEffect(() => {
    getUserPositions();
  }, [getUserPositions]);

  if (isLoadingProfile || isLoadingStats) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        {/* Profile Header */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.displayName || "Profile"}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="text-2xl font-bold text-muted-foreground">
                    {profile?.displayName?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              {profile?.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                  <svg
                    className="w-4 h-4 text-primary-foreground"
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
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {profile?.displayName || "Anonymous User"}
                  </h1>
                  <p className="text-muted-foreground">
                    @{profile?.username || "anonymous"}
                  </p>
                  {profile?.bio && (
                    <p className="text-sm text-muted-foreground mt-2 max-w-md">
                      {profile.bio}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/account-settings"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {stats?.totalPredictions || 0}
            </div>
            <div className="text-sm text-muted-foreground">Predictions</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {stats?.winRate || 0}%
            </div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              ${stats?.totalVolume?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-muted-foreground">Total Volume</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">
              #{stats?.rank || "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">Rank</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "positions", label: "Active Positions" },
              { id: "history", label: "Trade History" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground py-8">
                    <p>No recent activity</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Bets</span>
                    <span className="font-medium">{stats?.totalBets || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Winnings
                    </span>
                    <span className="font-medium text-green-500">
                      ${stats?.totalWinnings?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Current Streak
                    </span>
                    <span className="font-medium">{stats?.streak || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biggest Win</span>
                    <span className="font-medium text-green-500">
                      ${stats?.biggestWin?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "positions" && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Active Positions</h3>
              {userPositions.length > 0 ? (
                <div className="space-y-4">
                  {userPositions.map((position) => (
                    <div
                      key={position.predictionId}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          Position #{position.predictionId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {position.side.toUpperCase()} - ${position.amount}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${position.pnl >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {position.pnl >= 0 ? "+" : ""}$
                          {position.pnl.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">P&L</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No active positions</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Trade History</h3>
              <div className="text-center text-muted-foreground py-8">
                <p>No trade history available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
