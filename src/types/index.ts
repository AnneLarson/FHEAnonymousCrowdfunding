// Note: BigNumber is not imported as we use native BigInt for ethers v6

// Campaign Types
export interface Campaign {
  id: string
  creator: string
  title: string
  description: string
  category: string
  deadline: number
  isActive: boolean
  fundsWithdrawn: boolean
  createdAt?: number
  updatedAt?: number
}

// FHE Encrypted Types
export interface EncryptedCampaignData {
  encGoal: string // Encrypted goal amount
  encRaised: string // Encrypted raised amount
  encGoalReached: string // Encrypted goal reached status
}

export interface EncryptedDonation {
  campaignId: string
  encAmount: string // Encrypted donation amount
  timestamp: number
  isAnonymous: boolean
}

// Frontend Display Types
export interface CampaignDisplay extends Campaign {
  goalAmount?: string // Decrypted for campaign creator only
  raisedAmount?: string // Decrypted for campaign creator only
  goalReached?: boolean // Decrypted for campaign creator only
  donationCount?: number
  daysLeft?: number
  progressPercentage?: number
  isOwner?: boolean
}

// Form Types
export interface CreateCampaignForm {
  title: string
  description: string
  category: string
  goalAmount: string
  durationDays: number
}

export interface DonateForm {
  amount: string
  isAnonymous: boolean
  message?: string
}

// Wallet Types
export interface WalletState {
  address?: string
  isConnected: boolean
  isConnecting: boolean
  chainId?: number
  balance?: string
}

// Contract Types
export interface ContractConfig {
  address: string
  abi: any[]
  network: string
  chainId: number
}

// Transaction Types
export interface TransactionState {
  hash?: string
  status: 'idle' | 'pending' | 'success' | 'error'
  error?: string
}

// FHE Types
export interface FHEState {
  isInitialized: boolean
  isInitializing: boolean
  error?: string
  clientKey?: any
  serverKey?: any
  networkPublicKey?: any
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Statistics Types
export interface PlatformStats {
  totalCampaigns: number
  totalDonations: string // Encrypted total
  activeCampaigns: number
  totalUsers: number
}

// Category Types
export type CampaignCategory = 
  | 'technology'
  | 'health'
  | 'education'
  | 'environment'
  | 'arts'
  | 'community'
  | 'emergency'
  | 'other'

export const CAMPAIGN_CATEGORIES: { value: CampaignCategory; label: string }[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'health', label: 'Health & Medical' },
  { value: 'education', label: 'Education' },
  { value: 'environment', label: 'Environment' },
  { value: 'arts', label: 'Arts & Culture' },
  { value: 'community', label: 'Community' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'other', label: 'Other' },
]

// Filter Types
export interface CampaignFilters {
  category?: CampaignCategory
  status?: 'active' | 'completed' | 'all'
  sortBy?: 'newest' | 'oldest' | 'deadline' | 'popular'
  searchTerm?: string
}

// Notification Types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  read: boolean
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Loading States
export interface LoadingStates {
  campaigns: boolean
  creating: boolean
  donating: boolean
  withdrawing: boolean
  connecting: boolean
}

// Pagination
export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

// Search
export interface SearchResult {
  campaigns: CampaignDisplay[]
  total: number
  query: string
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

// Blockchain event types
export interface CampaignCreatedEvent {
  campaignId: string
  creator: string
  title: string
  deadline: number
  blockNumber: number
  transactionHash: string
}

export interface DonationEvent {
  campaignId: string
  timestamp: number
  blockNumber: number
  transactionHash: string
  // Note: No donor info or amount to maintain privacy
}

export interface FundsWithdrawnEvent {
  campaignId: string
  creator: string
  blockNumber: number
  transactionHash: string
  // Note: No amount info to maintain privacy
}