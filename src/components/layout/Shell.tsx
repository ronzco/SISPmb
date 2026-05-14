import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import { UserProfile } from '../../types';
import { auth } from '../../lib/firebase';
import { 
  LogOut, Bell, HelpCircle, 
  LayoutDashboard, FileEdit, FolderOpen, 
  CreditCard, Megaphone, DollarSign,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ShellProps {
  user: User;
  profile: UserProfile | null;
}

export default function Shell({ user, profile }: ShellProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const isAdminRole = profile?.role && profile.role !== 'applicant';

  const menuItems = isAdminRole ? [
    { name: 'Admin Console', path: '/admin', icon: ShieldAlert },
    { name: 'Financial Config', path: '/fees', icon: DollarSign },
    { name: 'Newsroom', path: '/announcements', icon: Megaphone },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'P Registration', path: '/registration', icon: FileEdit },
    { name: 'My Documents', path: '/documents', icon: FolderOpen },
    { name: 'Payment Control', path: '/payment', icon: CreditCard },
    { name: 'Fee Schedule', path: '/fees', icon: DollarSign },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-[100] shadow-sm">
        <div className="flex items-center gap-3 md:gap-4 truncate">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-900 rounded-xl flex items-center justify-center text-white font-black text-xl md:text-2xl italic shadow-lg shadow-blue-900/20 shrink-0">
            U
          </div>
          <div className="truncate">
            <h1 className="text-sm md:text-base font-black text-slate-900 leading-none uppercase tracking-tight truncate">UNU Teknologi Nusantara</h1>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 truncate">Portal PMB TA 2024/2025</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden lg:flex gap-2 items-center px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-700 uppercase tracking-widest">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Gelombang II Terbuka
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 border-l border-slate-100 pl-2 md:pl-6">
            <div className="text-right hidden sm:block truncate max-w-[150px]">
              <p className="text-xs font-black text-slate-900 truncate uppercase">{profile?.fullName || user.displayName}</p>
              <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">{profile?.role?.replace('_', ' ') || 'Applicant'}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-black text-sm md:text-base shrink-0 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile?.fullName?.charAt(0) || 'U'
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 md:p-2.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all border border-slate-100"
              title="Keluar"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 sm:p-6 md:p-8 max-w-[1440px] mx-auto w-full min-h-0">
        {/* Navigation Sidebar - Desktop */}
        <aside className="hidden lg:flex w-72 flex-col gap-6 shrink-0">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Main Menu</p>
            <nav className="space-y-1.5">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                    location.pathname === item.path 
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-slate-50">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2 flex items-center gap-2">
                <Bell size={12} /> Live Updates
              </h3>
              <div className="space-y-4">
                {isAdminRole ? (
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                    <p className="text-[10px] font-black text-amber-900 uppercase">Verification</p>
                    <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">Review documentation for 12 new applicants.</p>
                  </div>
                ) : (
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-black text-blue-900 uppercase">Admission Tip</p>
                    <p className="text-[10px] text-blue-700 mt-1 leading-relaxed">Complete your documents to start selection.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isAdminRole && (
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform"></div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 relative z-10 flex items-center gap-2">
                <HelpCircle size={12} className="text-blue-600" /> Helpdesk
              </h3>
              <div className="space-y-2 relative z-10">
                <a href="#" className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-100 group/item">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 font-black text-[10px] border border-slate-100 group-hover/item:border-blue-200">IG</div>
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">@unutech</p>
                </a>
                <a href="#" className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-100 group/item">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-green-600 font-black text-[10px] border border-slate-100 group-hover/item:border-green-200">WA</div>
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Support PMB</p>
                </a>
              </div>
            </div>
          )}
        </aside>

        {/* Mobile Navigation - Visible only on Mobile/Tablet */}
        <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide py-2 bg-white/50 backdrop-blur-sm border-b border-slate-100 sticky top-16 md:top-20 z-50">
          <nav className="flex gap-2 w-max">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  location.pathname === item.path 
                    ? "bg-blue-900 text-white shadow-lg shadow-blue-100" 
                    : "bg-white text-slate-500 border border-slate-100"
                )}
              >
                <item.icon size={14} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>


      {/* Footer */}
      <footer className="h-12 md:h-10 bg-white border-t border-slate-200 px-8 flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-400 shrink-0 gap-2 py-2 md:py-0">
        <div>&copy; 2024 Direktorat Sistem Informasi & Manajemen Akademik Universitas Teknologi Nusantara</div>
        <div className="flex gap-4">
          <span className="hover:text-slate-600 cursor-pointer uppercase tracking-tighter">Privacy</span>
          <span className="hover:text-slate-600 cursor-pointer uppercase tracking-tighter">Terms</span>
          <span className="hover:text-slate-600 cursor-pointer uppercase tracking-tighter">System Status</span>
        </div>
      </footer>
    </div>
  );
}
