export const site = {
  name: 'Elite Auto Estudio',
  phone: '829-642-5704',
  whatsapp: 'https://wa.me/18296425704',
  instagram: 'https://www.instagram.com/elit.eautolounge/',
  maps: 'https://www.google.com/maps/search/?api=1&query=Plaza%20Rachely%2C%20Av.%20San%20Vicente%20de%20Paul%2C%20Santo%20Domingo%20Este',
  defaultMessage: 'Hola Elite Auto Estudio, quiero información sobre sus servicios.',
} as const

export const whatsappLink = (message: string = site.defaultMessage) => `${site.whatsapp}?text=${encodeURIComponent(message)}`
