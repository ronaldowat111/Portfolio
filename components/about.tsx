export default function About(){
  return(
    <section id="tentang" className="bg-[#0D0804] py-24 px-20">
      
      {/* Header */}
      <p className="text-[#C9941A] text-xs uppercase tracking-[0.3em] mb-2">✦ Tentang Saya</p>
      <h2 className="font-serif text-4xl font-bold text-[#EAD9B0] mb-16">About Me</h2>

      {/* Konten 2 kolom */}
      <div className="grid grid-cols-2 gap-16 items-center">

        {/* Foto */}
        <div className="relative">
          <div className="w-full aspect-4/5 border-2 border-[#C9941A] bg-[#1A1008] flex items-center justify-center text-[#9C7A4A] text-xs uppercase tracking-widest">
            {/* Ganti dengan: <img src="/foto.jpg" className="w-full h-full object-cover" /> */}
            Foto Kamu
          </div>
          <div className="absolute -bottom-3 -left-3 w-full aspect-[4/5] border border-[#C9941A] opacity-20 -z-10"></div>
        </div>

        {/* Teks */}
        <div>
          <h3 className="font-serif text-3xl text-[#EAD9B0] mb-6 leading-snug">
            I will <em className="text-[#C9941A]">Design & Develop</em> the best websites
          </h3>
          <p className="text-[#9C7A4A] text-sm leading-relaxed mb-4">
            Tulis cerita singkat tentang dirimu di sini — siapa kamu, dari mana asalmu, dan apa yang membuatmu tertarik dengan bidang ini.
          </p>
          <p className="text-[#9C7A4A] text-sm leading-relaxed mb-8">
            Boleh juga cerita tentang perjalananmu, nilai yang kamu pegang, atau gaya kerjamu sehari-hari.
          </p>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Lokasi", value: "Kota, Provinsi" },
              { label: "Bidang", value: "Profesi / Spesialisasi" },
              { label: "Pengalaman", value: "X Tahun" },
              { label: "Status", value: "Open to Work" },
            ].map((item) => (
              <div key={item.label} className="border-t border-[#C9941A] border-opacity-30 pt-3">
                <p className="text-[#C9941A] text-xs uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-[#EAD9B0] text-sm font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}