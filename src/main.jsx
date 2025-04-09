import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import {HeroUIProvider} from '@heroui/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </React.StrictMode>,
)