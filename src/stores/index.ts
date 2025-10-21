// Export all stores from a single entry point
export { useAppStore } from './appStore'
export { useWalletPreferences } from './walletStore'
export { usePredictionStore } from './predictionStore'
export { useUserStore } from './userStore'
export { useNotificationStore } from './notificationStore'

// Export types
export type { Prediction, UserPosition, PredictionFilter, MarketStats } from './predictionStore'
export type { UserProfile, UserStats, UserPreferences } from './userStore'
export type { Notification, PriceAlert } from './notificationStore'
