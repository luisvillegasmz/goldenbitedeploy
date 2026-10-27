# Golden Bite 🍴

Aplicación web de restaurante de alta cocina desarrollada como proyecto universitario. Permite a los clientes explorar el menú, realizar pedidos en línea y hacer seguimiento de sus órdenes, mientras el equipo interno gestiona el negocio desde paneles diferenciados por rol.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Estilos | CSS Modules (por componente) |
| Routing | React Router DOM v6 |
| Backend / DB | Firebase (Auth, Firestore, Storage) |
| Deploy | Vercel |

---

## Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PrivateRoute.tsx      # Guarda de rutas con control de roles
│   ├── adminlayout.tsx       # Layout con sidebar para el panel admin
│   └── dashboardlayout.tsx   # Layout genérico para dashboards de rol
│
├── context/             # Estado global con React Context
│   ├── AuthContext.tsx       # Sesión de usuario, perfil y rol
│   └── CartContext.tsx       # Carrito de compras
│
├── data/
│   └── dishes.ts             # Catálogo estático de platos (fallback)
│
├── firebase.ts          # Inicialización de Firebase (Auth, Firestore, Storage)
│
├── hooks/
│   └── usedishes.ts          # Hook: carga platos desde Firestore o fallback estático
│
├── pages/
│   ├── Home.tsx
│   ├── Menu.tsx
│   ├── ProductDetail.tsx     # Detalle de plato con extras, término y carrito
│   ├── Cart.tsx
│   ├── Checkout.tsx          # Flujo de pago (envío/recogida, propina, método de pago)
│   ├── OrderConfirmation.tsx
│   ├── OrderTracking.tsx
│   ├── Profile.tsx           # Historial de pedidos del cliente
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   ├── Locations.tsx
│   ├── reservas.tsx
│   ├── contacto.tsx
│   ├── noautorizado.tsx
│   │
│   ├── admin/               # Panel de administrador
│   │   ├── admindashboard.tsx
│   │   ├── adminmenu.tsx         # CRUD de platos
│   │   ├── adminusers.tsx        # Gestión de usuarios y roles
│   │   ├── adminpromotions.tsx   # Gestión de promociones
│   │   └── adminanalytics.tsx    # Métricas y reportes de ventas
│   │
│   ├── dueno/               # Panel del dueño
│   │   └── duenodashboard.tsx
│   │
│   ├── asesor/              # Panel del asesor de servicio
│   │   └── asesordashboard.tsx
│   │
│   └── cajero/              # Panel del cajero
│       └── cajerodashboard.tsx
│
├── types/
│   └── order.ts              # Tipos Order, OrderItem, OrderStatus + helpers
│
└── utils/
    └── format.ts             # Utilidades de formato (ej: formatCOP)
```

---

## Sistema de roles

El acceso a rutas y funcionalidades está controlado por el campo `role` del perfil del usuario en Firestore. Los roles disponibles son:

| Rol | Ruta de acceso | Descripción |
|---|---|---|
| `cliente` | `/` | Navegación pública, pedidos y perfil |
| `administrador` | `/admin` | CRUD completo: menú, usuarios, promociones y analytics |
| `dueño` | `/dueno` | Vista ejecutiva del negocio |
| `asesor` | `/asesor` | Gestión y atención de pedidos en sala |
| `cajero` | `/cajero` | Procesamiento de pagos y cierre de órdenes |

El componente `PrivateRoute` recibe un prop `roles` opcional. Si el usuario no tiene el rol requerido, es redirigido a `/no-autorizado`.

---

## Autenticación

- Login con **email y contraseña** (Firebase Auth)
- Login con **Google** (OAuth popup)
- Recuperación de contraseña por email
- Al primer inicio de sesión se crea automáticamente un documento en la colección `usuarios` de Firestore con rol `cliente` por defecto
- Los roles superiores se asignan manualmente desde el panel de administrador

---

## Flujo de pedido

1. El cliente agrega platos al carrito desde `/menu` o `/menu/:id`
2. En `/checkout` selecciona modalidad (envío a domicilio o recogida), método de pago y propina opcional
3. Al confirmar se guarda la orden en la colección `pedidos` de Firestore y se actualiza el carrito de puntos del usuario
4. El cliente puede ver el estado de su pedido en `/seguimiento` y su historial en `/perfil`

---

## Colecciones en Firestore

| Colección | Descripción |
|---|---|
| `usuarios` | Perfil de cada usuario: nombre, email, rol, puntos |
| `platos` | Catálogo del menú (si está vacío, se usa `data/dishes.ts`) |
| `pedidos` | Órdenes realizadas con items, totales, estado y método de pago |
| `promociones` | Descuentos y ofertas configuradas desde el panel admin |

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables. En Vercel deben configurarse en **Settings → Environment Variables**.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

> El prefijo `VITE_` es obligatorio para que Vite exponga las variables al cliente. Las Firebase API keys son públicas por diseño; la seguridad del proyecto se gestiona mediante las reglas de Firestore y Firebase Auth.

---

## Instalación y desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

---

## Deploy

El proyecto se despliega automáticamente en **Vercel** al hacer push a la rama `main`. El build ejecuta `tsc -b && vite build`.