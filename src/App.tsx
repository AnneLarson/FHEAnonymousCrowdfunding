import React from 'react'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '3rem' }}>
          🔒 FHE Anonymous Crowdfunding
        </h1>
        
        <div style={{
          background: '#4CAF50',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '1.2rem'
        }}>
          ✅ NEW VERSION DEPLOYED! - FHE Anonymous Crowdfunding Platform
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.15)',
          padding: '25px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          <h2>🚀 Ready to Launch Your Anonymous Campaign!</h2>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '15px' }}>
            <p>🎯 <strong>Create Privacy-Protected Campaigns:</strong> Launch funding campaigns with complete anonymity</p>
            <p>💰 <strong>Accept Anonymous Donations:</strong> Receive contributions without revealing donor identities</p>
            <p>🔐 <strong>FHE Encryption:</strong> All donation amounts are fully encrypted using advanced cryptography</p>
            <p>🌐 <strong>Decentralized Platform:</strong> No central authority controls your funds or data</p>
          </div>
        </div>

        <div style={{
          background: 'rgba(0,123,255,0.2)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h2>🔗 Connect Your Wallet to Get Started</h2>
          <p>Connect your Web3 wallet to access the full anonymous crowdfunding experience</p>
          <button
            onClick={() => {
              alert('🎉 Wallet Connection Demo!\n\n✅ In the full version, this will:\n\n🔐 Connect to MetaMask or other Web3 wallets\n💰 Enable campaign creation with FHE privacy\n🔍 Browse and support active campaigns anonymously\n📊 Track your private donation history\n🛡️ All transactions encrypted for maximum privacy\n\n🚀 Next: Smart contract integration!')
            }}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              marginTop: '15px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            🔗 Connect Wallet (Demo)
          </button>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2>🌟 Platform Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginTop: '15px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '5px' }}>
              <h3>🔐 Complete Privacy</h3>
              <p>FHE encryption ensures donation amounts remain completely private</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '5px' }}>
              <h3>💰 Anonymous Funding</h3>
              <p>Support causes without revealing your identity or contribution amount</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '5px' }}>
              <h3>🌐 Decentralized</h3>
              <p>Built on blockchain technology with no central authority</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '5px' }}>
              <h3>🛡️ Secure</h3>
              <p>Smart contracts ensure transparent and automated fund management</p>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          <strong>🕐 Last Updated:</strong> {new Date().toLocaleString()}<br/>
          <strong>🚀 Status:</strong> Live and Ready<br/>
          <strong>🔧 Version:</strong> v2.1 - Enhanced Demo
        </div>

        <footer style={{ textAlign: 'center', marginTop: '30px', opacity: '0.8' }}>
          <p>Built with ❤️ using FHE, React, and Web3 • Powered by Zama</p>
        </footer>
      </div>
    </div>
  )
}

export default App
