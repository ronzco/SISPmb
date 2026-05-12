import { motion } from 'motion/react';
import { CreditCard, Info, Wallet, DollarSign, Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

const FEE_DATA = [
  {
    faculty: 'Fakultas Ekonomi dan Bisnis',
    programs: [
      { name: 'Akuntansi', ukt: 'Rp 5.500.000 - Rp 9.000.000' },
      { name: 'Ilmu Ekonomi', ukt: 'Rp 4.500.000 - Rp 7.500.000' },
      { name: 'Manajemen', ukt: 'Rp 5.500.000 - Rp 9.500.000' },
    ]
  },
  {
    faculty: 'Fakultas Hukum',
    programs: [
      { name: 'Ilmu Hukum', ukt: 'Rp 5.000.000 - Rp 8.500.000' },
    ]
  },
  {
    faculty: 'Fakultas Ilmu Sosial dan Ilmu Politik',
    programs: [
      { name: 'Ilmu Hubungan Internasional', ukt: 'Rp 6.000.000 - Rp 10.000.000' },
      { name: 'Ilmu Komunikasi', ukt: 'Rp 5.500.000 - Rp 9.000.000' },
      { name: 'Politik dan Pemerintahan', ukt: 'Rp 4.000.000 - Rp 7.000.000' },
      { name: 'Sosiologi', ukt: 'Rp 3.500.000 - Rp 6.500.000' },
    ]
  },
  {
    faculty: 'Fakultas Kedokteran',
    programs: [
      { name: 'Pendidikan Dokter', ukt: 'Rp 20.000.000 - Rp 35.000.000' },
      { name: 'Ilmu Keperawatan', ukt: 'Rp 7.000.000 - Rp 12.000.000' },
      { name: 'Gizi Kesehatan', ukt: 'Rp 6.500.000 - Rp 10.500.000' },
    ]
  },
  {
    faculty: 'Fakultas Teknik',
    programs: [
      { name: 'Arsitektur', ukt: 'Rp 7.500.000 - Rp 12.500.000' },
      { name: 'Teknik Industri', ukt: 'Rp 7.000.000 - Rp 11.500.000' },
      { name: 'Teknik Elektro', ukt: 'Rp 7.500.000 - Rp 12.000.000' },
      { name: 'Teknik Sipil', ukt: 'Rp 7.000.000 - Rp 11.000.000' },
      { name: 'Teknologi Informasi', ukt: 'Rp 8.000.000 - Rp 14.000.000' },
    ]
  },
  {
    faculty: 'Fakultas MIPA',
    programs: [
      { name: 'Ilmu Komputer', ukt: 'Rp 7.000.000 - Rp 11.000.000' },
      { name: 'Elektronika & Instrumentasi', ukt: 'Rp 6.500.000 - Rp 10.000.000' },
      { name: 'Matematika', ukt: 'Rp 4.500.000 - Rp 8.000.000' },
      { name: 'Kimia', ukt: 'Rp 5.000.000 - Rp 9.000.000' },
    ]
  },
  {
    faculty: 'Fakultas Psikologi',
    programs: [
      { name: 'Psikologi', ukt: 'Rp 6.000.000 - Rp 10.000.000' },
    ]
  },
  {
    faculty: 'Fakultas Kehutanan',
    programs: [
      { name: 'Kehutanan', ukt: 'Rp 4.500.000 - Rp 8.000.000' },
    ]
  }
];

export default function Fees() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = FEE_DATA.map(faculty => ({
    ...faculty,
    programs: faculty.programs.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faculty.faculty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(faculty => faculty.programs.length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl mx-auto w-full"
    >
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
          <CreditCard size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daftar Biaya Pendidikan</h2>
          <p className="text-slate-500 text-sm mt-1">Transparansi biaya pendaftaran dan UKT semester untuk tahun akademik 2024/2025.</p>
        </div>
        <div className="md:ml-auto w-full md:w-auto">
          <div className="bg-blue-900 text-white px-6 py-4 rounded-2xl shadow-xl">
            <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest mb-1">Biaya Pendaftaran</p>
            <p className="text-2xl font-bold">Rp 350.000</p>
            <p className="text-[9px] text-blue-300 mt-1">*Berlaku untuk semua program studi</p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari prodi atau fakultas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-lg">
          <Info size={14} />
          Estimasi UKT per Semester
        </div>
      </div>

      {/* Grid of Fees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {filteredData.map((faculty, idx) => (
          <motion.div 
            key={faculty.faculty}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <div className="w-2 h-4 bg-blue-600 rounded"></div>
                {faculty.faculty}
              </h3>
            </div>
            <div className="p-0">
              {faculty.programs.map((prog, pIdx) => (
                <div 
                  key={prog.name}
                  className={cn(
                    "px-6 py-4 flex justify-between items-center group hover:bg-blue-50/30 transition-colors",
                    pIdx !== faculty.programs.length - 1 ? "border-b border-slate-100" : ""
                  )}
                >
                  <span className="text-sm text-slate-700 font-medium">{prog.name}</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-blue-700 font-mono tracking-tighter">{prog.ukt}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notification / Alert */}
      <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl flex gap-4 mt-8 shadow-sm">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
          <Wallet size={20} />
        </div>
        <div>
          <h4 className="font-bold text-orange-800 text-sm">Informasi UKT</h4>
          <p className="text-xs text-orange-700 mt-1 leading-relaxed">
            UKT (Uang Kuliah Tunggal) ditetapkan berdasarkan kemampuan ekonomi orang tua/wali mahasiswa. 
            Calon mahasiswa tetap dapat mengajukan <b>KIP-Kuliah</b> atau Beasiswa khusus untuk mendapatkan pemotongan biaya hingga 100%.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
