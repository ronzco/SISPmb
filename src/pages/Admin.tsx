import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, query, getDocs, doc, setDoc, where, orderBy, limit } from 'firebase/firestore';
import { StudentApplication, RegistrationDocument, PaymentRecord, ApplicationStatus, ActivityLog } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, CheckCircle, Clock, AlertCircle, Search, 
  Filter, Download, Eye, Check, X, BarChart3, TrendingUp,
  Megaphone, DollarSign, Plus, Trash2, Edit, Save, ShieldCheck, CreditCard, FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/fireErrorHandler';
import { Announcement, FeeConfig } from '../types';
import { FACULTIES, getProgramById } from '../constants/programs';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
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
    const checkAdmin = async () => {
      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;
      const email = auth.currentUser.email;

      try {
        const { getDoc: fGetDoc } = await import('firebase/firestore');
        const adminRef = doc(db, 'admins', uid);
        const adminDoc = await fGetDoc(adminRef);

        if (adminDoc.exists()) {
          const data = adminDoc.data();
          setAdminRole(data.role);
          setIsAdmin(true);
          fetchApplications();
          fetchLogs();
          fetchAnnouncements();
          fetchFees();
        } else if (email === 'ronikoswara795@gmail.com') {
          // Bootstrap superadmin
          await setDoc(adminRef, {
            uid,
            fullName: auth.currentUser.displayName || 'System Admin',
            email,
            role: 'superadmin'
          });
          // Also update user profile role
          await setDoc(doc(db, 'users', uid), { role: 'superadmin' }, { merge: true });
          
          setAdminRole('superadmin');
          setIsAdmin(true);
          fetchApplications();
          fetchLogs();
          fetchAnnouncements();
          fetchFees();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Admin check error:", error);
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  const fetchAnnouncements = async () => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement)));
  };

  const fetchFees = async () => {
    const q = query(collection(db, 'fees_config'), orderBy('updatedAt', 'desc'));
    const snap = await getDocs(q);
    setFees(snap.docs.map(d => ({ id: d.id, ...d.data() } as FeeConfig)));
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    const id = `ANN-${Date.now()}`;
    await setDoc(doc(db, 'announcements', id), {
      ...newAnnouncement,
      id,
      createdAt: Date.now()
    });
    setNewAnnouncement({ title: '', content: '', type: 'info' });
    fetchAnnouncements();
  };

  const handleAddFee = async () => {
    if (!newFee.amount) return;
    
    // Auto-generate description if not provided based on program/faculty
    let description = newFee.description;
    if (!description && newFee.programId) {
      const prog = getProgramById(newFee.programId);
      if (prog) description = `Biaya Pendidikan: ${prog.name}`;
    } else if (!description && newFee.facultyId) {
      const fac = FACULTIES.find(f => f.id === newFee.facultyId);
      if (fac) description = `Biaya Pendidikan: ${fac.name}`;
    }

    if (!description) description = "Biaya Lainnya";

    const id = newFee.programId || newFee.facultyId || `FEE-${Date.now()}`;
    
    await setDoc(doc(db, 'fees_config', id), {
      description,
      amount: newFee.amount,
      facultyId: newFee.facultyId || null,
      programId: newFee.programId || null,
      id,
      updatedAt: Date.now()
    });
    setNewFee({ description: '', amount: 0, facultyId: '', programId: '' });
    fetchFees();
  };

  const deleteItem = async (collectionName: string, id: string) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    const { deleteDoc, doc: fDoc } = await import('firebase/firestore');
    await deleteDoc(fDoc(db, collectionName, id));
    if (collectionName === 'announcements') fetchAnnouncements();
    if (collectionName === 'fees_config') fetchFees();
  };

  const hasPermission = (action: 'view_logs' | 'manage_academic' | 'manage_finance' | 'export_report') => {
    if (adminRole === 'superadmin') return true;
    if (adminRole === 'committee_academic' && action === 'manage_academic') return true;
    if (adminRole === 'committee_finance' && action === 'manage_finance') return true;
    if (action === 'export_report' && (adminRole === 'superadmin' || adminRole === 'committee_academic')) return true;
    return false;
  };

  const fetchLogs = async () => {
    const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(50));
    const snap = await getDocs(q);
    setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog)));
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'applications'), orderBy('updatedAt', 'desc'));
      const snap = await getDocs(q).catch(e => handleFirestoreError(e, OperationType.LIST, 'applications'));
      
      // Fetch all payments for summary
      const paySnap = await getDocs(collection(db, 'payments'));
      setAllPayments(paySnap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentRecord)));

      // Fetch all documents for summary
      const docSnap = await getDocs(collection(db, 'documents'));
      setAllDocuments(docSnap.docs.map(d => ({ id: d.id, ...d.data() } as RegistrationDocument)));

      if (snap) {
        setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentApplication)));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (app: StudentApplication) => {
    setSelectedApp(app);
    // Fetch docs
    const docsQ = query(collection(db, 'documents'), where('userId', '==', app.userId));
    const docsSnap = await getDocs(docsQ);
    setAppDocs(docsSnap.docs.map(d => ({ id: d.id, ...d.data() } as RegistrationDocument)));

    // Fetch payment
    const payQ = query(collection(db, 'payments'), where('userId', '==', app.userId), limit(1));
    const paySnap = await getDocs(payQ);
    if (!paySnap.empty) {
        setAppPayment({ id: paySnap.docs[0].id, ...paySnap.docs[0].data() } as PaymentRecord);
    } else {
        setAppPayment(null);
    }
  };

  const updateDocStatus = async (docId: string, status: 'verified' | 'rejected') => {
    const { doc: fDoc, setDoc: fSetDoc } = await import('firebase/firestore');
    await fSetDoc(fDoc(db, 'documents', docId), { status }, { merge: true });
    
    // Log activity
    await setDoc(doc(collection(db, 'logs')), {
      userId: auth.currentUser?.uid,
      action: 'UPDATE_DOC_STATUS',
      details: `Changed status of document ${docId} to ${status}`,
      timestamp: Date.now()
    });

    if (selectedApp) fetchDetails(selectedApp);
  };

  const updateStatus = async (status: ApplicationStatus, score?: number) => {
    if (!selectedApp) return;
    const appRef = doc(db, 'applications', selectedApp.id);
    
    // If moving to test_ready, generate a participant number if it doesn't exist
    const updateData: any = { status, updatedAt: Date.now() };
    if (score !== undefined) updateData.score = score;
    
    if (status === 'test_ready' && !selectedApp.participantNumber) {
      updateData.participantNumber = `UTN-${new Date().getFullYear() % 100}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    await setDoc(appRef, updateData, { merge: true });
    
    // Log activity
    const logRef = doc(collection(db, 'logs'));
    await setDoc(logRef, {
      userId: auth.currentUser?.uid,
      action: 'UPDATE_STATUS',
      details: `Changed status of ${selectedApp.fullName} to ${status}${score ? ` with score ${score}` : ''}`,
      timestamp: Date.now()
    });

    // Handle rejection email
    if (status === 'rejected') {
      try {
        let recipientEmail = selectedApp.email;
        
        // Fallback: fetch from users collection if not in application
        if (!recipientEmail) {
          const { getDoc: fGetDoc } = await import('firebase/firestore');
          const userSnap = await fGetDoc(doc(db, 'users', selectedApp.userId));
          if (userSnap.exists()) {
            recipientEmail = userSnap.data().email;
          }
        }

        if (recipientEmail) {
          await fetch('/api/send-rejection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: recipientEmail,
              fullName: selectedApp.fullName
            })
          });
          console.log(`[ADMIN] Rejection notification sent to ${recipientEmail}`);
        } else {
          console.warn("[ADMIN] Could not find email for rejection notification");
        }
      } catch (err) {
        console.error("[ADMIN] Failed to send rejection email:", err);
      }
    }

    alert(status === 'test_ready' 
      ? `Data berhasil diverifikasi. Nomor peserta ${updateData.participantNumber || selectedApp.participantNumber} telah dibuat.`
      : `Status pendaftar ${selectedApp.fullName} berhasil diperbarui.`
    );
    setSelectedApp(null);
    fetchApplications();
  };

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

  if (loading) return <div className="p-12 text-center">Loading Admin...</div>;
  if (!isAdmin) return <div className="p-12 text-center text-red-600 font-bold">Akses Ditolak. Halaman ini hanya untuk Panitia Seleksi.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full px-4">
      <div className="flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none">Management Console</h2>
            <div className={cn(
              "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm",
              adminRole === 'superadmin' ? "bg-purple-50 text-purple-700 border-purple-100" :
              adminRole === 'committee_academic' ? "bg-blue-50 text-blue-700 border-blue-100" :
              "bg-amber-50 text-amber-700 border-amber-100"
            )}>
              {adminRole?.replace('committee_', '')?.replace('_', ' ')}
            </div>
          </div>
          <p className="text-slate-500 font-medium mt-2">Central hub for application processing and academic verification.</p>
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
              className="flex items-center gap-3 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 shrink-0"
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
          { label: 'Settlement', sub: 'Verified Revenue', value: `Rp ${(stats.revenue/1000000).toFixed(1)}M`, icon: <TrendingUp size={24} />, color: 'indigo' },
        ].map((s, i) => (
          <div key={i} className="group bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={cn(
              "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-transform group-hover:scale-110",
              s.color === 'blue' ? "bg-blue-50 text-blue-600" :
              s.color === 'amber' ? "bg-amber-50 text-amber-600" :
              s.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
              "bg-indigo-50 text-indigo-600"
            )}>
              {s.icon}
            </div>
            <div>
               <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">{s.label}</p>
               <p className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">{s.value}</p>
               <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Layout */}
      <div className="relative mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-max border border-slate-200/50">
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
                "px-4 md:px-6 py-2 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all relative z-10 whitespace-nowrap",
                activeTab === tab.id 
                  ? "text-blue-600" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabAdmin"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.icon} {tab.label}
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
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
        <div className="p-4 md:p-8 border-b border-slate-200 bg-slate-50/50 flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium transition-all"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 md:px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-600 outline-none hover:border-blue-300 transition-all cursor-pointer"
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
                className="px-3 md:px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-600 outline-none hover:border-blue-300 transition-all cursor-pointer"
              >
                <option value="all">Billing: ALL</option>
                <option value="paid">PAID</option>
                <option value="pending">UNPAID</option>
              </select>
 
              <select 
                value={docsFilter}
                onChange={(e) => setDocsFilter(e.target.value as any)}
                className="px-3 md:px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-600 outline-none hover:border-blue-300 transition-all cursor-pointer"
              >
                <option value="all">Docs: ALL</option>
                <option value="complete">COMPLETE</option>
                <option value="incomplete">INCOMPL</option>
              </select>
 
              <select 
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
                className="px-3 md:px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-600 outline-none hover:border-blue-300 transition-all cursor-pointer col-span-2 md:col-span-1"
              >
                <option value="all">Major: ALL</option>
                {majors.map(m => (
                  <option key={m as string} value={m as string}>{(m as string)?.toUpperCase()}</option>
                ))}
              </select>
 
              <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-3 gap-2 col-span-2 md:col-span-2 lg:col-span-1">
                <Filter size={14} className="text-slate-400" />
                <select 
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field as any);
                    setSortOrder(order as any);
                  }}
                  className="w-full py-3 bg-transparent text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer"
                >
                  <option value="date-desc">Newest</option>
                  <option value="date-asc">Oldest</option>
                  <option value="name-asc">A-Z</option>
                  <option value="name-desc">Z-A</option>
                </select>
              </div>
            </div>
          </div>
 
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 pt-4 md:pt-6 border-t border-slate-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
               <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Range:</span>
               <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-100 w-full sm:w-auto">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 sm:flex-none px-2 py-1.5 rounded-lg text-[9px] font-black text-slate-600 outline-none focus:bg-slate-50 uppercase min-w-[110px]"
                />
                <span className="text-slate-300">—</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 sm:flex-none px-2 py-1.5 rounded-lg text-[9px] font-black text-slate-600 outline-none focus:bg-slate-50 uppercase min-w-[110px]"
                />
               </div>
               {(startDate || endDate) && (
                 <button 
                   onClick={() => { setStartDate(''); setEndDate(''); }}
                   className="text-[9px] text-red-500 font-black hover:underline uppercase tracking-widest px-2"
                 >
                   Clear
                 </button>
               )}
            </div>
            
            <div className="lg:ml-auto flex items-center justify-between lg:justify-end gap-3">
               <div className="flex -space-x-2">
                 {filteredApps.slice(0, 4).map((a, i) => (
                   <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[9px] md:text-[10px] font-black text-slate-600 overflow-hidden shadow-sm">
                      {a.fullName.charAt(0)}
                   </div>
                 ))}
               </div>
               <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                <span className="text-blue-600">{filteredApps.length}</span> results found
               </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-[0.15em] border-b border-slate-100">
                <th className="px-8 py-5">Participant ID</th>
                <th className="px-8 py-5">Full Name</th>
                <th className="px-8 py-5">Program</th>
                <th className="px-8 py-5">Verification Status</th>
                <th className="px-8 py-5">Process Stage</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map(app => (
                <tr key={app.id} className="group hover:bg-slate-50/80 transition-all">
                  <td className="px-8 py-5 leading-none">
                     <span className="font-mono text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                        {app.participantNumber || 'NEW_ENTRY'}
                     </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {app.fullName.charAt(0)}
                       </div>
                       <div>
                          <p className="font-black text-slate-800 text-sm tracking-tight leading-none">{app.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-1 leading-none">{new Date(app.updatedAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <span className="text-xs font-bold text-slate-600">
                        {app.major}
                     </span>
                  </td>
                  <td className="px-4 md:px-8 py-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4">
                       <div className="flex flex-col gap-1">
                          <div className={cn(
                            "flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                            getPaymentStatus(app.userId) === 'success' ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-50"
                          )}>
                             <CreditCard size={10} />
                             {getPaymentStatus(app.userId)}
                          </div>
                          <div className={cn(
                            "flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                            getDocsStatus(app.userId) === 'complete' ? "text-blue-600 bg-blue-50" : "text-slate-400 bg-slate-50"
                          )}>
                             <FileText size={10} />
                             {getDocsStatus(app.userId)}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                      app.status === 'accepted' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      app.status === 'rejected' ? "bg-rose-50 text-rose-700 border border-rose-100" :
                      app.status === 'verifying' ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      app.status === 'test_ready' ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                      "bg-slate-100 text-slate-500 border border-slate-200"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        app.status === 'accepted' ? "bg-emerald-500" :
                        app.status === 'rejected' ? "bg-rose-500" :
                        app.status === 'verifying' ? "bg-blue-500" :
                        app.status === 'test_ready' ? "bg-indigo-500" :
                        "bg-slate-400"
                      )}></div>
                      {app.status?.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => fetchDetails(app)}
                      className="px-5 py-2.5 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-100 transition-all active:scale-95"
                    >
                      VIEW PROFILE
                    </button>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <Search size={32} />
                         </div>
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No matching records found</p>
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
          className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-8 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <div>
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Security Audit Trail</h4>
               <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">Real-time monitoring of administrative access and data mutations</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-blue-600">
               <ShieldCheck size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Active Monitoring</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-[0.15em] border-b border-slate-100">
                  <th className="px-8 py-5">Timestamp</th>
                  <th className="px-8 py-5">Operator ID</th>
                  <th className="px-8 py-5">Action Type</th>
                  <th className="px-8 py-5">Contextual Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map(log => (
                  <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                       <span className="text-[11px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2 group/id">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover/id:bg-blue-600 group-hover/id:text-white transition-all">
                             {log.userId?.charAt(0) || 'S'}
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 cursor-help" title={log.userId}>
                            ...{log.userId?.substring(log.userId.length - 8)}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-100">
                         {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-xs font-bold text-slate-600 max-w-md truncate group-hover:text-slate-900 group-hover:whitespace-normal transition-all">{log.details}</p>
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
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
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
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100/50 font-black text-sm tracking-tight"
                  />
               </div>
               <div className="md:col-span-4">
                  <select 
                    value={newAnnouncement.type}
                    onChange={e => setNewAnnouncement({...newAnnouncement, type: e.target.value as any})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-[10px] uppercase tracking-widest text-slate-500"
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
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl h-32 outline-none focus:ring-4 focus:ring-blue-100/50 font-medium text-sm leading-relaxed"
                  />
               </div>
               <div className="md:col-span-12">
                  <button 
                    onClick={handleAddAnnouncement}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase"
                  >
                    DISPATCH ANNOUNCEMENT
                  </button>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {announcements.map(ann => (
              <div key={ann.id} className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-6">
                      <div className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        ann.type === 'urgent' ? "bg-rose-50 text-rose-600 border-rose-100" :
                        ann.type === 'warning' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        {ann.type} notification
                      </div>
                      <button 
                        onClick={() => deleteItem('announcements', ann.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                   <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{ann.title}</h4>
                   <p className="text-sm text-slate-500 mt-3 font-medium leading-relaxed">{ann.content}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={12} />
                      {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </div>
                   <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
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
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
             <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <DollarSign size={20} />
              </div>
              FINANCIAL CONFIGURATION & PROGRAM PRICING
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
               <div className="md:col-span-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Faculty</label>
                  <select 
                    value={newFee.facultyId}
                    onChange={e => setNewFee({...newFee, facultyId: e.target.value, programId: '', description: ''})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 font-bold text-sm tracking-tight"
                  >
                    <option value="">-- PILIH FAKULTAS --</option>
                    {FACULTIES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
               </div>
               <div className="md:col-span-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Program Study</label>
                  <select 
                    value={newFee.programId}
                    onChange={e => setNewFee({...newFee, programId: e.target.value, description: ''})}
                    disabled={!newFee.facultyId}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 font-bold text-sm tracking-tight disabled:opacity-50"
                  >
                    <option value="">-- SEMUA PRODI / PILIH PRODI --</option>
                    {FACULTIES.find(f => f.id === newFee.facultyId)?.programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
               </div>
               <div className="md:col-span-4 relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Fee Amount</label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</div>
                    <input 
                      type="number" 
                      placeholder="Pricing..."
                      value={newFee.amount || ''}
                      onChange={e => setNewFee({...newFee, amount: Number(e.target.value)})}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 font-mono font-bold text-sm"
                    />
                  </div>
               </div>
               <div className="md:col-span-12">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Custom Label (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Auto-generated if empty (e.g., Biaya Pendidikan: Program Studi Akuntansi)"
                    value={newFee.description}
                    onChange={e => setNewFee({...newFee, description: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 font-bold text-sm tracking-tight"
                  />
               </div>
               <div className="md:col-span-12">
                  <button 
                    onClick={handleAddFee}
                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 uppercase"
                  >
                    SET PRICE / UPDATE STRUCTURE
                  </button>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {fees.map(fee => (
              <div key={fee.id} className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <DollarSign size={24} />
                   </div>
                   <button 
                     onClick={() => deleteItem('fees_config', fee.id)}
                     className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{fee.programId ? 'Major Pricing' : 'Global/Faculty Fee'}</p>
                   <h4 className="text-lg font-black text-slate-800 mt-1 tracking-tight leading-tight">{fee.description}</h4>
                   <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-sm font-bold text-slate-400">Rp</span>
                      <span className="text-3xl font-black text-emerald-600 tracking-tighter">
                         {fee.amount.toLocaleString('id-ID')}
                      </span>
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase">Last updated: {new Date(fee.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {fees.length === 0 && (
               <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No financial data configured</p>
               </div>
            )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>


      {/* Details Modal Redesign */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col border border-white/20"
          >
            <div className="p-5 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white shrink-0">
               <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.25rem] bg-blue-600 flex items-center justify-center text-xl md:text-2xl font-black shadow-lg shadow-blue-500/20">
                     {selectedApp.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-2xl font-black tracking-tight leading-none uppercase">{selectedApp.fullName}</h3>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1 md:mt-2">
                       <span className="font-mono text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">ID: {selectedApp.id}</span>
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
               <button 
                  onClick={() => setSelectedApp(null)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-white/50 hover:text-white"
               >
                  <X size={24} />
               </button>
            </div>            <div className="flex-1 overflow-y-auto p-5 md:p-10 bg-[#FBFCFD] custom-scrollbar">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                  {/* Left Column: Bento Grid for Info */}
                  <div className="lg:col-span-4 space-y-6 md:space-y-8">
                     <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform"></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2 relative z-10">
                           <Users size={14} className="text-blue-600" /> Personal Identity
                        </h4>
                        <div className="space-y-4 md:space-y-6 relative z-10">
                           <div>
                              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tight">Academic Background</p>
                              <p className="font-black text-slate-800 text-sm md:text-base leading-tight mt-1">{selectedApp.previousSchool}</p>
                           </div>
                           <div>
                              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tight">Target Program</p>
                              <p className="font-black text-blue-700 text-base md:text-lg leading-tight mt-1">{selectedApp.major}</p>
                           </div>
                           <div className="pt-4 md:pt-6 border-t border-slate-50">
                              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tight">Payment Fulfillment</p>
                              <div className="flex items-center gap-2 mt-2">
                                 <div className={cn("w-2 h-2 rounded-full", appPayment?.status === 'success' ? "bg-emerald-500" : "bg-rose-500")}></div>
                                 <p className={cn("font-black text-[10px] md:text-xs uppercase tracking-widest", appPayment?.status === 'success' ? "text-emerald-700" : "text-rose-700")}>
                                   {appPayment?.status === 'success' ? `VERIFIED VIA ${appPayment.method}` : 'AWAITING PAYMENT'}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
 
                     {/* Stats for Applicant Performance */}
                     <div className="bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-white overflow-hidden relative">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 md:mb-6">Selection Metrics</h4>
                        <div className="flex items-end justify-between">
                           <div>
                              <p className="text-[9px] md:text-[10px] font-medium text-slate-400 uppercase leading-none">Admission Score</p>
                              <p className="text-4xl md:text-5xl font-black mt-2 tracking-tighter">{selectedApp.score || '--'}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] md:text-[10px] font-medium text-slate-400 uppercase leading-none">Percentile</p>
                              <p className="text-base md:text-lg font-black mt-1 text-blue-400">Top 12%</p>
                           </div>
                        </div>
                     </div>
                  </div>
 
                  {/* Right Column: Files & Actions */}
                  <div className="lg:col-span-8 space-y-6 md:space-y-10">
                     <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 md:mb-8 flex items-center gap-2">
                           <FileText size={14} className="text-blue-600" /> Required Documentation
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {appDocs.map(docItem => (
                              <div key={docItem.id} className="p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all group">
                                 <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                                          <FileText size={16} />
                                       </div>
                                       <span className="text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-tight">{docItem.type}</span>
                                    </div>
                                    <span className={cn(
                                       "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                       docItem.status === 'verified' ? "bg-emerald-100 text-emerald-700" :
                                       docItem.status === 'rejected' ? "bg-rose-100 text-rose-700" :
                                       "bg-amber-100 text-amber-700"
                                    )}>
                                       {docItem.status}
                                    </span>
                                 </div>
                                 
                                 <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <a href={docItem.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-[9px] font-black tracking-widest uppercase">View Document</a>
                                    
                                    {hasPermission('manage_academic') && docItem.status === 'pending' && (
                                       <div className="flex gap-2">
                                          <button 
                                             onClick={() => updateDocStatus(docItem.id, 'verified')}
                                             className="p-1.5 md:p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                          >
                                             <Check size={12} className="md:w-[14px] md:h-[14px]" />
                                          </button>
                                          <button 
                                             onClick={() => updateDocStatus(docItem.id, 'rejected')}
                                             className="p-1.5 md:p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                          >
                                             <X size={12} className="md:w-[14px] md:h-[14px]" />
                                          </button>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           ))}
                           {appDocs.length === 0 && (
                              <div className="sm:col-span-2 py-8 md:py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No documentation uploaded yet</p>
                              </div>
                           )}
                        </div>
                     </div>
 
                     {/* Decision Panel */}
                     <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 md:mb-8">Admin Decision Workspace</h4>
                        
                        <div className="space-y-6">
                           {hasPermission('manage_academic') && (
                              <div className="flex flex-col gap-6">
                                 {(selectedApp.status === 'verifying' || selectedApp.status === 'submitted') && (
                                    <button 
                                       onClick={() => updateStatus('test_ready')} 
                                       className="group w-full py-4 md:py-5 bg-blue-600 text-white rounded-xl md:rounded-2xl font-black text-xs tracking-[0.2em] flex items-center justify-center gap-3 md:gap-4 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-[0.98]"
                                    >
                                       <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" /> VALIDATE & ISSUE TRACKING NO.
                                    </button>
                                 )}
 
                                 {selectedApp.status === 'test_ready' && (
                                    <div className="p-6 md:p-8 bg-blue-50/50 rounded-2xl md:rounded-3xl border border-blue-100 space-y-4 md:space-y-6 border-dashed">
                                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                          <div>
                                             <h5 className="text-[11px] font-black text-blue-900 uppercase tracking-widest">Final Examination Results</h5>
                                             <p className="text-[10px] text-blue-500 font-medium tracking-tight">Input official SKD score to determine eligibility.</p>
                                          </div>
                                          <div className="px-3 py-1 bg-white rounded-xl border border-blue-200 shadow-sm w-fit">
                                             <span className="text-[9px] font-black text-blue-600 uppercase">Stage: FINAL TEST</span>
                                          </div>
                                       </div>
                                       
                                       <div className="flex flex-col sm:flex-row gap-4">
                                          <div className="relative flex-1">
                                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={16} />
                                             <input 
                                               type="number" 
                                               placeholder="Final Score (0-100)"
                                               className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white border border-blue-200 rounded-2xl font-black text-sm tracking-tight outline-none focus:ring-4 focus:ring-blue-100/50"
                                               onChange={(e) => {
                                                 const score = parseInt(e.target.value);
                                                 (window as any)._tempScore = score;
                                               }}
                                             />
                                          </div>
                                          <div className="flex gap-2">
                                             <button 
                                                onClick={() => updateStatus('accepted', (window as any)._tempScore)}
                                                className="flex-1 sm:flex-none px-6 md:px-8 py-3.5 md:py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] hover:bg-emerald-700 shadow-lg shadow-emerald-100 uppercase transition-all"
                                             >
                                                Approve
                                             </button>
                                             <button 
                                                onClick={() => updateStatus('rejected')}
                                                className="flex-1 sm:flex-none px-6 md:px-8 py-3.5 md:py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] hover:bg-rose-700 shadow-lg shadow-rose-100 uppercase transition-all"
                                             >
                                                Reject
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 )}
 
                                 {(selectedApp.status === 'accepted' || selectedApp.status === 'rejected') && (
                                    <div className="text-center py-6 md:py-10 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100">
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Decision Finalized</p>
                                       <p className="text-2xl md:text-3xl font-black text-slate-800 mt-2 uppercase tracking-tighter">{selectedApp.status}</p>
                                       <button 
                                          onClick={() => updateStatus('test_ready')}
                                          className="mt-4 md:mt-6 text-[9px] md:text-[10px] font-black text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-xl transition-all uppercase tracking-widest border border-blue-100 shadow-sm"
                                       >
                                          Rollback to Test Stage
                                       </button>
                                    </div>
                                 )}
                              </div>
                           )}
                           
                           {hasPermission('manage_finance') && (
                              <button 
                                 onClick={async () => {
                                    const payRef = doc(db, 'payments', appPayment?.id || '');
                                    if (appPayment) {
                                      await setDoc(payRef, { status: 'success', paidAt: Date.now() }, { merge: true });
                                      alert('Transaction verified successfully.');
                                      fetchDetails(selectedApp);
                                    }
                                 }}
                                 className="w-full py-4 md:py-5 bg-indigo-900 text-white rounded-xl md:rounded-2xl font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-950 transition-all active:scale-95 disabled:opacity-30 uppercase"
                                 disabled={!appPayment || appPayment.status === 'success'}
                              >
                                 <CreditCard size={18} /> Approve Billing Receipt
                              </button>
                           )}
                           {!hasPermission('manage_academic') && !hasPermission('manage_finance') && (
                              <div className="text-center py-8">
                                 <AlertCircle size={24} className="mx-auto text-slate-300 mb-2" />
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Administrative Credentials Required</p>
                                 <p className="text-[10px] text-slate-400 mt-1 italic">You do not have permission to modify this entry.</p>
                              </div>
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
