import { User, ShieldCheck, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, FormEvent } from 'react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../lib/api';

export default function Login() {
  const [role, setRole] = useState<'applicant' | 'admin'>('applicant');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'google' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setLoginMethod('email');

    try {
      const response = await authApi.login({ email, password });
      const user = response.data.user;

      // Validate role based on selection
      const isAdminRole = user.role !== 'applicant';
      if (role === 'admin' && !isAdminRole) {
        throw new Error('Akun ini terdaftar sebagai Calon Mahasiswa. Silakan masuk sebagai Calon Mahasiswa.');
      }
      if (role === 'applicant' && isAdminRole) {
        throw new Error('Akun ini terdaftar sebagai Staf/Admin. Silakan masuk sebagai Staf/Admin.');
      }

      window.location.href = '/'; // Reload to refresh auth state
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.error || err.message || 'Gagal masuk. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
      setLoginMethod(null);
    }
  };

  const handleGoogleLogin = () => {
    setError('Sync Google dinonaktifkan sementara untuk database lokal. Silakan gunakan Email & Password.');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0B0E14] p-4 font-sans transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-[#151921] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="bg-slate-900 dark:bg-blue-900/40 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-slate-900 dark:text-white font-black text-4xl mx-auto mb-6 shadow-xl italic">
            U
          </div>
          <h1 className="text-2xl font-black tracking-tight leading-none">UNIVERSITAS TEKNOLOGI<br/>NUSANTARA</h1>
          <p className="text-slate-400 dark:text-blue-200/50 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Penerimaan Mahasiswa Baru</p>
        </div>
        
        <div className="p-10">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">PORTAL AKSES</h2>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mt-1">
                Gunakan akun terdaftar Anda untuk melanjutkan.
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl gap-1">
              <button
                onClick={() => setRole('applicant')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  role === 'applicant' 
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                <User size={14} /> Calon Mahasiswa
              </button>
              <button
                onClick={() => setRole('admin')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  role === 'admin' 
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                <ShieldCheck size={14} /> Staf / Admin
              </button>
            </div>

            {role === 'admin' && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl">
                <p className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold leading-tight">
                  <span className="uppercase block mb-1">Peringatan Keamanan:</span>
                  Login Admin wajib menggunakan email institusi <span className="underline">@unutech.ac.id</span>.
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            {/* Manual Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none text-sm font-bold transition-all dark:text-white dark:placeholder:text-slate-600"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="password"
                  placeholder="Secret Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none text-sm font-bold transition-all dark:text-white dark:placeholder:text-slate-600"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-100 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <LogIn size={18} /> {loading && loginMethod === 'email' ? 'VERIFIKASI...' : 'MASUK SISTEM'}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                <span className="bg-white dark:bg-[#151921] px-3 text-slate-300 dark:text-slate-600">Hubungkan Dengan</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-4 px-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50 text-xs"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              {loading && loginMethod === 'google' ? 'Sinkronisasi...' : 'Google Account Sync'}
            </button>

            <div className="pt-2 text-center">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Belum memiliki akun? <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"><UserPlus size={12} /> Daftar di sini</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 px-10 py-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[9px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.2em]">
            &copy; 2024 DIR. SISTEM INFORMASI & MANAJEMEN AKADEMIK UTN
          </p>
        </div>
      </motion.div>
    </div>
  );
}
