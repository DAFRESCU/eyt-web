import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { CONTACT, NAV_LINKS } from '../data/content.js'

export default function Footer() {
  return (
    <footer className="relative bg-brand-navy pt-14 pb-8 text-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"
      />
      <div className="container-page grid gap-10 sm:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Construimos la fuerza humana de cada empresa.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-white/80">
            Navegación
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="inline-block text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-brand-rose"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-white/80">
            Contacto
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-brand-rose">
            <li>
              <a href={`tel:${CONTACT.phoneHref}`}>{CONTACT.phone}</a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>{CONTACT.locations.join(' · ')}</li>
          </ul>
        </div>
      </div>

      <div className="container-page mt-12 border-t border-white/10 pt-6">
        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} E&amp;T ESTRATEGIA Y TALENTO S.A.C. · Todos los derechos reservados
        </p>
      </div>
    </footer>
  )
}
