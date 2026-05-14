import { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { dataApi } from '../lib/api';
import { StudentApplication, RegistrationDocument, PaymentRecord, ApplicationStatus, ActivityLog, AuthUser, Announcement, FeeConfig } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, CheckCircle, Clock, AlertCircle, Search, 
  Filter, Download, Eye, Check, X, BarChart3, TrendingUp,
  Megaphone, DollarSign, Plus, Trash2, Edit, Save, ShieldCheck, CreditCard, FileText, QrCode
} from 'lucide-react';
import { cn } from '../lib/utils';
import { FACULTIES, getProgramById } from '../constants/programs';

const BarcodeSim = ({ code }: { code: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex gap-[2px] h-8 items-end">
      {Array.from({ length: 30 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-black dark:bg-white" 
          style={{ 
            width: `${(i % 3 === 0 ? 2 : 1)}px`, 
            height: `${Math.random() * 15 + 15}px`,
            opacity: Math.random() > 0.1 ? 1 : 0
          }} 
        />
      ))}
    </div>
    <span className="font-mono text-[9px] tracking-[0.2em]">{code}</span>
  </div>
);

export default function AdminDashboard() {
  const { profile } = useOutletContext<{ profile: AuthUser }>();
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [docsFilter, setDocsFilter] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [majorFilter, setMajorFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'id'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);
  const [appDocs, setAppDocs] = useState<RegistrationDocument[]>([]);
  const [appPayment, setAppPayment] = useState<PaymentRecord | null>(null);
  
  // Bulk data for dashboard overview
  const [allPayments, setAllPayments] = useState<PaymentRecord[]>([]);
  const [allDocuments, setAllDocuments] = useState<RegistrationDocument[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'applicants' | 'logs' | 'announcements' | 'fees'>((searchParams.get('tab') as any) || 'applicants');
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['applicants', 'logs', 'announcements', 'fees'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
    setActiveTab(tab as any);
  };
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [fees, setFees] = useState<FeeConfig[]>([]);
  const [tempScore, setTempScore] = useState<number>(0);

  // Form states for new content
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', type: 'info' as any });
  const [newFee, setNewFee] = useState({ description: '', amount: 0, facultyId: '', programId: '' });

  useEffect(() => {
    const initAdmin = async () => {
      if (profile.role === 'admin' || profile.role === 'superadmin') {
        try {
          const tasks = [
            fetchApplications(),
            fetchAnnouncements(),
            fetchFees()
          ];
          if (profile.role === 'superadmin') tasks.push(fetchLogs());
          await Promise.all(tasks);
        } catch (error) {
          console.error("Admin init error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    initAdmin();
  }, [profile]);

  const fetchAnnouncements = async () => {
    const res = await dataApi.getAnnouncements();
    setAnnouncements(res.data);
  };

  const fetchFees = async () => {
    const res = await dataApi.getFees();
    setFees(res.data);
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    await dataApi.createAnnouncement(newAnnouncement);
    setNewAnnouncement({ title: '', content: '', type: 'info' });
    fetchAnnouncements();
  };

  const handleAddFee = async () => {
    if (!newFee.amount) return;
    
    let description = newFee.description;
    if (!description && newFee.programId) {
      const prog = getProgramById(newFee.programId);
      if (prog) description = `Biaya Pendidikan: ${prog.name}`;
    } else if (!description && newFee.facultyId) {
      const fac = FACULTIES.find(f => f.id === newFee.facultyId);
      if (fac) description = `Biaya Pendidikan: ${fac.name}`;
    }

    if (!description) description = "Biaya Lainnya";
    
    await dataApi.updateFee({ ...newFee, description });
    setNewFee({ description: '', amount: 0, facultyId: '', programId: '' });
    fetchFees();
  };

  const deleteItem = async (type: string, id: string) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    if (type === 'announcements') {
      await dataApi.deleteAnnouncement(id);
      fetchAnnouncements();
    } else if (type === 'fees_config') {
      await dataApi.deleteFee(id);
      fetchFees();
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await dataApi.getAdminApplications();
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching admin apps:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await dataApi.getLogs();
      setLogs(res.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const fetchDetails = async (app: StudentApplication) => {
    setSelectedApp(app);
    try {
      const [docsRes, payRes] = await Promise.all([
        dataApi.getUserDocuments(app.userId),
        dataApi.getUserPayment(app.userId)
      ]);
      setAppDocs(docsRes.data);
      setAppPayment(payRes.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const updateDocStatus = async (docId: string, status: string) => {
    if (status === 'verified' && appPayment?.status !== 'success') {
      alert("Maaf, Admin tidak dapat melakukan verifikasi berkas jika calon mahasiswa belum melakukan pembayaran atau pembayaran belum diverifikasi.");
      return;
    }
    await dataApi.updateDocumentStatus(docId, status);
    if (selectedApp) fetchDetails(selectedApp);
  };

  const hasPermission = (action: string) => {
    if (profile.role === 'superadmin') return true;
    if (profile.role === 'admin') return true; // Simplify for now
    return false;
  };

  const updateStatus = async (status: ApplicationStatus, score?: number) => {
    if (!selectedApp) return;
    
    // Check payment if moving to test_ready or accepted
    if (['test_ready', 'accepted'].includes(status) && appPayment?.status !== 'success') {
      alert("Maaf, Admin tidak dapat melakukan verifikasi data pendaftaran jika calon mahasiswa belum melakukan pembayaran atau pembayaran belum diverifikasi.");
      return;
    }

    await dataApi.updateApplicationStatus(selectedApp.id, { status, score });
    alert(`Status updated to ${status}`);
    setSelectedApp(null);
    fetchApplications();
  };

  const isAdmin = profile.role === 'admin' || profile.role === 'superadmin';
  const adminRole = profile.role;

  const getPaymentStatus = (userId: string) => {
    const payment = allPayments.find(p => p.userId === userId);
    return payment?.status || 'pending';
  };

  const getDocsStatus = (userId: string) => {
    const userDocs = allDocuments.filter(d => d.userId === userId);
    if (userDocs.length === 0) return 'none';
    const allVerified = userDocs.length >= 3 && userDocs.every(d => d.status === 'verified'); // Assuming 3 is complete
    return allVerified ? 'complete' : 'incomplete';
  };

  const filteredApps = applications
    .filter(app => {
      const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           app.participantNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesMajor = majorFilter === 'all' || app.major === majorFilter;
      
      const payStatus = getPaymentStatus(app.userId);
      const matchesPayment = paymentFilter === 'all' || (paymentFilter === 'paid' ? payStatus === 'success' : payStatus !== 'success');
      
      const docStatus = getDocsStatus(app.userId);
      const matchesDocs = docsFilter === 'all' || (docsFilter === 'complete' ? docStatus === 'complete' : docStatus !== 'complete');

      const appDate = app.updatedAt;
      const matchesStartDate = !startDate || appDate >= new Date(startDate).getTime();
      const matchesEndDate = !endDate || appDate <= new Date(endDate).getTime() + 86400000; // Include full day
      
      return matchesSearch && matchesStatus && matchesMajor && matchesStartDate && matchesEndDate && matchesPayment && matchesDocs;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.fullName.localeCompare(b.fullName);
      } else if (sortBy === 'date') {
        comparison = a.updatedAt - b.updatedAt;
      } else if (sortBy === 'id') {
        comparison = (a.participantNumber || '').localeCompare(b.participantNumber || '');
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const majors = Array.from(new Set(applications.map(a => a.major).filter(Boolean)));

  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.status === 'submitted' || a.status === 'verifying').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    pendingPayments: applications.filter(a => getPaymentStatus(a.userId) !== 'success').length,
    pendingDocs: applications.filter(a => getDocsStatus(a.userId) !== 'complete').length,
    revenue: allPayments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0)
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Initializing Admin Core...</p>
    </div>
  );
  
  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-center text-rose-500 dark:text-rose-400 mb-4 shadow-xl shadow-rose-100 dark:shadow-none translate-y-[-20%]">
         <ShieldCheck size={40} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Akses Ditolak</h2>
      <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm">Halaman ini hanya dapat diakses oleh Panitia Seleksi dengan kredensial yang valid.</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full px-4 mb-20">
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">Management Console</h2>
            <div className={cn(
              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
              adminRole === 'superadmin' ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/30" :
              adminRole === 'committee_academic' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30" :
              "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30"
            )}>
              {adminRole?.replace('committee_', '')?.replace('_', ' ')}
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-3 text-sm md:text-base">Central hub for application processing and academic verification.</p>
        </div>
        {hasPermission('export_report') && (
          <button 
              onClick={() => {
                  const csvRows = [
                      ['ID', 'Nama', 'Prodi', 'Status', 'Nomor Peserta'],
                      ...filteredApps.map(a => [a.id, a.fullName, a.major, a.status, a.participantNumber || '-'])
                  ];
                  const csvContent = csvRows.map(e => e.join(",")).join("\n");
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.setAttribute('hidden', '');
                  a.setAttribute('href', url);
                  a.setAttribute('download', `pendaftar_${Date.now()}.csv`);
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
              }}
              className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none shrink-0 uppercase active:scale-95"
          >
            <Download size={16} /> DOWNLOAD REPORT
          </button>
        )}
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Enrolled', sub: 'Gross Applicants', value: stats.total, icon: <Users size={24} />, color: 'blue' },
          { label: 'Billing Gap', sub: 'Pending Payments', value: stats.pendingPayments, icon: <DollarSign size={24} />, color: 'amber' },
          { label: 'Incomplete', sub: 'Pending Verification', value: stats.pendingDocs, icon: <AlertCircle size={24} />, color: 'rose' },
          { label: 'Settlement', sub: 'Verified Revenue', value: stats.revenue > 1000000 ? `Rp ${(stats.revenue/1000000).toFixed(1)}M` : `Rp ${stats.revenue.toLocaleString()}`, icon: <TrendingUp size={24} />, color: 'indigo' },
        ].map((s, i) => (
          <div key={i} className="group bg-white dark:bg-[#151921] p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
              s.color === 'blue' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" :
              s.color === 'amber' ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" :
              s.color === 'rose' ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400" :
              "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
            )}>
              {s.icon}
            </div>
            <div>
               <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-[0.2em]">{s.label}</p>
               <p className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tighter">{s.value}</p>
               <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-tight">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Layout */}
      <div className="relative mb-8 -mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-max border border-slate-200 dark:border-slate-800">
          {[
            { id: 'applicants', label: 'Applicants', icon: <Users size={14} /> },
            { id: 'logs', label: 'Logs', icon: <ShieldCheck size={14} />, hidden: !hasPermission('view_logs') },
            { id: 'announcements', label: 'News', icon: <Megaphone size={14} /> },
            { id: 'fees', label: 'Fees', icon: <CreditCard size={14} /> },
          ].map((tab) => !tab.hidden && (
            <button 
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all relative z-10 whitespace-nowrap",
                activeTab === tab.id 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-400"
              )}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabAdmin"
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="scale-110">{tab.icon}</div> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
      {activeTab === 'applicants' && (
        <motion.div 
          key="applicants"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white dark:bg-[#151921] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors"
        >
        <div className="p-6 md:p-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col gap-6 ">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search candidates by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900/50 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none text-sm font-medium transition-all"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-wrap gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3.5 bg-white dark:bg-slate-900/50 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none hover:border-blue-400 transition-all cursor-pointer appearance-none"
              >
                <option value="all">Stage: ALL</option>
                <option value="submitted">SUBMITTED</option>
                <option value="verifying">VERIFYING</option>
                <option value="test_ready">TEST READY</option>
                <option value="accepted">ACCEPTED</option>
                <option value="rejected">REJECTED</option>
              </select>
 
              <select 
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
                className="px-4 py-3.5 bg-white dark:bg-slate-900/50 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none hover:border-blue-400 transition-all cursor-pointer appearance-none"
              >
                <option value="all">Billing: ALL</option>
                <option value="paid">PAID</option>
                <option value="pending">UNPAID</option>
              </select>
 
              <select 
                value={docsFilter}
                onChange={(e) => setDocsFilter(e.target.value as any)}
                className="px-4 py-3.5 bg-white dark:bg-slate-900/50 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none hover:border-blue-400 transition-all cursor-pointer appearance-none"
              >
                <option value="all">Docs: ALL</option>
                <option value="complete">COMPLETE</option>
                <option value="incomplete">INCOMPL</option>
              </select>
 
              <div className="flex items-center bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 gap-2">
                <Filter size={14} className="text-slate-400" />
                <select 
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field as any);
                    setSortOrder(order as any);
                  }}
                  className="w-full py-3.5 bg-transparent text-[10px] dark:text-slate-300 font-black uppercase tracking-widest outline-none cursor-pointer appearance-none"
                >
                  <option value="date-desc">Newest</option>
                  <option value="date-asc">Oldest</option>
                  <option value="name-asc">A-Z</option>
                  <option value="name-desc">Z-A</option>
                </select>
              </div>
            </div>
          </div>
  
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Date Range:</span>
               <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 w-full sm:w-auto">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-400 outline-none hover:bg-slate-50 dark:hover:bg-slate-800 uppercase min-w-[130px] appearance-none"
                />
                <span className="text-slate-300 dark:text-slate-700">—</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-400 outline-none hover:bg-slate-50 dark:hover:bg-slate-800 uppercase min-w-[130px] appearance-none"
                />
               </div>
               {(startDate || endDate) && (
                 <button 
                   onClick={() => { setStartDate(''); setEndDate(''); }}
                   className="text-[10px] text-rose-500 font-black hover:bg-rose-50 dark:hover:bg-rose-900/20 px-4 py-2 rounded-xl uppercase tracking-widest transition-all"
                 >
                   Clear Filter
                 </button>
               )}
            </div>
            
            <div className="lg:ml-auto flex items-center justify-between lg:justify-end gap-5">
               <div className="flex -space-x-3">
                 {filteredApps.slice(0, 5).map((a, i) => (
                   <div key={i} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[11px] font-black text-slate-600 dark:text-slate-300 overflow-hidden shadow-sm uppercase">
                      {a.fullName.charAt(0)}
                   </div>
                 ))}
                 {filteredApps.length > 5 && (
                   <div className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800 bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                      +{filteredApps.length - 5}
                   </div>
                 )}
               </div>
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                <span className="text-blue-600 dark:text-blue-400 px-1">{filteredApps.length}</span> results found
               </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/20 text-[10px] uppercase font-black text-slate-400 dark:text-slate-600 tracking-[0.2em] border-b border-slate-100 dark:border-slate-800/50">
                <th className="px-10 py-6">Participant ID</th>
                <th className="px-10 py-6">Candidate Identity</th>
                <th className="px-10 py-6">Academic Program</th>
                <th className="px-10 py-6">Verification</th>
                <th className="px-10 py-6">Process Stage</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredApps.map(app => (
                <tr key={app.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all">
                  <td className="px-10 py-6 leading-none">
                     <span className="font-mono text-[12px] font-bold text-slate-400 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                        {app.participantNumber || 'NEW_ENTRY'}
                     </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[12px] font-black text-slate-600 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase shadow-sm">
                          {app.fullName.charAt(0)}
                       </div>
                       <div>
                          <p className="font-black text-slate-800 dark:text-white text-base tracking-tight leading-none uppercase">{app.fullName}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold mt-2 leading-none uppercase tracking-widest">{new Date(app.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                     <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase underline decoration-blue-600/30 underline-offset-4">
                        {app.major}
                     </p>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-2">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                          getPaymentStatus(app.userId) === 'success' ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10" : "text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/10"
                        )}>
                            <CreditCard size={12} />
                            {getPaymentStatus(app.userId)}
                        </div>
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                          getDocsStatus(app.userId) === 'complete' ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10" : "text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/10"
                        )}>
                            <FileText size={12} />
                            {getDocsStatus(app.userId)}
                        </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                      app.status === 'accepted' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30" :
                      app.status === 'rejected' ? "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30" :
                      app.status === 'verifying' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30" :
                      app.status === 'test_ready' ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30" :
                      "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                    )}>
                      <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        app.status === 'accepted' ? "bg-emerald-500" :
                        app.status === 'rejected' ? "bg-rose-500" :
                        app.status === 'verifying' ? "bg-blue-500" :
                        app.status === 'test_ready' ? "bg-indigo-500" :
                        "bg-slate-400"
                      )}></div>
                      {app.status?.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => fetchDetails(app)}
                      className="px-6 py-3 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-slate-700 shadow-sm hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-none transition-all active:scale-95"
                    >
                      Process Application
                    </button>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-200 dark:text-slate-800 shadow-inner">
                            <Search size={40} />
                         </div>
                         <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">No candidates match your current filter criteria</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    )}

      {activeTab === 'logs' && (
        <motion.div 
          key="logs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white dark:bg-[#151921] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
        >
          <div className="p-8 bg-slate-50 dark:bg-slate-900/10 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
               <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none">Security Audit Trail</h4>
               <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-2 uppercase tracking-tighter">Real-time monitoring of administrative access and data mutations</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-blue-600 dark:text-blue-400">
               <ShieldCheck size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Active Monitoring</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/20 text-[10px] uppercase font-black text-slate-400 dark:text-slate-600 tracking-[0.15em] border-b border-slate-100 dark:border-slate-800/50">
                  <th className="px-8 py-5">Timestamp</th>
                  <th className="px-8 py-5">Operator ID</th>
                  <th className="px-8 py-5">Action Type</th>
                  <th className="px-8 py-5">Contextual Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {logs.map(log => (
                  <tr key={log.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-8 py-5">
                       <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{new Date(log.timestamp).toLocaleString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2 group/id">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 group-hover/id:bg-blue-600 group-hover/id:text-white transition-all">
                             {log.userId?.charAt(0) || 'S'}
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-600 cursor-help uppercase" title={log.userId}>
                            ...{log.userId?.substring(log.userId.length - 8)}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                         {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-xs font-bold text-slate-600 dark:text-slate-400 max-w-md truncate group-hover:text-slate-900 dark:group-hover:text-white group-hover:whitespace-normal transition-all">{log.details}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'announcements' && (
        <motion.div 
          key="announcements"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8"
        >
          <div className="bg-white dark:bg-[#151921] p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
                <Plus size={20} />
              </div>
              PUBLISH SYSTEM BROADCAST
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
               <div className="md:col-span-8">
                  <input 
                    type="text" 
                    placeholder="Broadcast Headline"
                    value={newAnnouncement.title}
                    onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-blue-900/20 font-black text-sm tracking-tight"
                  />
               </div>
               <div className="md:col-span-4">
                  <select 
                    value={newAnnouncement.type}
                    onChange={e => setNewAnnouncement({...newAnnouncement, type: e.target.value as any})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl outline-none font-black text-[10px] uppercase tracking-widest text-slate-500"
                  >
                    <option value="info">INFO (NEUTRAL)</option>
                    <option value="warning">WARNING (ACTION REQ)</option>
                    <option value="urgent">CRITICAL (MANDATORY)</option>
                  </select>
               </div>
               <div className="md:col-span-12">
                  <textarea 
                    placeholder="Detailed messaging content..."
                    value={newAnnouncement.content}
                    onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl h-32 outline-none focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-blue-900/20 font-medium text-sm leading-relaxed"
                  />
               </div>
               <div className="md:col-span-12">
                  <button 
                    onClick={handleAddAnnouncement}
                    className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none uppercase active:scale-95"
                  >
                    DISPATCH ANNOUNCEMENT
                  </button>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {announcements.map(ann => (
              <div key={ann.id} className="group bg-white dark:bg-[#151921] p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-6">
                      <div className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        ann.type === 'urgent' ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30" :
                        ann.type === 'warning' ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30" : 
                        "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30"
                      )}>
                        {ann.type} notification
                      </div>
                      <button 
                        onClick={() => deleteItem('announcements', ann.id)}
                        className="p-2 text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                   <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">{ann.title}</h4>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 font-medium leading-relaxed">{ann.content}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                      <Clock size={12} />
                      {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </div>
                   <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700">
                      <Megaphone size={14} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'fees' && (
        <motion.div 
          key="fees"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-8"
        >
          <div className="bg-white dark:bg-[#151921] p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
             <h3 className="text-lg font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                <DollarSign size={20} />
              </div>
              FINANCIAL CONFIGURATION & PROGRAM PRICING
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
               <div className="md:col-span-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-2 block">Faculty</label>
                  <select 
                    value={newFee.facultyId}
                    onChange={e => setNewFee({...newFee, facultyId: e.target.value, programId: '', description: ''})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/20 font-bold text-sm tracking-tight"
                  >
                    <option value="">-- PILIH FAKULTAS --</option>
                    {FACULTIES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
               </div>
               <div className="md:col-span-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-2 block">Program Study</label>
                  <select 
                    value={newFee.programId}
                    onChange={e => setNewFee({...newFee, programId: e.target.value, description: ''})}
                    disabled={!newFee.facultyId}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/20 font-bold text-sm tracking-tight disabled:opacity-50"
                  >
                    <option value="">-- SEMUA PRODI / PILIH PRODI --</option>
                    {FACULTIES.find(f => f.id === newFee.facultyId)?.programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
               </div>
               <div className="md:col-span-4 relative">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-2 block">Fee Amount</label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 font-bold">Rp</div>
                    <input 
                      type="number" 
                      placeholder="Pricing..."
                      value={newFee.amount || ''}
                      onChange={e => setNewFee({...newFee, amount: Number(e.target.value)})}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900/50 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/20 font-mono font-bold text-sm"
                    />
                  </div>
               </div>
               <div className="md:col-span-12">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-2 block">Custom Label (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Auto-generated if empty (e.g., Biaya Pendidikan: Program Studi Akuntansi)"
                    value={newFee.description}
                    onChange={e => setNewFee({...newFee, description: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/20 font-bold text-sm tracking-tight"
                  />
               </div>
               <div className="md:col-span-12">
                  <button 
                    onClick={handleAddFee}
                    className="w-full py-5 bg-emerald-600 dark:bg-emerald-600 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 dark:shadow-none uppercase active:scale-95"
                  >
                    SET PRICE / UPDATE STRUCTURE
                  </button>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {fees.map(fee => (
              <div key={fee.id} className="group bg-white dark:bg-[#151921] p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <DollarSign size={24} />
                   </div>
                   <button 
                     onClick={() => deleteItem('fees_config', fee.id)}
                     className="p-2 text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{fee.programId ? 'Major Pricing' : 'Global/Faculty Fee'}</p>
                   <h4 className="text-lg font-black text-slate-800 dark:text-white mt-1 tracking-tight leading-tight uppercase">{fee.description}</h4>
                   <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-sm font-bold text-slate-400 dark:text-slate-600">Rp</span>
                      <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                         {fee.amount.toLocaleString('id-ID')}
                      </span>
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 mt-4 uppercase">Last updated: {new Date(fee.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {fees.length === 0 && (
               <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">No financial data configured</p>
               </div>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
      {/* Details Modal Redesign */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-8 bg-slate-900/80 dark:bg-black/90 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#151921] rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-6xl h-full max-h-[95vh] overflow-hidden flex flex-col border border-white/20 dark:border-slate-800"
          >
            {/* Modal Header */}
            <div className="p-4 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-900 dark:bg-black text-white shrink-0">
               <div className="flex items-center gap-3 md:gap-6">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-[1.25rem] bg-blue-600 flex items-center justify-center text-lg md:text-2xl font-black shadow-lg shadow-blue-500/20">
                     {selectedApp.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm md:text-2xl font-black tracking-tight leading-tight uppercase truncate max-w-[200px] md:max-w-none">{selectedApp.fullName}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                       <span className="font-mono text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest bg-slate-800 dark:bg-slate-900 px-2 py-0.5 rounded">ID: {selectedApp.id.substring(0, 8)}</span>
                       <span className={cn(
                         "px-2 py-0.5 rounded text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] border",
                         selectedApp.status === 'accepted' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                         selectedApp.status === 'rejected' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                         "bg-blue-500/10 text-blue-400 border-blue-500/20"
                       )}>
                         STAGE: {selectedApp.status?.replace('_', ' ')}
                       </span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  {selectedApp.selectionCode && (
                    <div className="hidden sm:block p-3 bg-white rounded-xl shadow-inner">
                       <BarcodeSim code={selectedApp.selectionCode} />
                    </div>
                  )}
                  <button 
                     onClick={() => setSelectedApp(null)}
                     className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-colors text-white/50 hover:text-white"
                  >
                     <X size={20} />
                  </button>
               </div>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#FBFCFD] dark:bg-[#0D1117] custom-scrollbar space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                  {/* Left Column: Essential Info */}
                  <div className="lg:col-span-4 space-y-6">
                     <div className="bg-white dark:bg-[#151921] p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
                        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                           <Users size={14} className="text-blue-600 dark:text-blue-400" /> Profil Peserta
                        </h4>
                        <div className="space-y-6">
                           <div>
                              <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-tight">Email Kontak</p>
                              <p className="font-bold text-slate-800 dark:text-white text-sm mt-1">{selectedApp.email || 'N/A'}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-tight">Asal Sekolah</p>
                              <p className="font-black text-slate-800 dark:text-white text-sm mt-1 uppercase leading-tight">{selectedApp.previousSchool || 'N/A'}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-tight">Program Studi Pilihan</p>
                              <p className="font-black text-blue-700 dark:text-blue-400 text-lg mt-1 uppercase leading-tight">{selectedApp.major}</p>
                           </div>
                           <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                              <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-tight">Status Pembayaran</p>
                              <div className="flex items-center gap-2 mt-2">
                                 <div className={cn("w-2.5 h-2.5 rounded-full", appPayment?.status === 'success' ? "bg-emerald-500 animate-pulse" : "bg-rose-500")}></div>
                                 <p className={cn("font-black text-[10px] md:text-xs uppercase tracking-widest", appPayment?.status === 'success' ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400")}>
                                   {appPayment?.status === 'success' ? `${appPayment.method || 'VERIFIED'}` : 'BELUM BAYAR'}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
  
                     {/* Score Panel */}
                     <div className="bg-slate-900 dark:bg-black p-6 rounded-[1.5rem] text-white relative border border-slate-800 shadow-xl overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.2em] mb-4">Metrik Seleksi</h4>
                        <div className="flex items-end justify-between relative z-10">
                           <div>
                              <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase leading-none">Admission Score</p>
                              <p className="text-5xl font-black mt-2 tracking-tighter text-blue-400">{selectedApp.score || '--'}</p>
                           </div>
                           <div className="text-right">
                              {selectedApp.status === 'accepted' ? (
                                <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Status</p>
                                  <p className="text-[10px] font-black text-emerald-400 uppercase">LUMINOUS</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase leading-none italic">Awaiting Finalization</p>
                                </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
  
                  {/* Right Column: Dynamic Content */}
                  <div className="lg:col-span-8 space-y-8">
                     {/* File Grid */}
                     <div className="bg-white dark:bg-[#151921] p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
                        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-6 md:mb-8 flex items-center gap-2">
                           <FileText size={14} className="text-blue-600 dark:text-blue-400" /> Verifikasi Dokumen Pendukung
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {appDocs.map(docItem => (
                              <div key={docItem.id} className="p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-200 dark:hover:border-blue-700 transition-all group">
                                 <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-all">
                                          <FileText size={16} />
                                       </div>
                                       <span className="text-[10px] md:text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight truncate max-w-[120px]">{docItem.type}</span>
                                    </div>
                                    <div className={cn(
                                       "px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest",
                                       docItem.status === 'verified' ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400" :
                                       docItem.status === 'rejected' ? "bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400" :
                                       "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400"
                                    )}>
                                       {docItem.status}
                                    </div>
                                 </div>
                                 
                                 <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <a href={docItem.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-[9px] font-black tracking-widest uppercase hover:text-blue-700">Open Viewer</a>
                                    
                                    {hasPermission('manage_academic') && docItem.status === 'pending' && (
                                       <div className="flex gap-2">
                                          <button 
                                             onClick={() => updateDocStatus(docItem.id, 'verified')}
                                             className="p-1.5 md:p-2 bg-emerald-600/10 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                                             title="Verify File"
                                          >
                                             <Check size={14} />
                                          </button>
                                          <button 
                                             onClick={() => updateDocStatus(docItem.id, 'rejected')}
                                             className="p-1.5 md:p-2 bg-rose-600/10 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
                                             title="Reject File"
                                          >
                                             <X size={14} />
                                          </button>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           ))}
                           {appDocs.length === 0 && (
                               <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">No documentation payload found</p>
                               </div>
                           )}
                        </div>
                     </div>
  
                     {/* Control Panel */}
                     <div className="bg-white dark:bg-[#151921] p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-8">Registry Decision Control</h4>
                        
                        <div className="space-y-6">
                           {hasPermission('manage_academic') && (
                              <div className="space-y-6">
                                 {(selectedApp.status === 'verifying' || selectedApp.status === 'submitted') && (
                                    <button 
                                       onClick={() => updateStatus('test_ready')} 
                                       className="group w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98] uppercase"
                                    >
                                       <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" /> GENERATE TEST CREDENTIALS
                                    </button>
                                 )}
  
                                 {selectedApp.status === 'test_ready' && (
                                    <div className="p-6 md:p-8 bg-blue-50/30 dark:bg-blue-900/10 rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-900/30 space-y-6">
                                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                          <div>
                                             <h5 className="text-[11px] font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest">Tahap Seleksi Tulis & Wawancara</h5>
                                             <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase">Input skor akhir untuk menentukan kelulusan.</p>
                                          </div>
                                          <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-blue-900/50">
                                             <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">PHASE: FINAL EVAL</span>
                                          </div>
                                       </div>
                                       
                                       <div className="flex flex-col md:flex-row gap-4">
                                          <div className="relative flex-1">
                                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-black text-xs">VAL:</div>
                                             <input 
                                               type="number" 
                                               placeholder="Final Outcome Score (0-100)"
                                               className="w-full pl-14 pr-4 py-4 bg-white dark:bg-slate-900 dark:text-white border border-blue-200 dark:border-blue-900/30 rounded-2xl font-black text-sm tracking-tight focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all outline-none"
                                               onChange={(e) => {
                                                 const score = parseInt(e.target.value);
                                                 (window as any)._tempScore = score;
                                               }}
                                             />
                                          </div>
                                          <div className="flex gap-2">
                                             <button 
                                                onClick={() => updateStatus('accepted', (window as any)._tempScore)}
                                                className="flex-1 md:flex-none px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100 dark:shadow-none uppercase"
                                             >
                                                Accepted
                                             </button>
                                             <button 
                                                onClick={() => updateStatus('rejected')}
                                                className="flex-1 md:flex-none px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-100 dark:shadow-none uppercase"
                                             >
                                                Rejected
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 )}
  
                                 {(selectedApp.status === 'accepted' || selectedApp.status === 'rejected') && (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-800">
                                       <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Final Status Registered</p>
                                       <h3 className={cn("text-3xl font-black mt-2 uppercase tracking-tighter", selectedApp.status === 'accepted' ? "text-emerald-600" : "text-rose-600")}>
                                          {selectedApp.status}
                                       </h3>
                                       <button 
                                          onClick={() => updateStatus('test_ready')}
                                          className="mt-6 text-[10px] font-black text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 px-8 py-2.5 rounded-xl transition-all uppercase tracking-widest border border-blue-100 dark:border-blue-900/50"
                                       >
                                          Re-evaluate Stage
                                       </button>
                                    </div>
                                 )}
                              </div>
                           )}
                           
                           {hasPermission('manage_finance') && (
                              <button 
                                 onClick={async () => {
                                    if (appPayment) {
                                      try {
                                        await dataApi.updatePaymentStatus(appPayment.id, 'success');
                                        alert('Receipt data synced successfully.');
                                        fetchDetails(selectedApp!);
                                      } catch (error) {
                                        console.error("Verification error:", error);
                                        alert("Critical Sync Failure: Billing verify failed.");
                                      }
                                    }
                                 }}
                                 className="w-full py-5 bg-indigo-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-950 dark:hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-30 uppercase shadow-2xl dark:shadow-none"
                                 disabled={!appPayment || appPayment.status === 'success'}
                              >
                                 <CreditCard size={18} /> {appPayment?.status === 'success' ? 'LEDGER VERIFIED' : 'VERIFY BILLING RECEIPT'}
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
