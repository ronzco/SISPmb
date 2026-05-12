import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, getDocs, where, limit } from 'firebase/firestore';
import { Announcement } from '../types';
import { motion } from 'motion/react';
import { Megaphone, Calendar, Tag, ChevronRight, Share2, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Default demo data since firestore might be empty initially
  const demoAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'Pendaftaran Jalur Beasiswa Gelombang II Dibuka',
      content: 'Universitas Teknologi Nusantara membuka kesempatan beasiswa penuh untuk calon mahasiswa berprestasi di Gelombang II. Cek kuota masing-masing prodi...',
      type: 'info',
      createdAt: Date.now() - 1000 * 60 * 60 * 24, // Yesterday
    },
    {
      id: '2',
      title: 'Workshop Persiapan Perkuliahan Online (PP-Pro)',
      content: 'Wajib diikuti oleh seluruh calon mahasiswa yang telah melakukan pembayaran biaya pendaftaran. Link zoom akan dibagikan melalui WhatsApp...',
      type: 'warning',
      createdAt: Date.now() - 1000 * 60 * 60 * 48,
    },
    {
      id: '3',
      title: 'Update Alamat Helpdesk PMB 2024',
      content: 'Pusat layanan informasi kini berpindah ke Gedung Rektorat Lantai dasar. Jam operasional tetap 08.00 - 16.00 WIB.',
      type: 'info',
      createdAt: Date.now() - 1000 * 60 * 60 * 72,
    }
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Announcement));
        
        let displayList = fetched.length > 0 ? fetched : demoAnnouncements;

        // Add contextual announcements
        if (auth.currentUser) {
          const appQ = query(collection(db, 'applications'), where('userId', '==', auth.currentUser.uid), limit(1));
          const appSnap = await getDocs(appQ);
          if (!appSnap.empty) {
            const app = appSnap.docs[0].data() as any;
            if (app.status === 'accepted') {
              displayList = [{
                id: 'congrats',
                title: '🎉 Selamat! Anda Dinyatakan Lulus Seleksi',
                content: `Selamat kepada ${app.fullName || 'Anda'}. Anda telah resmi diterima di Program Studi ${app.major}. Silakan ikuti langkah registrasi ulang di bawah ini.`,
                type: 'info',
                createdAt: Date.now()
              }, ...displayList];
            } else if (app.status === 'rejected') {
              displayList = [{
                id: 'sorry',
                title: 'Hasil Seleksi PMB Jalur Reguler 2024',
                content: 'Setelah melalui proses seleksi yang ketat, kami menginformasikan bahwa Anda belum dapat bergabung bersama kami saat ini. Tetap semangat!',
                type: 'urgent',
                createdAt: Date.now()
              }, ...displayList];
            }
          }
        }

        setAnnouncements(displayList);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setAnnouncements(demoAnnouncements);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Search & Stats */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari pengumuman..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide">
          {['Semua', 'Info', 'Peringatan', 'Mendesak'].map(cat => (
            <button key={cat} className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all",
              cat === 'Semua' ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-white text-slate-500 border border-slate-200 hover:border-blue-300"
            )}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {announcements.map((ann, idx) => (
          <motion.div 
            key={ann.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all group cursor-pointer"
          >
            <div className="shrink-0 flex md:flex-col gap-2 items-center md:items-start">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-sm border border-slate-100",
                ann.type === 'urgent' ? "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white" :
                ann.type === 'warning' ? "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white" :
                "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
              )}>
                <Megaphone size={24} />
              </div>
              <div className="md:mt-4 text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Terbit</p>
                <p className="text-xs font-bold text-slate-700 mt-1">{new Date(ann.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn(
                  "px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider",
                  ann.type === 'urgent' ? "bg-red-100 text-red-700" :
                  ann.type === 'warning' ? "bg-orange-100 text-orange-700" :
                  "bg-blue-100 text-blue-700"
                )}>
                  {ann.type}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                  <Tag size={10} /> #PMB2024
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {ann.title}
              </h3>
              
              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {ann.content}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <button className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                  Baca Selengkapnya <ChevronRight size={14} />
                </button>
                <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 ml-auto">
                   <Share2 size={12} /> Bagikan
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-2xl p-8 border-2 border-dashed border-slate-200 text-center">
        <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Arsip Pengumuman</h4>
        <p className="text-slate-400 text-[11px] mt-2 italic">Menampilkan 3 berita terbaru. Klik untuk melihat riwayat lengkap.</p>
      </div>
    </motion.div>
  );
}
