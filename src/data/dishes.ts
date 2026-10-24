export interface Dish {
  id:              string
  name:            string
  category:        string
  price:           number
  badges:          string[]
  desc:            string
  fullDesc:        string
  options:         string[]
  image:           string
  images:          string[]
  cookingOptions?: { id: string; label: string; sublabel: string }[]
  extras?:         { id: string; label: string; desc: string; price: number }[]
  allergens?:      string[]
}

export const categories = [
  'Todos',
  'Entradas',
  'Sopas y Caldos',
  'Parrilla',
  'Platos Principales',
  'Postres',
  'Bebidas',
]

// Términos de cocción para carnes
const terminosCarne = [
  { id: 'poco',  label: 'Poco cocido',   sublabel: '(3/4)' },
  { id: 'medio', label: 'Término medio', sublabel: '(Punto)' },
  { id: 'bien',  label: 'Bien cocido',   sublabel: '(3/4+)' },
]

export const dishes: Dish[] = [
  // ── ENTRADAS ─────────────────────────────────────────────────────────────
  {
    id: 'e1',
    name: 'Patacones con Hogao',
    category: 'Entradas',
    price: 14000,
    badges: ['Vegetariano', 'Popular'],
    desc: 'Patacones de plátano verde crujientes con hogao casero de tomate y cebolla larga.',
    fullDesc:
      'Plátano verde de la región, aplastado y frito hasta quedar crujiente por fuera y suave por dentro. Acompañado de hogao casero preparado con tomate chonto, cebolla larga y cilantro fresco.',
    options: [],
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80'],
    extras: [
      { id: 'queso', label: 'Queso costeño', desc: 'Queso costeño rallado por encima', price: 2500 },
      { id: 'aji',   label: 'Ají casero',    desc: 'Ají picante preparado en casa',    price: 1000 },
    ],
    allergens: ['Lácteos'],
  },
  {
    id: 'e2',
    name: 'Empanadas (x3)',
    category: 'Entradas',
    price: 12000,
    badges: ['Popular'],
    desc: 'Tres empanadas fritas de pipián, carne o mixtas. Con ají de maní casero.',
    fullDesc:
      'Empanadas de masa de maíz rellenas a tu elección: pipián (papa con cebolla y ají), carne molida con papa, o mixtas. Fritas al momento hasta quedar doradas y crujientes. Acompañadas de ají de maní casero.',
    options: ['Pipián', 'Carne', 'Mixtas'],
    image: 'https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=800&q=80'],
    allergens: ['Gluten', 'Maní'],
  },

  // ── SOPAS Y CALDOS ────────────────────────────────────────────────────────
  {
    id: 's1',
    name: 'Ajiaco Santafereño',
    category: 'Sopas y Caldos',
    price: 28000,
    badges: ['Tradicional'],
    desc: 'Sopa de pollo con tres tipos de papa, guascas y mazorca. Servida con crema y alcaparras.',
    fullDesc:
      'Preparado con pollo de campo, papa pastusa, papa criolla y papa sabanera, aromatizado con guascas frescas. Servido con mazorca tierna, crema de leche y alcaparras al lado.',
    options: [],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'],
    extras: [
      { id: 'presa', label: 'Presa extra de pollo', desc: 'Una presa adicional de pollo de campo', price: 6000 },
      { id: 'crema', label: 'Crema de leche extra',  desc: 'Porción adicional de crema de leche',  price: 1500 },
    ],
    allergens: ['Lácteos'],
  },
  {
    id: 's2',
    name: 'Sancocho de Gallina',
    category: 'Sopas y Caldos',
    price: 30000,
    badges: ['Tradicional', 'Para compartir'],
    desc: 'Gallina criolla cocinada a fuego lento con yuca, papa, mazorca y plátano verde.',
    fullDesc:
      'Gallina criolla cocinada por más de dos horas a fuego lento con yuca, papa pastusa, mazorca tierna y plátano verde. Servido con arroz blanco, aguacate y ají casero.',
    options: [],
    image: 'https://images.unsplash.com/photo-1509474722893-c3cf4b2ab4c8?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1509474722893-c3cf4b2ab4c8?w=800&q=80'],
    extras: [
      { id: 'presa2',   label: 'Presa adicional', desc: 'Una presa más de gallina criolla', price: 7000 },
      { id: 'aguacate', label: 'Aguacate',          desc: 'Media unidad de aguacate fresco',  price: 3000 },
    ],
    allergens: [],
  },

  // ── PARRILLA ──────────────────────────────────────────────────────────────
  {
    id: 'p1',
    name: 'Chuleta de Cerdo a la Parrilla',
    category: 'Parrilla',
    price: 38000,
    badges: ['Parrilla'],
    desc: 'Chuleta de cerdo marinada en ajo y hierbas. Asada al carbón con papa criolla y ensalada.',
    fullDesc:
      'Chuleta de cerdo de 350g marinada en ajo, tomillo, romero y limón. Asada lentamente al carbón hasta lograr una costra dorada. Acompañada de papa criolla salteada y ensalada fresca.',
    options: ['Poco cocida', 'Término medio', 'Bien cocida'],
    image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80'],
    cookingOptions: terminosCarne,
    extras: [
      { id: 'papa',        label: 'Papa criolla extra', desc: 'Porción adicional de papa criolla', price: 4000 },
      { id: 'chimichurri', label: 'Chimichurri casero', desc: 'Salsa chimichurri hecha en casa',    price: 2000 },
    ],
    allergens: ['Lácteos'],
  },
  {
    id: 'p2',
    name: 'Pollo Asado al Carbón',
    category: 'Parrilla',
    price: 32000,
    badges: ['Popular'],
    desc: 'Medio pollo asado al carbón, dorado por fuera y jugoso por dentro. Con papas y ensalada.',
    fullDesc:
      'Medio pollo de 600g marinado en chimichurri y especias criollas, asado lentamente al carbón. Servido con papas fritas artesanales y ensalada mixta de la casa.',
    options: [],
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c8?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1598103442097-8b74394b95c8?w=800&q=80'],
    extras: [
      { id: 'papas',  label: 'Papas fritas extra',  desc: 'Una porción adicional de papas', price: 4000 },
      { id: 'salsas', label: 'Salsas adicionales',   desc: 'Ají, chimichurri o BBQ',         price: 1500 },
    ],
    allergens: [],
  },
  {
    id: 'p3',
    name: 'Costillas BBQ',
    category: 'Parrilla',
    price: 48000,
    badges: ['Parrilla', 'Para compartir'],
    desc: 'Costillas de cerdo bañadas en salsa BBQ casera a base de panela. Tiernas y caramelizadas.',
    fullDesc:
      'Medio rack de costillas marinadas 12 horas en salsa BBQ casera de panela, ají y especias. Asadas lentamente a la parrilla. Con papas fritas y coleslaw de la casa.',
    options: ['Suaves', 'Con mordida'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'],
    cookingOptions: [
      { id: 'suave', label: 'Suaves',      sublabel: 'Se desprenden solas' },
      { id: 'firme', label: 'Con mordida', sublabel: 'Más caramelizadas'   },
    ],
    extras: [
      { id: 'salsa', label: 'Salsa BBQ extra',    desc: 'Porción extra de salsa BBQ casera', price: 2000 },
      { id: 'papas', label: 'Papas fritas extra', desc: 'Una porción adicional de papas',     price: 4000 },
    ],
    allergens: ['Gluten'],
  },
  {
    id: 'p4',
    name: 'Lomo de Res a la Plancha',
    category: 'Parrilla',
    price: 52000,
    badges: ['Recomendado'],
    desc: 'Lomo de res de 300g sellado en plancha con salsa criolla, papas al vapor y ensalada.',
    fullDesc:
      'Lomo de res de 300g sellado en plancha de hierro a alta temperatura. Bañado con salsa criolla de tomate chonto, cebolla larga y ají dulce. Con papas al vapor y ensalada fresca.',
    options: ['Poco cocido', 'Término medio', 'Bien cocido'],
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80'],
    cookingOptions: terminosCarne,
    extras: [
      { id: 'salsa',    label: 'Salsa criolla extra',  desc: 'Porción extra de salsa criolla', price: 2000 },
      { id: 'aguacate', label: 'Aguacate',              desc: 'Media unidad de aguacate fresco', price: 3000 },
    ],
    allergens: [],
  },

  // ── PLATOS PRINCIPALES ────────────────────────────────────────────────────
  {
    id: 'm1',
    name: 'Bandeja Paisa',
    category: 'Platos Principales',
    price: 42000,
    badges: ['Típico', 'Recomendado'],
    desc: 'El plato insignia: frijoles, arroz, chicharrón, carne molida, chorizo, huevo, aguacate y arepa.',
    fullDesc:
      'La auténtica Bandeja Paisa con frijoles cargamanto rojos cocinados al natural, arroz blanco, chicharrón crujiente, carne molida sazonada, chorizo antioqueño, huevo frito, aguacate fresco y arepa blanca.',
    options: [],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80'],
    extras: [
      { id: 'chicharron', label: 'Chicharrón extra',   desc: 'Porción adicional de chicharrón',  price: 5000 },
      { id: 'aguacate',   label: 'Aguacate adicional', desc: 'Media unidad de aguacate fresco',  price: 3000 },
      { id: 'arepa',      label: 'Arepa extra',         desc: 'Arepa blanca o de chócolo',        price: 2000 },
    ],
    allergens: ['Gluten', 'Huevo'],
  },
  {
    id: 'm2',
    name: 'Trucha al Horno',
    category: 'Platos Principales',
    price: 38000,
    badges: ['Del Río'],
    desc: 'Trucha arcoíris al horno con mantequilla de hierbas y ajo. Con arroz y patacones.',
    fullDesc:
      'Trucha arcoíris de 400g al horno en mantequilla de hierbas con ajo, perejil y limón. Servida con arroz blanco y patacones tostados bañados en hogao tradicional.',
    options: [],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80'],
    extras: [
      { id: 'patacon',  label: 'Patacones extra', desc: 'Dos patacones con hogao',       price: 3500 },
      { id: 'aguacate', label: 'Aguacate',          desc: 'Media unidad de aguacate fresco', price: 3000 },
    ],
    allergens: ['Pescado', 'Lácteos'],
  },

  // ── POSTRES ───────────────────────────────────────────────────────────────
  {
    id: 'd1',
    name: 'Arroz con Leche',
    category: 'Postres',
    price: 9000,
    badges: ['Casero'],
    desc: 'Arroz con leche cremoso con canela en rama y panela. La receta de siempre.',
    fullDesc:
      'Preparado con leche entera, canela en rama, cáscara de limón y endulzado con panela. Cocinado a fuego lento hasta lograr una textura cremosa. Servido tibio o frío.',
    options: ['Tibio', 'Frío'],
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80'],
    allergens: ['Lácteos'],
  },
  {
    id: 'd2',
    name: 'Torta de Tres Leches',
    category: 'Postres',
    price: 11000,
    badges: ['Popular'],
    desc: 'Bizcocho húmedo bañado en tres tipos de leche. Cubierto con crema chantillí.',
    fullDesc:
      'Bizcocho esponjoso bañado en leche entera, leche condensada y leche evaporada. Cubierto con crema chantillí y decorado con canela en polvo.',
    options: [],
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80'],
    allergens: ['Lácteos', 'Gluten', 'Huevo'],
  },

  // ── BEBIDAS ───────────────────────────────────────────────────────────────
  {
    id: 'b1',
    name: 'Limonada de Coco',
    category: 'Bebidas',
    price: 9000,
    badges: ['Refrescante'],
    desc: 'Limonada de coco cremosa preparada al momento con limón Tahití y hielo.',
    fullDesc:
      'Preparada al momento con limón Tahití, leche de coco y hielo. Cremosa y refrescante, perfecta para acompañar cualquier plato.',
    options: ['Con azúcar', 'Sin azúcar'],
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80'],
    allergens: ['Lácteos'],
  },
  {
    id: 'b2',
    name: 'Jugo Natural',
    category: 'Bebidas',
    price: 7000,
    badges: ['Natural'],
    desc: 'Jugo de fruta de temporada preparado al momento. En agua o en leche.',
    fullDesc:
      'Frutas de temporada: maracuyá, mango, guanábana, lulo, mora, fresa o naranja. En agua fría o en leche entera.',
    options: ['Maracuyá', 'Mango', 'Lulo', 'Mora', 'Fresa', 'Naranja'],
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80'],
    allergens: [],
  },
]