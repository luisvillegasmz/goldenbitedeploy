export type OrderStatus =
  | 'pendiente'
  | 'en_preparacion'
  | 'listo'
  | 'entregado'
  | 'cancelado'

export interface OrderItem {
  id:       string
  name:     string
  price:    number
  quantity: number
  image:    string
  cooking:  string | null
}

export interface Order {
  id:               string
  userId:           string
  userEmail:        string
  code:             string
  items:            OrderItem[]
  subtotal:         number
  shipping:         number
  tip:              number
  discount:         number
  total:            number
  delivery:         'envio' | 'recogida'
  paymentMethod:    'tarjeta' | 'digital' | 'efectivo'
  address:          { street: string; city: string; notes: string } | null
  invoiceRequested: boolean
  status:           OrderStatus
  createdAt:        any   // Firestore Timestamp
  asesorId?:        string
  cajeroId?:        string
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pendiente:      'Pendiente',
  en_preparacion: 'En preparación',
  listo:          'Listo',
  entregado:      'Entregado',
  cancelado:      'Cancelado',
}

export const STATUS_COLOR: Record<OrderStatus, string> = {
  pendiente:      '#f59e0b',
  en_preparacion: '#3b82f6',
  listo:          '#10b981',
  entregado:      '#6b7280',
  cancelado:      '#ef4444',
}

export function timeAgo(timestamp: any): string {
  if (!timestamp?.toDate) return 'hace un momento'
  const diff = Date.now() - timestamp.toDate().getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'hace un momento'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `hace ${hrs} h`
  return `hace ${Math.floor(hrs / 24)} días`
}