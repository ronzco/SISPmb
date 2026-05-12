import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { RegistrationDocument } from '../types';
import { motion } from 'motion/react';
import { Upload, File, CheckCircle, AlertCircle, X, ExternalLink, CloudUpload } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Documents() {
  const [docs, setDocs] = useState<RegistrationDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const documentTypes = [
    { id: 'ijazah', label: 'Ijazah / SKL SMA', description: 'File scan asli minimal resolusi 300dpi' },
    { id: 'kk', label: 'Kartu Keluarga', description: 'Halaman identitas kepala keluarga' },
    { id: 'foto', label: 'Pas Foto 4x6', description: 'Latar belakang merah/biru sesuai tahun lulus' },
    { id: 'ktp', label: 'KTP / Kartu Pelajar', description: 'Sisi depan yang terbaca jelas' },
  ];

  useEffect(() => {
    const fetchDocs = async () => {
      if (!auth.currentUser) return;
      const q = query(
        collection(db, 'documents'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedDocs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as RegistrationDocument));
      setDocs(fetchedDocs);
      setLoading(false);
    };

    fetchDocs();
  }, []);

  const handleUpload = async (typeId: string) => {
    if (!auth.currentUser) return;
    // Simulating upload for this applet environment
    const docData: Omit<RegistrationDocument, 'id'> = {
      userId: auth.currentUser.uid,
      type: typeId,
      url: `https://picsum.photos/seed/${typeId}/800/600`, // Placeholder
      status: 'pending',
      uploadedAt: Date.now(),
    };

    try {
      const docRef = await addDoc(collection(db, 'documents'), docData);
      setDocs([...docs, { id: docRef.id, ...docData }]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Gagal mengunggah berkas.');
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteDoc(doc(db, 'documents', docId));
      setDocs(docs.filter(d => d.id !== docId));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Berkas Persyaratan</h2>
        <p className="text-sm text-slate-500 mt-1">
          Unggah dokumen asli dalam format JPG, PNG, atau PDF (Maks 2MB per file).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentTypes.map((type) => {
          const docItem = docs.find(d => d.type === type.id);
          return (
            <div 
              key={type.id} 
              className={cn(
                "bg-white rounded-2xl border-2 p-6 flex flex-col gap-4 transition-all duration-300",
                docItem ? "border-slate-100 shadow-sm" : "border-dashed border-slate-200 hover:border-blue-300 bg-slate-50/50"
              )}
            >
              <div className="flex items-start justify-between">
                <div className={cn(
                  "p-3 rounded-xl",
                  docItem ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
                )}>
                  <File size={24} />
                </div>
                {docItem && (
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                    docItem.status === 'verified' ? "bg-green-100 text-green-700" :
                    docItem.status === 'rejected' ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  )}>
                    {docItem.status}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-sm">{type.label}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{type.description}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-50">
                {docItem ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <div className="flex-1 truncate text-xs text-slate-600 font-mono">
                        {type.id}_original_file.pdf
                      </div>
                      <button 
                        onClick={() => handleDelete(docItem.id)}
                        className="p-1 hover:text-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <a 
                      href={docItem.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                    >
                      <ExternalLink size={12} /> Lihat Berkas
                    </a>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleUpload(type.id)}
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-blue-600 transition-all rounded-xl hover:bg-white"
                  >
                    <CloudUpload size={32} strokeWidth={1.5} />
                    <span className="text-xs font-bold uppercase tracking-widest">Klik untuk Unggah</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-blue-900 rounded-2xl text-white flex flex-col sm:flex-row items-center gap-4 justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-800 rounded-xl">
            <CheckCircle size={24} className="text-blue-200" />
          </div>
          <div>
            <h3 className="font-bold">Total Berkas Terunggah</h3>
            <p className="text-xs text-blue-200">Anda telah mengunggah {docs.length} dari {documentTypes.length} berkas wajib.</p>
          </div>
        </div>
        <div className="w-48 h-2 bg-blue-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-400 transition-all duration-500" 
            style={{ width: `${(docs.length / documentTypes.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
}
