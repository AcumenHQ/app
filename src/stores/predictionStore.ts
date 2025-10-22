import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

interface PredictionState {
    // Predictions data
    predictions: Prediction[]
    featuredPredictions: Prediction[]
    userPredictions: Prediction[]
    trendingPredictions: Prediction[]

    // User positions
    userPositions: UserPosition[]
    watchlist: string[]

    // Market data
    marketStats: MarketStats | null

    // Filters and search
    searchQuery: string
    selectedCategory: string
    sortBy: 'newest' | 'oldest' | 'volume' | 'ending-soon' | 'trending' | 'price-change'
    filter: PredictionFilter

    // UI state
    selectedPrediction: Prediction | null
    isCreatingPrediction: boolean
    isPlacingBet: boolean
    isResolving: boolean

    // Loading states
    isLoadingPredictions: boolean
    isLoadingUserData: boolean
    isLoadingMarketStats: boolean

    // Error handling
    error: string | null

    // Actions
    setPredictions: (predictions: Prediction[]) => void
    setFeaturedPredictions: (predictions: Prediction[]) => void
    setUserPredictions: (predictions: Prediction[]) => void
    setTrendingPredictions: (predictions: Prediction[]) => void
    setUserPositions: (positions: UserPosition[]) => void
    setWatchlist: (watchlist: string[]) => void
    setMarketStats: (stats: MarketStats | null) => void
    setSearchQuery: (query: string) => void
    setSelectedCategory: (category: string) => void
    setSortBy: (sortBy: 'newest' | 'oldest' | 'volume' | 'ending-soon' | 'trending' | 'price-change') => void
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

export const usePredictionStore = create<PredictionState>()(
    persist(
        (set, get) => ({
            // Initial state
            predictions: [],
            featuredPredictions: [],
            userPredictions: [],
            trendingPredictions: [],
            userPositions: [],
            watchlist: [],
            marketStats: null,
            searchQuery: '',
            selectedCategory: 'all',
            sortBy: 'newest',
            filter: {
                category: 'all',
                difficulty: 'all',
                timeRange: 'all',
                priceRange: { min: 0, max: 1 },
                volumeRange: { min: 0, max: 1000000 },
                isVerified: null,
                isResolved: null,
            },
            selectedPrediction: null,
            isCreatingPrediction: false,
            isPlacingBet: false,
            isResolving: false,
            isLoadingPredictions: false,
            isLoadingUserData: false,
            isLoadingMarketStats: false,
            error: null,

            // Actions
            setPredictions: (predictions) => set({ predictions }),
            setFeaturedPredictions: (predictions) => set({ featuredPredictions: predictions }),
            setUserPredictions: (predictions) => set({ userPredictions: predictions }),
            setTrendingPredictions: (predictions) => set({ trendingPredictions: predictions }),
            setUserPositions: (positions) => set({ userPositions: positions }),
            setWatchlist: (watchlist) => set({ watchlist }),
            setMarketStats: (stats) => set({ marketStats: stats }),
            setSearchQuery: (query) => set({ searchQuery: query }),
            setSelectedCategory: (category) => set({ selectedCategory: category }),
            setSortBy: (sortBy) => set({ sortBy }),
            setFilter: (filterUpdate) => set((state) => ({ filter: { ...state.filter, ...filterUpdate } })),
            setSelectedPrediction: (prediction) => set({ selectedPrediction: prediction }),
            setCreatingPrediction: (creating) => set({ isCreatingPrediction: creating }),
            setPlacingBet: (placing) => set({ isPlacingBet: placing }),
            setResolving: (resolving) => set({ isResolving: resolving }),
            setLoadingPredictions: (loading) => set({ isLoadingPredictions: loading }),
            setLoadingUserData: (loading) => set({ isLoadingUserData: loading }),
            setLoadingMarketStats: (loading) => set({ isLoadingMarketStats: loading }),
            setError: (error) => set({ error }),

            // Prediction actions
            createPrediction: async (predictionData) => {
                set({ isCreatingPrediction: true, error: null })
                try {
                    const newPrediction: Prediction = {
                        ...predictionData,
                        id: crypto.randomUUID(),
                        createdAt: new Date(),
                    }

                    set((state) => ({
                        predictions: [newPrediction, ...state.predictions],
                        isCreatingPrediction: false,
                    }))
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to create prediction',
                        isCreatingPrediction: false,
                    })
                }
            },

            placeBet: async (predictionId, side, amount) => {
                set({ isPlacingBet: true, error: null })
                try {
                    // This will be implemented with smart contract integration
                    console.log(`Placing ${side} bet of ${amount} on prediction ${predictionId}`)

                    // Update user positions
                    const existingPosition = get().userPositions.find(p => p.predictionId === predictionId && p.side === side)
                    if (existingPosition) {
                        set((state) => ({
                            userPositions: state.userPositions.map(p =>
                                p.predictionId === predictionId && p.side === side
                                    ? { ...p, amount: p.amount + amount }
                                    : p
                            ),
                            isPlacingBet: false,
                        }))
                    } else {
                        set((state) => ({
                            userPositions: [...state.userPositions, {
                                predictionId,
                                side,
                                amount,
                                averagePrice: 0.5, // This would be calculated from actual market data
                                pnl: 0,
                                entryDate: new Date(),
                                isActive: true,
                                potentialPnl: 0,
                            }],
                            isPlacingBet: false,
                        }))
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to place bet',
                        isPlacingBet: false,
                    })
                }
            },

            resolvePrediction: async (predictionId, outcome) => {
                set({ isResolving: true, error: null })
                try {
                    // This will be implemented with smart contract integration
                    console.log(`Resolving prediction ${predictionId} with outcome: ${outcome}`)

                    set((state) => ({
                        predictions: state.predictions.map(p =>
                            p.id === predictionId ? { ...p, outcome, isResolved: true, resolutionDate: new Date() } : p
                        ),
                        isResolving: false,
                    }))
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to resolve prediction',
                        isResolving: false,
                    })
                }
            },

            // Watchlist actions
            addToWatchlist: (predictionId) => {
                set((state) => ({
                    watchlist: [...state.watchlist, predictionId]
                }))
            },

            removeFromWatchlist: (predictionId) => {
                set((state) => ({
                    watchlist: state.watchlist.filter(id => id !== predictionId)
                }))
            },

            toggleWatchlist: (predictionId) => {
                const { watchlist } = get()
                if (watchlist.includes(predictionId)) {
                    get().removeFromWatchlist(predictionId)
                } else {
                    get().addToWatchlist(predictionId)
                }
            },

            // Market actions
            loadMarketStats: async () => {
                set({ isLoadingMarketStats: true, error: null })
                try {
                    // This will be implemented with API calls
                    console.log('Loading market stats...')
                    // Mock data for now
                    const mockStats: MarketStats = {
                        totalPredictions: 150,
                        totalVolume: 2500000,
                        activePredictions: 120,
                        resolvedPredictions: 30,
                        averageVolume: 16666,
                        topCategories: [
                            { category: 'Politics', count: 45, volume: 800000 },
                            { category: 'Sports', count: 35, volume: 600000 },
                            { category: 'Crypto', count: 25, volume: 500000 },
                        ],
                        trendingTags: [
                            { tag: 'election', count: 15 },
                            { tag: 'bitcoin', count: 12 },
                            { tag: 'worldcup', count: 8 },
                        ]
                    }
                    set({ marketStats: mockStats, isLoadingMarketStats: false })
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to load market stats',
                        isLoadingMarketStats: false,
                    })
                }
            },

            loadTrendingPredictions: async () => {
                set({ isLoadingPredictions: true, error: null })
                try {
                    // This will be implemented with API calls
                    console.log('Loading trending predictions...')
                    // Mock data for now
                    set({ isLoadingPredictions: false })
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to load trending predictions',
                        isLoadingPredictions: false,
                    })
                }
            },

            // Load demo data (to be replaced with API calls)
            loadDemoData: async () => {
                set({ isLoadingPredictions: true, error: null })
                try {
                    const { generateDemoPredictions } = await import('@/services/demoData')
                    const demoPredictions = generateDemoPredictions()

                    set({
                        predictions: demoPredictions,
                        featuredPredictions: demoPredictions.filter(p => p.isFeatured),
                        trendingPredictions: demoPredictions.slice(0, 10), // First 10 as trending
                        isLoadingPredictions: false,
                    })
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to load demo data',
                        isLoadingPredictions: false,
                    })
                }
            },

            // Filter functions
            filterPredictions: () => {
                const { predictions, searchQuery, selectedCategory, sortBy } = get()

                const filtered = predictions.filter(prediction => {
                    const matchesSearch = prediction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        prediction.description.toLowerCase().includes(searchQuery.toLowerCase())
                    const matchesCategory = selectedCategory === 'all' || prediction.category === selectedCategory
                    return matchesSearch && matchesCategory
                })

                // Sort predictions
                switch (sortBy) {
                    case 'newest':
                        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                        break
                    case 'oldest':
                        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                        break
                    case 'volume':
                        filtered.sort((a, b) => b.totalVolume - a.totalVolume)
                        break
                    case 'ending-soon':
                        filtered.sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
                        break
                }

                return filtered
            },

            getFilteredPredictions: () => {
                return get().filterPredictions()
            },

            getPredictionsByCategory: (category) => {
                const { predictions } = get()
                return predictions.filter(p => p.category === category)
            },

            getTrendingPredictions: () => {
                const { trendingPredictions } = get()
                return trendingPredictions
            },

            getUserPositions: () => {
                const { userPositions } = get()
                return userPositions
            },

            getWatchlistPredictions: () => {
                const { predictions, watchlist } = get()
                return predictions.filter(p => watchlist.includes(p.id))
            },
        }),
        {
            name: 'acumen-prediction-store',
            partialize: (state) => ({
                searchQuery: state.searchQuery,
                selectedCategory: state.selectedCategory,
                sortBy: state.sortBy,
            }),
        }
    )
)
