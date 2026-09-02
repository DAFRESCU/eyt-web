import { Link } from 'react-router-dom'

export default function Logo({ light = true, className = '' }) {
  const textColor = light ? 'text-white' : 'text-brand-navy'
  return (
    <Link to="/" className={`flex items-center gap-2 shrink-0 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-gold font-serif text-sm font-bold text-white">
        E&amp;T
      </span>
      <span className={`font-serif text-sm font-bold leading-tight ${textColor}`}>
        ESTRATEGIA
        <br />Y TALENTO
      </span>
    </Link>
  )
}
