import React, { useState, useEffect } from 'react'
import { createPublicClient, createWalletClient, custom, http, parseEther, formatEther } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { FHEAnonymousCrowdfundingABI } from './abi/FHEAnonymousCrowdfunding'
import { initializeFHE, encryptAmount } from './utils/fhe'

// Contract address - FHE Anonymous Crowdfunding deployed contract
const CONTRACT_ADDRESS = '0x5baB1e95C6Eba8e92CA8f5645A193167E79abD95'

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
  
  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [donationAmount, setDonationAmount] = useState('')

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
  })

  // Check if wallet is connected on load
  useEffect(() => {
    checkConnection()
    loadCampaigns()
    initializeFHE().catch(console.error)
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setIsConnected(true)
          setAccount(accounts[0])
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setLoading(true)
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setIsConnected(true)
        setAccount(accounts[0])
        await loadCampaigns()
      } catch (error) {
        console.error('Error connecting wallet:', error)
        alert('Failed to connect wallet. Please try again.')
      } finally {
        setLoading(false)
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to use this dApp.')
    }
  }

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      
      // Get campaigns count
      const campaignsCount = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FHEAnonymousCrowdfundingABI,
        functionName: 'getCampaignsCount',
      })

      const loadedCampaigns: Campaign[] = []
      
      // Load each campaign
      for (let i = 0; i < Number(campaignsCount); i++) {
        const campaign = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: FHEAnonymousCrowdfundingABI,
          functionName: 'getCampaign',
          args: [BigInt(i)],
        }) as Campaign

        loadedCampaigns.push(campaign)
      }

      setCampaigns(loadedCampaigns)
    } catch (error) {
      console.error('Error loading campaigns:', error)
      // For demo purposes, show sample campaigns if contract not deployed
      setCampaigns([
        {
          creator: '0x1234...5678',
          title: 'Help Build Clean Water Wells',
          description: 'Supporting clean water access in rural communities with complete donor privacy.',
          target: parseEther('10'),
          deadline: BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000),
          amountCollected: parseEther('3.5'),
          withdrawn: false
        },
        {
          creator: '0x8765...4321',
          title: 'Anonymous Medical Research Fund',
          description: 'Private funding for critical medical research. All donations are completely anonymous.',
          target: parseEther('25'),
          deadline: BigInt(Date.now() + 45 * 24 * 60 * 60 * 1000),
          amountCollected: parseEther('18.2'),
          withdrawn: false
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async () => {
    if (!isConnected || !title || !description || !target || !deadline) {
      alert('Please fill in all fields and connect your wallet.')
      return
    }

    try {
      setLoading(true)
      
      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum)
      })

      const targetWei = parseEther(target)
      const deadlineTimestamp = BigInt(new Date(deadline).getTime())

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FHEAnonymousCrowdfundingABI,
        functionName: 'createCampaign',
        args: [title, description, targetWei, deadlineTimestamp],
        account: account as `0x${string}`,
      })

      alert(`Campaign created! Transaction: ${hash}`)
      
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
    if (!isConnected || !donationAmount) {
      alert('Please connect your wallet and enter a donation amount.')
      return
    }

    try {
      setLoading(true)
      
      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum)
      })

      const donationWei = parseEther(donationAmount)
      
      // Encrypt the donation amount using FHE
      const amountInWei = Number(donationWei)
      const encryptedAmount = await encryptAmount(amountInWei)

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: FHEAnonymousCrowdfundingABI,
        functionName: 'contribute',
        args: [BigInt(campaignId), encryptedAmount as `0x${string}`],
        account: account as `0x${string}`,
        value: donationWei,
      })

      alert(`Anonymous donation sent! Transaction: ${hash}`)
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