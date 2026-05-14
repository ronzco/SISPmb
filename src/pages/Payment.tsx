import { useState, useEffect } from 'react';
import { dataApi } from '../lib/api';
import { PaymentRecord, StudentApplication, FeeConfig } from '../types';
import { motion } from 'motion/react';
import { CreditCard, CheckCircle2, Clock, AlertCircle, RefreshCw, Copy, ExternalLink, Download, Loader2, QrCode } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Payment() {
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [application, setApplication] = useState<StudentApplication | null>(null);
  const [fee, setFee] = useState<FeeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'VA' | 'QRIS' | 'EWALLET'>('VA');

  const defaultAmount = 350000;
  const uniqueCode = 192; // Simulated unique code for identification
  const amount = (fee?.amount || defaultAmount) + uniqueCode;
  
  const vaNumber = `8812000${application?.userId?.substring(0, 5) || '12345'}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current application to get major
        const appRes = await dataApi.getMyApplications();
        let userMajor = '';
        if (appRes.data && appRes.data.length > 0) {
          const app = appRes.data[0];
          setApplication(app);
          userMajor = app.major || '';
        }

        // Fetch payment
        const payRes = await dataApi.getMyPayment();
        if (payRes.data && !payRes.data.error) {
          setPayment(payRes.data);
        } else {
          setPayment(null);
        }

        // Fetch Fee Config
        const feesRes = await dataApi.getFees();
        const allFees = feesRes.data as FeeConfig[];
        
        // Find fee that matches the major
        const matchedFee = allFees.find(f => 
          f.description.includes(userMajor) || 
          (userMajor && f.id.includes(userMajor))
        );
        
        if (matchedFee) {
          setFee(matchedFee);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Financial Data...</p>
    </div>
  );

  const methods = [
    { id: 'VA', name: 'Virtual Account', icon: <CreditCard size={18} />, color: 'blue' },
    { id: 'QRIS', name: 'QRIS / E-Money', icon: <RefreshCw size={18} />, color: 'green' },
    { id: 'EWALLET', name: 'E-Wallet (OVO/Dana)', icon: <CheckCircle2 size={18} />, color: 'purple' },
  ];

  const handleSimulatePayment = async (methodName?: string) => {
    const currentMethod = methodName || (selectedMethod === 'VA' ? 'BNI Virtual Account' : selectedMethod === 'QRIS' ? 'QRIS GPN' : 'E-Wallet');
    const payData = {
      amount: amount,
      method: currentMethod,
      status: 'success',
      transactionId: `TXN-${Math.random().toString(36).substring(7).toUpperCase()}`,
      paidAt: Date.now(),
    };

    try {
      const response = await dataApi.createPayment(payData);
      setPayment({ id: response.data.id, ...payData, userId: '' } as PaymentRecord);
      alert('Pembayaran berhasil dikonfirmasi secara otomatis.');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Gagal memproses pembayaran.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full space-y-6 px-4 md:px-0"
    >
      <div className="bg-white dark:bg-[#151921] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start transition-colors">
        <div className="w-full md:flex-1 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Status Pembayaran</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium italic">Biaya Pendaftaran Mahasiswa Baru 2024/2025.</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Metode Pembayaran Tersedia</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all gap-2",
                    selectedMethod === m.id 
                      ? "border-blue-600 bg-white dark:bg-slate-900 text-blue-600 shadow-lg scale-105" 
                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 hover:border-slate-200 dark:hover:border-slate-700"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-xl",
                    selectedMethod === m.id ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800"
                  )}>
                    {m.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center text-center shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-blue-900/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            {payment?.status === 'success' ? (
              <>
                <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-[2rem] flex items-center justify-center text-green-600 dark:text-green-400 mb-6 shadow-lg shadow-green-100 dark:shadow-none">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest">TRANSAKSI LUNAS</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-bold uppercase tracking-widest leading-loose">
                  Terverifikasi otomatis pada {new Date(payment.paidAt!).toLocaleString('id-ID')}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
                  <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
                    <Download size={16} /> Unduh Bukti
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-900 dark:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black dark:hover:bg-blue-700 shadow-xl shadow-blue-900/20 transition-all active:scale-95">
                    <ExternalLink size={16} /> Cetak Kwitansi
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-lg shadow-blue-100 dark:shadow-none animate-pulse">
                  {selectedMethod === 'VA' ? <CreditCard size={40} /> : selectedMethod === 'QRIS' ? <RefreshCw size={40} /> : <CheckCircle2 size={40} />}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Menunggu Pembayaran</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 italic leading-relaxed max-w-sm">
                  Mohon segera selesaikan pembayaran agar Admin dapat memverifikasi data pendaftaran Anda.
                </p>
                
                <div className="mt-8 w-full space-y-4">
                  {selectedMethod === 'VA' && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 relative group">
                      <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-left mb-2">Virtual Account (Bank BNI)</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl md:text-3xl font-mono font-black text-blue-900 dark:text-blue-400 tracking-tighter">{vaNumber}</span>
                        <button className="p-3 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl text-blue-600 dark:text-blue-400 transition-all border border-slate-200 dark:border-slate-700" title="Salin">
                          <Copy size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'QRIS' && (
                    <div className="bg-white dark:bg-white rounded-3xl p-6 border border-slate-200 flex flex-col items-center gap-4 group">
                      <div className="w-56 h-56 bg-slate-50 rounded-2xl flex items-center justify-center border-4 border-dashed border-slate-100 group-hover:border-blue-200 transition-colors">
                        <div className="text-center">
                          <QrCode size={96} className="mx-auto text-slate-300 group-hover:text-blue-200 transition-colors" />
                          <p className="text-[10px] text-slate-400 font-black mt-4 uppercase tracking-[0.2em]">Generate QRIS Code</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium font-mono leading-none">ID: QRIS-SIPMB-2024</p>
                    </div>
                  )}

                  {selectedMethod === 'EWALLET' && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-3">
                       <input 
                         type="text" 
                         placeholder="Nomor HP OVO/Dana/LinkAja..."
                         className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                       />
                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Konfirmasi via Notifikasi HP</p>
                    </div>
                  )}
                  
                  <div className="bg-slate-900 dark:bg-blue-900/40 p-6 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-blue-300 opacity-60 uppercase tracking-[0.2em] text-left mb-2">Total Tagihan</p>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-white font-mono tracking-tighter">Rp {amount.toLocaleString('id-ID')}</span>
                      <div className="px-3 py-1 bg-white/10 dark:bg-blue-400/20 text-white dark:text-blue-300 text-[9px] font-black rounded-lg uppercase tracking-widest border border-white/10">Inkl. Kode Unik</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 w-full">
                  <button 
                    onClick={() => handleSimulatePayment()}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-900/20 transition-all active:scale-95"
                  >
                    Konfirmasi Pembayaran
                  </button>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Sistem menunggu sinyal konfirmasi bank...</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <div className="bg-slate-900 dark:bg-[#1A1F29] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 mb-6 text-blue-400">
              <Clock size={16} />
              Manual Guideline
            </h3>
            <ul className="space-y-6">
              {[
                'Pilih menu Transfer ke Bank Lain atau BNI Virtual Account.',
                'Masukkan Nomor VA sesuai petunjuk di samping.',
                'Nominal harus sama persis termasuk 3 digit terakhir.',
                'Klik konfirmasi dan verifikasi instan dalam hitungan detik.',
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-[10px] font-black border border-white/10">{i + 1}</span>
                  <p className="text-[11px] text-slate-400 dark:text-blue-100/60 leading-relaxed font-medium">{step}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/50 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-500">
                <AlertCircle size={18} />
              </div>
              <h4 className="font-black text-xs text-slate-800 dark:text-slate-200 uppercase tracking-widest">Policy Note</h4>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">
              Biaya pendaftaran yang telah dibayarkan bersifat <span className="font-black text-rose-600 dark:text-rose-400">NON-REFUNDABLE</span>. Harap teliti prodi Anda.
            </p>
          </div>
        </div>
      </div>
      
      {payment?.status === 'success' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-8 rounded-[2rem] flex items-start gap-5 shadow-sm"
        >
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest text-xs">Verification Successful</h4>
            <p className="text-sm text-emerald-800 dark:text-emerald-500/80 mt-1 font-medium leading-relaxed">
              Terima kasih! Pembayaran Anda telah diterima oleh Direktorat Keuangan. Silakan lanjutkan pelengkapan berkas di menu Berkas Persyaratan.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
