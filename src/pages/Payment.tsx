import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { PaymentRecord, StudentApplication, FeeConfig } from '../types';
import { motion } from 'motion/react';
import { CreditCard, CheckCircle2, Clock, AlertCircle, RefreshCw, Copy, ExternalLink, Download, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Payment() {
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [application, setApplication] = useState<StudentApplication | null>(null);
  const [fee, setFee] = useState<FeeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'VA' | 'QRIS' | 'EWALLET'>('VA');

  const vaNumber = `8812000${auth.currentUser?.uid.substring(0, 5)}`;
  const defaultAmount = 350000;
  const uniqueCode = 192; // Simulated unique code for identification
  const amount = (fee?.amount || defaultAmount) + uniqueCode;

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      
      try {
        // Fetch current application to get major
        const appSnap = await getDocs(query(collection(db, 'applications'), where('userId', '==', auth.currentUser.uid)));
        let userMajor = '';
        if (!appSnap.empty) {
          const app = { id: appSnap.docs[0].id, ...appSnap.docs[0].data() } as StudentApplication;
          setApplication(app);
          userMajor = app.major || '';
        }

        // Fetch payment
        const paySnap = await getDocs(query(collection(db, 'payments'), where('userId', '==', auth.currentUser.uid)));
        if (!paySnap.empty) {
          setPayment({ id: paySnap.docs[0].id, ...paySnap.docs[0].data() } as PaymentRecord);
        }

        // Fetch Fee Config
        // First try to match by exact major name in description (since we stored name in major field)
        const feesSnap = await getDocs(collection(db, 'fees_config'));
        const allFees = feesSnap.docs.map(d => d.data() as FeeConfig);
        
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
    if (!auth.currentUser) return;
    const currentMethod = methodName || (selectedMethod === 'VA' ? 'BNI Virtual Account' : selectedMethod === 'QRIS' ? 'QRIS GPN' : 'E-Wallet');
    const payId = `PAY-${Date.now()}`;
    const payData: PaymentRecord = {
      id: payId,
      userId: auth.currentUser.uid,
      amount: amount,
      method: currentMethod,
      status: 'success',
      transactionId: `TXN-${Math.random().toString(36).substring(7).toUpperCase()}`,
      paidAt: Date.now(),
    };

    try {
      await setDoc(doc(db, 'payments', payId), payData);
      const appRef = doc(db, 'applications', auth.currentUser.uid);
      await setDoc(appRef, { 
        userId: auth.currentUser.uid, 
        status: 'verifying', 
        updatedAt: Date.now() 
      }, { merge: true });
      
      // Activity Log
      await setDoc(doc(collection(db, 'logs')), {
        userId: auth.currentUser.uid,
        action: 'PAYMENT_SUCCESS',
        details: `Paid ${amount} using ${currentMethod}`,
        timestamp: Date.now()
      });

      setPayment(payData);
      alert('Pembayaran berhasil dikonfirmasi secara otomatis.');
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full space-y-6"
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-full md:flex-1 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Status Pembayaran</h2>
            <p className="text-slate-500 text-sm mt-1">Biaya Pendaftaran Mahasiswa Baru 2024/2025.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pilih Metode Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2",
                    selectedMethod === m.id 
                      ? `border-${m.color}-600 bg-${m.color}-50 text-${m.color}-700` 
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  )}
                >
                  {m.icon}
                  <span className="text-[10px] font-bold uppercase tracking-tight">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
            {payment?.status === 'success' ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">LUNAS</h3>
                <p className="text-xs text-slate-500 mt-1">Dibayar via {payment.method} pada {new Date(payment.paidAt!).toLocaleString('id-ID')}</p>
                <div className="mt-6 flex gap-3 w-full">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                    <Download size={14} /> Unduh Bukti
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors">
                    <ExternalLink size={14} /> Cetak Kwitansi
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 animate-pulse">
                  {selectedMethod === 'VA' ? <CreditCard size={32} /> : selectedMethod === 'QRIS' ? <RefreshCw size={32} /> : <CheckCircle2 size={32} />}
                </div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Menunggu Pembayaran</h3>
                <p className="text-xs text-slate-500 mt-1 italic leading-relaxed">
                  Segera lakukan pembayaran sebelum <b>24 jam</b> kedepan untuk menghindari pembatalan otomatis.
                </p>
                
                <div className="mt-6 w-full space-y-4">
                  {selectedMethod === 'VA' && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left mb-1">Nomor Virtual Account (BNI)</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-mono font-bold text-blue-900">{vaNumber}</span>
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-blue-600 transition-colors" title="Salin">
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'QRIS' && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center gap-4">
                      <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200">
                        <div className="text-center">
                          <RefreshCw size={32} className="mx-auto text-slate-300 mb-2" />
                          <p className="text-[9px] text-slate-400 font-bold">QRIS DINAMIS</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500">Scan menggunakan aplikasi bank atau e-wallet (GoPay, ShopeePay, dll)</p>
                    </div>
                  )}

                  {selectedMethod === 'EWALLET' && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                       <input 
                         type="text" 
                         placeholder="Nomor HP OVO/Dana/LinkAja..."
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                       />
                       <p className="text-[9px] text-slate-400">Konfirmasi akan muncul di aplikasi e-wallet Anda.</p>
                    </div>
                  )}
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left mb-1">Total yang Harus Dibayar</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-slate-800">Rp {amount.toLocaleString('id-ID')}</span>
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded">Tagihan Registrasi</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => handleSimulatePayment()}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                  >
                    Konfirmasi Pembayaran
                  </button>
                  <p className="text-[10px] text-slate-400">Verifikasi otomatis biasanya memakan waktu 5-10 menit.</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Clock size={16} className="text-blue-400" />
              Cara Pembayaran
            </h3>
            <ul className="space-y-4">
              {[
                'Pilih menu Transfer > Virtual Account Billing pada ATM/Mobile Banking.',
                'Masukkan Nomor VA yang tertera di samping.',
                'Periksa apakah nominal sudah sesuai dengan tagihan.',
                'Gunakan Kode Unik (3 digit terakhir) agar verifikasi instan.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-5 h-5 bg-blue-800 rounded-full flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                  <p className="text-xs text-blue-100 leading-relaxed">{step}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500" />
              <h4 className="font-bold text-sm text-slate-700">Penting</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Biaya pendaftaran yang telah dibayarkan <b>tidak dapat ditarik kembali</b> dengan alasan apapun.
            </p>
          </div>
        </div>
      </div>
      
      {payment?.status === 'success' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 p-6 rounded-2xl flex items-start gap-4"
        >
          <CheckCircle2 size={24} className="text-green-600 shrink-0" />
          <div>
            <h4 className="font-bold text-green-800">Pembayaran Berhasil Diverifikasi</h4>
            <p className="text-sm text-green-700 mt-1">
              Terima kasih! Pembayaran Anda telah diterima. Silakan lanjutkan pelengkapan berkas di menu Berkas Persyaratan.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
