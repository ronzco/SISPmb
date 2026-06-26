import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Database, HelpCircle, ArrowRight, User, Server, 
  Workflow, Info, Layers, Lock, Settings, CheckCircle2, 
  AlertCircle, ChevronRight, FileText, LayoutDashboard, Code, Shield
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminDiagrams() {
  const [activeTab, setActiveTab] = useState<'usecase' | 'activity' | 'sequence' | 'class'>('usecase');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // Swimlanes Data for Activity Diagram
  const activitySteps = [
    {
      id: 'step1',
      title: 'Registrasi & Login',
      lane: 'student',
      desc: 'Calon Mahasiswa membuat akun menggunakan email aktif dan melakukan login ke sistem.',
      next: 'step2'
    },
    {
      id: 'step2',
      title: 'Isi Formulir Data Diri',
      lane: 'student',
      desc: 'Mengisi biodata lengkap, memilih fakultas & program studi (prodi) yang diinginkan.',
      next: 'step3'
    },
    {
      id: 'step3',
      title: 'Unggah Berkas Persyaratan',
      lane: 'student',
      desc: 'Mengunggah 4 berkas wajib: Ijazah, KTP, KK, & Pas Foto dalam format JPG/PNG/PDF.',
      next: 'step4'
    },
    {
      id: 'step4',
      title: 'Bayar Biaya Pendaftaran',
      lane: 'student',
      desc: 'Melakukan pembayaran pendaftaran melalui metode VA atau QRIS.',
      next: 'step5'
    },
    {
      id: 'step5',
      title: 'Validasi Pembayaran',
      lane: 'system',
      desc: 'Sistem secara otomatis atau manual memverifikasi status transaksi pembayaran pendaftaran.',
      next: 'step6'
    },
    {
      id: 'step6',
      title: 'Verifikasi Berkas Pendaftaran',
      lane: 'committee',
      desc: 'Panitia Akademik meninjau kelayakan dan kebenaran berkas yang diunggah mahasiswa.',
      next: 'step7'
    },
    {
      id: 'step7',
      title: 'Pemberian Kartu Ujian (Test Ready)',
      lane: 'system',
      desc: 'Setelah berkas diverifikasi dan pembayaran sukses, sistem merilis kartu dan kode seleksi ujian.',
      next: 'step8'
    },
    {
      id: 'step8',
      title: 'Seleksi Tulis & Input Nilai',
      lane: 'committee',
      desc: 'Mahasiswa mengikuti ujian seleksi, dan panitia menginput nilai hasil ujian ke sistem.',
      next: 'step9'
    },
    {
      id: 'step9',
      title: 'Pengumuman Hasil Seleksi',
      lane: 'system',
      desc: 'Sistem merilis hasil seleksi: LULUS (Accepted) atau TIDAK LULUS (Rejected).',
      next: 'step10'
    },
    {
      id: 'step10',
      title: 'Bayar Biaya Kuliah (UKT)',
      lane: 'student',
      desc: 'Bagi yang dinyatakan LULUS, tombol bayar UKT aktif untuk daftar ulang dan mendapatkan NIM.',
      next: 'finish'
    }
  ];

  // Sequence Diagram Steps
  const sequenceSteps = [
    { num: "1", from: "Calon Mahasiswa", to: "React Client", msg: "Mengisi form pendaftaran & unggah berkas", type: "request" },
    { num: "2", from: "React Client", to: "Express Server", msg: "POST /api/applications & documents", type: "request" },
    { num: "3", from: "Express Server", to: "Database (MySQL/SQLite)", msg: "Insert data pendaftaran & berkas (status draft/submitted)", type: "db" },
    { num: "4", from: "Database (MySQL/SQLite)", to: "Express Server", msg: "Konfirmasi penyimpanan sukses", type: "response" },
    { num: "5", from: "Express Server", to: "React Client", msg: "Response 201 Created & update status di UI", type: "response" },
    { num: "6", from: "Calon Mahasiswa", to: "React Client", msg: "Pilih opsi bayar pendaftaran", type: "request" },
    { num: "7", from: "React Client", to: "Express Server", msg: "POST /api/payment (category: registration)", type: "request" },
    { num: "8", from: "Express Server", to: "Database (MySQL/SQLite)", msg: "Create Payment Record (status pending)", type: "db" },
    { num: "9", from: "Express Server", to: "React Client", msg: "Tampilkan detail invoice & QRIS/VA", type: "response" },
    { num: "10", from: "Panitia PMB (Admin)", to: "React Client", msg: "Buka menu verifikasi pendaftar", type: "request" },
    { num: "11", from: "React Client", to: "Express Server", msg: "GET /api/admin/applications (Ambil seluruh pendaftar)", type: "request" },
    { num: "12", from: "Express Server", to: "Database (MySQL/SQLite)", msg: "Query pendaftar, status pembayaran, & berkas", type: "db" },
    { num: "13", from: "Database (MySQL/SQLite)", to: "Express Server", msg: "Kirim data relasi lengkap", type: "response" },
    { num: "14", from: "Express Server", to: "React Client", msg: "Tampilkan tabel pendaftar di Admin Console", type: "response" },
    { num: "15", from: "Panitia PMB (Admin)", to: "React Client", msg: "Verifikasi berkas & ubah status ke 'test_ready'", type: "request" },
    { num: "16", from: "React Client", to: "Express Server", msg: "PUT /api/admin/applications/:id/status (test_ready)", type: "request" },
    { num: "17", from: "Express Server", to: "Database (MySQL/SQLite)", msg: "Update status pendaftaran & log aktivitas", type: "db" },
    { num: "18", from: "Express Server", to: "React Client", msg: "Notifikasi update berhasil", type: "response" },
    { num: "19", from: "Panitia PMB (Admin)", to: "React Client", msg: "Input nilai seleksi & set status 'accepted' (Lulus)", type: "request" },
    { num: "20", from: "React Client", to: "Express Server", msg: "PUT /api/admin/applications/:id/status (accepted + score)", type: "request" },
    { num: "21", from: "Express Server", to: "Database (MySQL/SQLite)", msg: "Update status & simpan score", type: "db" },
    { num: "22", from: "Calon Mahasiswa", to: "React Client", msg: "Akses Dashboard (Status: LULUS, Tombol UKT aktif)", type: "request" },
    { num: "23", from: "Calon Mahasiswa", to: "React Client", msg: "Klik 'Bayar Biaya Kuliah' untuk daftar ulang", type: "request" }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full px-4 mb-20 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
              Sistem Blueprint & Arsitektur
            </h2>
            <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30">
              UML & Use Cases
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-3 text-sm md:text-base">
            Representasi lengkap arsitektur sistem SIPMB (Sistem Informasi Penerimaan Mahasiswa Baru) UNUTN.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative mb-8 -mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-max border border-slate-200 dark:border-slate-800">
          {[
            { id: 'usecase', label: 'Use Case Matrix', icon: <User size={14} /> },
            { id: 'activity', label: 'Activity Diagram', icon: <Workflow size={14} /> },
            { id: 'sequence', label: 'Sequence Diagram', icon: <Network size={14} /> },
            { id: 'class', label: 'Class Diagram (UML)', icon: <Database size={14} /> },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedElement(null);
              }}
              className={cn(
                "px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all relative z-10 whitespace-nowrap",
                activeTab === tab.id 
                  ? "text-blue-600 dark:text-blue-400 font-black" 
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-400"
              )}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabDiagrams"
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="scale-110">{tab.icon}</div> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white dark:bg-[#151921] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-10 transition-all duration-300">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: USE CASE MATRIX */}
          {activeTab === 'usecase' && (
            <motion.div
              key="usecase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-950/40">
                <Info size={24} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Use Case Matrix Overview</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                    Menjelaskan pembagian wewenang dan aktor (Aktor Calon Mahasiswa, Panitia Akademik, Panitia Keuangan, dan Superadmin) dalam platform SIPMB. Klik aktor untuk melihat detail.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Calon Mahasiswa Card */}
                <div 
                  onClick={() => setSelectedElement('applicant')}
                  className={cn(
                    "p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-full group",
                    selectedElement === 'applicant' 
                      ? "border-blue-500 bg-blue-50/20 dark:bg-blue-900/10 shadow-lg" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-[#1a1f2c]/10"
                  )}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <User size={24} />
                    </div>
                    <h3 className="text-base font-black uppercase text-slate-900 dark:text-white tracking-tight">Calon Mahasiswa</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Applicant Role</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium leading-relaxed">
                      Aktor utama yang mendaftar secara online, mengisi profil akademis, mengunggah dokumen prasyarat, serta melakukan transaksi keuangan pembayaran kuliah.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                    <span>9 Use Cases</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Panitia Akademik Card */}
                <div 
                  onClick={() => setSelectedElement('committee_academic')}
                  className={cn(
                    "p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-full group",
                    selectedElement === 'committee_academic' 
                      ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-900/10 shadow-lg" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-[#1a1f2c]/10"
                  )}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Workflow size={24} />
                    </div>
                    <h3 className="text-base font-black uppercase text-slate-900 dark:text-white tracking-tight">Panitia Akademik</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Academic Committee</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium leading-relaxed">
                      Bertanggung jawab memverifikasi berkas akademis, menyelenggarakan seleksi tertulis, menginput nilai seleksi, dan merilis pengumuman hasil kelulusan.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">
                    <span>6 Use Cases</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Panitia Keuangan Card */}
                <div 
                  onClick={() => setSelectedElement('committee_finance')}
                  className={cn(
                    "p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-full group",
                    selectedElement === 'committee_finance' 
                      ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-900/10 shadow-lg" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-[#1a1f2c]/10"
                  )}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Layers size={24} />
                    </div>
                    <h3 className="text-base font-black uppercase text-slate-900 dark:text-white tracking-tight">Panitia Keuangan</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Finance Committee</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium leading-relaxed">
                      Memantau alur masuk dana (Biaya Pendaftaran & Biaya Kuliah/UKT), memverifikasi pembayaran manual/split, serta menetapkan konfigurasi biaya.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
                    <span>4 Use Cases</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Superadmin Card */}
                <div 
                  onClick={() => setSelectedElement('superadmin')}
                  className={cn(
                    "p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-full group",
                    selectedElement === 'superadmin' 
                      ? "border-purple-500 bg-purple-50/20 dark:bg-purple-900/10 shadow-lg" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-[#1a1f2c]/10"
                  )}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Lock size={24} />
                    </div>
                    <h3 className="text-base font-black uppercase text-slate-900 dark:text-white tracking-tight">Superadmin</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Main System Admin</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium leading-relaxed">
                      Memegang kendali penuh seluruh sistem. Mengawasi berkas log keamanan (audit trail), konfigurasi program studi, manajemen pengumuman sistem, serta hak akses operator.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs font-black uppercase text-purple-600 dark:text-purple-400">
                    <span>All System Use Cases</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Use Case Details Drawer / Panel */}
              <AnimatePresence mode="wait">
                {selectedElement && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-8 bg-slate-50 dark:bg-[#1a1f29]/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <Code size={16} className="text-blue-600 dark:text-blue-400" />
                        Daftar Use Case: {selectedElement === 'applicant' ? 'Calon Mahasiswa' : selectedElement === 'committee_academic' ? 'Panitia Akademik' : selectedElement === 'committee_finance' ? 'Panitia Keuangan' : 'Superadmin'}
                      </h4>
                      <button 
                        onClick={() => setSelectedElement(null)}
                        className="text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-3 py-1.5 rounded-xl uppercase tracking-widest transition-all"
                      >
                        Tutup Detail
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedElement === 'applicant' && [
                        { uc: 'UC-01: Registrasi Akun', d: 'Mendaftarkan akun baru pendaftar PMB dengan validasi email.' },
                        { uc: 'UC-02: Otentikasi Akun', d: 'Melakukan login dan mengamankan session akun mahasiswa.' },
                        { uc: 'UC-03: Kelola Formulir Biodata', d: 'Mengisi data diri, alamat, sekolah asal, program studi & fakultas.' },
                        { uc: 'UC-04: Unggah Dokumen Syarat', d: 'Mengunggah file KTP, Ijazah/SKL, Kartu Keluarga, & Pas Foto.' },
                        { uc: 'UC-05: Melakukan Pembayaran', d: 'Melakukan pembayaran pendaftaran & daftar ulang kuliah via VA/QRIS.' },
                        { uc: 'UC-06: Memantau Alur/Status', d: 'Melihat perkembangan tahapan verifikasi dokumen, tes, dan kelulusan.' },
                        { uc: 'UC-07: Mengunduh Kartu Ujian', d: 'Mengunduh tanda bukti kartu seleksi jika status berkas terverifikasi.' },
                        { uc: 'UC-08: Melihat Pengumuman PMB', d: 'Melihat status kelulusan seleksi dan rincian nominal biaya UKT.' },
                        { uc: 'UC-09: Mengunduh Invoice', d: 'Mengunduh kuitansi resmi/bukti bayar yang sah dari universitas.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                          <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">{item.uc}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">{item.d}</p>
                        </div>
                      ))}

                      {selectedElement === 'committee_academic' && [
                        { uc: 'UC-10: Memantau Daftar Pendaftar', d: 'Melihat seluruh daftar calon mahasiswa baru beserta status akademis.' },
                        { uc: 'UC-11: Verifikasi Berkas Akademik', d: 'Memverifikasi atau menolak kelengkapan berkas dokumen pendaftaran mahasiswa.' },
                        { uc: 'UC-12: Mengelola Kode Seleksi', d: 'Menyiapkan, merilis, dan mendistribusikan link/kartu ujian seleksi.' },
                        { uc: 'UC-13: Menginput Nilai Ujian', d: 'Mencatat nilai hasil ujian tulis calon mahasiswa ke dalam sistem.' },
                        { uc: 'UC-14: Memutus Kelulusan', d: 'Mengubah status pendaftaran menjadi Lulus (Accepted) atau Tidak Lulus (Rejected).' },
                        { uc: 'UC-15: Mengunduh Laporan Akademik', d: 'Mengunduh file laporan pendaftar berformat CSV/Excel untuk rapat rektorat.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{item.uc}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">{item.d}</p>
                        </div>
                      ))}

                      {selectedElement === 'committee_finance' && [
                        { uc: 'UC-16: Monitoring Keuangan', d: 'Melihat rekapan transaksi pembayaran pendaftaran & biaya kuliah (UKT).' },
                        { uc: 'UC-17: Verifikasi Manual Split', d: 'Memproses validasi pembayaran jika terjadi kendala pada auto-sinkron bank.' },
                        { uc: 'UC-18: Mengelola Skema Tarif Biaya', d: 'Menyesuaikan konfigurasi tarif biaya masuk & biaya kuliah per fakultas/prodi.' },
                        { uc: 'UC-19: Eksport Rekap Keuangan', d: 'Mengekspor laporan penerimaan dana untuk diintegrasikan dengan divisi keuangan kampus.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                          <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{item.uc}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">{item.d}</p>
                        </div>
                      ))}

                      {selectedElement === 'superadmin' && [
                        { uc: 'UC-20: Security Audit Log Access', d: 'Melihat seluruh rekapan log aktivitas administrator dan panitia secara detail (IP, Operator, Aksi).' },
                        { uc: 'UC-21: Broadcast Manajemen', d: 'Mengisi, mengedit, dan mempublikasikan pengumuman darurat, info pendaftaran atau info kuliah di portal depan.' },
                        { uc: 'UC-22: Pengendalian Operator PMB', d: 'Mengatur hak akses panitia pendaftaran, baik level akademik maupun keuangan.' },
                        { uc: 'UC-23: Sinkronisasi Database Pusat', d: 'Melakukan backup, sinkronisasi data dari schema lokal SQLite ke server MySQL Produksi.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                          <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">{item.uc}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">{item.d}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* TAB 2: ACTIVITY DIAGRAM (SWIMLANES) */}
          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-950/40">
                <Workflow size={24} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Activity Diagram (Visual Alur Kerja)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                    Alur aktivitas end-to-end yang mengilustrasikan pembagian kerja (Swimlanes) antara Calon Mahasiswa, Portal Sistem PMB Otomatis, dan Panitia Pelaksana. Klik setiap node untuk melihat deskripsi langkah.
                  </p>
                </div>
              </div>

              {/* Swimlanes Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-slate-50/20 dark:bg-slate-950/10">
                {/* Lane 1: Calon Mahasiswa */}
                <div className="border-r border-slate-200 dark:border-slate-800 flex flex-col">
                  <div className="p-4 bg-blue-900 dark:bg-blue-600 text-white text-center font-black text-xs uppercase tracking-widest">
                    Lane 1: Calon Mahasiswa (Applicant)
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-start">
                    {activitySteps.filter(s => s.lane === 'student').map((step, idx) => (
                      <div 
                        key={step.id}
                        onClick={() => setSelectedElement(step.id)}
                        className={cn(
                          "p-4 rounded-2xl border text-left cursor-pointer transition-all hover:scale-102 hover:shadow-md",
                          selectedElement === step.id
                            ? "bg-blue-600 text-white border-blue-500"
                            : "bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800 hover:border-blue-500"
                        )}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={cn("text-[9px] font-black uppercase tracking-widest", selectedElement === step.id ? "text-blue-100" : "text-blue-500")}>Langkah {idx + 1}</span>
                          <span className="text-[10px] font-bold">Mahasiswa</span>
                        </div>
                        <h4 className="text-xs font-black uppercase">{step.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lane 2: Portal PMB (Sistem) */}
                <div className="border-r border-slate-200 dark:border-slate-800 flex flex-col">
                  <div className="p-4 bg-purple-900 dark:bg-purple-700 text-white text-center font-black text-xs uppercase tracking-widest">
                    Lane 2: Portal Sistem (App Engine)
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-start">
                    {activitySteps.filter(s => s.lane === 'system').map((step, idx) => (
                      <div 
                        key={step.id}
                        onClick={() => setSelectedElement(step.id)}
                        className={cn(
                          "p-4 rounded-2xl border text-left cursor-pointer transition-all hover:scale-102 hover:shadow-md",
                          selectedElement === step.id
                            ? "bg-purple-600 text-white border-purple-500"
                            : "bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800 hover:border-purple-500"
                        )}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={cn("text-[9px] font-black uppercase tracking-widest", selectedElement === step.id ? "text-purple-100" : "text-purple-500")}>Proses Otomatis</span>
                          <span className="text-[10px] font-bold">Sistem</span>
                        </div>
                        <h4 className="text-xs font-black uppercase">{step.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lane 3: Panitia Seleksi */}
                <div className="flex flex-col">
                  <div className="p-4 bg-indigo-900 dark:bg-indigo-700 text-white text-center font-black text-xs uppercase tracking-widest">
                    Lane 3: Panitia PMB (Committee)
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-start">
                    {activitySteps.filter(s => s.lane === 'committee').map((step, idx) => (
                      <div 
                        key={step.id}
                        onClick={() => setSelectedElement(step.id)}
                        className={cn(
                          "p-4 rounded-2xl border text-left cursor-pointer transition-all hover:scale-102 hover:shadow-md",
                          selectedElement === step.id
                            ? "bg-indigo-600 text-white border-indigo-500"
                            : "bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800 hover:border-indigo-500"
                        )}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={cn("text-[9px] font-black uppercase tracking-widest", selectedElement === step.id ? "text-indigo-100" : "text-indigo-500")}>Tindakan Manual</span>
                          <span className="text-[10px] font-bold">Panitia</span>
                        </div>
                        <h4 className="text-xs font-black uppercase">{step.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lane Info Detail Area */}
              <AnimatePresence mode="wait">
                {selectedElement && activitySteps.find(s => s.id === selectedElement) && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800"
                  >
                    {(() => {
                      const step = activitySteps.find(s => s.id === selectedElement)!;
                      return (
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-black uppercase text-slate-800 dark:text-white flex items-center gap-2">
                              <Workflow size={16} className="text-indigo-600 dark:text-indigo-400" />
                              Langkah Terpilih: {step.title}
                            </h4>
                            <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg">
                              Aktor: {step.lane === 'student' ? 'Calon Mahasiswa' : step.lane === 'system' ? 'System Engine' : 'Panitia PMB'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-3 leading-relaxed">
                            {step.desc}
                          </p>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600">Alur Berikutnya:</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase">
                              {step.next === 'finish' ? 'PROSES SELESAI / NIM DIRILIS' : activitySteps.find(s => s.id === step.next)?.title || 'Selesai'}
                              <ArrowRight size={12} className="text-slate-400" />
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* General Process Lifecycle */}
              <div className="p-8 bg-slate-50 dark:bg-[#1a1f29]/30 rounded-3xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Siklus Hidup Pendaftaran (Status Transition)
                </h4>
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  {[
                    { label: 'DRAFT', desc: 'Siswa mengisi biodata dasar.' },
                    { label: 'SUBMITTED', desc: 'Biodata dikunci & dokumen disimpan.' },
                    { label: 'VERIFYING', desc: 'Berkas dicek & biaya dikonfirmasi.' },
                    { label: 'TEST_READY', desc: 'Rilis kartu ujian & kode seleksi.' },
                    { label: 'ACCEPTED / REJECTED', desc: 'Hasil final seleksi diumumkan.' }
                  ].map((s, idx) => (
                    <div key={idx} className="flex-1 w-full flex flex-col md:flex-row items-center gap-4">
                      <div className="p-4 bg-white dark:bg-[#151921] border border-slate-200 dark:border-slate-800 rounded-2xl w-full text-center hover:border-blue-500 transition-all">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 block tracking-wider">{s.label}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block mt-1 leading-relaxed">{s.desc}</span>
                      </div>
                      {idx < 4 && <ArrowRight size={16} className="text-slate-300 dark:text-slate-700 hidden lg:block shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: SEQUENCE DIAGRAM */}
          {activeTab === 'sequence' && (
            <motion.div
              key="sequence"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4 p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-950/40">
                <Network size={24} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Sequence Diagram (Aliran Pesan Sinkron)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                    Visualisasi aliran interaksi objek dan pesan (Messages) antar lapisan mulai dari User UI, Controller Client, API Endpoint Express, Server, Database MySQL/SQLite hingga Admin Dashboard.
                  </p>
                </div>
              </div>

              {/* Sequence diagram custom visual representation */}
              <div className="p-6 md:p-8 bg-slate-50 dark:bg-[#1a1f29]/30 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-x-auto">
                <div className="min-w-[800px] space-y-4">
                  {/* Lifeline Headers */}
                  <div className="grid grid-cols-5 text-center font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="bg-blue-500/10 text-blue-600 px-3 py-2 rounded-xl border border-blue-500/20">Calon Mahasiswa</div>
                    <div className="bg-teal-500/10 text-teal-600 px-3 py-2 rounded-xl border border-teal-500/20">React Client (Vite)</div>
                    <div className="bg-purple-500/10 text-purple-600 px-3 py-2 rounded-xl border border-purple-500/20">Express Backend</div>
                    <div className="bg-amber-500/10 text-amber-600 px-3 py-2 rounded-xl border border-amber-500/20">Database (SQL)</div>
                    <div className="bg-indigo-500/10 text-indigo-600 px-3 py-2 rounded-xl border border-indigo-500/20">Panitia PMB (Admin)</div>
                  </div>

                  {/* Lifeline vertical dots simulation */}
                  <div className="space-y-3 pt-4 relative">
                    {sequenceSteps.map((step, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 bg-white dark:bg-[#151921] rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            {step.num}
                          </span>
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className={cn(
                              "text-[10px] uppercase tracking-wider",
                              step.from === "Calon Mahasiswa" ? "text-blue-500" :
                              step.from === "React Client" ? "text-teal-500" :
                              step.from === "Express Server" ? "text-purple-500" :
                              step.from === "Database (MySQL/SQLite)" ? "text-amber-500" : "text-indigo-500"
                            )}>{step.from}</span>
                            <ArrowRight size={12} className="text-slate-400 shrink-0" />
                            <span className={cn(
                              "text-[10px] uppercase tracking-wider",
                              step.to === "Calon Mahasiswa" ? "text-blue-500" :
                              step.to === "React Client" ? "text-teal-500" :
                              step.to === "Express Server" ? "text-purple-500" :
                              step.to === "Database (MySQL/SQLite)" ? "text-amber-500" : "text-indigo-500"
                            )}>{step.to}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-white block">{step.msg}</span>
                          <span className={cn(
                            "inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mt-1",
                            step.type === "request" ? "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400" :
                            step.type === "db" ? "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400" :
                            "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400"
                          )}>{step.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: CLASS DIAGRAM (UML) */}
          {activeTab === 'class' && (
            <motion.div
              key="class"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4 p-6 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-950/40">
                <Database size={24} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Class Diagram (UML Relasional Database)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                    Diagram kelas sistem memetakan struktur database, field data beserta relasi logis antar entitas yang mendukung operasional SIPMB. Klik entitas untuk menyorot relasi.
                  </p>
                </div>
              </div>

              {/* UML Cards representation */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Class: User */}
                <div className="bg-white dark:bg-[#151921] rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-900 dark:bg-slate-800 text-white flex justify-between items-center border-b border-slate-700">
                    <span className="font-mono text-xs font-black uppercase tracking-widest">class User</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-600 rounded">Model / Entitas</span>
                  </div>
                  <div className="p-4 space-y-1 text-xs border-b border-slate-100 dark:border-slate-800/80">
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> fullName: string</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> email: string <span className="text-slate-400 dark:text-slate-600">// Unique</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> phone: string</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> role: UserRole</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> createdAt: number</p>
                  </div>
                  <div className="p-4 space-y-1 text-xs bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> register()</p>
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> login()</p>
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> updateProfile()</p>
                  </div>
                </div>

                {/* Class: StudentApplication */}
                <div className="bg-white dark:bg-[#151921] rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-900 dark:bg-slate-800 text-white flex justify-between items-center border-b border-slate-700">
                    <span className="font-mono text-xs font-black uppercase tracking-widest">class StudentApplication</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-600 rounded">Model / Entitas</span>
                  </div>
                  <div className="p-4 space-y-1 text-xs border-b border-slate-100 dark:border-slate-800/80">
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> userId: string <span className="text-slate-400 dark:text-slate-600">// FK</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> major: string</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> status: ApplicationStatus</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> participantNumber: string</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> score: number</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> reRegistrationPaid: boolean</p>
                  </div>
                  <div className="p-4 space-y-1 text-xs bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> createDraft()</p>
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> submit()</p>
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> verify()</p>
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> grade()</p>
                  </div>
                </div>

                {/* Class: RegistrationDocument */}
                <div className="bg-white dark:bg-[#151921] rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-900 dark:bg-slate-800 text-white flex justify-between items-center border-b border-slate-700">
                    <span className="font-mono text-xs font-black uppercase tracking-widest">class Document</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-600 rounded">Model / Entitas</span>
                  </div>
                  <div className="p-4 space-y-1 text-xs border-b border-slate-100 dark:border-slate-800/80">
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> userId: string <span className="text-slate-400 dark:text-slate-600">// FK</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> type: string <span className="text-slate-400 dark:text-slate-600">// e.g. KTP, KK</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> url: string</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> status: string <span className="text-slate-400 dark:text-slate-600">// verified/rejected</span></p>
                  </div>
                  <div className="p-4 space-y-1 text-xs bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> upload()</p>
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> verifyDocument()</p>
                  </div>
                </div>

                {/* Class: PaymentRecord */}
                <div className="bg-white dark:bg-[#151921] rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-900 dark:bg-slate-800 text-white flex justify-between items-center border-b border-slate-700">
                    <span className="font-mono text-xs font-black uppercase tracking-widest">class Payment</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-600 rounded">Model / Entitas</span>
                  </div>
                  <div className="p-4 space-y-1 text-xs border-b border-slate-100 dark:border-slate-800/80">
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> userId: string <span className="text-slate-400 dark:text-slate-600">// FK</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> amount: number</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> method: string</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> status: string <span className="text-slate-400 dark:text-slate-600">// success/pending</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> category: string <span className="text-slate-400 dark:text-slate-600">// tuition/registration</span></p>
                  </div>
                  <div className="p-4 space-y-1 text-xs bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> payInvoice()</p>
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> verifyPayment()</p>
                  </div>
                </div>

                {/* Class: Announcement */}
                <div className="bg-white dark:bg-[#151921] rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-900 dark:bg-slate-800 text-white flex justify-between items-center border-b border-slate-700">
                    <span className="font-mono text-xs font-black uppercase tracking-widest">class Announcement</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-600 rounded">Model / Entitas</span>
                  </div>
                  <div className="p-4 space-y-1 text-xs border-b border-slate-100 dark:border-slate-800/80">
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> title: string</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> content: string</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> type: string <span className="text-slate-400 dark:text-slate-600">// info/urgent</span></p>
                  </div>
                  <div className="p-4 space-y-1 text-xs bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> publish()</p>
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> archive()</p>
                  </div>
                </div>

                {/* Class: ActivityLog */}
                <div className="bg-white dark:bg-[#151921] rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-900 dark:bg-slate-800 text-white flex justify-between items-center border-b border-slate-700">
                    <span className="font-mono text-xs font-black uppercase tracking-widest">class ActivityLog</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-600 rounded">Audit Trail</span>
                  </div>
                  <div className="p-4 space-y-1 text-xs border-b border-slate-100 dark:border-slate-800/80">
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> userId: string <span className="text-slate-400 dark:text-slate-600">// FK</span></p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> action: string</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> details: string</p>
                    <p className="font-mono text-[11px] text-slate-500"><span className="text-blue-500">+</span> timestamp: number</p>
                  </div>
                  <div className="p-4 space-y-1 text-xs bg-slate-50/50 dark:bg-slate-900/10">
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-400"><span className="text-purple-500">[]</span> logAction()</p>
                  </div>
                </div>
              </div>

              {/* Entity Relationships Info */}
              <div className="p-8 bg-slate-50 dark:bg-[#1a1f29]/30 rounded-3xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Relasi Antar Kelas (Entity Relationships)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white dark:bg-[#151921] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <p className="font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-tight">User ⇄ StudentApplication</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Kardinalitas <span className="font-bold text-blue-500">1 to 1</span>. Setiap Calon Mahasiswa terikat dengan tepat satu data formulir pendaftaran.</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#151921] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <p className="font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-tight">User ⇄ Document</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Kardinalitas <span className="font-bold text-blue-500">1 to Many</span>. Satu pengguna mengunggah maksimal 4 jenis berkas persyaratan masuk.</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#151921] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <p className="font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-tight">User ⇄ Payment</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Kardinalitas <span className="font-bold text-blue-500">1 to Many</span>. Memiliki minimal dua transaksi keuangan (Biaya Daftar & UKT Semester 1).</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#151921] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <p className="font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-tight">User ⇄ ActivityLog</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Kardinalitas <span className="font-bold text-blue-500">1 to Many</span>. Seluruh interaksi penting dari operator (Admin) dicatat dalam log keamanan.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
