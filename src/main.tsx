import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiConfig, createConfig } from 'wagmi'
import { sepolia, goerli, hardhat } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig as createWagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { Toaster } from 'react-hot-toast'

import App from './App'
import './index.css'

import '@rainbow-me/rainbowkit/styles.css'

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, goerli, hardhat],
  [
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_PROJECT_ID || 'demo' }),
    publicProvider()
  ]
)

// Configure wallets
const { connectors } = getDefaultWallets({
  appName: 'FHE Anonymous Crowdfunding',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo',
  chains
})

// Create wagmi config
const wagmiConfig = createWagmiConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

// Create react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 30000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #374151',
              },
            }}
          />
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)