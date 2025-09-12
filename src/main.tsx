import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ReactQueryProvider } from './lib/react-query'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </StrictMode>,
)
