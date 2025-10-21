'use client'

import { useTheme } from '@/components/ThemeProvider'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
        >
            {theme === 'light' ? (
                <Moon className="h-4 w-4" />
            ) : (
                <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
