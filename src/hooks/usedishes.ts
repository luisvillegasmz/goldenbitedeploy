import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { dishes as staticDishes } from '../data/dishes'
import type { Dish } from '../data/dishes'

// Intenta leer desde Firestore. Si está vacío, usa dishes.ts como fallback.
export function useDishes() {
  const [dishes, setDishes]   = useState<Dish[]>(staticDishes)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, 'platos'))
        if (!snap.empty) {
          const list = snap.docs
            .map(d => {
              const data = d.data()
              return {
                ...data,
                id:     d.id,
                image:  data.image  ?? '',
                images: data.image  ? [data.image] : [],
                options: Array.isArray(data.options)
                  ? data.options
                  : (data.options ?? '').split(',').map((s: string) => s.trim()).filter(Boolean),
                badges:   data.badges   ?? [],
                allergens:data.allergens ?? [],
                cookingOptions: data.cookingOptions ?? undefined,
                extras:         data.extras ?? undefined,
              } as Dish
            })
            .filter(d => d.active !== false)
            .sort((a, b) => a.category.localeCompare(b.category))
          setDishes(list)
        }
        // Si snap está vacío → keepea staticDishes
      } catch {
        // En error → keepea staticDishes
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { dishes, loading }
}