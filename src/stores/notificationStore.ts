import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

interface NotificationState {
    // Notifications
    notifications: Notification[]
    unreadCount: number

    // Price alerts
    priceAlerts: PriceAlert[]

    // Settings
    settings: {
        email: boolean
        push: boolean
        sms: boolean
        betUpdates: boolean
        predictionResolved: boolean
        newPredictions: boolean
        priceAlerts: boolean
        socialUpdates: boolean
        achievements: boolean
    }

    // UI state
    isOpen: boolean
    isLoading: boolean

    // Error handling
    error: string | null

    // Actions
    setNotifications: (notifications: Notification[]) => void
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
    markAsRead: (notificationId: string) => void
    markAllAsRead: () => void
    removeNotification: (notificationId: string) => void
    clearAllNotifications: () => void
    setUnreadCount: (count: number) => void

    // Price alerts
    setPriceAlerts: (alerts: PriceAlert[]) => void
    addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void
    removePriceAlert: (alertId: string) => void
    updatePriceAlert: (alertId: string, updates: Partial<PriceAlert>) => void

    // Settings
    updateSettings: (settings: Partial<NotificationState['settings']>) => void

    // UI actions
    setOpen: (open: boolean) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Utility functions
    getUnreadNotifications: () => Notification[]
    getNotificationsByType: (type: Notification['type']) => Notification[]
    getActivePriceAlerts: () => PriceAlert[]
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            // Initial state
            notifications: [],
            unreadCount: 0,
            priceAlerts: [],
            settings: {
                email: true,
                push: true,
                sms: false,
                betUpdates: true,
                predictionResolved: true,
                newPredictions: false,
                priceAlerts: true,
                socialUpdates: true,
                achievements: true,
            },
            isOpen: false,
            isLoading: false,
            error: null,

            // Actions
            setNotifications: (notifications) => {
                const unreadCount = notifications.filter(n => !n.isRead).length
                set({ notifications, unreadCount })
            },

            addNotification: (notificationData) => {
                const notification: Notification = {
                    ...notificationData,
                    id: crypto.randomUUID(),
                    timestamp: new Date(),
                }

                set((state) => {
                    const newNotifications = [notification, ...state.notifications]
                    const unreadCount = newNotifications.filter(n => !n.isRead).length
                    return {
                        notifications: newNotifications,
                        unreadCount,
                    }
                })
            },

            markAsRead: (notificationId) => {
                set((state) => {
                    const updatedNotifications = state.notifications.map(n =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    )
                    const unreadCount = updatedNotifications.filter(n => !n.isRead).length
                    return {
                        notifications: updatedNotifications,
                        unreadCount,
                    }
                })
            },

            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                    unreadCount: 0,
                }))
            },

            removeNotification: (notificationId) => {
                set((state) => {
                    const updatedNotifications = state.notifications.filter(n => n.id !== notificationId)
                    const unreadCount = updatedNotifications.filter(n => !n.isRead).length
                    return {
                        notifications: updatedNotifications,
                        unreadCount,
                    }
                })
            },

            clearAllNotifications: () => {
                set({ notifications: [], unreadCount: 0 })
            },

            setUnreadCount: (count) => set({ unreadCount: count }),

            // Price alerts
            setPriceAlerts: (alerts) => set({ priceAlerts: alerts }),

            addPriceAlert: (alertData) => {
                const alert: PriceAlert = {
                    ...alertData,
                    id: crypto.randomUUID(),
                    createdAt: new Date(),
                }

                set((state) => ({
                    priceAlerts: [...state.priceAlerts, alert]
                }))
            },

            removePriceAlert: (alertId) => {
                set((state) => ({
                    priceAlerts: state.priceAlerts.filter(a => a.id !== alertId)
                }))
            },

            updatePriceAlert: (alertId, updates) => {
                set((state) => ({
                    priceAlerts: state.priceAlerts.map(a =>
                        a.id === alertId ? { ...a, ...updates } : a
                    )
                }))
            },

            // Settings
            updateSettings: (settings) => {
                set((state) => ({
                    settings: { ...state.settings, ...settings }
                }))
            },

            // UI actions
            setOpen: (open) => set({ isOpen: open }),
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),

            // Utility functions
            getUnreadNotifications: () => {
                const { notifications } = get()
                return notifications.filter(n => !n.isRead)
            },

            getNotificationsByType: (type) => {
                const { notifications } = get()
                return notifications.filter(n => n.type === type)
            },

            getActivePriceAlerts: () => {
                const { priceAlerts } = get()
                return priceAlerts.filter(a => a.isActive)
            },
        }),
        {
            name: 'acumen-notification-store',
            partialize: (state) => ({
                settings: state.settings,
                priceAlerts: state.priceAlerts,
            }),
        }
    )
)
