// Reusar en cualquier componente que muestre precios
export const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style:                 'currency',
    currency:              'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)