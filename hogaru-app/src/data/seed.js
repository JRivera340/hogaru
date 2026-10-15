// Datos de ejemplo — MVP local, zona única (Bogotá), solo aseo del hogar.

export const services = [
  { id: 'aseo-general', label: 'Aseo general' },
  { id: 'aseo-profundo', label: 'Aseo profundo' },
  { id: 'planchado', label: 'Planchado' },
  { id: 'post-obra', label: 'Aseo post obra' },
]

export const professionals = [
  {
    id: 'p1',
    userId: 'u-p1',
    pricing: { 'aseo-general': 45000, 'aseo-profundo': 70000, 'planchado': 38000 },
    portfolio: [
      { id: 'p1-w1', title: 'Apartamento después de mudanza', description: 'Aseo profundo de un apartamento de 90 m² con cocina y dos baños, entregado en una mañana.', image: 'https://picsum.photos/seed/portfolio-p1-a/640/420' },
      { id: 'p1-w2', title: 'Planchado de temporada', description: 'Cuarenta prendas entre camisas y vestidos, entregadas en perchas y organizadas por familia.', image: 'https://picsum.photos/seed/portfolio-p1-b/640/420' },
      { id: 'p1-w3', title: 'Cocina con grasa acumulada', description: 'Campana, estufa y gabinetes desengrasados sin dañar el acabado.', image: 'https://picsum.photos/seed/portfolio-p1-c/640/420' },
    ],
    createdAt: '2026-01-15T10:00:00-05:00',
    name: 'Marcela Ortiz',
    photo: 'https://i.pravatar.cc/300?img=47',
    verified: true,
    rating: 4.9,
    reviewCount: 38,
    zone: 'Chapinero, Bogotá',
    bio: 'Once años de experiencia en aseo residencial. Verificada por antecedentes y referencias de tres hogares.',
    services: ['aseo-general', 'aseo-profundo', 'planchado'],
    availability: {
      lun: ['08:00', '10:00', '14:00'],
      mie: ['08:00', '13:00'],
      vie: ['09:00', '11:00', '15:00'],
      sab: ['08:00', '10:00'],
    },
  },
  {
    id: 'p2',
    userId: 'u-p2',
    pricing: { 'aseo-profundo': 60000, 'post-obra': 95000 },
    portfolio: [
      { id: 'p2-w1', title: 'Casa tras remodelación', description: 'Retiro de polvo de cemento y estuco en tres habitaciones y sala, con insumos ecológicos.', image: 'https://picsum.photos/seed/portfolio-p2-a/640/420' },
      { id: 'p2-w2', title: 'Baños con cal acumulada', description: 'Juntas y vidrios recuperados con productos sin olor fuerte.', image: 'https://picsum.photos/seed/portfolio-p2-b/640/420' },
    ],
    createdAt: '2026-01-15T10:00:00-05:00',
    name: 'Diana Cárdenas',
    photo: 'https://i.pravatar.cc/300?img=32',
    verified: true,
    rating: 4.8,
    reviewCount: 52,
    zone: 'Usaquén, Bogotá',
    bio: 'Especialista en aseo profundo y post obra. Trae sus propios insumos ecológicos.',
    services: ['aseo-profundo', 'post-obra'],
    availability: {
      mar: ['08:00', '11:00'],
      jue: ['08:00', '10:00', '14:00'],
      sab: ['09:00'],
    },
  },
  {
    id: 'p3',
    userId: 'u-p3',
    pricing: { 'aseo-general': 40000, 'planchado': 35000 },
    portfolio: [
      { id: 'p3-w1', title: 'Aseo semanal en casa con mascotas', description: 'Rutina fija los sábados, manejo cuidadoso con dos perros y un gato.', image: 'https://picsum.photos/seed/portfolio-p3-a/640/420' },
      { id: 'p3-w2', title: 'Ropa delicada', description: 'Planchado de blusas de lino y seda con temperatura controlada.', image: 'https://picsum.photos/seed/portfolio-p3-b/640/420' },
      { id: 'p3-w3', title: 'Apartamento de estudiantes', description: 'Aseo general de un apartamento compartido de tres habitaciones.', image: 'https://picsum.photos/seed/portfolio-p3-c/640/420' },
    ],
    createdAt: '2026-01-15T10:00:00-05:00',
    name: 'Luz Elena Rojas',
    photo: 'https://i.pravatar.cc/300?img=45',
    verified: true,
    rating: 5.0,
    reviewCount: 21,
    zone: 'Suba, Bogotá',
    bio: 'Recomendada por su puntualidad y trato con mascotas en casa. Disponible fines de semana.',
    services: ['aseo-general', 'planchado'],
    availability: {
      lun: ['13:00', '15:00'],
      vie: ['08:00'],
      sab: ['08:00', '10:00', '13:00'],
      dom: ['09:00'],
    },
  },
  {
    id: 'p4',
    userId: 'u-p4',
    pricing: { 'aseo-general': 42000, 'aseo-profundo': 65000 },
    portfolio: [
      { id: 'p4-w1', title: 'Cocina y electrodomésticos', description: 'Nevera, horno y microondas por dentro y por fuera, sin rayones.', image: 'https://picsum.photos/seed/portfolio-p4-a/640/420' },
      { id: 'p4-w2', title: 'Baño principal', description: 'Remoción de moho en silicona y rejillas.', image: 'https://picsum.photos/seed/portfolio-p4-b/640/420' },
    ],
    createdAt: '2026-01-15T10:00:00-05:00',
    name: 'Yolima Pérez',
    photo: 'https://i.pravatar.cc/300?img=44',
    verified: true,
    rating: 4.7,
    reviewCount: 29,
    zone: 'Engativá, Bogotá',
    bio: 'Aseo general con enfoque en cocinas y baños. Buen manejo de electrodomésticos delicados.',
    services: ['aseo-general', 'aseo-profundo'],
    availability: {
      mie: ['09:00', '14:00'],
      jue: ['08:00'],
      sab: ['11:00'],
    },
  },
  {
    id: 'p5',
    userId: 'u-p5',
    pricing: { 'aseo-general': 48000, 'planchado': 40000, 'post-obra': 90000 },
    portfolio: [
      { id: 'p5-w1', title: 'Oficina pequeña en Chapinero', description: 'Aseo general quincenal de oficina de 60 m².', image: 'https://picsum.photos/seed/portfolio-p5-a/640/420' },
      { id: 'p5-w2', title: 'Apartamento recién entregado', description: 'Aseo post obra de constructora: ventanas, pisos y marcos.', image: 'https://picsum.photos/seed/portfolio-p5-b/640/420' },
      { id: 'p5-w3', title: 'Camisas de oficina', description: 'Planchado semanal para una familia de cuatro.', image: 'https://picsum.photos/seed/portfolio-p5-c/640/420' },
    ],
    createdAt: '2026-01-15T10:00:00-05:00',
    name: 'Carolina Beltrán',
    photo: 'https://i.pravatar.cc/300?img=48',
    verified: true,
    rating: 4.9,
    reviewCount: 44,
    zone: 'Chapinero, Bogotá',
    bio: 'Diez años trabajando con familias de la zona. Referencias verificables disponibles.',
    services: ['aseo-general', 'planchado', 'post-obra'],
    availability: {
      lun: ['09:00'],
      mar: ['08:00', '10:00'],
      jue: ['13:00'],
      vie: ['08:00', '10:00'],
    },
  },
  {
    id: 'p6',
    userId: 'u-p6',
    pricing: { 'aseo-general': 38000 },
    portfolio: [
      { id: 'p6-w1', title: 'Apartamento de una pareja', description: 'Aseo general con enfoque en pisos y cocina, cada dos semanas.', image: 'https://picsum.photos/seed/portfolio-p6-a/640/420' },
    ],
    createdAt: '2026-01-15T10:00:00-05:00',
    name: 'Sandra Milena Gómez',
    photo: 'https://i.pravatar.cc/300?img=41',
    verified: true,
    rating: 4.6,
    reviewCount: 17,
    zone: 'Usaquén, Bogotá',
    bio: 'Nueva en la plataforma, verificación completa. Tarifas competitivas mientras construye reputación.',
    services: ['aseo-general'],
    availability: {
      mie: ['08:00', '10:00'],
      vie: ['13:00'],
      sab: ['09:00', '11:00'],
    },
  },
  {
    id: 'p7',
    userId: 'u-p7',
    pricing: { 'planchado': 30000, 'aseo-general': 36000 },
    portfolio: [
      { id: 'p7-w1', title: 'Planchado para una familia de cinco', description: 'Ropa de la semana planchada y organizada por persona.', image: 'https://picsum.photos/seed/portfolio-p7-a/640/420' },
    ],
    createdAt: '2026-10-12T09:20:00-05:00',
    name: 'Rosa Elena Pardo',
    photo: 'https://i.pravatar.cc/300?img=49',
    verified: false,
    rating: 0,
    reviewCount: 0,
    zone: 'Kennedy, Bogotá',
    bio: 'Me dedico al planchado y al aseo general desde hace seis años. Estoy empezando en la plataforma.',
    services: ['planchado', 'aseo-general'],
    availability: {
      mar: ['09:00', '14:00'],
      jue: ['09:00'],
      sab: ['10:00'],
    },
  },
]

