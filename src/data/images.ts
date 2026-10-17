export type SiteImage = {
  src: string
  alt: string
  width: number
  height: number
}

const imagePath = (filename: string) => `${import.meta.env.BASE_URL}images/${filename}`

export const images = {
  logo: {
    src: imagePath('Elite%20autoestudio%20Logo%20v2.jpeg'),
    alt: 'Logo de Elite Car Wash',
    width: 640,
    height: 640,
  },
  hero: {
    src: imagePath('hero-car-natural.jpg'),
    alt: 'Trabajador lavando una SUV blanca con espuma en un car wash',
    width: 1774,
    height: 887,
  },
  services: {
    wash: {
      src: imagePath('service-wash-natural.jpg'),
      alt: 'Lavado manual con espuma de un vehículo',
      width: 1400,
      height: 933,
    },
    interior: {
      src: imagePath('service-interior-natural.jpg'),
      alt: 'Limpieza con aspiradora del interior de un vehículo',
      width: 1400,
      height: 933,
    },
    detailing: {
      src: imagePath('service-detailing-natural.jpg'),
      alt: 'Trabajador dando terminación a la pintura de un sedán',
      width: 1400,
      height: 933,
    },
    treatments: {
      src: imagePath('service-treatment-natural.jpg'),
      alt: 'Limpieza profesional del motor de un vehículo',
      width: 1400,
      height: 933,
    },
  },
  promotion: {
    src: imagePath('promotion-cubetazo-user-v2.jpg'),
    alt: 'Cubeta con cervezas Presidente Light para los Domingos de Cubetazo',
    width: 1200,
    height: 1200,
  },
  experience: {
    src: imagePath('experience-elite-natural.jpg'),
    alt: 'Vehículo atendido mientras una cliente espera en un ambiente cómodo',
    width: 1536,
    height: 1024,
  },
} satisfies Record<string, SiteImage | Record<string, SiteImage>>

// Sustituir estas imágenes por fotografías reales de Elite Car Wash cuando estén disponibles.
// Al conservar las mismas propiedades, ningún componente necesita ser modificado.
export const galleryImages: SiteImage[] = [
  images.services.wash,
  { src: imagePath('gallery-foam-natural.jpg'), alt: 'Espuma sobre una SUV durante el lavado', width: 1400, height: 933 },
  images.services.interior,
  { src: imagePath('gallery-wheel-natural.jpg'), alt: 'Lavado detallado de aro y neumático', width: 1024, height: 1536 },
  images.services.detailing,
  { src: imagePath('gallery-sedan-natural.jpg'), alt: 'Sedán azul limpio después del lavado', width: 1400, height: 933 },
  images.services.treatments,
  images.experience,
]
