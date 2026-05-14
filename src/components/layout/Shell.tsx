import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthUser } from '../../types';
import { authApi, dataApi } from '../../lib/api';
import { 
  LogOut, Bell, HelpCircle, 
  LayoutDashboard, FileEdit, FolderOpen, 
  CreditCard, Megaphone, DollarSign,
  ShieldAlert, Moon, Sun, Menu, X
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ShellProps {
  user: AuthUser;
  profile: AuthUser | null;
}

export default function Shell({ user, profile }: ShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      window.location.href = '/login';
    } catch (error) {
      navigate('/login');
    }
  };

  const isAdminRole = profile?.role && profile.role !== 'applicant';

  const [hasApplication, setHasApplication] = useState(false);
  const [appStatus, setAppStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminRole) {
      dataApi.getMyApplications().then(res => {
        if (res.data.length > 0) {
          setHasApplication(true);
          setAppStatus(res.data[0].status);
        }
      });
    }
  }, [isAdminRole]);

  const menuItems = isAdminRole ? [
    { name: 'Admin Console', path: '/admin', icon: ShieldAlert },
    { name: 'Financial Config', path: '/fees', icon: DollarSign },
    { name: 'Newsroom', path: '/announcements', icon: Megaphone },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ...(appStatus === 'draft' || !hasApplication ? [{ 
      name: appStatus === 'draft' ? 'Lengkapi Data' : 'Pendaftaran', 
      path: '/registration', 
      icon: FileEdit 
    }] : []),
    { name: 'My Documents', path: '/documents', icon: FolderOpen },
    { name: 'Payment Control', path: '/payment', icon: CreditCard },
    { name: 'Fee Schedule', path: '/fees', icon: DollarSign },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#0B0E14] font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="h-16 md:h-20 bg-white dark:bg-[#151921] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-[110] shadow-sm">
        <div className="flex items-center gap-3 md:gap-4 truncate">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-900 dark:bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl md:text-2xl italic shadow-lg shadow-blue-900/20 shrink-0">
            U
          </div>
          <div className="truncate">
            <h1 className="text-sm md:text-base font-black text-slate-900 dark:text-white leading-none uppercase tracking-tight truncate">UNU Teknologi Nusantara</h1>
            <p className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 truncate">Portal PMB TA 2024/2025</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          <button 
            onClick={toggleDarkMode}
            className="p-2 md:p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="hidden lg:flex gap-2 items-center px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-full text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Gelombang II Terbuka
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 border-l border-slate-200 dark:border-slate-800 pl-2 md:pl-6">
            <div className="text-right hidden sm:block truncate max-w-[150px]">
              <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase">{profile?.fullName}</p>
              <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-0.5">{profile?.role?.replace('_', ' ') || 'Applicant'}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-black text-sm md:text-base shrink-0 overflow-hidden">
              {profile?.fullName?.charAt(0) || 'U'}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 md:p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
              title="Keluar"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full relative">
        {/* Navigation Sidebar - Desktop */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-[105] w-72 bg-white dark:bg-[#151921] border-r border-slate-200 dark:border-slate-800 flex flex-col gap-6 p-6 transition-transform duration-300 lg:relative lg:translate-x-0 lg:bg-transparent lg:dark:bg-transparent lg:border-none lg:p-8 shrink-0",
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="bg-white dark:bg-[#151921] lg:dark:bg-[#1A1F29] rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex-1 flex flex-col min-h-0">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2 shrink-0">Main Menu</p>
            <nav className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide pr-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                    location.pathname === item.path 
                      ? "bg-slate-900 dark:bg-blue-600 text-white shadow-xl shadow-slate-200 dark:shadow-blue-900/20" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 shrink-0">
               <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2 flex items-center gap-2">
                <Bell size={12} /> Newsroom
              </h3>
              <div className="space-y-3">
                {isAdminRole ? (
                  <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <p className="text-[10px] font-black text-amber-900 dark:text-amber-400 uppercase">Verification</p>
                    <p className="text-[9px] text-amber-700 dark:text-amber-500/80 mt-1 leading-relaxed">Review documentation for pending applicants.</p>
                  </div>
                ) : (
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <p className="text-[10px] font-black text-blue-900 dark:text-blue-400 uppercase">Status</p>
                    <p className="text-[9px] text-blue-700 dark:text-blue-500/80 mt-1 leading-relaxed">Pendaftaran Anda sedang dalam proses verifikasi.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area - Content Scrollable */}
        <main className="flex-1 min-w-0 flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden h-full">
           <div className="flex-1 overflow-y-auto scrollbar-hide">
              <Outlet context={{ user, profile }} />
              
              {/* Internal Footer for scrollable area */}
              <footer className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>&copy; 2024 Direktorat Sistem Informasi & Manajemen Akademik UNUTN</p>
                <div className="flex gap-6 uppercase tracking-tighter">
                  <span className="hover:text-blue-600 cursor-pointer">Privacy</span>
                  <span className="hover:text-blue-600 cursor-pointer">Terms</span>
                  <span className="hover:text-blue-600 cursor-pointer">Support</span>
                </div>
              </footer>
           </div>
        </main>
      </div>
    </div>
  );
}