export const dayLabels = {
  lun: 'Lunes',
  mar: 'Martes',
  mie: 'Miércoles',
  jue: 'Jueves',
  vie: 'Viernes',
  sab: 'Sábado',
  dom: 'Domingo',
}


// Cuentas de ejemplo. Los clientes y las profesionales comparten la clave demo1234.
export const seedUsers = [
  { id: 'u1', role: 'cliente', name: 'Juan Camilo Restrepo', email: 'juanc.restrepo@example.com', password: 'demo1234', verified: true, suspended: false, createdAt: '2026-08-20T10:00:00-05:00' },
  { id: 'u2', role: 'cliente', name: 'Valentina Suárez', email: 'valentina.suarez@example.com', password: 'demo1234', verified: true, suspended: false, createdAt: '2026-09-02T09:30:00-05:00' },
  { id: 'u3', role: 'cliente', name: 'Andrés Felipe Mora', email: 'andres.mora@example.com', password: 'demo1234', verified: true, suspended: false, createdAt: '2026-09-18T16:45:00-05:00' },
  { id: 'u4', role: 'cliente', name: 'Paola Jiménez', email: 'paola.jimenez@example.com', password: 'demo1234', verified: true, suspended: false, createdAt: '2026-10-01T08:15:00-05:00' },
  { id: 'u-p1', role: 'profesional', professionalId: 'p1', name: 'Marcela Ortiz', email: 'marcela.ortiz@example.com', password: 'demo1234', verified: true, suspended: false, createdAt: '2026-01-15T10:00:00-05:00' },
  { id: 'u-p2', role: 'profesional', professionalId: 'p2', name: 'Diana Cárdenas', email: 'diana.cardenas@example.com', password: 'demo1234', verified: true, suspended: false, createdAt: '2026-01-15T10:00:00-05:00' },
  { id: 'u-p3', role: 'profesional', professionalId: 'p3', name: 'Luz Elena Rojas', email: 'luzelena.rojas@example.com', password: 'demo1234', verified: true, suspended: false, createdAt: '2026-01-15T10:00:00-05:00' },
  { id: 'u-p4', role: 'profesional', professionalId: 'p4', name: 'Yolima Pérez', email: 'yolima.perez@example.com', password: 'demo1234', verified: true, suspended: false, createdAt: '2026-01-15T10:00:00-05:00' },
  { id: 'u-p5', role: 'profesional', professionalId: 'p5', name: 'Carolina Beltrán', email: 'carolina.beltran@example.com', password: 'demo1234', verified: true, suspended: false, createdAt: '2026-01-15T10:00:00-05:00' },
  { id: 'u-p6', role: 'profesional', professionalId: 'p6', name: 'Sandra Milena Gómez', email: 'sandra.gomez@example.com', password: 'demo1234', verified: true, suspended: false, createdAt: '2026-01-15T10:00:00-05:00' },
  { id: 'u5', role: 'cliente', name: 'Camilo Herrera', email: 'camilo.herrera@example.com', password: 'demo1234', verified: false, suspended: false, createdAt: '2026-10-13T20:10:00-05:00' },
  { id: 'u6', role: 'cliente', name: 'Hernán Gutiérrez', email: 'hernan.gutierrez@example.com', password: 'demo1234', verified: true, suspended: true, createdAt: '2026-08-05T12:00:00-05:00' },
  { id: 'u-p7', role: 'profesional', professionalId: 'p7', name: 'Rosa Elena Pardo', email: 'rosa.pardo@example.com', password: 'demo1234', verified: false, suspended: false, createdAt: '2026-10-12T09:20:00-05:00' },
]

