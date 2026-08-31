import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import './styles/base.css'
import './styles/sections.css'
import './styles/gallery.css'
import './styles/process.css'
import './styles/reviews.css'
import './styles/contact.css'
import './styles/footer.css'
import './styles/float.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)