import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Car, ChevronRight, Clock3, GlassWater, Instagram, MapPin, Menu, MessageCircle, Sparkles, X } from 'lucide-react'
import { barMixers, barSpirits, bottleMenu, carWashServices, loungeMixers } from './data/content'
import { site, whatsappLink } from './data/site'

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const videos = {
  carWash: publicAsset('Videos/car-wash.mp4'),
  bar: publicAsset('Videos/Bar.mp4'),
  billiards: publicAsset('Videos/Billar.mp4'),
}

const navItems = [['Inicio', '#inicio'], ['Car Wash', '#car-wash'], ['Bar', '#bar'], ['Billar', '#billar'], ['Ubicación', '#ubicacion']] as const

function VideoBackdrop({ src, label, eager = false, className = '' }: { src: string; label: string; eager?: boolean; className?: string }) {
  const name = src.includes('/Bar.') ? 'bar' : src.includes('/Billar.') ? 'billar' : 'car-wash'
  const poster = publicAsset(`images/video-highlights/${name}.webp`)
  if (label.startsWith('Servicio')) {
    return <img className={`video-cover ${className}`} src={poster} alt={label} width={1080} height={1920} loading="lazy" decoding="async" />
  }
  return <MotionVideo name={name} poster={poster} label={label} eager={eager} className={className} card={label.startsWith('Experiencia')} />
}

function MotionVideo({ name, poster, label, eager, className, card = false }: { name: string; poster: string; label: string; eager: boolean; className: string; card?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const video = ref.current!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    let visible = false
    const load = () => {
      if (!video.getAttribute('src')) {
        const size = window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop'
        video.src = publicAsset(card ? `Videos/optimized/card-${name}.mp4` : eager ? 'Videos/car-wash.mp4' : `Videos/optimized/${name}-${size}.mp4`)
        if (card) video.preload = 'metadata'
        video.load()
      }
    }
    const playback = () => {
      if (visible && !document.hidden && (card || eager || (!reduced.matches && !connection?.saveData))) {
        load()
        video.muted = true
        void video.play().catch((error: unknown) => {
          if (card) console.warn(`No se pudo reproducir la tarjeta ${name}:`, error)
        })
      } else video.pause()
    }
    const nearby = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && (card || (!reduced.matches && !connection?.saveData))) load()
    }, { rootMargin: '250px' })
    const onscreen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && (card ? entry.intersectionRatio >= 0.25 : entry.intersectionRatio > 0)
      playback()
    }, { threshold: card ? [0, 0.25] : [0, 0.01] })
    if (eager) load()
    nearby.observe(video)
    onscreen.observe(video)
    document.addEventListener('visibilitychange', playback)
    reduced.addEventListener('change', playback)
    return () => { nearby.disconnect(); onscreen.disconnect(); video.pause(); document.removeEventListener('visibilitychange', playback); reduced.removeEventListener('change', playback) }
  }, [name, eager, card])
  return <div className={`video-cover motion-media ${className}`}>
    <video ref={ref} className="motion-video" autoPlay muted loop playsInline preload={eager ? 'metadata' : 'none'} poster={poster} aria-label={label} onPlaying={() => setPlaying(true)} onWaiting={() => setPlaying(false)} onError={() => setPlaying(false)} />
    <img className={`motion-poster ${playing ? 'motion-poster-hidden' : ''}`} src={poster} alt="" aria-hidden="true" width={1080} height={1920} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
  </div>
}

function BrandMark() {
  return <a className="brand" href="#inicio" aria-label="Elite Auto Estudio, inicio"><img src={publicAsset('images/Elite%20autoestudio%20Logo%20v2.jpeg')} alt="Elite Auto Estudio" width={686} height={768} decoding="async" /></a>
}

function InstagramLink({ variant }: { variant: 'desktop' | 'mobile' | 'footer' }) {
  return <a className={`instagram-link instagram-${variant}`} href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Elite Auto Estudio">
    <Instagram size={20} aria-hidden="true" />
    {variant !== 'desktop' && <span>Instagram{variant === 'footer' && <small>@elit.eautolounge</small>}</span>}
  </a>
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <header className={`navbar ${scrolled || open ? 'navbar-solid' : ''}`}><nav className="nav-shell" aria-label="Navegación principal"><BrandMark /><div className="nav-links">{navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div><div className="nav-actions"><InstagramLink variant="desktop" /><a className="button button-gold nav-cta" href={whatsappLink()} target="_blank" rel="noreferrer">Reservar</a></div><button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>{open ? <X /> : <Menu />}</button></nav>{open && <div className="mobile-nav" id="mobile-nav">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ChevronRight size={18} /></a>)}<InstagramLink variant="mobile" /><a className="button button-gold" href={whatsappLink()} target="_blank" rel="noreferrer">Reservar por WhatsApp</a></div>}</header>
}

