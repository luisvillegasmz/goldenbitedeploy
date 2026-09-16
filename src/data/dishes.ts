// src/data/dishes.ts  ← Crea esta carpeta y archivo

export interface Dish {
  id: string
  name: string
  category: string
  price: number
  badges: string[]
  desc: string
  fullDesc: string
  options: string[]
  image: string
  images: string[]
  cookingOptions?: { id: string; label: string; sublabel: string }[]
  extras?: { id: string; label: string; desc: string; price: number }[]
  pairing?: { name: string; price: number; desc: string }
  allergens?: string[]
}

export const dishes: Dish[] = [
  {
    id: '1',
    name: 'The Golden Truffle Burger',
    category: 'Hamburguesas de Autor',
    price: 28.5,
    badges: ['Gourmet', 'Chef Pick'],
    desc: '220g de Black Angus certificado, láminas de trufa negra Perigord, queso Raclette suizo fundido...',
    fullDesc:
      'Medallón de 220g de lomo bajo Black Angus certificado, madurado 21 días en cámara propia. Fundido con queso Raclette del Valais traído semanalmente, confitura de chalotas al oporto y lluvia generosa de trufa negra Melanosporum fresca de temporada. Servido sobre pan brioche horneado a diario con mantequilla francesa AOP.',
    options: ['Poco Hecho', 'Al Punto', 'Hecho'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
      'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80',
      'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&q=80',
    ],
    cookingOptions: [
      { id: 'poco', label: 'Poco Hecho', sublabel: 'Sabor Intenso' },
      { id: 'punto', label: 'Al Punto', sublabel: 'Jugoso' },
      { id: 'hecho', label: 'Hecho', sublabel: 'Firme' },
    ],
    extras: [
      { id: 'trufa', label: 'Trufa Negra Melanosporum fresca', desc: 'Laminada al momento en mesa (+5 gramos)', price: 8 },
      { id: 'foie', label: 'Escalope de Foie Gras Poêlé', desc: 'Marcado al soplete con reducción de Pedro Ximénez', price: 6 },
      { id: 'raclette', label: 'Doble Fundido de Raclette Suizo', desc: 'Curación alpina de 6 meses', price: 4 },
    ],
    pairing: {
      name: 'Ribera del Duero Reserva 2018',
      price: 14,
      desc: 'Notas de roble tostado, ciruela negra madura y final balsámico de gran estructura mineral.',
    },
    allergens: ['Gluten', 'Lácteos', 'Huevo'],
  },
  {
    id: '2',
    name: 'Ribeye Añejo 45 Días',
    category: 'Cortes & Grill',
    price: 46,
    badges: ['Sin Gluten', 'Dry Aged'],
    desc: 'Corte de vaca vieja rubia gallega con 45 días de maduración en seco (Dry Aging). Asado al...',
    fullDesc:
      'Corte de vaca vieja rubia gallega con 45 días de maduración en seco en nuestra cámara de Dry Aging. Asado al josper de encina a temperatura extrema para sellar los jugos. Servido con sal Maldon y reducción de su propio jugo. Una experiencia carnívora sin igual.',
    options: ['Pimientos Padrón', 'Puré Robuchon'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=800&q=80',
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
    ],
    cookingOptions: [
      { id: 'poco', label: 'Poco Hecho', sublabel: 'Rojo Intenso' },
      { id: 'punto', label: 'Al Punto', sublabel: 'Rosado' },
      { id: 'hecho', label: 'Hecho', sublabel: 'Firme' },
    ],
    extras: [
      { id: 'foie', label: 'Escalope de Foie Gras', desc: 'Marcado al soplete sobre el corte', price: 9 },
      { id: 'sal', label: 'Sal del Himalaya Ahumada', desc: 'Cristales en pirámide para finalizar', price: 3 },
    ],
    pairing: {
      name: 'Priorat Gran Reserva 2016',
      price: 18,
      desc: 'Garnacha y Cariñena sobre pizarra. Potente, mineral y elegante con final eterno.',
    },
    allergens: ['Lácteos'],
  },
  {
    id: '3',
    name: 'Tartar de Wagyu con Caviar',
    category: 'Entrantes Exclusivos',
    price: 34,
    badges: ['A5 Imperial'],
    desc: 'Solomillo de Wagyu japonés cortado a cuchillo, emulsión de yema curada en ponzu, 10g de...',
    fullDesc:
      'Solomillo de Wagyu japonés A5 cortado a cuchillo en el momento, aderezado con emulsión de yema curada en ponzu, alcaparras de Pantelleria, chalota encurtida y mostaza Dijon antigua. Coronado con 10g de caviar Oscietra. Una preparación de máximo respeto al producto.',
    options: ['+ Caviar (+12€)', 'Receta Estándar'],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
      'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80',
    ],
    extras: [
      { id: 'caviar', label: 'Extra Caviar Oscietra +10g', desc: 'De crianza en agua dulce de temperatura controlada', price: 12 },
      { id: 'trufa', label: 'Ralladura de Trufa Blanca Alba', desc: 'De temporada, servida en mesa', price: 15 },
    ],
    pairing: {
      name: 'Champagne Blanc de Blancs Grand Cru',
      price: 22,
      desc: 'Brioche tostado, cítricos frescos y minerales. Sublime contraste con la grasa del Wagyu.',
    },
    allergens: ['Huevo', 'Mostaza', 'Pescado'],
  },
  {
    id: '4',
    name: 'Papas Rústicas al Parmesano & Trufa',
    category: 'Guarniciones Trufadas',
    price: 14.5,
    badges: ['Vegetariano', 'Sin Gluten'],
    desc: 'Papas agrias confitadas en grasa de pato y fritas a tres cocciones, lluvia de Parmigiano Reggiano...',
    fullDesc:
      'Papas agrias confitadas en grasa de pato y fritas a tres cocciones para lograr el exterior más crujiente posible con interior cremoso. Terminadas con lluvia de Parmigiano Reggiano DOP 24 meses, aceite de trufa negra y cebollino fresco. La guarnición perfecta.',
    options: ['Aioli Trufado', 'Brava Ahumada'],
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
    ],
    extras: [
      { id: 'doble', label: 'Ración Doble', desc: 'Para compartir entre 2-3 personas', price: 10 },
    ],
    allergens: ['Lácteos', 'Huevo'],
  },
  {
    id: '5',
    name: 'Pulpo Braseado al Carbón',
    category: 'Entrantes Exclusivos',
    price: 31,
    badges: ['Del Mar', 'Sin Gluten'],
    desc: 'Pata de pulpo de roca asada al carbón de marabú, causa limeña ahumada, emulsión de...',
    fullDesc:
      'Pata de pulpo de roca gallego, cocida a baja temperatura durante 3 horas y asada al carbón de marabú para lograr el exterior tostado y crujiente. Servido sobre causa limeña ahumada, emulsión de pimentón de la Vera y brotes de cilantro. Una fusión Atlántico-Pacífico inigualable.',
    options: ['Suave Clásico', 'Toque Intenso'],
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
      'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=800&q=80',
    ],
    extras: [
      { id: 'extra', label: 'Pata entera adicional', desc: 'Para los grandes amantes del pulpo', price: 14 },
    ],
    pairing: {
      name: 'Albariño Rías Baixas 2022',
      price: 10,
      desc: 'Cítrico, atlántico y salino. Complemento natural para los sabores del mar.',
    },
    allergens: ['Moluscos'],
  },
  {
    id: '6',
    name: 'Esfera de Cacao Dorado & Avellana',
    category: 'Postres & Vinos',
    price: 16,
    badges: ['Gourmet', 'Postre Signature'],
    desc: 'Cúpula de cacao Valrhona 72%, mousse de avellanas del Piamonte tostadas, corazón de...',
    fullDesc:
      'Cúpula de cacao Valrhona 72% rellena de mousse de avellanas del Piamonte tostadas al momento, corazón de pralinée crujiente y ganache de café etíope. Servida con helado de vainilla Bourbon y salsa de caramelo con flor de sal. Una obra maestra del chocolate.',
    options: ['Pedro Ximénez (+7€)', 'Sin Maridaje'],
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
      'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=800&q=80',
    ],
    extras: [
      { id: 'px', label: 'Copa de Pedro Ximénez', desc: 'Maridaje dulce recomendado por el sommelier', price: 7 },
      { id: 'helado', label: 'Bola extra de helado artesanal', desc: 'Vainilla Bourbon, Pistache o Frambuesa', price: 3 },
    ],
    allergens: ['Gluten', 'Lácteos', 'Frutos Secos', 'Huevo'],
  },
]