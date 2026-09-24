import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppContent } from './App'
import { AppStateProvider } from './context/AppStateContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  </React.StrictMode>,
)