function Hero() {
  return <section className="hero" id="inicio"><VideoBackdrop src={videos.carWash} label="Lavado profesional en Elite Auto Estudio" eager /><div className="hero-shade" /><div className="hero-content reveal"><p className="eyebrow">Elite Auto Estudio · Santo Domingo</p><h1>Tu carro se<br />lava.<br /><em>Tú disfrutas.</em></h1><p className="hero-copy">Auto detailing, bar y billar en un solo lugar.</p><div className="hero-actions"><a className="button button-gold" href={whatsappLink()} target="_blank" rel="noreferrer">Reservar servicio <ArrowRight size={18} /></a><a className="button button-ghost" href="#experiencia">Ver experiencias</a></div><p className="hero-location"><MapPin size={16} /> Santo Domingo Este, RD</p></div><a className="scroll-cue" href="#experiencia">Reservas y servicios <ArrowDown size={17} /></a></section>
}

function Intro() {
  const pillars = [['01', 'Car Wash', 'Cuidado y detailing para tu vehículo.'], ['02', 'Bar', 'Tragos, mezclas y un ambiente para disfrutar.'], ['03', 'Billar', 'Juega mientras tu vehículo queda listo.']]
  return <section className="section intro" id="experiencia"><div className="shell intro-grid"><div className="reveal"><p className="eyebrow gold">La experiencia Elite</p><h2 className="display-title">Mucho más que<br />un car wash.</h2></div><p className="lead reveal">En Elite Auto Estudio convertimos el cuidado de tu vehículo en una experiencia. Mientras nosotros nos encargamos de tu carro, tú puedes disfrutar del bar, jugar una partida de billar y relajarte.</p></div><div className="shell pillar-grid">{pillars.map(([number, title, copy]) => <article className="pillar reveal" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
}

function CarWash() {
  return <section className="section section-deep" id="car-wash"><div className="shell media-grid"><div className="cinema-frame reveal"><VideoBackdrop src={videos.carWash} label="Servicio de auto detailing" /><div className="frame-tag"><Sparkles size={16} /> Detailing studio</div></div><div className="section-copy-block reveal"><p className="eyebrow gold">Auto detailing</p><h2 className="display-title">Cuidado que<br />se nota.</h2><p className="lead">Desde un lavado básico hasta detailing y revitalización de pintura. Tratamos cada vehículo con atención a los detalles.</p><a className="text-link" href={whatsappLink('Hola Elite Auto Estudio, quiero cotizar un servicio de Car Wash / Auto Detailing.')} target="_blank" rel="noreferrer">Consultar servicio <ArrowRight size={18} /></a></div></div><div className="shell services-wrap reveal"><div className="services-heading"><h3>Servicios de cuidado</h3><p>Selecciona un servicio para consultarlo directamente.</p></div><div className="service-list">{carWashServices.map((service, index) => <a key={service} href={whatsappLink(`Hola Elite Auto Estudio, quiero cotizar el servicio: ${service}.`)} target="_blank" rel="noreferrer"><span className="service-number">{String(index + 1).padStart(2, '0')}</span><span>{service}</span><ArrowRight size={18} /></a>)}</div></div></section>
}

function MenuColumn({ title, items, priced = false }: { title: string; items: readonly (string | readonly [string, string])[]; priced?: boolean }) {
  return <div className="menu-column"><p className="menu-title">{title}</p><ul>{items.map((item) => { const [name, price] = Array.isArray(item) ? item : [item, '']; return <li key={name}><span>{name}</span>{priced && price && <strong>{price}</strong>}</li> })}</ul></div>
}

function BarSection() {
  return <section className="section lounge-section" id="bar"><div className="ambient ambient-one" /><div className="shell lounge-hero"><div className="section-copy-block reveal"><p className="eyebrow gold">Elite Bar</p><h2 className="display-title">Mientras tu carro queda ready,<br /><em>tú también.</em></h2><p className="lead">Relájate, pide tu trago favorito y disfruta la experiencia Elite.</p></div><div className="cinema-frame portrait reveal"><VideoBackdrop src={videos.bar} label="Ambiente de Elite Bar" /><div className="frame-tag"><GlassWater size={16} /> Lounge & drinks</div></div></div><div className="shell lounge-menu reveal"><MenuColumn title="Tragos premium / dobles" items={barSpirits} /><MenuColumn title="Mezclas / mixers" items={barMixers} /></div><div className="shell section-reservation"><a className="text-link" href={whatsappLink('Hola Elite Auto Estudio, quiero reservar en el Bar.')} target="_blank" rel="noreferrer">Reservar en el Bar <ArrowRight size={18} /></a></div></section>
}

function Billiards() {
  return <section className="section billiards-section" id="billar"><div className="billiards-video"><VideoBackdrop src={videos.billiards} label="Mesa de billar en Elite Auto Estudio" /><div className="video-vignette" /></div><div className="shell billiards-content"><div className="billiards-heading reveal"><p className="eyebrow gold">Billar & Lounge</p><h2 className="display-title">Una partida<br />mientras esperas.</h2><p>Reta a tus amigos, disfruta una bebida y haz que esperar por tu vehículo sea la mejor parte del día.</p></div><div className="price-card reveal"><MenuColumn title="Menú premium por botella" items={bottleMenu} priced /><MenuColumn title="Mezclas / ofertas" items={loungeMixers} priced /><p className="house-note">El hielo va por la casa.</p><a className="text-link section-reservation" href={whatsappLink('Hola Elite Auto Estudio, quiero consultar una reserva para Billar.')} target="_blank" rel="noreferrer">Consultar Billar <ArrowRight size={18} /></a></div></div></section>
}

function BrandStatement() {
  return <section className="statement"><div className="statement-line" aria-hidden="true" /><div className="shell reveal"><p>Lava.</p><p>Juega.</p><p>Disfruta.</p><span>Todo en el mismo lugar.</span></div></section>
}

function Editorial() {
  const cards = [{ title: 'Car Wash', number: '01', src: videos.carWash, href: '#car-wash' }, { title: 'Bar', number: '02', src: videos.bar, href: '#bar' }, { title: 'Billar', number: '03', src: videos.billiards, href: '#billar' }]
  return <section className="section editorial"><div className="shell"><div className="editorial-head reveal"><p className="eyebrow gold">Un solo destino</p><h2 className="display-title">Tres formas de disfrutar.</h2></div><div className="editorial-grid">{cards.map((card) => <a className="editorial-card reveal" href={card.href} key={card.title}><VideoBackdrop src={card.src} label={`Experiencia ${card.title}`} /><div className="editorial-shade" /><span>{card.number}</span><h3>{card.title}</h3><ArrowRight /></a>)}</div></div></section>
}

function Location() {
  return <section className="section location" id="ubicacion"><div className="shell location-grid"><div className="reveal"><p className="eyebrow gold">Encuéntranos</p><h2 className="display-title">El punto de encuentro<br />en Santo Domingo Este.</h2></div><div className="address-card reveal"><MapPin className="address-icon" /><address>Plaza Rachely<br />Av. San Vicente de Paul<br />Frente al Parque El Rosal<br />Santo Domingo Este<br />República Dominicana 11506</address><div className="location-actions"><a className="button button-gold" href={site.maps} target="_blank" rel="noreferrer">Cómo llegar</a><a className="button button-outline" href={whatsappLink()} target="_blank" rel="noreferrer">Escribir por WhatsApp</a></div></div></div></section>
}

function FinalCta() {
  return <section className="final-cta"><div className="shell reveal"><Car size={30} /><h2>Tu carro merece<br /><em>el trato Elite.</em></h2><p>Reserva tu servicio y disfruta mientras nosotros hacemos el resto.</p><div><a className="button button-gold" href={whatsappLink()} target="_blank" rel="noreferrer">Reservar por WhatsApp <MessageCircle size={18} /></a><a className="button button-ghost" href="#car-wash">Ver servicios</a></div></div></section>
}

function Footer() {
  return <footer><div className="shell footer-grid"><div><BrandMark /><p>Tu carro se lava. Tú disfrutas.</p><p className="footer-meta">Car Wash · Bar · Billar</p></div><div><p className="footer-label">Visítanos</p><p>Plaza Rachely<br />Av. San Vicente de Paul<br />Frente al Parque El Rosal<br />Santo Domingo Este</p></div><div><p className="footer-label">Contacto</p><a href={whatsappLink()} target="_blank" rel="noreferrer">{site.phone}</a><p className="hours"><Clock3 size={15} /> Reservas por WhatsApp</p><InstagramLink variant="footer" /></div><div className="footer-links">{navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div></div><div className="shell copyright">© {new Date().getFullYear()} Elite Auto Estudio</div></footer>
}

function WhatsAppButton() {
  return <a className="whatsapp-float" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Contactar a Elite Auto Estudio por WhatsApp"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.47 0 .11 5.35.1 11.94c0 2.1.55 4.16 1.6 5.98L0 24l6.24-1.64a11.94 11.94 0 0 0 5.8 1.48h.01c6.58 0 11.94-5.35 11.95-11.94a11.86 11.86 0 0 0-3.48-8.42ZM12.05 21.82a9.9 9.9 0 0 1-5.04-1.38l-.36-.22-3.7.97.99-3.61-.24-.37a9.88 9.88 0 0 1-1.52-5.27c0-5.48 4.46-9.93 9.94-9.93a9.86 9.86 0 0 1 7.02 2.91 9.87 9.87 0 0 1 2.9 7.03c0 5.47-4.46 9.87-9.99 9.87Zm5.45-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.62.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" /></svg><span>Reservar por WhatsApp</span></a>
}

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible') }), { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
  return <><Navbar /><main><Hero /><Intro /><CarWash /><BarSection /><Billiards /><BrandStatement /><Editorial /><Location /><FinalCta /></main><Footer /><WhatsAppButton /></>
}
