import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { dataApi } from '../lib/api';
import { RegistrationDocument } from '../types';
import { motion } from 'motion/react';
import { File, CheckCircle, X, ExternalLink, CloudUpload, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Documents() {
  const [docs, setDocs] = useState<RegistrationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const documentTypes = [
    { id: 'ijazah', label: 'Ijazah / SKL SMA', description: 'File scan asli minimal resolusi 300dpi' },
    { id: 'kk', label: 'Kartu Keluarga', description: 'Halaman identitas kepala keluarga' },
    { id: 'foto', label: 'Pas Foto 4x6', description: 'Latar belakang merah/biru sesuai tahun lulus' },
    { id: 'ktp', label: 'KTP / Kartu Pelajar', description: 'Sisi depan yang terbaca jelas' },
  ];

  const [uploading, setUploading] = useState<string | null>(null);

  const fetchDocs = async () => {
    try {
      const response = await dataApi.getMyDocuments();
      if (Array.isArray(response.data)) {
        setDocs(response.data);
        setError(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch documents:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, typeId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File terlalu besar. Maksimal 2MB.');
      return;
    }

    setUploading(typeId);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload file to server
      const uploadRes = await dataApi.uploadFile(formData);
      
      const fileUrl = uploadRes.data.url;

      // 2. Save document metadata
      await dataApi.uploadDocument({
        type: typeId,
        url: fileUrl,
      });

      await fetchDocs();
      alert('Berkas berhasil diunggah.');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Gagal mengunggah berkas.');
    } finally {
      setUploading(null);
    }
  };

  const handleUploadClick = (typeId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (e: any) => handleFileUpload(e, typeId);
    input.click();
  };

  const handleDelete = async (docId: string) => {
    try {
      await dataApi.deleteDocument(docId);
      setDocs(docs.filter(d => d.id !== docId));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (error) return (
    <div className="max-w-xl mx-auto mt-12 p-10 bg-white dark:bg-[#151921] rounded-[2.5rem] border border-red-200 dark:border-red-900/30 text-center">
      <X size={48} className="text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sync Error</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Gagal mengambil data berkas: {error}</p>
      <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest">Retry</button>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Documents...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white dark:bg-[#151921] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm transition-colors">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Berkas Persyaratan</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Unggah dokumen asli dalam format <span className="text-blue-600 dark:text-blue-400 font-bold">JPG, PNG, atau PDF</span> (Maks 2MB per file).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {documentTypes.map((type) => {
          const docItem = Array.isArray(docs) ? docs.find(d => d.type === type.id) : null;
          return (
            <div 
              key={type.id} 
              className={cn(
                "bg-white dark:bg-[#151921] rounded-3xl border-2 p-6 flex flex-col gap-4 transition-all duration-300 group",
                docItem 
                  ? "border-slate-100 dark:border-slate-800 shadow-sm" 
                  : "border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/20"
              )}
            >
              <div className="flex items-start justify-between">
                <div className={cn(
                  "p-3 rounded-[1rem] shadow-sm transition-all group-hover:scale-110",
                  docItem 
                    ? "bg-blue-600 text-white" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
                )}>
                  <File size={20} />
                </div>
                {docItem && (
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                    docItem.status === 'verified' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                    docItem.status === 'rejected' ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" :
                    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                  )}>
                    {docItem.status}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-wider">{type.label}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{type.description}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                {docItem ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="flex-1 truncate text-[10px] text-slate-500 font-mono font-bold tracking-tighter">
                        {type.id}_ORIGINAL_SCAN.pdf
                      </div>
                      <button 
                        onClick={() => handleDelete(docItem.id)}
                        className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-600 transition-colors rounded-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <a 
                      href={docItem.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all border border-blue-100 dark:border-blue-900/50"
                    >
                      <ExternalLink size={12} /> View File
                    </a>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleUploadClick(type.id)}
                    disabled={uploading === type.id}
                    className="w-full h-28 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-2xl hover:bg-white dark:hover:bg-slate-800/50 disabled:opacity-50"
                  >
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      {uploading === type.id ? <Loader2 className="animate-spin" size={24} /> : <CloudUpload size={24} strokeWidth={2} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                      {uploading === type.id ? 'Uploading...' : 'Upload Now'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-blue-900 dark:bg-blue-600 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-6 justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-inner">
            <CheckCircle size={32} className="text-white" />
          </div>
          <div>
            <h3 className="font-black text-xl tracking-tight">Kesiapan Berkas</h3>
            <p className="text-sm text-blue-100/80 font-medium">Anda telah mengunggah <span className="text-white font-black">{docs.length}</span> dari <span className="text-white font-black">{documentTypes.length}</span> berkas wajib.</p>
          </div>
        </div>
        <div className="w-full md:w-64 space-y-2 relative z-10">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-1">
             <span>Progress</span>
             <span>{Math.round((docs.length / documentTypes.length) * 100)}%</span>
          </div>
          <div className="h-3 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden p-0.5 border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(docs.length / documentTypes.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
            ></motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
