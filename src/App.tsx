import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

// Componentes compartidos
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'   // ← ya existía, solo hay que usarlo

// Páginas cliente
import Home from './pages/Home'
import Menu from './pages/Menu'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderTracking from './pages/OrderTracking'
import Locations from './pages/Locations'
import Profile from './pages/Profile'
import Reservas from './pages/reservas'   // ← crear (instrucciones abajo)
import Contacto from './pages/contacto'   // ← crear (instrucciones abajo)

// Páginas admin
import AdminDashboard from './pages/admin/admindashboard'
import AdminUsers from './pages/admin/adminusers'
import AdminMenu from './pages/admin/adminmenu'
import AdminPromotions from './pages/admin/adminpromotions'
import AdminAnalytics from './pages/admin/adminanalytics'

function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Páginas cliente ── */}
            <Route path="/"           element={<ClientLayout><Home /></ClientLayout>} />
            <Route path="/menu"       element={<ClientLayout><Menu /></ClientLayout>} />
            <Route path="/menu/:id"   element={<ClientLayout><ProductDetail /></ClientLayout>} />
            <Route path="/login"      element={<ClientLayout><Login /></ClientLayout>} />
            <Route path="/registro"   element={<ClientLayout><Register /></ClientLayout>} />
            <Route path="/recuperar"  element={<ClientLayout><ForgotPassword /></ClientLayout>} />
            <Route path="/carrito"    element={<ClientLayout><Cart /></ClientLayout>} />
            <Route path="/checkout"   element={<ClientLayout><Checkout /></ClientLayout>} />
            <Route path="/confirmacion" element={<ClientLayout><OrderConfirmation /></ClientLayout>} />
            <Route path="/seguimiento"  element={<ClientLayout><OrderTracking /></ClientLayout>} />
            <Route path="/ubicaciones"  element={<ClientLayout><Locations /></ClientLayout>} />
            <Route path="/reservas"     element={<ClientLayout><Reservas /></ClientLayout>} />
            <Route path="/contacto"     element={<ClientLayout><Contacto /></ClientLayout>} />
            <Route path="/perfil"       element={<ClientLayout><Profile /></ClientLayout>} />

            {/* ── Admin — todas protegidas con PrivateRoute ── */}
            <Route path="/admin"              element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/usuarios"     element={<PrivateRoute><AdminUsers /></PrivateRoute>} />
            <Route path="/admin/menu"         element={<PrivateRoute><AdminMenu /></PrivateRoute>} />
            <Route path="/admin/promociones"  element={<PrivateRoute><AdminPromotions /></PrivateRoute>} />
            <Route path="/admin/analytics"    element={<PrivateRoute><AdminAnalytics /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}