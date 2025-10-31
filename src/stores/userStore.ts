import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
    UserProfile,
    UserStats,
    UserAchievement,
    UserStoreState,
    WalletBalance
} from '@/types/types'

// Deterministically derive a pseudo wallet address from a connected account or email
// This is NOT a blockchain address; it's an app-scoped identifier for display only
function generateVirtualAddressFor(input: string): string {
    // djb2 hash as a simple deterministic seed
    let hash = 5381
    for (let i = 0; i < input.length; i++) {
        hash = ((hash << 5) + hash) + input.charCodeAt(i)
        hash = hash >>> 0
    }
    // Expand to 20 bytes (40 hex chars)
    const bytes: number[] = []
    let seed = hash
    for (let i = 0; i < 20; i++) {
        // xorshift32
        seed ^= seed << 13
        seed ^= seed >>> 17
        seed ^= seed << 5
        bytes.push(seed & 0xff)
    }
    const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('')
    return `0x${hex}`
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto'
    language: string
    currency: 'ETH' | 'USD' | 'EUR'
    timezone: string
    notifications: {
        email: boolean
        push: boolean
        sms: boolean
        betUpdates: boolean
        predictionResolved: boolean
        newPredictions: boolean
        priceAlerts: boolean
        socialUpdates: boolean
    }
    privacy: {
        showStats: boolean
        showPositions: boolean
        showWatchlist: boolean
        allowMessages: boolean
        showOnlineStatus: boolean
    }
    trading: {
        defaultBetSize: number
        maxBetSize: number
        autoConfirm: boolean
        slippageTolerance: number
        gasPrice: 'slow' | 'standard' | 'fast'
    }
}

interface UserState {
    // User data
    profile: UserProfile | null
    stats: UserStats | null
    preferences: UserPreferences
    walletBalance: WalletBalance | null

    // Loading states
    isLoadingProfile: boolean
    isLoadingStats: boolean
    isUpdatingProfile: boolean
    isLoadingBalance: boolean

    // Error handling
    error: string | null

    // Actions
    setProfile: (profile: UserProfile | null) => void
    setStats: (stats: UserStats | null) => void
    setPreferences: (preferences: Partial<UserPreferences>) => void
    setWalletBalance: (balance: WalletBalance | null) => void
    setLoadingProfile: (loading: boolean) => void
    setLoadingStats: (loading: boolean) => void
    setUpdatingProfile: (updating: boolean) => void
    setLoadingBalance: (loading: boolean) => void
    setError: (error: string | null) => void

    // User actions
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>
    updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>
    loadUserData: (userId: string) => Promise<void>
    loadWalletBalance: (userId: string, walletAddress?: string, chainId?: string) => Promise<void>
    resetUser: () => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            // Initial state
            profile: null,
            stats: null,
            walletBalance: null,
            preferences: {
                theme: 'auto',
                language: 'en',
                currency: 'ETH',
                timezone: 'UTC',
                notifications: {
                    email: true,
                    push: true,
                    sms: false,
                    betUpdates: true,
                    predictionResolved: true,
                    newPredictions: false,
                    priceAlerts: true,
                    socialUpdates: true,
                },
                privacy: {
                    showStats: true,
                    showPositions: true,
                    showWatchlist: false,
                    allowMessages: true,
                    showOnlineStatus: true,
                },
                trading: {
                    defaultBetSize: 0.01,
                    maxBetSize: 1.0,
                    autoConfirm: false,
                    slippageTolerance: 0.5,
                    gasPrice: 'standard',
                },
            },
            isLoadingProfile: false,
            isLoadingStats: false,
            isUpdatingProfile: false,
            isLoadingBalance: false,
            error: null,

            // Actions
            setProfile: (profile) => set({ profile }),
            setStats: (stats) => set({ stats }),
            setPreferences: (updates) => set((state) => ({
                preferences: { ...state.preferences, ...updates }
            })),
            setWalletBalance: (balance) => set({ walletBalance: balance }),
            setLoadingProfile: (loading) => set({ isLoadingProfile: loading }),
            setLoadingStats: (loading) => set({ isLoadingStats: loading }),
            setUpdatingProfile: (updating) => set({ isUpdatingProfile: updating }),
            setLoadingBalance: (loading) => set({ isLoadingBalance: loading }),
            setError: (error) => set({ error }),

