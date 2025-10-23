'use client';

import { useState, useEffect } from 'react';
import { usePredictionStore } from '@/stores/predictionStore';
import { PredictionCard } from '@/components/predictions/PredictionCard';
import { ConnectButton } from '@/components/appkit-button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function Home() {
  const { theme, resolvedTheme } = useTheme();
  const {
    predictions,
    searchQuery,
    selectedCategory,
    sortBy,
    isLoadingPredictions,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    loadDemoData,
    getFilteredPredictions,
  } = usePredictionStore();

  const [filteredPredictions, setFilteredPredictions] = useState(predictions);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Load demo data on component mount
  useEffect(() => {
    loadDemoData();
  }, [loadDemoData]);

  // Update filtered predictions when store state changes
  useEffect(() => {
    const filtered = getFilteredPredictions();
    setFilteredPredictions(filtered);
  }, [predictions, searchQuery, selectedCategory, sortBy, getFilteredPredictions]);

  // Handle scroll direction detection
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Hide filter bar when scrolling down and past 200px
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'token', name: 'Token' },
    { id: 'politics', name: 'Politics' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'sports', name: 'Sports' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src={resolvedTheme === 'dark' ? '/Artboard 9.PNG' : '/Artboard 10.PNG'}
                alt="Acumen Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>


            {/* Connect Wallet Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
                How it works
              </button>
              <ConnectButton />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-14 sm:top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 transition-colors text-sm sm:text-base ${selectedCategory === category.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`sticky top-28 sm:top-32 z-30 bg-background/95 backdrop-blur-sm transition-transform duration-200 ease-in-out ${isScrollingUp ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-3 gap-3 lg:gap-4">
            {/* Left: Filters + Bookmarks */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              <button className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-sm sm:text-base font-medium text-foreground">Filters</span>
              </button>
              <button className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="text-sm sm:text-base font-medium text-foreground">Bookmarks</span>
              </button>
            </div>

            {/* Middle: Search Bar - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
              <span className="text-sm sm:text-base text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'volume' | 'ending-soon' | 'trending')}
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
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'volume' | 'ending-soon' | 'trending')}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8">
        {isLoadingPredictions ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredPredictions.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                prediction={prediction}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingPredictions && filteredPredictions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-base sm:text-lg mb-4">No predictions found</div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}