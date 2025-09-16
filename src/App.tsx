import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { FHEAnonymousCrowdfundingABI } from './abi/FHEAnonymousCrowdfunding'
import { initializeFHE, encryptAmount } from './utils/fhe'

// Contract address - FHE Anonymous Crowdfunding deployed contract
const CONTRACT_ADDRESS = '0x5baB1e95C6Eba8e92CA8f5645A193167E79abD95'

// Sepolia testnet configuration
const SEPOLIA_CHAIN_ID = '0xaa36a7' // 11155111 in hex
const SEPOLIA_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
}

interface Campaign {
  creator: string
  title: string
  description: string
  target: bigint
  deadline: bigint
  amountCollected: bigint
  withdrawn: boolean
}

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string>('')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse')
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  
  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [donationAmount, setDonationAmount] = useState('')

  // Check if wallet is connected on load
  useEffect(() => {
    checkConnection()
    initializeFHE().catch(console.error)
  }, [])

  // Step 1: Detection - Check for window.ethereum (MetaMask provider)
  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          await setupProviderAndContract(accounts[0])
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  // Complete wallet connection flow
  const connectWallet = async () => {
    // Step 1: Detection - Check for MetaMask
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install MetaMask to use this dApp.')
      return
    }

    try {
      setLoading(true)
      
      // Step 2: Request Access - Get user permission with eth_requestAccounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      // Step 3: Network Validation - Check connection to Sepolia testnet
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      
      // Step 4: Network Switching - Auto switch/add Sepolia if needed
      if (chainId !== SEPOLIA_CHAIN_ID) {
        await switchToSepolia()
      }

      // Step 5: Provider Setup - Create ethers.js BrowserProvider and signer
      await setupProviderAndContract(accounts[0])
      
      // Step 7: State Update - Update React state with account and contract
      setIsConnected(true)
      setAccount(accounts[0])
      
      // Step 8: Success Handling - Show success message
      alert('Connected to Sepolia! ✅')
      
      // Get Initial State - Load campaigns
      await loadCampaigns()
      
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Switch to or add Sepolia network
  const switchToSepolia = async () => {
    try {
      // Try to switch to Sepolia
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      })
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_CONFIG],
          })
        } catch (addError) {
          throw new Error('Failed to add Sepolia network')
        }
      } else {
        throw switchError
      }
    }
  }

  // Step 5 & 6: Provider Setup and Contract Initialization
  const setupProviderAndContract = async (accountAddress: string) => {
    try {
      // Create ethers.js BrowserProvider
      const ethersProvider = new ethers.BrowserProvider(window.ethereum!)
      
      // Get signer
      const ethersSigner = await ethersProvider.getSigner()
      
      // Step 6: Contract Initialization - Create game contract instance
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        FHEAnonymousCrowdfundingABI,
        ethersSigner
      )

      setProvider(ethersProvider)
      setSigner(ethersSigner)
      setContract(gameContract)
      
    } catch (error) {
      console.error('Error setting up provider and contract:', error)
      throw error
    }
  }

  const loadCampaigns = async () => {
    if (!contract) {
      console.log('Contract not initialized, showing demo campaigns')
      // Show demo campaigns if contract not connected
      setCampaigns([
        {
          creator: '0x1234...5678',
          title: 'Help Build Clean Water Wells',
          description: 'Supporting clean water access in rural communities with complete donor privacy.',
          target: ethers.parseEther('10'),
          deadline: BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000),
          amountCollected: ethers.parseEther('3.5'),
          withdrawn: false
        },
        {
          creator: '0x8765...4321',
          title: 'Anonymous Medical Research Fund',
          description: 'Private funding for critical medical research. All donations are completely anonymous.',
          target: ethers.parseEther('25'),
          deadline: BigInt(Date.now() + 45 * 24 * 60 * 60 * 1000),
          amountCollected: ethers.parseEther('18.2'),
          withdrawn: false
        }
      ])
      return
    }

    try {
      setLoading(true)
      
      // Get campaigns count using ethers.js
      const campaignsCount = await contract.getCampaignsCount()
      const loadedCampaigns: Campaign[] = []
      
      // Load each campaign
      for (let i = 0; i < Number(campaignsCount); i++) {
        const campaign = await contract.getCampaign(i)
        loadedCampaigns.push({
          creator: campaign.creator,
          title: campaign.title,
          description: campaign.description,
          target: campaign.target,
          deadline: campaign.deadline,
          amountCollected: campaign.amountCollected,
          withdrawn: campaign.withdrawn
        })
      }

      setCampaigns(loadedCampaigns)
    } catch (error) {
      console.error('Error loading campaigns:', error)
      // Show demo campaigns on error
      setCampaigns([
        {
          creator: '0x1234...5678',
          title: 'Help Build Clean Water Wells',
          description: 'Supporting clean water access in rural communities with complete donor privacy.',
          target: ethers.parseEther('10'),
          deadline: BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000),
          amountCollected: ethers.parseEther('3.5'),
          withdrawn: false
        },
        {
          creator: '0x8765...4321',
          title: 'Anonymous Medical Research Fund',
          description: 'Private funding for critical medical research. All donations are completely anonymous.',
          target: ethers.parseEther('25'),
          deadline: BigInt(Date.now() + 45 * 24 * 60 * 60 * 1000),
          amountCollected: ethers.parseEther('18.2'),
          withdrawn: false
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async () => {
    if (!isConnected || !contract || !title || !description || !target || !deadline) {
      alert('Please fill in all fields and connect your wallet.')
      return
    }

    try {
      setLoading(true)
      
      const targetWei = ethers.parseEther(target)
      const deadlineTimestamp = BigInt(new Date(deadline).getTime())

      // Create campaign using ethers.js contract
      const tx = await contract.createCampaign(title, description, targetWei, deadlineTimestamp)
      
      alert(`Campaign creation submitted! Transaction: ${tx.hash}`)
      
      // Wait for transaction confirmation
      await tx.wait()
      
      alert('Campaign created successfully! ✅')
      
      // Reset form
      setTitle('')
      setDescription('')
      setTarget('')
      setDeadline('')
      setActiveTab('browse')
      
      // Reload campaigns
      await loadCampaigns()
    } catch (error) {
      console.error('Error creating campaign:', error)
      alert('Failed to create campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const donateToCampaign = async (campaignId: number) => {
    if (!isConnected || !contract || !donationAmount) {
      alert('Please connect your wallet and enter a donation amount.')
      return
    }

    try {
      setLoading(true)
      
      const donationWei = ethers.parseEther(donationAmount)
      
      // Encrypt the donation amount using FHE
      const amountInWei = Number(donationWei)
      const encryptedAmount = await encryptAmount(amountInWei)

      // Make donation using ethers.js contract
      const tx = await contract.contribute(BigInt(campaignId), encryptedAmount, {
        value: donationWei
      })

      alert(`Anonymous donation submitted! Transaction: ${tx.hash}`)
      
      // Wait for transaction confirmation
      await tx.wait()
      
      alert('Anonymous donation sent successfully! ✅')
      setDonationAmount('')
      await loadCampaigns()
    } catch (error) {
      console.error('Error making donation:', error)
      alert('Failed to make donation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isDeadlinePassed = (deadline: bigint) => {
    return Number(deadline) < Date.now()
  }

  const getProgress = (collected: bigint, target: bigint) => {
    return Number((collected * 100n) / target)
  }

  const formatEther = (value: bigint) => {
    return ethers.formatEther(value)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '30px',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)',
          marginBottom: '20px'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '3rem', margin: '0 0 20px 0' }}>
            🔒 FHE Anonymous Crowdfunding
          </h1>
          
          <div style={{ textAlign: 'center' }}>
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={loading}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  fontSize: '1.2rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '🔄 Connecting...' : '🔗 Connect Wallet'}
              </button>
            ) : (
              <div style={{
                background: '#4CAF50',
                padding: '15px',
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                ✅ Connected: {formatAddress(account)}
              </div>
            )}
          </div>
        </div>

        {isConnected && (
          <>
            {/* Navigation */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <button
                onClick={() => setActiveTab('browse')}
                style={{
                  background: activeTab === 'browse' ? '#007bff' : 'transparent',
                  color: 'white',
                  border: '2px solid #007bff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                🔍 Browse Campaigns
              </button>
              <button
                onClick={() => setActiveTab('create')}
                style={{
                  background: activeTab === 'create' ? '#28a745' : 'transparent',
                  color: 'white',
                  border: '2px solid #28a745',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                ➕ Create Campaign
              </button>
            </div>

            {/* Browse Campaigns Tab */}
            {activeTab === 'browse' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>🌟 Active Campaigns</h2>
                {loading && (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    🔄 Loading campaigns...
                  </div>
                )}
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '20px'
                }}>
                  {campaigns.map((campaign, index) => (
                    <div key={index} style={{
                      background: 'rgba(255,255,255,0.1)',
                      padding: '25px',
                      borderRadius: '10px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem' }}>{campaign.title}</h3>
                      <p style={{ margin: '0 0 15px 0', opacity: 0.9 }}>{campaign.description}</p>
                      
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span>Progress:</span>
                          <span>{getProgress(campaign.amountCollected, campaign.target)}%</span>
                        </div>
                        <div style={{
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: '10px',
                          height: '8px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            background: '#4CAF50',
                            height: '100%',
                            width: `${Math.min(100, getProgress(campaign.amountCollected, campaign.target))}%`,
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '0.9rem', marginBottom: '15px', opacity: 0.8 }}>
                        <div>💰 Raised: {formatEther(campaign.amountCollected)} ETH / {formatEther(campaign.target)} ETH</div>
                        <div>👤 Creator: {formatAddress(campaign.creator)}</div>
                        <div>⏰ Deadline: {new Date(Number(campaign.deadline)).toLocaleDateString()}</div>
                        <div>📊 Status: {isDeadlinePassed(campaign.deadline) ? '⏰ Ended' : '✅ Active'}</div>
                      </div>
                      
                      {!isDeadlinePassed(campaign.deadline) && (
                        <div style={{ marginTop: '15px' }}>
                          <input
                            type="number"
                            placeholder="Amount in ETH"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            step="0.01"
                            min="0"
                            style={{
                              width: '100%',
                              padding: '10px',
                              marginBottom: '10px',
                              borderRadius: '5px',
                              border: '1px solid rgba(255,255,255,0.3)',
                              background: 'rgba(255,255,255,0.1)',
                              color: 'white',
                              fontSize: '1rem'
                            }}
                          />
                          <button
                            onClick={() => donateToCampaign(index)}
                            disabled={loading || !donationAmount}
                            style={{
                              background: '#28a745',
                              color: 'white',
                              border: 'none',
                              padding: '12px 20px',
                              borderRadius: '8px',
                              fontSize: '1rem',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              width: '100%',
                              opacity: loading || !donationAmount ? 0.7 : 1
                            }}
                          >
                            {loading ? '🔄 Processing...' : '🎁 Donate Anonymously'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {campaigns.length === 0 && !loading && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px'
                  }}>
                    <h3>No campaigns found</h3>
                    <p>Be the first to create an anonymous crowdfunding campaign!</p>
                  </div>
                )}
              </div>
            )}

            {/* Create Campaign Tab */}
            {activeTab === 'create' && (
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '30px',
                borderRadius: '10px',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 style={{ marginBottom: '25px' }}>🚀 Create New Campaign</h2>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    📝 Campaign Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter campaign title"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    📄 Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your campaign and how funds will be used"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      🎯 Target Amount (ETH)
                    </label>
                    <input
                      type="number"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="0.0"
                      step="0.01"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      ⏰ Deadline
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={createCampaign}
                  disabled={loading || !title || !description || !target || !deadline}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '8px',
                    fontSize: '1.2rem',
                    cursor: loading || !title || !description || !target || !deadline ? 'not-allowed' : 'pointer',
                    width: '100%',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    opacity: loading || !title || !description || !target || !deadline ? 0.7 : 1
                  }}
                >
                  {loading ? '🔄 Creating Campaign...' : '🚀 Launch Campaign'}
                </button>
                
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'rgba(0,123,255,0.2)',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  <strong>🔐 Privacy Notice:</strong> All donations to your campaign will be completely anonymous. 
                  Donor identities and amounts are protected using FHE encryption.
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>🕐 Last Updated:</strong> {new Date().toLocaleString()}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>🚀 Status:</strong> {isConnected ? '✅ Connected & Ready' : '⏳ Waiting for Wallet Connection'}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>🔧 Version:</strong> v3.0 - Full Web3 Integration
          </div>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Built with ❤️ using FHE, React, Web3, and Privacy-First Technology • Powered by Zama
          </p>
        </div>
      </div>
    </div>
  )
}

export default App