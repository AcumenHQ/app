import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
    UserProfile,
    UserStats,
    UserAchievement,
    UserStoreState
} from '@/types/types'

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

    // Loading states
    isLoadingProfile: boolean
    isLoadingStats: boolean
    isUpdatingProfile: boolean

    // Error handling
    error: string | null

    // Actions
    setProfile: (profile: UserProfile | null) => void
    setStats: (stats: UserStats | null) => void
    setPreferences: (preferences: Partial<UserPreferences>) => void
    setLoadingProfile: (loading: boolean) => void
    setLoadingStats: (loading: boolean) => void
    setUpdatingProfile: (updating: boolean) => void
    setError: (error: string | null) => void

    // User actions
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>
    updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>
    loadUserData: (address: string) => Promise<void>
    resetUser: () => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            // Initial state
            profile: null,
            stats: null,
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
            error: null,

            // Actions
            setProfile: (profile) => set({ profile }),
            setStats: (stats) => set({ stats }),
            setPreferences: (updates) => set((state) => ({
                preferences: { ...state.preferences, ...updates }
            })),
            setLoadingProfile: (loading) => set({ isLoadingProfile: loading }),
            setLoadingStats: (loading) => set({ isLoadingStats: loading }),
            setUpdatingProfile: (updating) => set({ isUpdatingProfile: updating }),
            setError: (error) => set({ error }),

            // User actions
            updateProfile: async (updates) => {
                set({ isUpdatingProfile: true, error: null })
                try {
                    // This will be implemented with API calls
                    console.log('Updating profile:', updates)

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
                    // This will be implemented with API calls
                    console.log('Updating preferences:', updates)

                    set((state) => ({
                        preferences: { ...state.preferences, ...updates }
                    }))
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update preferences',
                    })
                }
            },

            loadUserData: async (address) => {
                set({ isLoadingProfile: true, isLoadingStats: true, error: null })
                try {
                    // This will be implemented with API calls
                    console.log('Loading user data for:', address)

                    // Mock data for now
                    const mockProfile: UserProfile = {
                        id: crypto.randomUUID(),
                        address,
                        username: `user_${address.slice(0, 6)}`,
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

                    set({
                        profile: mockProfile,
                        stats: mockStats,
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

            resetUser: () => set({
                profile: null,
                stats: null,
                isLoadingProfile: false,
                isLoadingStats: false,
                isUpdatingProfile: false,
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
