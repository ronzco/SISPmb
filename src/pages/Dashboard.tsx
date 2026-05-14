import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { dataApi } from '../lib/api';
import { StudentApplication, RegistrationDocument, PaymentRecord, Announcement, FeeConfig, AuthUser } from '../types';
import { motion } from 'motion/react';
import { 
  CheckCircle2, Clock, FileText, CreditCard, ShieldCheck, Trophy, 
  Bell, Megaphone, PenTool, QrCode, Copy, Share2, ExternalLink,
  Calendar, MapPin, ChevronRight, Download
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { profile } = useOutletContext<{ profile: AuthUser }>();
  const [application, setApplication] = useState<StudentApplication | null>(null);
  const [docs, setDocs] = useState<RegistrationDocument[]>([]);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [fees, setFees] = useState<FeeConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [annRes, feeRes, appRes, docRes, payRes] = await Promise.all([
          dataApi.getAnnouncements(),
          dataApi.getFees(),
          dataApi.getMyApplications(),
          dataApi.getMyDocuments(),
          dataApi.getMyPayment(),
        ]);
        
        setAnnouncements(annRes.data);
        setFees(feeRes.data);
        setDocs(docRes.data);
        setPayment(payRes.data);
        setFetchError(null);
        
        if (appRes.data.length > 0) {
          setApplication(appRes.data[0]);
        }
      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        const serverMessage = error.response?.data?.message || error.message;
        setFetchError(serverMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const steps = [
    { label: 'Registrasi', icon: <FileText size={18} /> },
    { label: 'Unggah Berkas', icon: <FileText size={18} /> },
    { label: 'Pembayaran', icon: <CreditCard size={18} /> },
    { label: 'Verifikasi', icon: <ShieldCheck size={18} /> },
    { label: 'Seleksi Tulis', icon: <PenTool size={18} /> },
    { label: 'Hasil Seleksi', icon: <Trophy size={18} /> },
  ];

  const getStepStatus = (index: number) => {
    if (!application) return index === 0 ? 'current' : 'pending';
    if (index === 0) return 'completed';
    const isDocsDone = docs.length >= 4;
    const isPaid = payment?.status === 'success';

    if (index === 1) return isDocsDone ? 'completed' : (isPaid ? 'current' : 'pending');
    if (index === 2) return isPaid ? 'completed' : 'current';
    if (index === 3) {
      if (application.status === 'verifying') return 'current';
      if (['test_ready', 'accepted', 'rejected'].includes(application.status)) return 'completed';
      return 'pending';
    }
    if (index === 4) {
      if (application.status === 'test_ready' || application.selectionCode) return 'current';
      if (['accepted', 'rejected'].includes(application.status)) return 'completed';
      return 'pending';
    }
    if (index === 5) return ['accepted', 'rejected'].includes(application.status) ? 'completed' : 'pending';
    return 'pending';
  };

  if (fetchError) return (
    <div className="max-w-xl mx-auto mt-12 p-10 bg-white dark:bg-[#151921] rounded-[2.5rem] border border-red-200 dark:border-red-900/30 text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Bell size={32} />
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Sync Error</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">Gagal sinkronisasi data: {fetchError}. Pastikan database MySQL aktif.</p>
      <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest">Retry Connection</button>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Syncing Academic Records...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-[1280px] mx-auto pb-20 px-4 sm:px-0">
      <div className="bg-white dark:bg-[#151921] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-10 shadow-sm relative overflow-hidden group transition-all duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 dark:bg-blue-900/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1 text-slate-900 dark:text-white">
            <h2 className="text-3xl font-black tracking-tight leading-tight">Halo, {profile?.fullName?.split(' ')[0]}! 👋</h2>
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Selamat datang di portal akademik PMB UNUTN.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700 shrink-0 shadow-sm hover:shadow-md transition-shadow">
             <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest pl-2">Participant ID: {application?.participantNumber || 'PENDING'}</p>
             <div className="w-10 h-10 bg-blue-900 dark:bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
               <Trophy size={20} />
             </div>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto pb-6 scrollbar-hide">
          <div className="flex justify-between items-center mb-8 min-w-max">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <Clock size={14} className="text-blue-500" /> Progress Seleksi
            </h3>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">TA 2024/2025</span>
          </div>
          
          <div className="relative flex justify-between items-center px-6 min-w-[700px] md:min-w-full">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 dark:bg-slate-800/50 -translate-y-1/2 -z-0 rounded-full"></div>
            <div 
               className="absolute top-1/2 left-0 h-[2px] bg-blue-600 -translate-y-1/2 -z-0 rounded-full transition-all duration-1000"
               style={{ width: `${(Math.max(0, steps.findIndex((_, i) => getStepStatus(i) === 'current')) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={index} className="z-10 flex flex-col items-center group/step">
                  <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                    status === 'completed' ? "bg-blue-900 dark:bg-blue-600 border-blue-900 dark:border-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/20" :
                    status === 'current' ? "bg-white dark:bg-slate-900 border-blue-600 text-blue-600 scale-110 shadow-xl shadow-blue-50 dark:shadow-none" :
                    "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/50 text-slate-300 dark:text-slate-700"
                  )}>
                    {status === 'completed' ? <CheckCircle2 size={20} /> : step.icon}
                  </div>
                  <span className={cn(
                    "mt-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-center max-w-[80px] leading-tight",
                    status === 'completed' || status === 'current' ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-600"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selection Card Section */}
        {(application?.selectionCode || application?.status === 'test_ready') && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-blue-900 dark:bg-blue-700 rounded-[2rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group shadow-blue-200 dark:shadow-none"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                      <QrCode size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Kartu Peserta Seleksi</p>
                      <h3 className="text-xl md:text-2xl font-black mt-0.5">Kode Seleksi Tulis</h3>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="bg-white/10 dark:bg-black/20 border border-white/20 rounded-2xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
                      <p className="text-4xl md:text-5xl font-black font-mono tracking-[0.2em] drop-shadow-lg">
                        {application?.selectionCode || "PENDING"}
                      </p>
                      {application?.selectionCode && (
                        <button 
                          onClick={() => alert(`Sistem sedang menyiapkan berkas PDF Kartu Ujian untuk: ${application.selectionCode}`)}
                          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-2xl text-[11px] font-black tracking-widest uppercase hover:bg-slate-50 transition-all shadow-xl active:scale-95 group/btn"
                        >
                          <Download size={18} className="group-hover/btn:translate-y-0.5 transition-transform" />
                          Cetak Kartu Ujian
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                       <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                         <MapPin size={12} className="text-blue-200" />
                         <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Kampus I UNUTN Kuningan</span>
                       </div>
                       <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                         <Calendar size={12} className="text-blue-200" />
                         <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Tgl: (Lihat Jadwal di Pengumuman)</span>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="hidden lg:block w-40 h-40 bg-white p-3 rounded-2xl shadow-inner relative">
                  <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                    <QrCode size={64} className="text-slate-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none"></div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-[10px] font-medium opacity-70 leading-relaxed italic max-w-lg">
                  *Harap dibawa pada saat ujian seleksi tulis. Kehilangan kode dapat menghambat proses verifikasi kehadiran ujian.
                </p>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                   <span className="text-[9px] font-black uppercase tracking-widest text-green-300">Verified by Admin Registry</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Prodi Pilihan</p>
            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate">{application?.major || 'Belum Memilih'}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Biaya Pendaftaran</p>
            <p className="text-sm font-black text-slate-900 dark:text-white font-mono">Rp 350.192</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Status Pembayaran</p>
            {payment?.status === 'success' ? (
              <span className="text-[10px] font-black text-green-600 dark:text-green-400 flex items-center gap-1 uppercase">
                <CheckCircle2 size={12} /> Payment Verified
              </span>
            ) : (
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase">Menunggu Pembayaran</span>
            )}
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Kelengkapan Berkas</p>
            {docs.length >= 4 ? (
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1 uppercase">
                <CheckCircle2 size={12} /> Berkas Lengkap
              </span>
            ) : (
              <button 
                onClick={() => window.location.href = '/documents'}
                className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase hover:underline text-left animate-pulse"
              >
                Complete Documents
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 overflow-hidden items-start">
        <div className="xl:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white dark:bg-[#151921] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <h3 className="text-base md:text-lg font-black text-slate-800 dark:text-white flex items-center gap-3">
                <FileText size={20} className="text-blue-600" /> Berkas Pendaftaran
              </h3>
              <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl w-fit">
                 <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{docs.length}/4 Dokumen</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                 {['Ijazah', 'Kartu Keluarga', 'Pas Foto', 'KTP'].map((label) => {
                    const doc = docs.find(d => d.type.toLowerCase() === label.toLowerCase());
                    const status = doc?.status || 'empty';
                    return (
                      <div key={label} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                         <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-1.5 h-6 rounded-full",
                              status === 'verified' ? "bg-green-500" : status === 'pending' ? "bg-amber-500" : "bg-slate-200 dark:bg-slate-700"
                            )}></div>
                            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">{label}</p>
                         </div>
                         <button 
                            onClick={() => status === 'empty' && (window.location.href = '/documents')}
                            className={cn(
                              "text-[9px] font-black uppercase tracking-widest",
                              status === 'empty' ? "text-blue-600 dark:text-blue-400" : 
                              status === 'verified' ? "text-green-600 dark:text-green-400" : "text-amber-600"
                            )}
                         >
                            {status === 'empty' ? 'Upload' : status}
                         </button>
                      </div>
                    );
                 })}
              </div>

              <div className="bg-slate-900 dark:bg-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
                <p className="text-[10px] font-black text-slate-400 dark:text-blue-300/60 uppercase tracking-[0.2em] mb-4 relative z-10">Keuangan Pendaftaran</p>
                <div className="flex justify-between items-end mb-6 relative z-10">
                  <div>
                    <p className="text-[9px] text-slate-400 dark:text-blue-300/60 uppercase font-black tracking-widest">Tagihan</p>
                    <p className="text-2xl font-black font-mono tracking-tighter">Rp 350.192</p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-[8px] font-black uppercase", 
                    payment?.status === 'success' 
                      ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                  )}>
                    {payment?.status === 'success' ? 'LUNAS' : 'PENDING'}
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = '/payment'}
                  className="w-full py-4 bg-blue-600 dark:bg-white dark:text-blue-900 text-white rounded-xl text-[10px] font-black tracking-widest hover:bg-blue-700 dark:hover:bg-slate-50 transition-all relative z-10 shadow-lg"
                >
                  {payment?.status === 'success' ? 'RIWAYAT TRANSAKSI' : 'BAYAR SEKARANG'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
           <div className="bg-white dark:bg-[#151921] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
              <h3 className="text-base md:text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Megaphone size={20} className="text-orange-500" /> Pengumuman
              </h3>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
                {announcements.length > 0 ? announcements.map((ann) => (
                  <div key={ann.id} className="pb-4 border-b border-slate-50 dark:border-slate-800/50 last:border-0 group">
                    <div className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mb-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">{ann.type}</div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tighter truncate">{ann.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{ann.content}</p>
                  </div>
                )) : <p className="text-[11px] text-slate-400 italic text-center py-8">Belum ada info terbaru.</p>}
              </div>
           </div>

           <div className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Informasi UKT/Biaya</h3>
              <div className="space-y-2">
                 {fees.slice(0, 3).map((fee) => (
                   <div key={fee.id} className="flex justify-between items-center bg-white dark:bg-[#1A1F29] p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase truncate pr-2">{fee.description}</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white shrink-0 font-mono">Rp {fee.amount.toLocaleString('id-ID')}</span>
                   </div>
                 ))}
                 <button 
                   onClick={() => window.location.href = '/fees'}
                   className="w-full mt-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center justify-center gap-2"
                 >
                   STRUKTUR BIAYA & PRODI <FileText size={14} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
