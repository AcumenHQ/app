'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAppStore } from '@/stores/appStore'

type Theme = 'light' | 'dark'

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

interface ThemeProviderState {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const initialState: ThemeProviderState = {
    theme: 'light',
    setTheme: () => null,
    toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = 'light',
    storageKey = 'acumen-theme',
    ...props
}: ThemeProviderProps) {
    const { theme, toggleTheme } = useAppStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
    }, [theme])

    const setTheme = (theme: Theme) => {
        useAppStore.getState().setTheme(theme)
    }

    if (!mounted) {
        return null
    }

    const value = {
        theme,
        setTheme,
        toggleTheme,
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider')

    return context
}
