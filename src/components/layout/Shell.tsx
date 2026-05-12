import { Outlet, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { UserProfile } from '../../types';
import { auth } from '../../lib/firebase';
import { LogOut, Bell, HelpCircle, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ShellProps {
  user: User;
  profile: UserProfile | null;
}

export default function Shell({ user, profile }: ShellProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const isAdminRole = profile?.role && profile.role !== 'applicant';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="h-16 bg-blue-900 text-white flex items-center justify-between px-8 shrink-0 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-xl">U</div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Universitas Teknologi Nusantara</h1>
            <p className="text-xs text-blue-200">Portal Penerimaan Mahasiswa Baru 2024/2025</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-2 items-center px-3 py-1 bg-blue-800 rounded text-xs border border-blue-700">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Pendaftaran Gelombang II Terbuka</span>
          </div>
          
          <div className="flex items-center gap-3 border-l border-blue-700 pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile?.fullName || user.displayName}</p>
              <p className="text-[10px] text-blue-300 uppercase tracking-wider">ID: PMB-{user.uid.substring(0, 7).toUpperCase()}</p>
            </div>
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${profile?.fullName}`} 
              alt="Profile" 
              className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white"
            />
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-blue-800 rounded-full transition-colors text-blue-200"
              title="Keluar"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-6 overflow-hidden max-w-[1440px] mx-auto w-full">
        {/* Main Section */}
        <main className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
          <Outlet />
        </main>

        {/* Sidebar */}
        <aside className="w-full md:w-80 flex flex-col gap-6 shrink-0">
          {/* Notifications */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col min-h-[200px]">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bell size={18} className="text-blue-600" />
              Notifikasi
            </h3>
            <div className="space-y-4">
              {isAdminRole ? (
                <>
                  <div className="border-l-4 border-amber-500 pl-3 py-1">
                    <p className="text-xs font-bold">5 Pendaftar Menunggu Verifikasi</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Segera cek dokumen di dashboard admin.</p>
                    <span className="text-[9px] text-slate-400 uppercase">10 Menit Lalu</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-l-4 border-green-500 pl-3 py-1">
                    <p className="text-xs font-bold">Akun Terverifikasi</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Konfirmasi dikirim ke email {user.email}</p>
                    <span className="text-[9px] text-slate-400 uppercase">Baru saja</span>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-3 py-1 opacity-60">
                    <p className="text-xs font-bold">Selamat Datang</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Mulai lengkapi data registrasi Anda hari ini.</p>
                    <span className="text-[9px] text-slate-400 uppercase">Hari ini</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {!isAdminRole && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex-1 flex flex-col">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <HelpCircle size={18} className="text-blue-600" />
                Layanan Informasi
              </h3>
              <div className="space-y-3 flex-1">
                <a href="#" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-[10px] uppercase">
                    IG
                  </div>
                  <div>
                    <p className="text-xs font-bold group-hover:text-blue-600">@unutech_official</p>
                    <p className="text-[10px] text-slate-500">Update harian</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-green-600 font-bold text-[10px]">
                    WA
                  </div>
                  <div>
                    <p className="text-xs font-bold group-hover:text-green-600">Helpdesk PMB</p>
                    <p className="text-[10px] text-slate-500">08:00 - 16:00 WIB</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center text-slate-600 font-bold text-xs">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold group-hover:text-slate-900">admisi@unutech.ac.id</p>
                    <p className="text-[10px] text-slate-500">Pertanyaan Tertulis</p>
                  </div>
                </a>
              </div>
              <button className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-bold mt-4 hover:bg-slate-800 transition-all active:scale-[0.98]">
                Bantuan & FAQ
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Footer */}
      <footer className="h-12 md:h-10 bg-white border-t border-slate-200 px-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 shrink-0 gap-2 py-2 md:py-0">
        <div>&copy; 2024 Direktorat Sistem Informasi & Manajemen Akademik Universitas Teknologi Nusantara</div>
        <div className="flex gap-4">
          <span className="hover:text-slate-600 cursor-pointer">Kebijakan Privasi</span>
          <span className="hover:text-slate-600 cursor-pointer">Syarat & Ketentuan</span>
          <span className="hover:text-slate-600 cursor-pointer">Integritas Akademik</span>
        </div>
      </footer>
    </div>
  );
}
