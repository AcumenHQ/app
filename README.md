# Acumen - Prediction Market Platform

A modern, decentralized prediction market platform built with Next.js, TypeScript, and Zustand. Acumen allows users to create, participate in, and trade on prediction markets across various categories including politics, sports, entertainment, and cryptocurrency.

## 🚀 Features

### Core Functionality

-  **Prediction Markets**: Create and participate in prediction markets
-  **Trading Interface**: Buy/sell positions with real-time pricing
-  **Wallet Integration**: Connect with Web3 wallets for transactions
-  **User Profiles**: Track performance, achievements, and statistics
-  **Watchlist**: Save and monitor favorite predictions
-  **Categories**: Organized markets across politics, sports, entertainment, and crypto

### UI/UX Features

-  **Responsive Design**: Works seamlessly on desktop and mobile
-  **Dark/Light Theme**: Toggle between themes with persistent preferences
-  **Real-time Updates**: Live market data and price updates
-  **Interactive Cards**: Acumen-style prediction cards with dynamic content
-  **Trading Modal**: Streamlined buy/sell interface
-  **Collapsible Headers**: Optimized navigation with scroll-based UI changes

## 🛠️ Tech Stack

### Frontend

-  **Next.js 15** - React framework with App Router
-  **TypeScript** - Type-safe development
-  **Tailwind CSS** - Utility-first styling
-  **Zustand** - Lightweight state management
-  **Reown (WalletConnect)** - Web3 wallet integration

### State Management

-  **Centralized Types** - All interfaces in `src/types/types.ts`
-  **Store Architecture**:
   -  `predictionStore` - Market data and trading
   -  `userStore` - User profiles and preferences
   -  `walletStore` - Wallet connection and settings
   -  `appStore` - UI state and theme management
   -  `notificationStore` - Alerts and notifications

### Styling & Theming

-  **CSS Variables** - Dynamic theming system
-  **Color Scheme**:
   -  Primary: `#6f46be` (Purple)
   -  Secondary: `#120f25` (Dark Blue)
   -  Background: `#ffffff` (White)
-  **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and theme variables
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── predictions/       # Prediction-specific components
│   │   └── PredictionCard.tsx
│   ├── TradingModal.tsx   # Trading interface modal
│   ├── CircularProgress.tsx
│   └── ThemeToggle.tsx
├── hooks/                 # Custom React hooks
│   └── useWalletIntegration.ts
├── stores/                # Zustand state stores
│   ├── predictionStore.ts
│   ├── userStore.ts
│   ├── walletStore.ts
│   ├── appStore.ts
│   └── notificationStore.ts
├── types/                 # TypeScript type definitions
│   └── types.ts          # Centralized type definitions
├── services/              # API and data services
│   └── demoData.ts       # Mock data generation
└── reown/                 # Wallet integration
    └── appkit.tsx
```

## 🎨 Design System

### Color Palette

-  **Primary**: `#6f46be` - Main brand color for buttons and accents
-  **Secondary**: `#120f25` - Dark text and backgrounds
-  **Background**: `#ffffff` - Clean white backgrounds
-  **Success**: `#10b981` - Green for positive actions
-  **Error**: `#ef4444` - Red for errors and warnings

### Component Patterns

-  **Cards**: Consistent border radius, shadows, and hover effects
-  **Buttons**: Primary, secondary, and destructive variants
-  **Modals**: Centered overlays with backdrop blur
-  **Forms**: Consistent input styling with focus states

## 🚀 Getting Started

### Prerequisites

-  Node.js 18+
-  npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd acumen-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# API endpoints (when backend is ready)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Privy (replace with your real keys when enabled)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_PRIVY_CLIENT_ID=your_privy_client_id
PRIVY_APP_SECRET=your_privy_app_secret

# Alchemy API Key for RPC endpoints (get from https://www.alchemy.com/)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# Each user gets a unique generated deposit address on first sign-in
DEPOSIT_ADDRESS_STRATEGY=first_signin_unique

# Supported multichain config (CAIP-2 chain ids) - now includes testnets
SUPPORTED_CHAINS=eip155:1,eip155:84532,eip155:80002,eip155:137,eip155:97,solana:101
SUPPORTED_ASSETS=usdc,usdt
```

## 🔧 Development

### Available Scripts

-  `npm run dev` - Start development server
-  `npm run build` - Build for production
-  `npm run start` - Start production server
-  `npm run lint` - Run ESLint
-  `npm run type-check` - Run TypeScript compiler

### Code Organization

-  **Types**: All TypeScript interfaces are centralized in `src/types/types.ts`
-  **Stores**: Zustand stores for different domains (predictions, users, etc.)
-  **Components**: Reusable UI components with proper TypeScript props
-  **Hooks**: Custom hooks for wallet integration and other logic
-  **Services**: API calls and data manipulation (currently using mock data)

### State Management

The app uses Zustand for state management with the following stores:

-  **PredictionStore**: Market data, trading, watchlist
-  **UserStore**: User profiles, preferences, statistics
-  **WalletStore**: Wallet connection and settings
-  **AppStore**: UI state, theme, navigation
-  **NotificationStore**: Alerts and notifications

## 🔮 Future Roadmap

### Phase 1: Core Features ✅

-  [x] Basic prediction market UI
-  [x] Wallet integration
-  [x] Trading modal
-  [x] Theme system
-  [x] Responsive design

### Phase 2: Backend Integration 🚧

-  [ ] Smart contract integration
-  [ ] Real-time price feeds
-  [ ] User authentication
-  [ ] Market creation
-  [ ] Trading execution

### Phase 3: Advanced Features 📋

-  [ ] Social features (comments, following)
-  [ ] Advanced analytics
-  [ ] Mobile app
-  [ ] API documentation
-  [ ] Admin dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-  [Next.js](https://nextjs.org/) for the amazing React framework
-  [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
-  [Zustand](https://zustand-demo.pmnd.rs/) for lightweight state management

---

Built with ❤️ by the Acumen team