const ADDR_U1 = 'Calle 85 #12-34, Apto 501, Chapinero'

// Reservas de ejemplo: pasadas completadas, una cancelada y varias próximas confirmadas.
export const seedBookings = [
  { id: 'b1', professionalId: 'p1', userId: 'u1', userName: 'Juan Camilo Restrepo', service: 'aseo-general', day: 'vie', time: '09:00', date: '2026-10-02', address: ADDR_U1, status: 'completada', price: 45000, createdAt: '2026-09-28T14:20:00-05:00' },
  { id: 'b2', professionalId: 'p3', userId: 'u1', userName: 'Juan Camilo Restrepo', service: 'planchado', day: 'sab', time: '10:00', date: '2026-10-03', address: ADDR_U1, status: 'completada', price: 35000, createdAt: '2026-09-29T09:00:00-05:00' },
  { id: 'b3', professionalId: 'p2', userId: 'u2', userName: 'Valentina Suárez', service: 'aseo-profundo', day: 'jue', time: '08:00', date: '2026-10-22', address: 'Carrera 7 #116-20, Usaquén', status: 'confirmada', price: 60000, createdAt: '2026-10-11T11:10:00-05:00' },
  { id: 'b4', professionalId: 'p1', userId: 'u3', userName: 'Andrés Felipe Mora', service: 'aseo-profundo', day: 'lun', time: '08:00', date: '2026-10-12', address: 'Carrera 13 #63-40, Apto 302, Chapinero', status: 'completada', price: 70000, createdAt: '2026-10-07T19:05:00-05:00' },
  { id: 'b5', professionalId: 'p5', userId: 'u2', userName: 'Valentina Suárez', service: 'post-obra', day: 'mar', time: '10:00', date: '2026-10-13', address: 'Carrera 7 #116-20, Usaquén', status: 'completada', price: 90000, createdAt: '2026-10-08T10:40:00-05:00' },
  { id: 'b6', professionalId: 'p4', userId: 'u3', userName: 'Andrés Felipe Mora', service: 'aseo-general', day: 'mie', time: '09:00', date: '2026-10-21', address: 'Carrera 13 #63-40, Apto 302, Chapinero', status: 'confirmada', price: 42000, createdAt: '2026-10-13T21:30:00-05:00' },
  { id: 'b7', professionalId: 'p1', userId: 'u1', userName: 'Juan Camilo Restrepo', service: 'planchado', day: 'sab', time: '08:00', date: '2026-10-17', address: ADDR_U1, status: 'confirmada', price: 38000, createdAt: '2026-10-14T08:50:00-05:00' },
  { id: 'b8', professionalId: 'p6', userId: 'u4', userName: 'Paola Jiménez', service: 'aseo-general', day: 'sab', time: '09:00', date: '2026-10-10', address: 'Calle 127 #15-20, Usaquén', status: 'cancelada', price: 38000, createdAt: '2026-10-05T13:15:00-05:00' },
  { id: 'b9', professionalId: 'p3', userId: 'u4', userName: 'Paola Jiménez', service: 'aseo-general', day: 'lun', time: '13:00', date: '2026-10-19', address: 'Calle 127 #15-20, Usaquén', status: 'confirmada', price: 40000, createdAt: '2026-10-12T17:00:00-05:00' },
  { id: 'b10', professionalId: 'p2', userId: 'u3', userName: 'Andrés Felipe Mora', service: 'post-obra', day: 'sab', time: '09:00', date: '2026-10-10', address: 'Carrera 13 #63-40, Apto 302, Chapinero', status: 'completada', price: 95000, createdAt: '2026-10-03T12:00:00-05:00' },
]

