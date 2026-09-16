// REEMPLAZA tu archivo: src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider }  from './context/CartContext'
import { AuthProvider }  from './context/AuthContext'
import PrivateRoute      from './components/PrivateRoute'
import Navbar            from './components/Navbar'
import Footer            from './components/Footer'

import Home              from './pages/Home'
import Menu              from './pages/Menu'
import ProductDetail     from './pages/ProductDetail'
import Login             from './pages/Login'
import Register          from './pages/Register'
import ForgotPassword    from './pages/ForgotPassword'
import Cart              from './pages/Cart'
import Checkout          from './pages/Checkout'       // <- reemplaza el contenido de este archivo
import OrderConfirmation from './pages/OrderConfirmation'
import OrderTracking     from './pages/OrderTracking'
import Locations         from './pages/Locations'
import Profile           from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/menu"         element={<Menu />} />
            <Route path="/menu/:id"     element={<ProductDetail />} />
            <Route path="/login"        element={<Login />} />
            <Route path="/registro"     element={<Register />} />
            <Route path="/recuperar"    element={<ForgotPassword />} />
            <Route path="/carrito"      element={<Cart />} />
            <Route path="/ubicaciones"  element={<Locations />} />

            {/* Rutas protegidas — requieren sesión */}
            <Route path="/checkout"     element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/confirmacion" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
            <Route path="/seguimiento"  element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
            <Route path="/perfil"       element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App