import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from "@/components/theme-provider"


createRoot(document.getElementById('root')!).render(
      <BrowserRouter>
      <ThemeProvider defaultTheme='dark'>
        <App />
      </ThemeProvider>
    </BrowserRouter>
)
