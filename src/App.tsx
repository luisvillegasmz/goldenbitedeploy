import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider }   from './context/CartContext'
import { AuthProvider }   from './context/AuthContext'
import PrivateRoute       from './components/PrivateRoute'

// Layout cliente
import Navbar  from './components/Navbar'
import Footer  from './components/Footer'

// Páginas cliente
import Home              from './pages/Home'
import Menu              from './pages/Menu'
import ProductDetail     from './pages/ProductDetail'
import Login             from './pages/Login'
import Register          from './pages/Register'
import ForgotPassword    from './pages/ForgotPassword'
import Cart              from './pages/Cart'
import Checkout          from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderTracking     from './pages/OrderTracking'
import Locations         from './pages/Locations'
import Profile           from './pages/Profile'
import Reservas          from './pages/reservas'
import Contacto          from './pages/contacto'

// Dashboards por rol
import AdminDashboard    from './pages/admin/admindashboard'
import AdminUsers        from './pages/admin/adminusers'
import AdminMenu         from './pages/admin/adminmenu'
import AdminPromotions   from './pages/admin/adminpromotions'
import AdminAnalytics    from './pages/admin/adminanalytics'

import DuenoDashboard    from './pages/dueno/duenodashboard'
import AsesorDashboard   from './pages/asesor/asesordashboard'
import CajeroDashboard   from './pages/cajero/cajerodashboard'

// Página de error de acceso
import NoAutorizado      from './pages/noautorizado'

// ── Layout con Navbar + Footer ─────────────────────────────────────────────
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

            {/* ── Páginas públicas ── */}
            <Route path="/"             element={<ClientLayout><Home /></ClientLayout>} />
            <Route path="/menu"         element={<ClientLayout><Menu /></ClientLayout>} />
            <Route path="/menu/:id"     element={<ClientLayout><ProductDetail /></ClientLayout>} />
            <Route path="/login"        element={<ClientLayout><Login /></ClientLayout>} />
            <Route path="/registro"     element={<ClientLayout><Register /></ClientLayout>} />
            <Route path="/recuperar"    element={<ClientLayout><ForgotPassword /></ClientLayout>} />
            <Route path="/ubicaciones"  element={<ClientLayout><Locations /></ClientLayout>} />
            <Route path="/reservas"     element={<ClientLayout><Reservas /></ClientLayout>} />
            <Route path="/contacto"     element={<ClientLayout><Contacto /></ClientLayout>} />
            <Route path="/no-autorizado" element={<NoAutorizado />} />

            {/* ── Páginas de cliente autenticado ── */}
            <Route path="/carrito"      element={<ClientLayout><Cart /></ClientLayout>} />
            <Route path="/checkout"     element={<PrivateRoute><ClientLayout><Checkout /></ClientLayout></PrivateRoute>} />
            <Route path="/confirmacion" element={<PrivateRoute><ClientLayout><OrderConfirmation /></ClientLayout></PrivateRoute>} />
            <Route path="/seguimiento"  element={<PrivateRoute><ClientLayout><OrderTracking /></ClientLayout></PrivateRoute>} />
            <Route path="/perfil"       element={<PrivateRoute><ClientLayout><Profile /></ClientLayout></PrivateRoute>} />

            {/* ── Dashboard: Administrador ── */}
            <Route path="/admin"             element={<PrivateRoute roles={['administrador']}><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/usuarios"    element={<PrivateRoute roles={['administrador']}><AdminUsers /></PrivateRoute>} />
            <Route path="/admin/menu"        element={<PrivateRoute roles={['administrador']}><AdminMenu /></PrivateRoute>} />
            <Route path="/admin/promociones" element={<PrivateRoute roles={['administrador']}><AdminPromotions /></PrivateRoute>} />
            <Route path="/admin/analytics"   element={<PrivateRoute roles={['administrador']}><AdminAnalytics /></PrivateRoute>} />

            {/* ── Dashboard: Dueño ── */}
            <Route path="/dueno" element={<PrivateRoute roles={['dueño']}><DuenoDashboard /></PrivateRoute>} />

            {/* ── Dashboard: Asesor ── */}
            <Route path="/asesor" element={<PrivateRoute roles={['asesor']}><AsesorDashboard /></PrivateRoute>} />

            {/* ── Dashboard: Cajero ── */}
            <Route path="/cajero" element={<PrivateRoute roles={['cajero']}><CajeroDashboard /></PrivateRoute>} />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}