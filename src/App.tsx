import { Routes, Route } from 'react-router'
import LandingPage from './components/LandingPage'
import ProductsPage from './components/ProductsPage'


function App() {
  return (
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/products' element={<ProductsPage />} />
      </Routes>
  )
}

export default App
