"use client";

import { useState, useEffect } from "react";
import { usePredictionStore } from "@/stores/predictionStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useUserStore } from "@/stores/userStore";
import { DepositModal } from "@/components/DepositModal";

export function Header() {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const {
    searchQuery,
    selectedCategory,
    sortBy,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
  } = usePredictionStore();

  // Privy auth & wallet
  const { authenticated, user, login, logout, ready } = usePrivy();
  const { profile, walletBalance, loadUserData, loadWalletBalance } = useUserStore();

  // Load user data when authenticated
  useEffect(() => {
    if (authenticated && user?.id && (!profile || profile.id !== user.id)) {
      loadUserData(user.id);
    }
  }, [authenticated, user?.id, profile, loadUserData]);

  // Load wallet balance when profile is available
  useEffect(() => {
    if (authenticated && profile?.virtualAddress) {
      // Default to Base Sepolia testnet (chainId: 84532)
      const chainId = '84532';
      loadWalletBalance(profile.id, profile.virtualAddress, chainId);
    }
  }, [authenticated, profile?.virtualAddress, profile?.id, loadWalletBalance]);

  // Show generated deposit address from Privy, not the connected wallet
  const displayAddress = profile?.virtualAddress;

  // Handle scroll direction detection
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 200) {
            setIsScrollingUp(true);
          } else if (currentScrollY < lastScrollY || currentScrollY <= 200) {
            setIsScrollingUp(false);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const categories = [
    { id: "all", name: "All" },
    { id: "token", name: "Token" },
    { id: "politics", name: "Politics" },
    { id: "entertainment", name: "Entertainment" },
    { id: "sports", name: "Sports" },
  ];

  const showFullNavigation = pathname === "/";

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo + link */}
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src={resolvedTheme === "dark" ? "/Artboard 9.PNG" : "/Artboard 10.PNG"}
                  alt="Acumen Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
            </Link>

            {/* Right actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Portfolio/Cash/Deposit */}
              {authenticated && (
                <>
                  <Link href="/profile" className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md hover:bg-muted transition-colors">
                    <span className="text-xs text-muted-foreground">Portfolio</span>
                    <span className="text-xs font-semibold">
                      ${walletBalance?.portfolio.toFixed(2) || "0.00"}
                    </span>
                  </Link>
                  <Link href="/profile" className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md hover:bg-muted transition-colors">
                    <span className="text-xs text-muted-foreground">Cash</span>
                    <span className="text-xs font-semibold">
                      ${walletBalance?.cash.toFixed(2) || "0.00"}
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="hidden sm:inline-flex items-center bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    Deposit
                  </button>
                </>
              )}
              {!authenticated && (
                <button
                  onClick={login}
                  className="inline-flex items-center bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Connect Wallet
                </button>
              )}
              {/* {authenticated && displayAddress && (
                <span className="hidden sm:flex items-center px-2 py-1 rounded-md bg-muted text-xs font-mono">
                  {displayAddress.slice(0, 6)}…{displayAddress.slice(-4)}
                </span>
              )} */}
              <ThemeToggle />
              <HamburgerMenu isConnected={authenticated} />
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />

      {/* Category Navigation */}
      {showFullNavigation && (
        <div className="sticky top-14 sm:top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 transition-colors text-sm sm:text-base cursor-pointer ${selectedCategory === category.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      {showFullNavigation && (
        <div
          className={`sticky top-28 sm:top-32 z-30 bg-background/95 backdrop-blur-sm transition-transform duration-200 ease-in-out ${isScrollingUp ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-3 gap-3 lg:gap-4">
              {/* Left: Filters + Bookmarks */}
              <div className="flex items-center space-x-3 sm:space-x-6">
                <button className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span className="text-sm sm:text-base font-medium text-foreground">
                    Filters
                  </span>
                </button>
                <button className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground"
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
                  <span className="text-sm sm:text-base font-medium text-foreground">
                    Bookmarks
                  </span>
                </button>
              </div>

              {/* Middle: Search Bar - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:flex flex-1 max-w-md mx-4">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search predictions..."
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm sm:text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right: Sort dropdown - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:flex items-center space-x-2 sm:space-x-4">
                <span className="text-sm sm:text-base text-muted-foreground">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                      | "newest"
                      | "volume"
                      | "ending-soon"
                      | "trending",
                    )
                  }
                  className="bg-background border border-input rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[120px] sm:min-w-[140px]"
                >
                  <option value="newest">Newest</option>
                  <option value="volume">Volume</option>
                  <option value="ending-soon">Ending Soon</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>

            {/* Mobile: Search Bar and Sort dropdown sharing width */}
            <div className="flex items-center gap-3 w-full lg:hidden">
              {/* Search Bar (mobile) - Takes more space */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search predictions..."
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm sm:text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort dropdown (mobile) - Takes less space */}
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                      | "newest"
                      | "volume"
                      | "ending-soon"
                      | "trending",
                    )
                  }
                  className="bg-background border border-input rounded-lg px-2 sm:px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[100px] sm:min-w-[120px]"
                >
                  <option value="newest">Newest</option>
                  <option value="volume">Volume</option>
                  <option value="ending-soon">Ending Soon</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
