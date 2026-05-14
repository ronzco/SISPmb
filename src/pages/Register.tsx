import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ShieldCheck, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { authApi } from '../lib/api';

export default function Register() {
  const [role, setRole] = useState<'applicant' | 'admin'>('applicant');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Konformasi kata sandi tidak cocok.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    const isCampusEmail = formData.email.endsWith('@unutech.ac.id');
    if (role === 'admin' && !isCampusEmail) {
      setError('Registrasi Admin wajib menggunakan email kampus (@unutech.ac.id).');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role === 'admin' ? 'superadmin' : 'applicant',
      });
      
      window.location.href = '/'; // Reload to refresh auth state
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.error || err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0B0E14] p-4 font-sans transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-[#151921] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="bg-slate-900 dark:bg-blue-900/40 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 dark:text-blue-300 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-6">
            <ArrowLeft size={14} /> Kembali ke Login
          </Link>
          <h1 className="text-3xl font-black tracking-tight italic">JOIN UTN</h1>
          <p className="text-slate-400 dark:text-blue-200/60 text-sm mt-2 font-medium">Buat akun untuk memulai pendaftaran atau akses console.</p>
        </div>
        
        <form onSubmit={handleRegister} className="p-8 space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">Tujuan Pendaftaran</label>
            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setRole('applicant')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  role === 'applicant' 
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                <User size={14} /> Mahasiswa
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  role === 'admin' 
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                <ShieldCheck size={14} /> Staf / Panitia
              </button>
            </div>
          </div>

          {role === 'admin' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl">
              <p className="text-[10px] text-blue-700 dark:text-blue-400 font-bold leading-tight">
                <span className="uppercase block mb-1">Penting:</span>
                Admin wajib menggunakan domain institusi <span className="underline">@unutech.ac.id</span>.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="text"
                placeholder="Nama Lengkap"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none text-sm font-bold transition-all dark:text-white dark:placeholder:text-slate-600"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="email"
                placeholder="Alamat Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none text-sm font-bold transition-all dark:text-white dark:placeholder:text-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none text-sm font-bold transition-all dark:text-white dark:placeholder:text-slate-600"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="password"
                  placeholder="Konfirmasi"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none text-sm font-bold transition-all dark:text-white dark:placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <UserPlus size={18} /> {loading ? 'MENDAFTARKAN...' : 'DAFTAR SEKARANG'}
          </button>

          <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
            Sudah punya akun? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Masuk di sini</Link>
          </p>
        </form>

        <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">
            &copy; 2024 UNIVERSITAS TEKNOLOGI NUSANTARA
          </p>
        </div>
      </motion.div>
    </div>
  );
}
