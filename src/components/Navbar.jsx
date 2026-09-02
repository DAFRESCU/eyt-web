import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo.jsx'
import { NAV_LINKS } from '../data/content.js'

const container = {
  hidden: { opacity: 0, y: -12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0 },
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location])

  const handleNavClick = (e, to) => {
    if (to.startsWith('/#')) {
      e.preventDefault()
      const id = to.slice(2)
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }, 80)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <motion.header
      variants={container}
      initial="hidden"
      animate="show"
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-brand-navy shadow-lg' : 'bg-brand-navy/95'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <motion.div variants={item}>
          <Logo />
        </motion.div>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <motion.div variants={item} key={link.label}>
              <Link
                to={link.to}
                onClick={(e) => handleNavClick(e, link.to)}
                className="text-sm font-medium text-white/85 transition-colors hover:text-brand-rose"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div variants={item} className="hidden lg:block">
          <Link
            to="/contacto"
            className="rounded-md bg-brand-gold px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:bg-brand-gold-dark hover:shadow-card-hover"
          >
            Solicitar Diagnóstico
          </Link>
        </motion.div>

        <button
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-white lg:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-brand-navy-soft lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={(e) => handleNavClick(e, link.to)}
                  className="rounded-md px-3 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contacto"
                className="mt-2 rounded-md bg-brand-gold px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Solicitar Diagnóstico
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