export const seedReviews = [
  { id: 'r1', bookingId: 'b1', professionalId: 'p1', userId: 'u1', userName: 'Juan Camilo Restrepo', rating: 5, comment: 'Marcela llegó puntual y dejó el apartamento impecable. Muy recomendada.', createdAt: '2026-10-02T18:00:00-05:00' },
  { id: 'r2', bookingId: 'b2', professionalId: 'p3', userId: 'u1', userName: 'Juan Camilo Restrepo', rating: 5, comment: 'Excelente trato, cuidó mucho la ropa delicada.', createdAt: '2026-10-03T13:00:00-05:00' },
  { id: 'r3', bookingId: 'b4', professionalId: 'p1', userId: 'u3', userName: 'Andrés Felipe Mora', rating: 4, comment: 'Muy buen aseo profundo. Se demoró un poco más de lo acordado pero el resultado valió la pena.', createdAt: '2026-10-12T17:30:00-05:00' },
  { id: 'r4', bookingId: 'b5', professionalId: 'p5', userId: 'u2', userName: 'Valentina Suárez', rating: 5, comment: 'Dejó la casa lista para estrenar después de la obra. Cero polvo en los marcos.', createdAt: '2026-10-13T16:10:00-05:00' },
  { id: 'r5', bookingId: 'b10', professionalId: 'p2', userId: 'u3', userName: 'Andrés Felipe Mora', rating: 5, comment: 'Diana trae todo lo necesario y los productos no tienen olor fuerte. Repetiría.', createdAt: '2026-10-10T15:00:00-05:00' },
]
