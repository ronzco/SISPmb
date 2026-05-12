import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, limit, doc, setDoc, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/fireErrorHandler';
import { StudentApplication, ApplicationStatus, RegistrationDocument, PaymentRecord, UserRole, UserProfile, Announcement, FeeConfig } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, Camera, FileText, CreditCard, ShieldCheck, Trophy, Bell, AlertCircle, Download, Megaphone, DollarSign, PenTool } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [application, setApplication] = useState<StudentApplication | null>(null);
  const [docs, setDocs] = useState<RegistrationDocument[]>([]);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [fees, setFees] = useState<FeeConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;
      
      // 0. Fetch Profile
      const profileSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', uid), limit(1))).catch(e => handleFirestoreError(e, OperationType.GET, 'users'));
      if (profileSnap && !profileSnap.empty) {
        setProfile(profileSnap.docs[0].data() as UserProfile);
      } else if (auth.currentUser) {
        // Create initial profile
        const newProfile: UserProfile = {
          uid: auth.currentUser.uid,
          fullName: auth.currentUser.displayName || 'Calon Mahasiswa',
          email: auth.currentUser.email || '',
          role: 'applicant',
          createdAt: Date.now()
        };
        await setDoc(doc(db, 'users', uid), newProfile);
        setProfile(newProfile);
      }
      
      // 1. Fetch Content
      const annSnap = await getDocs(query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(5)));
      setAnnouncements(annSnap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement)));

      const feeSnap = await getDocs(query(collection(db, 'fees_config'), orderBy('updatedAt', 'desc')));
      setFees(feeSnap.docs.map(d => ({ id: d.id, ...d.data() } as FeeConfig)));

      // 2. Fetch Application
      const appQ = query(collection(db, 'applications'), where('userId', '==', uid), limit(1));
      const appSnap = await getDocs(appQ).catch(e => handleFirestoreError(e, OperationType.LIST, 'applications'));
      if (appSnap && !appSnap.empty) {
        setApplication({ id: appSnap.docs[0].id, ...appSnap.docs[0].data() } as StudentApplication);
      }

      // 3. Fetch Documents
      const docsQ = query(collection(db, 'documents'), where('userId', '==', uid));
      const docsSnap = await getDocs(docsQ).catch(e => handleFirestoreError(e, OperationType.LIST, 'documents'));
      if (docsSnap) {
        setDocs(docsSnap.docs.map(d => ({ id: d.id, ...d.data() } as RegistrationDocument)));
      }

      // 4. Fetch Payment
      const payQ = query(collection(db, 'payments'), where('userId', '==', uid), limit(1));
      const paySnap = await getDocs(payQ).catch(e => handleFirestoreError(e, OperationType.LIST, 'payments'));
      if (paySnap && !paySnap.empty) {
        setPayment({ id: paySnap.docs[0].id, ...paySnap.docs[0].data() } as PaymentRecord);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const steps = [
    { label: 'Registrasi', icon: <FileText size={18} /> },
    { label: 'Unggah Berkas', icon: <Camera size={18} /> },
    { label: 'Pembayaran', icon: <CreditCard size={18} /> },
    { label: 'Verifikasi', icon: <ShieldCheck size={18} /> },
    { label: 'Seleksi Tulis', icon: <PenTool size={18} /> },
    { label: 'Hasil Seleksi', icon: <Trophy size={18} /> },
  ];

  const getStepStatus = (index: number) => {
    if (!application) return index === 0 ? 'current' : 'pending';
    
    // Logic based on state
    if (index === 0) return 'completed'; // Registration is done if application exists
    
    const requiredDocs = 4;
    const isDocsDone = docs.length >= requiredDocs;
    const isPaid = payment?.status === 'success';

    if (index === 1) { // Unggah Berkas
      if (isDocsDone) return 'completed';
      return isPaid ? 'current' : 'pending';
    }

    if (index === 2) { // Pembayaran
      if (isPaid) return 'completed';
      return 'current';
    }

    if (index === 3) { // Verifikasi
      if (application.status === 'verifying') return 'current';
      if (['test_ready', 'accepted', 'rejected'].includes(application.status)) return 'completed';
      return 'pending';
    }

    if (index === 4) { // Seleksi Tulis
      if (application.status === 'test_ready') return 'current';
      if (['accepted', 'rejected'].includes(application.status)) return 'completed';
      return 'pending';
    }

    if (index === 5) { // Hasil Seleksi
      if (['accepted', 'rejected'].includes(application.status)) return 'completed';
      return 'pending';
    }
    
    return 'pending';
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );


  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Editorial Welcome Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Halo, {profile?.fullName?.split(' ')[0]}! 👋
            </h2>
            <p className="text-base text-slate-500 font-medium">Selamat datang di portal akademik UTN. Pantau kemajuan pendaftaran Anda di sini.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <div className="text-right pr-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                {application?.participantNumber ? 'Nomor Peserta' : 'ID Registrasi'}
              </p>
              <p className="text-xs font-mono font-bold text-slate-800">
                {application?.participantNumber || `#UTN-24-${auth.currentUser?.uid.substring(0, 5).toUpperCase()}`}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <Trophy size={20} />
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock size={14} className="text-blue-500" /> Tahapan Seleksi
            </h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Gelombang II</span>
          </div>
          
          <div className="relative flex justify-between items-center px-2">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 -z-0 rounded-full"></div>
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${(steps.findIndex((_, i) => getStepStatus(i) === 'current') / (steps.length - 1)) * 100}%` }}
               className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 -z-0 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-1000"
            ></motion.div>
            
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={index} className="z-10 flex flex-col items-center">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                    status === 'completed' ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" :
                    status === 'current' ? "bg-white border-blue-600 text-blue-600 scale-110 shadow-xl shadow-blue-100 ring-4 ring-blue-50" :
                    "bg-white border-slate-200 text-slate-300"
                  )}>
                    {status === 'completed' ? <CheckCircle2 size={24} /> : React.cloneElement(step.icon as React.ReactElement, { size: 22 })}
                  </div>
                  <span className={cn(
                    "mt-3 text-[10px] font-black uppercase tracking-wider",
                    status === 'completed' || status === 'current' ? "text-slate-800" : "text-slate-400"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Notification (Conditional) */}
      {application?.status === 'test_ready' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-blue-600 text-white shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0 backdrop-blur-sm">
            <PenTool size={40} />
          </div>
          <div className="text-center md:text-left flex-1 relative z-10">
            <h3 className="text-2xl font-black tracking-tight uppercase">Kartu Peserta Ujian</h3>
            <p className="text-sm mt-2 font-medium text-blue-100 leading-relaxed max-w-2xl">
              Selamat! Berkas pendaftaran Anda telah diverifikasi. Anda telah terdaftar sebagai peserta Seleksi Tulis (SKD). Silakan unduh kartu peserta dan perhatikan jadwal ujian Anda.
            </p>
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
               <button className="px-8 py-3 bg-white text-blue-700 rounded-2xl text-xs font-black tracking-widest hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20">
                 UNDUH KARTU UJIAN <Download size={14} />
               </button>
               <button className="px-8 py-3 bg-blue-500 text-white border border-blue-400 rounded-2xl text-xs font-black tracking-widest hover:bg-blue-400 transition-all flex items-center gap-2">
                 JADWAL SELEKSI <Clock size={14} />
               </button>
            </div>
          </div>
        </motion.div>
      )}

      {(application?.status === 'accepted' || application?.status === 'rejected') && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8 border-4 transition-all hover:scale-[1.01]",
            application.status === 'accepted' 
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" 
              : "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
          )}
        >
          <div className={cn(
            "w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-inner",
            application.status === 'accepted' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          )}>
            {application.status === 'accepted' ? <Trophy size={40} /> : <AlertCircle size={40} />}
          </div>
          <div className="text-center md:text-left flex-1">
            <h3 className={cn(
              "text-2xl font-black tracking-tight",
              application.status === 'accepted' ? "text-green-900" : "text-red-900"
            )}>
              {application.status === 'accepted' ? "PENGUMUMAN KELULUSAN" : "HASIL SELEKSI AKADEMIK"}
            </h3>
            <p className="text-sm mt-2 font-medium opacity-80 leading-relaxed max-w-2xl">
              {application.status === 'accepted' 
                ? `Selamat ${profile?.fullName}, Anda telah resmi DISAHKAN sebagai calon mahasiswa Program Studi ${application.major}. Silakan lakukan registrasi ulang dan pembayaran UKT untuk mengamankan kursi Anda.`
                : "Terima kasih atas partisipasi Anda dalam kompetisi seleksi PMB 2024. Saat ini kursi untuk pilihan prodi Anda telah penuh. Anda masih dapat mendaftar kembali di gelombang khusus jika tersedia."}
            </p>
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              {application.status === 'accepted' && (
                <>
                  <button className="px-8 py-3 bg-green-600 text-white rounded-2xl text-xs font-black tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100 flex items-center gap-2">
                    SURAT KEPUTUSAN <Download size={14} />
                  </button>
                  <button 
                    onClick={() => window.location.href = '/payment'}
                    className="px-8 py-3 bg-white text-green-700 border-2 border-green-200 rounded-2xl text-xs font-black tracking-widest hover:bg-green-50 transition-all flex items-center gap-2"
                  >
                    BAYAR REGISTRASI <CreditCard size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Bento Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Docs & Payment */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                <FileText size={22} className="text-blue-600" /> Berkas & Administrasi
              </h3>
              <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verifikasi Status</p>
                 <p className="text-xs font-bold text-slate-700">{docs.length}/4 Berkas</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Document List */}
              <div className="space-y-6">
                 <div className="grid grid-cols-1 gap-3">
                   {[
                      { id: 'ijazah', label: 'Ijazah / SKL SMA' },
                      { id: 'kk', label: 'Kartu Keluarga' },
                      { id: 'foto', label: 'Pas Foto 4x6' },
                      { id: 'ktp', label: 'KTP / Kartu Pelajar' },
                   ].map((type) => {
                      const upload = docs.find(d => d.type === type.id);
                      return (
                        <div key={type.id} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-blue-200 transition-all">
                           <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-2 h-8 rounded-full transition-colors",
                                upload?.status === 'verified' ? "bg-green-500" :
                                upload?.status === 'pending' ? "bg-amber-500" :
                                "bg-slate-200"
                              )}></div>
                              <div>
                                <p className="text-xs font-bold text-slate-700 leading-none">{type.label}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">Format: PDF/JPG Max 2MB</p>
                              </div>
                           </div>
                           <div className="text-right">
                              {upload ? (
                                <span className={cn(
                                  "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                                  upload.status === 'verified' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                )}>{upload.status}</span>
                              ) : (
                                <button className="text-[10px] font-black text-blue-600 hover:scale-105 transition-transform">UPLOAD</button>
                              )}
                           </div>
                        </div>
                      );
                   })}
                 </div>
              </div>

              {/* Payment Summary */}
              <div className="flex flex-col gap-6">
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    {application?.status === 'accepted' ? 'Tagihan Registrasi Ulang' : 'Ringkasan Biaya'}
                  </p>
                  <div className="space-y-2">
                    {application?.status === 'accepted' ? (
                      <>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>UKT Semester I</span>
                          <span className="font-mono text-slate-200">Rp 4.500.000</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Jas Almamater & Orientasi</span>
                          <span className="font-mono text-slate-200">Rp 1.250.000</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Pendaftaran Gel. II</span>
                          <span className="font-mono text-slate-200">Rp 350.000</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Administrasi Mutasi</span>
                          <span className="font-mono text-slate-200">Rp 192</span>
                        </div>
                      </>
                    )}
                    <div className="pt-4 mt-2 border-t border-slate-700 flex justify-between items-end">
                       <span className="text-sm font-bold text-slate-300">Total Tagihan</span>
                       <span className="text-2xl font-black text-white font-mono tracking-tighter">
                          {application?.status === 'accepted' ? 'Rp 5.750.000' : 'Rp 350.192'}
                       </span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    {payment?.status === 'success' ? (
                      <div className="flex items-center gap-2 text-green-400 bg-green-900/40 p-3 rounded-xl border border-green-800/50">
                        <CheckCircle2 size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">TRANSAKSI LUNAS</span>
                      </div>
                    ) : (
                      <button 
                         onClick={() => window.location.href = '/payment'}
                         className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                      >
                          BAYAR SEKARANG
                      </button>
                    )}
                  </div>
                </div>

                {/* Verification Action Card */}
                {(application?.status === 'submitted' || application?.status === 'draft') && docs.length >= 4 && payment?.status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-xl shadow-blue-100"
                  >
                    <div className="flex items-start gap-4">
                       <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <ShieldCheck size={20} />
                       </div>
                       <div>
                          <h4 className="text-sm font-black uppercase tracking-wider mb-1 leading-tight">Ajukan Verifikasi</h4>
                          <p className="text-[10px] text-blue-100 opacity-80 leading-relaxed mb-4">Semua prasyarat telah terpenuhi. Mohon periksa kembali data Anda sebelum dikirim ke tim seleksi.</p>
                          <button 
                            onClick={async () => {
                              const appRef = doc(db, 'applications', auth.currentUser!.uid);
                              await setDoc(appRef, { status: 'verifying', updatedAt: Date.now() }, { merge: true });
                              window.location.reload();
                            }}
                            className="px-6 py-2 bg-white text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all"
                          >
                            KIRIM SEKARANG
                          </button>
                       </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: News & Info */}
        <div className="space-y-8">
           {/* Announcements editorial style */}
           <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <Megaphone size={22} className="text-orange-500" /> Papan Pengumuman
              </h3>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {announcements.length > 0 ? (
                  announcements.map((ann) => (
                    <div key={ann.id} className="pb-6 border-b border-slate-50 last:border-0 group cursor-pointer">
                      <div className={cn(
                        "inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest mb-2",
                        ann.type === 'urgent' ? "bg-red-100 text-red-700" :
                        ann.type === 'warning' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {ann.type}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{ann.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-3">{ann.content}</p>
                      <div className="flex items-center gap-3 mt-3 text-[9px] text-slate-400 font-bold uppercase">
                         <span>Admin Akademik</span>
                         <span>•</span>
                         <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Bell size={40} className="mx-auto text-slate-100 mb-2" />
                    <p className="text-xs text-slate-400 italic">Belum ada pengumuman terbaru.</p>
                  </div>
                )}
              </div>
           </div>

           {/* Quick Fee List */}
           <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Informasi UKT/Biaya</h3>
              <div className="space-y-2">
                 {fees.slice(0, 3).map((fee) => (
                   <div key={fee.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-600 uppercase">{fee.description}</span>
                      <span className="text-xs font-black text-slate-800">Rp {fee.amount.toLocaleString('id-ID')}</span>
                   </div>
                 ))}
                 <button className="w-full mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                    LIHAT SEMUA PRODI
                 </button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
