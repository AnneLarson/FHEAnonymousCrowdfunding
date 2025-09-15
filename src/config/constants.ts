// App Configuration
export const APP_CONFIG = {
  name: 'FHE Anonymous Crowdfunding',
  description: 'Privacy-first crowdfunding platform powered by FHE',
  version: '2.0.0',
  author: 'FHE Crowdfunding Team',
  repository: 'https://github.com/your-username/fhe-anonymous-crowdfunding',
}

// Network Configuration
export const SUPPORTED_CHAINS = {
  HARDHAT: 31337,
  SEPOLIA: 11155111,
  GOERLI: 5,
  FHEVM_DEVNET: 8009,
} as const

export const DEFAULT_CHAIN_ID = SUPPORTED_CHAINS.SEPOLIA

// Contract Configuration
export const CONTRACT_CONFIG = {
  name: 'FHEAnonymousCrowdfunding',
  // These will be populated by deployment script
  addresses: {
    [SUPPORTED_CHAINS.HARDHAT]: '',
    [SUPPORTED_CHAINS.SEPOLIA]: '',
    [SUPPORTED_CHAINS.GOERLI]: '',
    [SUPPORTED_CHAINS.FHEVM_DEVNET]: '',
  },
}

// API Endpoints
export const API_ENDPOINTS = {
  INFURA: 'https://sepolia.infura.io/v3/',
  ETHERSCAN: 'https://api-sepolia.etherscan.io/api',
  FHEVM_DEVNET: 'https://devnet.zama.ai',
  IPFS_GATEWAY: 'https://ipfs.io/ipfs/',
}

// Platform Configuration
export const PLATFORM_CONFIG = {
  FEE_PERCENTAGE: 1, // 1%
  MIN_CAMPAIGN_DURATION: 1, // 1 day
  MAX_CAMPAIGN_DURATION: 365, // 365 days
  MIN_DONATION_AMOUNT: '0.001', // ETH
  MAX_DONATION_AMOUNT: '1000', // ETH
  MIN_CAMPAIGN_GOAL: '0.01', // ETH
  MAX_CAMPAIGN_GOAL: '10000', // ETH
}

// UI Configuration
export const UI_CONFIG = {
  CAMPAIGNS_PER_PAGE: 12,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 2000,
  DEBOUNCE_DELAY: 300, // ms
  TOAST_DURATION: 4000, // ms
  ANIMATION_DURATION: 300, // ms
}

// Validation Patterns
export const VALIDATION = {
  ETH_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  ETH_AMOUNT: /^\d+(\.\d{1,18})?$/,
  TRANSACTION_HASH: /^0x[a-fA-F0-9]{64}$/,
  POSITIVE_NUMBER: /^[1-9]\d*$/,
  URL: /^https?:\/\/.+/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  INVALID_AMOUNT: 'Please enter a valid amount',
  INVALID_ADDRESS: 'Invalid Ethereum address',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  CONTRACT_ERROR: 'Smart contract error occurred',
  FHE_INIT_ERROR: 'Failed to initialize FHE encryption',
  CAMPAIGN_NOT_FOUND: 'Campaign not found',
  CAMPAIGN_ENDED: 'This campaign has ended',
  CAMPAIGN_INACTIVE: 'This campaign is not active',
  GOAL_NOT_REACHED: 'Campaign goal has not been reached',
  ALREADY_WITHDRAWN: 'Funds have already been withdrawn',
  NOT_CAMPAIGN_CREATOR: 'Only campaign creator can perform this action',
  FORM_VALIDATION_ERROR: 'Please fix the form errors before submitting',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  CAMPAIGN_CREATED: 'Campaign created successfully',
  DONATION_SENT: 'Donation sent successfully',
  FUNDS_WITHDRAWN: 'Funds withdrawn successfully',
  TRANSACTION_CONFIRMED: 'Transaction confirmed on blockchain',
}

// Loading Messages
export const LOADING_MESSAGES = {
  CONNECTING_WALLET: 'Connecting wallet...',
  INITIALIZING_FHE: 'Initializing FHE encryption...',
  LOADING_CAMPAIGNS: 'Loading campaigns...',
  CREATING_CAMPAIGN: 'Creating campaign...',
  PROCESSING_DONATION: 'Processing donation...',
  WITHDRAWING_FUNDS: 'Withdrawing funds...',
  CONFIRMING_TRANSACTION: 'Confirming transaction...',
}

// Storage Keys
export const STORAGE_KEYS = {
  THEME: 'fhe-crowdfunding-theme',
  WALLET_PREFERENCE: 'fhe-crowdfunding-wallet',
  USER_SETTINGS: 'fhe-crowdfunding-settings',
  CACHED_CAMPAIGNS: 'fhe-crowdfunding-campaigns',
  FHE_KEYS: 'fhe-crowdfunding-keys',
}

// Feature Flags
export const FEATURES = {
  ENABLE_FHE: true,
  ENABLE_ANALYTICS: false,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_IPFS: false,
  ENABLE_ENS: false,
}

// Social Links
export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/your-username/fhe-anonymous-crowdfunding',
  TWITTER: 'https://twitter.com/fhe-crowdfunding',
  DISCORD: 'https://discord.gg/fhe-crowdfunding',
  TELEGRAM: 'https://t.me/fhe-crowdfunding',
  DOCS: 'https://docs.fhe-crowdfunding.com',
}

// External Links
export const EXTERNAL_LINKS = {
  METAMASK: 'https://metamask.io',
  SEPOLIA_FAUCET: 'https://sepoliafaucet.com',
  ETHERSCAN_SEPOLIA: 'https://sepolia.etherscan.io',
  ZAMA_DOCS: 'https://docs.zama.ai',
  FHE_DOCS: 'https://docs.zama.ai/fhevm',
}

// Development Configuration
export const DEV_CONFIG = {
  ENABLE_LOGS: process.env.NODE_ENV === 'development',
  ENABLE_DEBUGGING: process.env.NODE_ENV === 'development',
  MOCK_WALLET: process.env.NODE_ENV === 'development',
  MOCK_CONTRACTS: process.env.NODE_ENV === 'development',
}

// Animation Variants for Framer Motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  staggerItem: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
}

export default {
  APP_CONFIG,
  SUPPORTED_CHAINS,
  CONTRACT_CONFIG,
  PLATFORM_CONFIG,
  UI_CONFIG,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
}