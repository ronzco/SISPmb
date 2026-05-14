import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { dataApi } from '../lib/api';
import { StudentApplication, ApplicationStatus, AuthUser, RegistrationDocument } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { User, GraduationCap, MapPin, CheckCircle2, Save, Send, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { FACULTIES } from '../constants/programs';

export default function Registration() {
  const { profile } = useOutletContext<{ profile: AuthUser }>();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    birthPlace: '',
    birthDate: '',
    gender: '',
    address: '',
    phone: '',
    previousSchool: '',
    gradYear: '',
    program: '',
    major: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [appStatus, setAppStatus] = useState<ApplicationStatus>('draft');
  const [appId, setAppId] = useState<string | null>(null);
  const [docs, setDocs] = useState<RegistrationDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const selectedFaculty = FACULTIES.find(f => f.id === formData.program);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const [appRes, docRes] = await Promise.all([
          dataApi.getMyApplications(),
          dataApi.getMyDocuments()
        ]);
        
        setDocs(docRes.data);
        
        if (appRes.data.length > 0) {
          const app = appRes.data[0];
          setFormData(prev => ({ ...prev, ...app }));
          setAppStatus(app.status);
          setAppId(app.id);
        } else {
          setFormData(prev => ({ 
            ...prev, 
            fullName: profile.fullName || '',
          }));
        }
      } catch (error) {
        console.error("Fetch application error:", error);
      } finally {
        setLoading(false);
        setDocsLoading(false);
      }
    };

    fetchExistingData();
  }, [profile]);

  const handleSave = async (isSubmit = false) => {
    if (isSubmit && !validateStep(step)) return;
    
    setSaving(true);
    try {
      if (appId) {
        await dataApi.updateApplication(appId, {
          ...formData,
          status: isSubmit ? 'verifying' : 'draft',
        });
      } else {
        const res = await dataApi.createApplication({
          ...formData,
          status: isSubmit ? 'verifying' : 'draft',
        });
        setAppId(res.data.id);
      }

      if (isSubmit) {
        alert(`Pendaftaran Anda berhasil dikirimkan. Anda akan diarahkan ke halaman pembayaran.`);
        setAppStatus('verifying');
        window.location.href = '/payment';
      } else {
        alert('Progress berhasil disimpan.');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const isReadOnly = appStatus !== 'draft' && step !== 4;
  const isDocsComplete = docs.length >= 4;

  const validateStep = (s: number) => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!formData.fullName) newErrors.fullName = 'Nama lengkap wajib diisi';
      if (!formData.birthPlace) newErrors.birthPlace = 'Tempat lahir wajib diisi';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const steps = [
    { label: 'Identitas Diri', icon: <User size={20} /> },
    { label: 'Domisili', icon: <MapPin size={20} /> },
    { label: 'Akademik', icon: <GraduationCap size={20} /> },
    { label: 'Konfirmasi', icon: <CheckCircle2 size={20} /> },
  ];

  if (loading || docsLoading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Initializing Secure Portal...</p>
    </div>
  );

  if (!isDocsComplete && appStatus === 'draft') {
    return (
      <div className="max-w-xl mx-auto mt-12 p-10 bg-white dark:bg-[#151921] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-center text-rose-500 dark:text-rose-400 mx-auto mb-6 shadow-lg shadow-rose-100 dark:shadow-none">
           <FileText size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Lengkapi Dokumen</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
          Maaf, Anda harus mengunggah semua dokumen persyaratan (Ijazah, KK, Pas Foto, KTP) sebelum dapat melanjutkan ke proses pendaftaran.
        </p>
        <button 
          onClick={() => window.location.href = '/documents'}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-none"
        >
          Unggah Dokumen Sekarang
        </button>
      </div>
    );
  }

  if (appStatus !== 'draft' && step !== 4) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-10 bg-white dark:bg-[#151921] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl text-center transition-colors">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center text-emerald-500 dark:text-emerald-400 mx-auto mb-6 shadow-lg shadow-emerald-100 dark:shadow-none">
           <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Pendaftaran Selesai</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
          Anda sudah melakukan pendaftaran. Silakan pantau status pendaftaran Anda melalui halaman Dashboard.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Stepper */}
      <div className="flex justify-between items-center mb-10 px-2 md:px-4 max-w-2xl mx-auto">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center relative">
            {i !== 0 && (
              <div className={cn(
                "absolute top-4 md:top-5 -left-1/2 right-1/2 h-[2px] transition-colors duration-500",
                step > i ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
              )}></div>
            )}
            <div className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300",
              step > i ? "bg-blue-600 text-white" : 
              step === i + 1 ? "bg-white dark:bg-slate-900 border-2 border-blue-600 text-blue-600 shadow-lg shadow-blue-50 dark:shadow-none" : 
              "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
            )}>
              <div className="scale-75 md:scale-100">
                {s.icon}
              </div>
            </div>
            <span className={cn(
              "text-[8px] md:text-[10px] uppercase font-bold mt-2 tracking-wider text-center px-1",
              step === i + 1 ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"
            )}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-[#151921] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors"
        >
          <div className="p-6 md:p-10">
            {step === 1 && (
              <div className="space-y-6">
                {isReadOnly && (
                  <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl flex items-center gap-3 text-amber-800 dark:text-amber-400 text-[10px] md:text-xs font-bold uppercase tracking-tight">
                    <Save size={16} /> Data terkunci karena sedang dalam proses verifikasi.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nama Lengkap sesuai Ijazah</label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      disabled={isReadOnly}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={cn(
                        "w-full px-5 py-4 rounded-2xl border dark:bg-slate-800/50 dark:text-white dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium",
                        errors.fullName ? "border-red-500 bg-red-50" : "border-slate-200",
                        isReadOnly && "bg-slate-50 opacity-70"
                      )}
                      placeholder="Masukkan nama lengkap..."
                    />
                    {errors.fullName && <p className="text-[10px] text-red-500 font-bold">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tempat Lahir</label>
                    <input 
                      type="text" 
                      value={formData.birthPlace}
                      disabled={isReadOnly}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      className={cn(
                        "w-full px-5 py-4 rounded-2xl border dark:bg-slate-800/50 dark:text-white dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium",
                        errors.birthPlace ? "border-red-500 bg-red-50" : "border-slate-200",
                        isReadOnly && "bg-slate-50 opacity-70"
                      )}
                      placeholder="Kota kelahiran..."
                    />
                    {errors.birthPlace && <p className="text-[10px] text-red-500 font-bold">{errors.birthPlace}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tanggal Lahir</label>
                    <input 
                      type="date" 
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Jenis Kelamin</label>
                    <div className="flex gap-4">
                      {['Laki-laki', 'Perempuan'].map(g => (
                        <label key={g} className={cn(
                          "flex-1 py-4 px-4 rounded-2xl border cursor-pointer text-center transition-all font-bold text-xs uppercase tracking-widest",
                          formData.gender === g 
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20" 
                            : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-300"
                        )}>
                          <input 
                            type="radio" 
                            name="gender" 
                            className="hidden" 
                            value={g} 
                            checked={formData.gender === g}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Alamat Lengkap (KTP)</label>
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[140px] placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium"
                    placeholder="Nama jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nomor WhatsApp Aktif</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                      placeholder="81234567890"
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400 border-r border-slate-200 dark:border-slate-700 pr-3">+62</div>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic mt-2">*Mohon pastikan nomor ini aktif untuk koordinasi seleksi via WhatsApp.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sekolah Asal (SMA/SMK/MA/Pesantren)</label>
                    <input 
                      type="text" 
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium"
                      placeholder="Nama instansi pendidikan asal..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tahun Kelulusan</label>
                    <select 
                      value={formData.gradYear}
                      onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium appearance-none"
                    >
                      <option value="">Pilih Tahun</option>
                      {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 mb-6 relative z-10 text-blue-200">
                    <CheckCircle2 size={16} /> Pemilihan Program Studi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-300/60 uppercase tracking-widest">Fakultas Utama</label>
                      <select 
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value, major: '' })}
                        className="w-full px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-white outline-none transition-all bg-white/10 backdrop-blur-md text-white font-bold"
                      >
                        <option value="" className="text-slate-900">Pilih Fakultas</option>
                        {FACULTIES.map((faculty) => (
                          <option key={faculty.id} value={faculty.id} className="text-slate-900">{faculty.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-300/60 uppercase tracking-widest">Program Studi Tujuan</label>
                      <select 
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-white outline-none transition-all bg-white/10 backdrop-blur-md text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={!formData.program}
                      >
                        <option value="" className="text-slate-900">Pilih Prodi</option>
                        {selectedFaculty?.programs.map(p => (
                          <option key={p.id} value={p.name} className="text-slate-900">{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="py-8 flex flex-col items-center text-center space-y-8">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2rem] flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2 shadow-inner">
                  <CheckCircle2 size={56} className="animate-float" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Konfirmasi Pendaftaran</h3>
                  <p className="max-w-md text-slate-500 dark:text-slate-400 font-medium">
                    Mohon teliti kembali data Anda. Data yang sudah diajukan tidak dapat diubah tanpa persetujuan admin.
                  </p>
                </div>
                
                <div className="w-full max-w-2xl bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] p-8 text-left space-y-5 border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 gap-1">
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Pilihan Utama</span>
                    <span className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{formData.major}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 gap-1">
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Fakultas</span>
                    <span className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{selectedFaculty?.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 gap-1">
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Asal Sekolah</span>
                    <span className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{formData.previousSchool} ({formData.gradYear})</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 md:px-10 py-6 bg-slate-50 dark:bg-[#1A1F29] border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4 transition-colors">
            <div className="flex gap-2">
              {step > 1 && step < 4 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
                >
                  Kembali
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 ml-auto w-full sm:w-auto">
              {step < 4 && (
                <button 
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="flex-1 sm:flex-none px-6 py-3 flex items-center justify-center gap-2 rounded-2xl font-black uppercase text-[10px] tracking-widest text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                  <Save size={16} /> {saving ? 'Saving...' : 'Draft'}
                </button>
              )}
              {step < 3 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  className="flex-1 sm:flex-none px-10 py-3 bg-blue-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-800 dark:hover:bg-blue-500 shadow-xl shadow-blue-900/20 transition-all active:scale-95"
                >
                  Lanjut
                </button>
              ) : step === 3 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  className="flex-1 sm:flex-none px-10 py-3 bg-blue-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-800 dark:hover:bg-blue-500 shadow-xl shadow-blue-900/20 transition-all active:scale-95"
                >
                  Review
                </button>
              ) : step === 4 ? (
                <button 
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="w-full sm:w-auto px-10 py-4 bg-green-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-green-700 shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <Send size={20} /> Kirim Sekarang
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
