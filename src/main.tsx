import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('🚀 FHE Anonymous Crowdfunding - Starting application...')

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('❌ Root element not found!')
  document.body.innerHTML = '<h1>Error: Root element not found</h1>'
} else {
  console.log('✅ Root element found, rendering React app...')
  try {
    const root = ReactDOM.createRoot(rootElement)
    root.render(<App />)
    console.log('✅ React app rendered successfully!')
  } catch (error) {
    console.error('❌ Error rendering React app:', error)
    rootElement.innerHTML = `<h1>Error: ${error.message}</h1>`
  }
}
