import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'

import { FHEProvider } from '@/hooks/useFHE'
import { ContractProvider } from '@/hooks/useContract'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Pages
import HomePage from '@/pages/HomePage'
import ExplorePage from '@/pages/ExplorePage'
import CreatePage from '@/pages/CreatePage'
import CampaignPage from '@/pages/CampaignPage'
import DashboardPage from '@/pages/DashboardPage'
import AboutPage from '@/pages/AboutPage'

function App() {
  return (
    <FHEProvider>
      <ContractProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <Navbar />
            
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/campaign/:id" element={<CampaignPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </motion.main>
            
            <Footer />
          </div>
        </Router>
      </ContractProvider>
    </FHEProvider>
  )
}

export default App