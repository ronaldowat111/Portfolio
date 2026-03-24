export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0A06] border-b border-[#C9941A] h-14 flex items-center justify-between px-10">
      <a href="#hero" className="font-serif text-[#EAD9B0] font-bold tracking-wide text-sm">
        [Nama Kamu]
      </a>
      <ul className="flex gap-8 list-none">
        <li><a href="#tentang" className="text-[#9C7A4A] text-xs uppercase tracking-widest hover:text-[#C9941A] transition-colors">Tentang</a></li>
        <li><a href="#keahlian" className="text-[#9C7A4A] text-xs uppercase tracking-widest hover:text-[#C9941A] transition-colors">Keahlian</a></li>
        <li><a href="#proyek" className="text-[#9C7A4A] text-xs uppercase tracking-widest hover:text-[#C9941A] transition-colors">Proyek</a></li>
        <li><a href="#kontak" className="text-[#9C7A4A] text-xs uppercase tracking-widest hover:text-[#C9941A] transition-colors">Kontak</a></li>
      </ul>
    </nav>
  )
}