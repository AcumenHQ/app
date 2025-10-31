// ============================================================================
// PREDICTION TYPES
// ============================================================================

export interface PredictionOption {
    id: string
    label: string
    percentage: number
    yesPrice: number
    noPrice: number
    volume: number
}

export interface Prediction {
    id: string
    title: string
    description: string
    category: string
    subcategory?: string
    endDate: Date
    outcome: 'yes' | 'no' | 'pending' | 'cancelled'

    // Card type determines how the card is rendered
    cardType: 'simple' | 'multiple-options' | 'date-based' | 'range-based'

    // For simple cards (single Yes/No)
    yesPrice?: number
    noPrice?: number

    // For cards with multiple options
    options?: PredictionOption[]

    // Overall chance for simple cards
    overallChance?: number

    totalVolume: number
    liquidity: number
    creator: string
    createdAt: Date
    tags: string[]
    imageUrl?: string
    resolutionSource?: string
    isResolved: boolean
    resolutionDate?: Date
    marketCap: number
    volume24h: number
    priceChange24h: number
    participants: number
    isFeatured: boolean
    isVerified: boolean
    difficulty: 'easy' | 'medium' | 'hard'
}

export interface UserPosition {
    predictionId: string
    side: 'yes' | 'no'
    amount: number
    averagePrice: number
    pnl: number
    entryDate: Date
    isActive: boolean
    potentialPnl: number
}

export interface PredictionFilter {
    category: string
    subcategory?: string
    difficulty: string
    timeRange: 'all' | '24h' | '7d' | '30d' | '90d'
    priceRange: { min: number; max: number }
    volumeRange: { min: number; max: number }
    isVerified: boolean | null
    isResolved: boolean | null
}

export interface MarketStats {
    totalPredictions: number
    totalVolume: number
    activePredictions: number
    resolvedPredictions: number
    averageVolume: number
    topCategories: { category: string; count: number; volume: number }[]
    trendingTags: { tag: string; count: number }[]
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface UserProfile {
    id: string
    address: string
    virtualAddress?: string
    depositAddresses?: Record<string, { usdc?: string; usdt?: string }>
    username: string
    displayName: string
    bio: string
    avatar: string
    banner: string
    location: string
    website: string
    twitter: string
    discord: string
    joinedDate: Date
    isVerified: boolean
    reputation: number
    level: number
    xp: number
}

export interface UserStats {
    totalPredictions: number
    totalBets: number
    totalWinnings: number
    totalLosses: number
    winRate: number
    averageBetSize: number
    biggestWin: number
    biggestLoss: number
    streak: number
    longestStreak: number
    totalVolume: number
    rank: number
    percentile: number
}

export interface WalletBalance {
    portfolio: number // Total portfolio value
    cash: number // Available cash/USDC balance
    tokens: {
        usdc: number
        usdt: number
        eth?: number
        sol?: number
    }
}

export interface UserAchievement {
    id: string
    title: string
    description: string
    icon: string
    unlockedAt: Date
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    points: number
}

// ============================================================================
// DEPOSIT TYPES
// ============================================================================

export type DepositChain = "ethereum" | "base" | "bnb" | "solana";
export type DepositToken = "usdc" | "usdt";

export interface DepositChainInfo {
    id: DepositChain;
    name: string;
    chainId: string;
}

export interface DepositTokenInfo {
    id: DepositToken;
    name: string;
    symbol: string;
}

export interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// ============================================================================
// WALLET TYPES
// ============================================================================

export interface WalletPreferences {
    // User preferences for wallet interactions
    preferredWallet: string | null
    autoConnect: boolean
    showBalance: boolean
    currency: 'ETH' | 'USD' | 'EUR'

    // Transaction preferences
    gasPrice: 'slow' | 'standard' | 'fast'
    slippageTolerance: number

    // Actions
    setPreferredWallet: (wallet: string | null) => void
    setAutoConnect: (auto: boolean) => void
    setShowBalance: (show: boolean) => void
    setCurrency: (currency: 'ETH' | 'USD' | 'EUR') => void
    setGasPrice: (gasPrice: 'slow' | 'standard' | 'fast') => void
    setSlippageTolerance: (slippage: number) => void
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
    id: string
    type: 'bet' | 'prediction' | 'price' | 'social' | 'system' | 'achievement'
    title: string
    message: string
    timestamp: Date
    isRead: boolean
    isImportant: boolean
    actionUrl?: string
    metadata?: Record<string, unknown>
}

export interface PriceAlert {
    id: string
    predictionId: string
    condition: 'above' | 'below' | 'change'
    targetPrice: number
    isActive: boolean
    createdAt: Date
    triggeredAt?: Date
}

// ============================================================================
// APP STATE TYPES
// ============================================================================

export interface AppState {
    // UI State
    isMobileMenuOpen: boolean
    isResourcesOpen: boolean
    isCommunityOpen: boolean
    isScrolled: boolean

    // Theme
    theme: 'light' | 'dark'

    // Loading states
    isLoading: boolean

