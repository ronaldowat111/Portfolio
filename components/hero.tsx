export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-between px-20 pt-14 bg-[#0F0A06]">
      
      {/* Kiri — Teks */}
      <div className="flex flex-col gap-6 max-w-lg">
        <p className="text-[#C9941A] text-xs uppercase tracking-[0.3em]">
          ✦ Selamat Datang
        </p>
        <h1 className="font-serif text-6xl font-bold text-[#EAD9B0] leading-tight">
          I'm <em className="text-[#C9941A]">Sheva</em>
        </h1>
        <p className="text-[#9C7A4A] text-lg italic">
          [Judul / Profesi kamu]
        </p>
        <p className="text-[#6B5A3A] text-sm leading-relaxed">
          Deskripsi singkat tentang dirimu — apa yang kamu buat, untuk siapa, dan mengapa kamu melakukannya.
        </p>
        <div className="flex gap-4 mt-2">
          <a href="#proyek" className="bg-[#C9941A] text-[#0F0A06] text-xs uppercase tracking-widest px-7 py-3 font-bold hover:bg-[#A63A1A] transition-colors">
            Lihat Karya
          </a>
          <a href="/cv.pdf" download className="border border-[#C9941A] text-[#C9941A] text-xs uppercase tracking-widest px-7 py-3 hover:bg-[#C9941A] hover:text-[#0F0A06] transition-colors">
            Unduh CV
          </a>
        </div>
      </div>

      {/* Kanan — Foto */}
      <div className="relative">
        <div className="w-80 h-96 border-2 border-[#C9941A] flex items-center justify-center text-[#9C7A4A] text-xs uppercase tracking-widest bg-[#1A1008]">
          {/* Ganti dengan: <img src="/foto.jpg" className="w-full h-full object-cover" /> */}
          Foto Kamu
        </div>
        {/* Ornamen kotak geser */}
        <div className="absolute -bottom-3 -right-3 w-80 h-96 border border-[#C9941A] opacity-20 -z-10"></div>
      </div>

    </section>
  )
}