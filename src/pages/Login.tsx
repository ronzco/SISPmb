import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Gagal masuk. Silakan coba lagi.');
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="bg-blue-900 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-3xl mx-auto mb-4">
            U
          </div>
          <h1 className="text-2xl font-bold">Universitas Teknologi Nusantara</h1>
          <p className="text-blue-200 text-sm mt-2">Portal Penerimaan Mahasiswa Baru</p>
        </div>
        
        <div className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800">Selamat Datang</h2>
              <p className="text-slate-500 text-sm mt-1">
                Silakan masuk menggunakan akun Google Anda untuk memulai pendaftaran.
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Masuk dengan Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Informasi Pendaftaran</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-bold text-slate-700">Gelombang II</p>
                <p className="text-[10px] text-slate-500 uppercase">Sedang Dibuka</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-bold text-slate-700">Beasiswa</p>
                <p className="text-[10px] text-slate-500 uppercase">Tersedia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 text-center">
          <p className="text-[10px] text-slate-400">
            &copy; 2024 Direktorat Sistem Informasi & Manajemen Akademik UTN
          </p>
        </div>
      </motion.div>
    </div>
  );
}