    // Actions
    setMobileMenuOpen: (open: boolean) => void
    setResourcesOpen: (open: boolean) => void
    setCommunityOpen: (open: boolean) => void
    setScrolled: (scrolled: boolean) => void
    setTheme: (theme: 'light' | 'dark') => void
    setLoading: (loading: boolean) => void
    toggleTheme: () => void
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface TradingModalProps {
    isOpen: boolean
    onClose: () => void
    prediction: Prediction | null
    selectedOutcome: 'yes' | 'no' | null
    action: 'buy' | 'sell'
}

export interface CircularProgressProps {
    percentage: number
    size?: number
    strokeWidth?: number
    className?: string
}

export interface PredictionCardProps {
    prediction: Prediction
}

// ============================================================================
// STORE STATE TYPES
// ============================================================================

export interface PredictionStoreState {
    // Data
    predictions: Prediction[]
    selectedPrediction: Prediction | null
    userPositions: UserPosition[]
    watchlist: string[]
    marketStats: MarketStats | null

    // UI State
    searchQuery: string
    selectedCategory: string
    sortBy: 'newest' | 'volume' | 'ending-soon' | 'trending'
    filter: PredictionFilter
    isCreatingPrediction: boolean
    isPlacingBet: boolean
    isResolving: boolean
    isLoadingPredictions: boolean
    isLoadingUserData: boolean
    isLoadingMarketStats: boolean
    error: string | null

    // Actions
    setPredictions: (predictions: Prediction[]) => void
    setUserPositions: (positions: UserPosition[]) => void
    setWatchlist: (watchlist: string[]) => void
    setMarketStats: (stats: MarketStats | null) => void
    setSearchQuery: (query: string) => void
    setSelectedCategory: (category: string) => void
    setSortBy: (sortBy: 'newest' | 'volume' | 'ending-soon' | 'trending') => void
    setFilter: (filter: Partial<PredictionFilter>) => void
    setSelectedPrediction: (prediction: Prediction | null) => void
    setCreatingPrediction: (creating: boolean) => void
    setPlacingBet: (placing: boolean) => void
    setResolving: (resolving: boolean) => void
    setLoadingPredictions: (loading: boolean) => void
    setLoadingUserData: (loading: boolean) => void
    setLoadingMarketStats: (loading: boolean) => void
    setError: (error: string | null) => void

    // Prediction actions
    createPrediction: (prediction: Omit<Prediction, 'id' | 'createdAt'>) => Promise<void>
    fetchPredictionById: (id: string) => Promise<Prediction | null>
    placeBet: (predictionId: string, side: 'yes' | 'no', amount: number) => Promise<void>
    resolvePrediction: (predictionId: string, outcome: 'yes' | 'no') => Promise<void>
    addToWatchlist: (predictionId: string) => void
    removeFromWatchlist: (predictionId: string) => void
    toggleWatchlist: (predictionId: string) => void

    // Market actions
    loadMarketStats: () => Promise<void>
    loadTrendingPredictions: () => Promise<void>
    loadDemoData: () => Promise<void>

    // Filter actions
    filterPredictions: () => Prediction[]
    getFilteredPredictions: () => Prediction[]
    getPredictionsByCategory: (category: string) => Prediction[]
    getTrendingPredictions: () => Prediction[]
    getUserPositions: () => UserPosition[]
    getWatchlistPredictions: () => Prediction[]
}

export interface NotificationStoreState {
    // Notifications
    notifications: Notification[]
    unreadCount: number

    // Price alerts
    priceAlerts: PriceAlert[]

    // Settings
    emailNotifications: boolean
    pushNotifications: boolean
    priceAlertsEnabled: boolean
    socialNotifications: boolean
    systemNotifications: boolean

    // Actions
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
    markAsRead: (notificationId: string) => void
    markAllAsRead: () => void
    removeNotification: (notificationId: string) => void
    clearAllNotifications: () => void

    // Price alerts
    addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void
    updatePriceAlert: (alertId: string, updates: Partial<PriceAlert>) => void
    removePriceAlert: (alertId: string) => void
    triggerPriceAlert: (alertId: string) => void

    // Settings
    setEmailNotifications: (enabled: boolean) => void
    setPushNotifications: (enabled: boolean) => void
    setPriceAlertsEnabled: (enabled: boolean) => void
    setSocialNotifications: (enabled: boolean) => void
    setSystemNotifications: (enabled: boolean) => void
}

export interface UserStoreState {
    // User data
    profile: UserProfile | null
    stats: UserStats | null
    achievements: UserAchievement[]

    // Loading states
    isLoadingProfile: boolean
    isLoadingStats: boolean
    isLoadingAchievements: boolean

    // Actions
    setProfile: (profile: UserProfile | null) => void
    setStats: (stats: UserStats | null) => void
    setAchievements: (achievements: UserAchievement[]) => void
    setLoadingProfile: (loading: boolean) => void
    setLoadingStats: (loading: boolean) => void
    setLoadingAchievements: (loading: boolean) => void

    // Profile actions
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>
    uploadAvatar: (file: File) => Promise<string>
    uploadBanner: (file: File) => Promise<string>

    // Stats actions
    refreshStats: () => Promise<void>

    // Achievement actions
    unlockAchievement: (achievementId: string) => void
    checkAchievements: () => void
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Theme = 'light' | 'dark'

export type SortBy = 'newest' | 'volume' | 'ending-soon' | 'trending'

export type CardType = 'simple' | 'multiple-options' | 'date-based' | 'range-based'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Outcome = 'yes' | 'no' | 'pending' | 'cancelled'

export type BetSide = 'yes' | 'no'

export type TradeAction = 'buy' | 'sell'

export type NotificationType = 'bet' | 'prediction' | 'price' | 'social' | 'system' | 'achievement'

export type AlertCondition = 'above' | 'below' | 'change'

export type GasPrice = 'slow' | 'standard' | 'fast'

export type Currency = 'ETH' | 'USD' | 'EUR'

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'
