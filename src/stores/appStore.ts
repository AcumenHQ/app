import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
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

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial state
            isMobileMenuOpen: false,
            isResourcesOpen: false,
            isCommunityOpen: false,
            isScrolled: false,
            theme: 'light',
            isLoading: false,

            // Actions
            setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
            setResourcesOpen: (open) => set({ isResourcesOpen: open }),
            setCommunityOpen: (open) => set({ isCommunityOpen: open }),
            setScrolled: (scrolled) => set({ isScrolled: scrolled }),
            setTheme: (theme) => set({ theme }),
            setLoading: (loading) => set({ isLoading: loading }),
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        }),
        {
            name: 'acumen-app-store',
            partialize: (state) => ({ theme: state.theme }), // Only persist theme
        }
    )
)