            // User actions
            updateProfile: async (updates) => {
                set({ isUpdatingProfile: true, error: null })
                try {
                    set((state) => ({
                        profile: state.profile ? { ...state.profile, ...updates } : null,
                        isUpdatingProfile: false,
                    }))
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update profile',
                        isUpdatingProfile: false,
                    })
                }
            },

            updatePreferences: async (updates) => {
                set({ error: null })
                try {
                    set((state) => ({
                        preferences: { ...state.preferences, ...updates }
                    }))
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update preferences',
                    })
                }
            },

            loadUserData: async (userId) => {
                set({ isLoadingProfile: true, isLoadingStats: true, error: null })
                try {
                    let depositAddresses: Record<string, { usdc?: string; usdt?: string }> | undefined
                    let defaultEvmAddress: string | undefined
                    try {
                        const res = await fetch(`/api/session`, {
                            method: 'POST',
                            headers: { 'content-type': 'application/json' },
                            body: JSON.stringify({ userId })
                        })
                        if (res.ok) {
                            const data = await res.json()
                            depositAddresses = data?.depositAddresses
                            defaultEvmAddress = data?.defaultEvmAddress
                        } else {
                            const errorText = await res.text()
                            console.error('Failed to fetch deposit addresses:', res.status, errorText)
                        }
                    } catch (err) {
                        console.error('Error fetching deposit addresses:', err)
                    }

                    if (!depositAddresses) {
                        const fallback = generateVirtualAddressFor(userId)
                        depositAddresses = {
                            'eip155:1': { usdc: fallback, usdt: fallback },
                            'eip155:8453': { usdc: fallback, usdt: fallback },
                            'eip155:56': { usdc: fallback, usdt: fallback },
                            'eip155:137': { usdc: fallback, usdt: fallback },
                            'solana:101': { usdc: fallback, usdt: fallback },
                        }
                        defaultEvmAddress = fallback
                    }

                    // Mock data for now
                    const mockProfile: UserProfile = {
                        id: userId,
                        address: userId,
                        virtualAddress: defaultEvmAddress,
                        depositAddresses,
                        username: `user_${userId.slice(0, 6)}`,
                        displayName: 'Anonymous Trader',
                        bio: 'Prediction market enthusiast',
                        avatar: '',
                        banner: '',
                        location: '',
                        website: '',
                        twitter: '',
                        discord: '',
                        joinedDate: new Date(),
                        isVerified: false,
                        reputation: 0,
                        level: 1,
                        xp: 0,
                    }

                    const mockStats: UserStats = {
                        totalPredictions: 0,
                        totalBets: 0,
                        totalWinnings: 0,
                        totalLosses: 0,
                        winRate: 0,
                        averageBetSize: 0,
                        biggestWin: 0,
                        biggestLoss: 0,
                        streak: 0,
                        longestStreak: 0,
                        totalVolume: 0,
                        rank: 0,
                        percentile: 0,
                    }

                    // Load wallet balance
                    const mockBalance: WalletBalance = {
                        portfolio: 1250.50,
                        cash: 850.25,
                        tokens: {
                            usdc: 850.25,
                            usdt: 0,
                            eth: 0.15,
                            sol: 0
                        }
                    }

                    set({
                        profile: mockProfile,
                        stats: mockStats,
                        walletBalance: mockBalance,
                        isLoadingProfile: false,
                        isLoadingStats: false,
                    })
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to load user data',
                        isLoadingProfile: false,
                        isLoadingStats: false,
                    })
                }
            },

            loadWalletBalance: async (userId, walletAddress?: string, chainId: string = '1') => {
                set({ isLoadingBalance: true, error: null })
                try {
                    // If no wallet address provided, try to get from profile
                    const address = walletAddress || get().profile?.virtualAddress || get().profile?.address;

                    if (!address) {
                        // Fallback to mock data if no address
                        const mockBalance: WalletBalance = {
                            portfolio: 0,
                            cash: 0,
                            tokens: {
                                usdc: 0,
                                usdt: 0,
                                eth: 0,
                                sol: 0
                            }
                        }
                        set({ walletBalance: mockBalance, isLoadingBalance: false })
                        return
                    }

                    // Use ethers.js to fetch real balances (client-side only)
                    if (typeof window !== 'undefined') {
                        const { fetchWalletBalance } = await import('@/lib/balanceUtils')
                        const balance = await fetchWalletBalance(address, chainId)
                        set({ walletBalance: balance, isLoadingBalance: false })
                    } else {
                        // Server-side fallback
                        const mockBalance: WalletBalance = {
                            portfolio: 0,
                            cash: 0,
                            tokens: {
                                usdc: 0,
                                usdt: 0,
                                eth: 0,
                                sol: 0
                            }
                        }
                        set({ walletBalance: mockBalance, isLoadingBalance: false })
                    }
                } catch (error) {
                    console.error('Error loading wallet balance:', error)
                    // Fallback to zero balance on error
                    const fallbackBalance: WalletBalance = {
                        portfolio: 0,
                        cash: 0,
                        tokens: {
                            usdc: 0,
                            usdt: 0,
                            eth: 0,
                            sol: 0
                        }
                    }
                    set({
                        walletBalance: fallbackBalance,
                        isLoadingBalance: false,
                        error: error instanceof Error ? error.message : 'Failed to load wallet balance',
                    })
                }
            },

            resetUser: () => set({
                profile: null,
                stats: null,
                walletBalance: null,
                isLoadingProfile: false,
                isLoadingStats: false,
                isUpdatingProfile: false,
                isLoadingBalance: false,
                error: null,
            }),
        }),
        {
            name: 'acumen-user-store',
            partialize: (state) => ({
                preferences: state.preferences,
            }),
        }
    )
)
