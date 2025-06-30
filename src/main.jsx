import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import FollowPage from './components/FollowPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <FollowPage/>
  </StrictMode>,
)
