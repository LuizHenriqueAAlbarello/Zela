/** Logo do Zela: um poste aceso ao lado do nome. */
export default function Marca() {
  return (
    <span className="flex items-center gap-2.5">
      <svg aria-hidden="true" viewBox="0 0 24 32" className="h-8 w-6">
        <path d="M7 31V7a4 4 0 0 1 4-4h6" fill="none" stroke="#ECE8E0" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M14 3h8l-1.6 4h-4.8z" fill="#ECE8E0" />
        <ellipse cx="18" cy="8.6" rx="3.4" ry="1.4" fill="#FF9A3C" />
        <path d="M18 10l-7 21h14z" fill="url(#cone)" />
        <defs>
          <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FF9A3C" stopOpacity=".55" />
            <stop offset="1" stopColor="#FF9A3C" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <span className="titulo text-[26px] leading-none text-papel">Zela</span>
    </span>
  )
}