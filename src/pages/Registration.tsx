import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc, query, collection, where, getDocs, limit } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/fireErrorHandler';
import { StudentApplication, ApplicationStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { User, GraduationCap, MapPin, CheckCircle2, Save, Send } from 'lucide-react';
import { cn } from '../lib/utils';

import { FACULTIES } from '../constants/programs';

export default function Registration() {
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

  const selectedFaculty = FACULTIES.find(f => f.id === formData.program);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [appStatus, setAppStatus] = useState<ApplicationStatus>('draft');

  const validateStep = (s: number) => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!formData.fullName) newErrors.fullName = 'Nama lengkap wajib diisi';
      if (!formData.birthPlace) newErrors.birthPlace = 'Tempat lahir wajib diisi';
      if (!formData.birthDate) newErrors.birthDate = 'Tanggal lahir wajib diisi';
      if (!formData.gender) newErrors.gender = 'Pilih jenis kelamin';
    } else if (s === 2) {
      if (!formData.address) newErrors.address = 'Alamat wajib diisi';
      if (!formData.phone) newErrors.phone = 'Nomor WhatsApp wajib diisi';
      else if (!/^\d{10,13}$/.test(formData.phone)) newErrors.phone = 'Format nomor HP tidak valid';
    } else if (s === 3) {
      if (!formData.previousSchool) newErrors.previousSchool = 'Sekolah asal wajib diisi';
      if (!formData.gradYear) newErrors.gradYear = 'Tahun lulus wajib diisi';
      if (!formData.program) newErrors.program = 'Pilih fakultas';
      if (!formData.major) newErrors.major = 'Pilih prodi';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!auth.currentUser) return;
      
      const q = query(
        collection(db, 'applications'),
        where('userId', '==', auth.currentUser.uid),
        limit(1)
      );
      const querySnapshot = await getDocs(q).catch(e => handleFirestoreError(e, OperationType.LIST, 'applications'));
      
      if (querySnapshot && !querySnapshot.empty) {
        const app = querySnapshot.docs[0].data() as StudentApplication;
        setFormData(prev => ({ ...prev, ...app as any }));
        setAppStatus(app.status);
      } else {
        const profileRef = doc(db, 'users', auth.currentUser.uid);
        const profileSnap = await getDoc(profileRef).catch(e => handleFirestoreError(e, OperationType.GET, `users/${auth.currentUser?.uid}`));
        if (profileSnap && profileSnap.exists()) {
          const profile = profileSnap.data();
          setFormData(prev => ({ 
            ...prev, 
            fullName: profile.fullName || '',
            email: profile.email || '',
          }));
        }
      }
      setLoading(false);
    };

    fetchExistingData();
  }, []);

  const handleSave = async (isSubmit = false) => {
    if (!auth.currentUser) return;
    if (isSubmit && !validateStep(step)) return;
    
    setSaving(true);
    
    try {
      const appId = auth.currentUser.uid;
      const appRef = doc(db, 'applications', appId);
      
      const participantNumber = isSubmit ? `PMB-2024-${Math.floor(1000 + Math.random() * 9000)}` : (formData as any).participantNumber || null;

      const payload: Partial<StudentApplication> = {
        id: appId,
        userId: auth.currentUser.uid,
        status: isSubmit ? 'submitted' : 'draft',
        updatedAt: Date.now(),
        participantNumber: participantNumber ?? undefined,
        fullName: formData.fullName,
      };
      
      await setDoc(appRef, { ...formData, ...payload }, { merge: true }).catch(e => handleFirestoreError(e, OperationType.WRITE, `applications/${appId}`));
      
      // Log activity
      const logRef = doc(collection(db, 'logs'));
      await setDoc(logRef, {
        userId: auth.currentUser.uid,
        action: isSubmit ? 'SUBMIT_APPLICATION' : 'SAVE_DRAFT',
        details: isSubmit ? `Submitted application for ${formData.major}` : 'Saved draft registration data',
        timestamp: Date.now()
      });

      if (isSubmit) {
        try {
          await fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: auth.currentUser.email,
              fullName: formData.fullName,
              major: formData.major
            })
          });
        } catch (e) {
          console.error("Email notification failed:", e);
        }

        alert(`Pendaftaran Anda berhasil dikirimkan. Nomor Peserta: ${participantNumber}. Silakan cek status Anda di Dashboard.`);
        setStep(4);
        setAppStatus('submitted');
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

  const isReadOnly = appStatus !== 'draft' && appStatus !== 'submitted' && step !== 4;

  const steps = [
    { label: 'Identitas Diri', icon: <User size={20} /> },
    { label: 'Domisili', icon: <MapPin size={20} /> },
    { label: 'Akademik', icon: <GraduationCap size={20} /> },
    { label: 'Konfirmasi', icon: <CheckCircle2 size={20} /> },
  ];

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Stepper */}
      <div className="flex justify-between items-center mb-8 px-2 md:px-4">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center relative">
            {i !== 0 && (
              <div className={cn(
                "absolute top-4 md:top-5 -left-1/2 right-1/2 h-[2px] transition-colors duration-500",
                step > i ? "bg-blue-600" : "bg-slate-200"
              )}></div>
            )}
            <div className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300",
              step > i ? "bg-blue-600 text-white" : 
              step === i + 1 ? "bg-white border-2 border-blue-600 text-blue-600 shadow-lg shadow-blue-50" : 
              "bg-slate-100 text-slate-400"
            )}>
              <div className="scale-75 md:scale-100">
                {s.icon}
              </div>
            </div>
            <span className={cn(
              "text-[8px] md:text-[10px] uppercase font-bold mt-2 tracking-wider text-center px-1",
              step === i + 1 ? "text-blue-600" : "text-slate-400"
            )}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-6">
                {isReadOnly && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3 text-yellow-800 text-[10px] md:text-xs font-medium">
                    <Save size={16} /> Data terkunci karena sedang dalam proses verifikasi.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Lengkap sesuai Ijazah</label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      disabled={isReadOnly}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                        errors.fullName ? "border-red-500 bg-red-50" : "border-slate-200",
                        isReadOnly && "bg-slate-50 opacity-70"
                      )}
                      placeholder="Masukkan nama lengkap..."
                    />
                    {errors.fullName && <p className="text-[10px] text-red-500 font-bold">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tempat Lahir</label>
                    <input 
                      type="text" 
                      value={formData.birthPlace}
                      disabled={isReadOnly}
                      onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                        errors.birthPlace ? "border-red-500 bg-red-50" : "border-slate-200",
                        isReadOnly && "bg-slate-50 opacity-70"
                      )}
                      placeholder="Kota kelahiran..."
                    />
                    {errors.birthPlace && <p className="text-[10px] text-red-500 font-bold">{errors.birthPlace}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tanggal Lahir</label>
                    <input 
                      type="date" 
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Jenis Kelamin</label>
                    <div className="flex gap-4">
                      {['Laki-laki', 'Perempuan'].map(g => (
                        <label key={g} className={cn(
                          "flex-1 py-3 px-4 rounded-xl border cursor-pointer text-center transition-all",
                          formData.gender === g ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"
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
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Alamat Lengkap</label>
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px]"
                    placeholder="Nama jalan, RT/RW, Kelurahan, Kecamatan..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nomor WhatsApp Aktif</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Contoh: 081234567890"
                  />
                  <p className="text-[10px] text-slate-400">Penting: Informasi seleksi akan dikirimkan melalui nomor ini.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sekolah Asal (SMA/SMK/MA)</label>
                    <input 
                      type="text" 
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Nama sekolah asal..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tahun Lulus</label>
                    <select 
                      value={formData.gradYear}
                      onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                    >
                      <option value="">Pilih Tahun</option>
                      {[2024, 2023, 2022, 2021, 2020].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-blue-900 rounded-xl p-6 text-white shadow-xl">
                  <h3 className="font-bold flex items-center gap-2 mb-4">
                    <CheckCircle2 size={18} /> Pilihan Program Studi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-blue-900">
                      <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Fakultas</label>
                      <select 
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value, major: '' })}
                        className="w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-white outline-none transition-all bg-white"
                      >
                        <option value="">Pilih Fakultas</option>
                        {FACULTIES.map((faculty) => (
                          <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 text-blue-900">
                      <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Program Studi</label>
                      <select 
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-white outline-none transition-all bg-white disabled:bg-blue-800/50"
                        disabled={!formData.program}
                      >
                        <option value="">Pilih Prodi</option>
                        {selectedFaculty?.programs.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="py-12 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Verifikasi Data Registrasi</h3>
                <p className="max-w-md text-slate-500">
                  Data Anda telah kami simpan. Silakan periksa kembali semua rincian sebelum mengirim file bukti untuk finalisasi.
                </p>
                <div className="w-full bg-slate-50 rounded-xl p-6 text-left space-y-4">
                  <div className="flex justify-between border-b border-white pb-2">
                    <span className="text-slate-400 text-xs">Pilihan Utama</span>
                    <span className="font-bold text-slate-800">{formData.major}</span>
                  </div>
                  <div className="flex justify-between border-b border-white pb-2">
                    <span className="text-slate-400 text-xs">Fakultas</span>
                    <span className="font-bold text-slate-800">{selectedFaculty?.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white pb-2">
                    <span className="text-slate-400 text-xs">Asal Sekolah</span>
                    <span className="font-bold text-slate-800">{formData.previousSchool} ({formData.gradYear})</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 md:px-8 py-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2 w-full sm:w-auto">
              {step > 1 && step < 4 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors text-xs md:text-sm border border-transparent"
                >
                  Kembali
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ml-auto">
              {step < 4 && (
                <button 
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-2 flex items-center justify-center gap-2 rounded-xl font-bold text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 transition-colors text-xs md:text-sm"
                >
                  <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Draft'}
                </button>
              )}
              {step < 3 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  className="w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-2 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 shadow-lg shadow-blue-100 transition-all active:scale-95 text-xs md:text-sm"
                >
                  Lanjut
                </button>
              ) : step === 3 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  className="w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-2 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 shadow-lg shadow-blue-100 transition-all text-xs md:text-sm"
                >
                  Review
                </button>
              ) : step === 4 ? (
                <button 
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all text-xs md:text-sm"
                >
                  <Send size={18} /> Finalisasi & Ajukan
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
