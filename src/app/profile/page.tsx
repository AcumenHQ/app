"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { usePrivy } from "@privy-io/react-auth";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";

export default function ProfilePage() {
  const { authenticated, user } = usePrivy();
  const { profile, walletBalance, loadUserData, loadWalletBalance } = useUserStore();
  const [pnlRange, setPnlRange] = useState<"1D" | "1W" | "1M" | "ALL">("1D");
  const [activeTab, setActiveTab] = useState<"positions" | "open" | "history">("positions");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Load user data when authenticated
  useEffect(() => {
    if (authenticated && user?.id && (!profile || profile.id !== user.id)) {
      loadUserData(user.id);
      // Get wallet address from Privy user
      const walletAddress = user?.wallet?.address || profile?.virtualAddress;
      // Default to Ethereum mainnet (chainId: 1)
      // In production, you may want to detect the active chain from the wallet provider
      const chainId = '1';
      loadWalletBalance(user.id, walletAddress, chainId);
    }
  }, [authenticated, user?.id, user?.wallet?.address, profile, loadUserData, loadWalletBalance]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 pt-24">
        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Portfolio</span>
            </div>
            <div className="mt-2 text-3xl font-semibold">
              ${walletBalance?.portfolio.toFixed(2) || "0.00"}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="inline-flex items-center bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Deposit
              </button>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="inline-flex items-center border border-input text-sm px-4 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
              >
                Withdraw
              </button>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Profit/Loss</span>
              <div className="flex gap-2">
                {(["1D", "1W", "1M", "ALL"] as const).map(r => (
                  <button key={r} onClick={() => setPnlRange(r)} className={`px-2 py-1 rounded-md text-xs cursor-pointer ${pnlRange === r ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"}`}>{r}</button>
                ))}
              </div>
            </div>
            <div className="mt-2 text-3xl font-semibold">$0.00</div>
            <div className="mt-3 h-8 rounded-md bg-muted" />
          </div>
        </div>

        {/* Positions / Open orders / History */}
        <div className="bg-card rounded-lg border border-border">
          {/* Tabs */}
          <div className="border-b border-border px-4 py-3 flex items-center gap-6">
            <button onClick={() => setActiveTab("positions")} className={`text-sm pb-1 cursor-pointer ${activeTab === "positions" ? "font-medium border-b-2 border-primary" : "text-muted-foreground"}`}>Positions</button>
            <button onClick={() => setActiveTab("open")} className={`text-sm pb-1 cursor-pointer ${activeTab === "open" ? "font-medium border-b-2 border-primary" : "text-muted-foreground"}`}>Open orders</button>
            <button onClick={() => setActiveTab("history")} className={`text-sm pb-1 cursor-pointer ${activeTab === "history" ? "font-medium border-b-2 border-primary" : "text-muted-foreground"}`}>History</button>
          </div>

          {/* Search/controls row */}
          <div className="p-4 flex items-center gap-3">
            <div className="flex-1 relative">
              <input className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-md text-sm" placeholder="Search" />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            {activeTab !== "history" && (
              <button className="inline-flex items-center border border-input text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors">Market</button>
            )}
            {activeTab === "history" && (
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center border border-input text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors">All</button>
                <button className="inline-flex items-center border border-input text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors">Newest</button>
                <button className="inline-flex items-center border border-input text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors">Export</button>
              </div>
            )}
          </div>

          {/* Content */}
          {activeTab === "positions" && (
            <div className="px-4 pb-8 text-center text-muted-foreground">
              <div className="py-10">No positions found.</div>
            </div>
          )}

          {activeTab === "open" && (
            <div className="px-4 pb-8">
              <div className="flex justify-center">
                <button className="w-full md:w-[420px] bg-primary text-primary-foreground rounded-md h-11 font-medium hover:bg-primary/90 cursor-pointer">Generate</button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="px-4 pb-8">
              <div className="grid grid-cols-3 gap-4 px-1 text-xs text-muted-foreground mb-4">
                <div>ACTIVITY</div>
                <div>MARKET</div>
                <div className="text-right">VALUE</div>
              </div>
              <div className="text-center text-muted-foreground py-10">You haven&apos;t traded any polymarkets yet</div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <span>Account:</span>
            <span className="font-mono">{profile?.virtualAddress ? `${profile.virtualAddress.slice(0, 6)}…${profile.virtualAddress.slice(-4)}` : "Not connected"}</span>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />

      {/* Withdraw Modal */}
      <WithdrawModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} />
    </div>
  );
}
