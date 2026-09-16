import { createContext, useContext, useState, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  cooking?: string
  notes?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([
    // Datos de ejemplo para ver el carrito poblado
    {
      id: '1',
      name: 'The Golden Truffle Burger',
      price: 42,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80',
      cooking: 'Término Medio (Punto)',
    },
    {
      id: '3',
      name: 'Tartar de Wagyu con Caviar',
      price: 58,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80',
    },
    {
      id: 'v1',
      name: 'Vino Tinto Reserva Selección',
      price: 75,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&q=80',
    },
  ])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, item]
    })
  }

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) { removeItem(id); return }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

// Hook para usar el carrito en cualquier componente
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}