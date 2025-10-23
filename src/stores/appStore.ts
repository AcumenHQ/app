import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState } from '@/types/types'

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
