import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { dataApi } from '../lib/api';
import { StudentApplication, RegistrationDocument, PaymentRecord, Announcement, FeeConfig, AuthUser } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, FileText, CreditCard, ShieldCheck, Trophy, Bell, Megaphone, PenTool } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { profile } = useOutletContext<{ profile: AuthUser }>();
  const [application, setApplication] = useState<StudentApplication | null>(null);
  const [docs, setDocs] = useState<RegistrationDocument[]>([]);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [fees, setFees] = useState<FeeConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [annRes, feeRes, appRes] = await Promise.all([
          dataApi.getAnnouncements(),
          dataApi.getFees(),
          dataApi.getMyApplications(),
        ]);
        
        setAnnouncements(annRes.data);
        setFees(feeRes.data);
        
        if (appRes.data.length > 0) {
          setApplication(appRes.data[0]);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
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
      if (application.status === 'test_ready') return 'current';
      if (['accepted', 'rejected'].includes(application.status)) return 'completed';
      return 'pending';
    }
    if (index === 5) return ['accepted', 'rejected'].includes(application.status) ? 'completed' : 'pending';
    return 'pending';
  };

  if (loading) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1 text-slate-900">
            <h2 className="text-3xl font-black tracking-tight leading-tight">Halo, {profile?.fullName?.split(' ')[0]}! 👋</h2>
            <p className="text-base text-slate-500 font-medium">Selamat datang di portal akademik PMB.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 shrink-0">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-2">ID: {application?.participantNumber || 'NEW-USER'}</p>
             <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center text-white shadow-lg">
               <Trophy size={20} />
             </div>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex justify-between items-center mb-6 min-w-max">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock size={14} className="text-blue-500" /> Tahapan Seleksi
            </h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">PMB 2024</span>
          </div>
          
          <div className="relative flex justify-between items-center px-4 min-w-[600px] md:min-w-full">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 -z-0 rounded-full"></div>
            <div 
               className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 -z-0 rounded-full transition-all duration-1000"
               style={{ width: `${(steps.findIndex((_, i) => getStepStatus(i) === 'current') / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={index} className="z-10 flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                    status === 'completed' ? "bg-blue-900 border-blue-900 text-white shadow-lg shadow-blue-100" :
                    status === 'current' ? "bg-white border-blue-600 text-blue-600 scale-110 shadow-xl" :
                    "bg-white border-slate-200 text-slate-300"
                  )}>
                    {status === 'completed' ? <CheckCircle2 size={20} /> : step.icon}
                  </div>
                  <span className={cn(
                    "mt-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] text-center",
                    status === 'completed' || status === 'current' ? "text-slate-800" : "text-slate-400"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Summary Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prodi Pilihan</p>
            <p className="text-sm font-black text-slate-900">{application?.major || 'Belum Memilih'}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Biaya Pendaftaran</p>
            <p className="text-sm font-black text-slate-900">Rp 350.192</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Pembayaran</p>
            {payment?.status === 'success' ? (
              <span className="text-[10px] font-black text-green-600 flex items-center gap-1 uppercase">
                <CheckCircle2 size={12} /> Payment Verified
              </span>
            ) : (
              <span className="text-[10px] font-black text-amber-600 uppercase">Menunggu Pembayaran</span>
            )}
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kelengkapan Berkas</p>
            {docs.length >= 4 ? (
              <span className="text-[10px] font-black text-blue-600 flex items-center gap-1 uppercase">
                <CheckCircle2 size={12} /> Berkas Lengkap
              </span>
            ) : (
              <button 
                onClick={() => window.location.href = '/documents'}
                className="text-[10px] font-black text-rose-600 uppercase hover:underline text-left animate-pulse"
              >
                Complete Documents
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 overflow-hidden items-start">
        <div className="xl:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <h3 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-3">
                <FileText size={20} className="text-blue-600" /> Berkas Pendaftaran
              </h3>
              <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                 <p className="text-xs font-bold text-slate-700">{docs.length}/4 Dokumen</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                 {['Ijazah', 'Kartu Keluarga', 'Pas Foto', 'KTP'].map((label, i) => {
                    const status = docs[i]?.status || 'empty';
                    return (
                      <div key={label} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-blue-200 transition-all">
                         <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-1.5 h-6 rounded-full",
                              status === 'verified' ? "bg-green-500" : status === 'pending' ? "bg-amber-500" : "bg-slate-200"
                            )}></div>
                            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{label}</p>
                         </div>
                         <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{status === 'empty' ? 'Upload' : status}</button>
                      </div>
                    );
                 })}
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pembayaran</p>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Total Biaya</p>
                    <p className="text-2xl font-black font-mono">Rp 350.192</p>
                  </div>
                  <div className={cn("px-2 py-1 rounded text-[8px] font-black uppercase", payment?.status === 'success' ? "bg-green-500/20 text-green-400 border border-green-500/50" : "bg-amber-500/20 text-amber-400 border border-amber-500/50")}>
                    {payment?.status === 'success' ? 'LUNAS' : 'PENDING'}
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = '/payment'}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black tracking-widest hover:bg-blue-700 transition-all"
                >
                  {payment?.status === 'success' ? 'RIWAYAT TRANSAKSI' : 'BAYAR SEKARANG'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
           <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h3 className="text-base md:text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <Megaphone size={20} className="text-orange-500" /> Pengumuman
              </h3>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {announcements.length > 0 ? announcements.map((ann) => (
                  <div key={ann.id} className="pb-4 border-b border-slate-50 last:border-0 group">
                    <div className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mb-1.5 bg-blue-100 text-blue-700">{ann.type}</div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tighter truncate">{ann.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{ann.content}</p>
                  </div>
                )) : <p className="text-[11px] text-slate-400 italic text-center py-8">Belum ada info terbaru.</p>}
              </div>
           </div>

           <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Informasi UKT/Biaya</h3>
              <div className="space-y-2">
                 {fees.slice(0, 3).map((fee) => (
                   <div key={fee.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-600 uppercase truncate pr-2">{fee.description}</span>
                      <span className="text-xs font-black text-slate-800 shrink-0">Rp {fee.amount.toLocaleString('id-ID')}</span>
                   </div>
                 ))}
                 <button 
                   onClick={() => window.location.href = '/fees'}
                   className="w-full mt-4 py-3 bg-white border border-slate-200 text-[10px] font-black text-blue-600 uppercase tracking-widest rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm flex items-center justify-center gap-2"
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
