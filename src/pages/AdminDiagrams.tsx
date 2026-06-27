import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Database, HelpCircle, ArrowRight, User, Server, 
  Workflow, Info, Layers, Lock, Settings, CheckCircle2, 
  AlertCircle, ChevronRight, FileText, LayoutDashboard, Code, Shield
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminDiagrams() {
  const [activeTab, setActiveTab] = useState<'usecase' | 'activity' | 'sequence' | 'class'>('usecase');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedNotation, setSelectedNotation] = useState<string | null>(null);
  const [selectedSeqStep, setSelectedSeqStep] = useState<string | null>(null);
  const [seqActivePhase, setSeqActivePhase] = useState<'all' | 'registration' | 'selection' | 'reregistration'>('all');
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubDiagram, setSelectedSubDiagram] = useState<'auth' | 'admin' | 'student'>('student');

  // Swimlanes Data for Activity Diagram
  const activitySteps = [
    {
      id: 'step1',
      title: 'Registrasi & Login',
      lane: 'student',
      desc: 'Calon Mahasiswa membuat akun menggunakan email aktif dan melakukan login ke sistem.',
      next: 'step2'
    },
    {
      id: 'step2',
      title: 'Isi Formulir Data Diri',
      lane: 'student',
      desc: 'Mengisi biodata lengkap, memilih fakultas & program studi (prodi) yang diinginkan.',
      next: 'step3'
    },
    {
      id: 'step3',
      title: 'Unggah Berkas Persyaratan',
      lane: 'student',
      desc: 'Mengunggah 4 berkas wajib: Ijazah, KTP, KK, & Pas Foto dalam format JPG/PNG/PDF.',
      next: 'step4'
    },
    {
      id: 'step4',
      title: 'Bayar Biaya Pendaftaran',
      lane: 'student',
      desc: 'Melakukan pembayaran pendaftaran melalui metode VA atau QRIS.',
      next: 'step5'
    },
    {
      id: 'step5',
      title: 'Validasi Pembayaran',
      lane: 'system',
      desc: 'Sistem secara otomatis atau manual memverifikasi status transaksi pembayaran pendaftaran.',
      next: 'step6'
    },
    {
      id: 'step6',
      title: 'Verifikasi Berkas Pendaftaran',
      lane: 'committee',
      desc: 'Panitia Akademik meninjau kelayakan dan kebenaran berkas yang diunggah mahasiswa.',
      next: 'step7'
    },
    {
      id: 'step7',
      title: 'Pemberian Kartu Ujian (Test Ready)',
      lane: 'system',
      desc: 'Setelah berkas diverifikasi dan pembayaran sukses, sistem merilis kartu dan kode seleksi ujian.',
      next: 'step8'
    },
    {
      id: 'step8',
      title: 'Seleksi Tulis & Input Nilai',
      lane: 'committee',
      desc: 'Mahasiswa mengikuti ujian seleksi, dan panitia menginput nilai hasil ujian ke sistem.',
      next: 'step9'
    },
    {
      id: 'step9',
      title: 'Pengumuman Hasil Seleksi',
      lane: 'system',
      desc: 'Sistem merilis hasil seleksi: LULUS (Accepted) atau TIDAK LULUS (Rejected).',
      next: 'step10'
    },
    {
      id: 'step10',
      title: 'Bayar Biaya Kuliah (UKT)',
      lane: 'student',
      desc: 'Bagi yang dinyatakan LULUS, tombol bayar UKT aktif untuk daftar ulang dan mendapatkan NIM.',
      next: 'finish'
    }
  ];

  // Dynamic Helpers for Activity and Sequence diagrams based on sub-diagram selection

  const getAuthActivityPaths = () => (
    <>
      {/* init -> act_auth_reg */}
      <path 
        d="M 160 52 L 160 100" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_auth_reg -> act_auth_save */}
      <path 
        d="M 160 150 L 160 165 L 480 165 L 480 180" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_auth_save -> act_auth_login */}
      <path 
        d="M 480 230 L 480 255 L 160 255 L 160 280" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_auth_login -> act_auth_verify */}
      <path 
        d="M 160 330 L 160 345 L 480 345 L 480 360" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_auth_verify -> dec_auth_valid */}
      <path 
        d="M 480 410 L 480 460" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* dec_auth_valid -> act_auth_fail [Tidak Valid] */}
      <path 
        d="M 456 480 L 800 480" 
        stroke="#ef4444" 
        strokeWidth="2" 
        strokeDasharray="4 4"
        markerEnd="url(#arrow-red)" 
        fill="none" 
      />
      {/* act_auth_fail -> act_auth_login */}
      <path 
        d="M 875 435 L 875 305 L 265 305" 
        stroke="#ef4444" 
        strokeWidth="2" 
        strokeDasharray="4 4"
        markerEnd="url(#arrow-red)" 
        fill="none" 
      />
      {/* dec_auth_valid -> act_auth_success [Valid] */}
      <path 
        d="M 480 504 L 480 560" 
        stroke="#10b981" 
        strokeWidth="2" 
        markerEnd="url(#arrow-green)" 
        fill="none" 
      />
      {/* act_auth_success -> final_auth */}
      <path 
        d="M 480 610 L 480 650" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
    </>
  );

  const getAdminActivityPaths = () => (
    <>
      {/* init -> act_adm_ann */}
      <path 
        d="M 160 52 L 160 100" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_adm_ann -> act_adm_fee */}
      <path 
        d="M 160 150 L 160 200" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_adm_fee -> act_adm_verify_doc */}
      <path 
        d="M 160 250 L 160 300" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_adm_verify_doc -> dec_doc_valid */}
      <path 
        d="M 265 325 L 480 325" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* dec_doc_valid -> act_adm_verify_test [Valid] */}
      <path 
        d="M 480 344 L 480 370 L 160 370 L 160 400" 
        stroke="#10b981" 
        strokeWidth="2" 
        markerEnd="url(#arrow-green)" 
        fill="none" 
      />
      {/* dec_doc_valid -> act_adm_ann [Revisi Berkas] */}
      <path 
        d="M 504 325 L 800 325 L 800 125 L 265 125" 
        stroke="#ef4444" 
        strokeWidth="2" 
        strokeDasharray="4 4"
        markerEnd="url(#arrow-red)" 
        fill="none" 
      />
      {/* act_adm_verify_test -> dec_test_pass */}
      <path 
        d="M 265 425 L 480 425" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* dec_test_pass -> act_adm_publish [Lolos] */}
      <path 
        d="M 504 425 L 800 425" 
        stroke="#10b981" 
        strokeWidth="2" 
        markerEnd="url(#arrow-green)" 
        fill="none" 
      />
      {/* dec_test_pass -> final_admin [Gagal / Reject] */}
      <path 
        d="M 480 444 L 480 515 L 800 515" 
        stroke="#ef4444" 
        strokeWidth="2" 
        strokeDasharray="4 4"
        markerEnd="url(#arrow-red)" 
        fill="none" 
      />
      {/* act_adm_publish -> final_admin */}
      <path 
        d="M 875 450 L 875 490" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
    </>
  );

  const getStudentActivityPaths = () => (
    <>
      {/* init -> act_reg_fill */}
      <path 
        d="M 160 52 L 160 90" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_reg_fill -> act_reg_upload */}
      <path 
        d="M 160 140 L 160 190" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_reg_upload -> act_reg_pay */}
      <path 
        d="M 160 240 L 160 290" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_reg_pay -> act_reg_verify_pay */}
      <path 
        d="M 265 315 L 480 315" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_reg_verify_pay -> dec_pay_ok */}
      <path 
        d="M 480 340 L 480 390" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* dec_pay_ok -> act_reg_card [Valid] */}
      <path 
        d="M 456 415 L 160 415 L 160 490" 
        stroke="#10b981" 
        strokeWidth="2" 
        markerEnd="url(#arrow-green)" 
        fill="none" 
      />
      {/* dec_pay_ok -> act_reg_pay [Gagal] */}
      <path 
        d="M 504 415 L 680 415 L 680 265 L 265 265" 
        stroke="#ef4444" 
        strokeWidth="2" 
        strokeDasharray="4 4"
        markerEnd="url(#arrow-red)" 
        fill="none" 
      />
      {/* act_reg_card -> act_exam_offline */}
      <path 
        d="M 265 515 L 800 515" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_exam_offline -> act_reg_re_reg */}
      <path 
        d="M 800 540 L 800 565 L 480 565 L 480 590" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* act_reg_re_reg -> dec_re_reg_valid */}
      <path 
        d="M 480 640 L 480 690" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
      {/* dec_re_reg_valid -> act_reg_complete [Selesai] */}
      <path 
        d="M 480 714 L 480 780" 
        stroke="#10b981" 
        strokeWidth="2" 
        markerEnd="url(#arrow-green)" 
        fill="none" 
      />
      {/* dec_re_reg_valid -> act_reg_re_reg [Pending] */}
      <path 
        d="M 504 715 L 720 715 L 720 570 L 265 570" 
        stroke="#ef4444" 
        strokeWidth="2" 
        strokeDasharray="4 4"
        markerEnd="url(#arrow-red)" 
        fill="none" 
      />
      {/* act_reg_complete -> final_reg */}
      <path 
        d="M 480 830 L 480 860" 
        stroke={selectedNotation === 'control' ? "#3b82f6" : "#64748b"} 
        strokeWidth={selectedNotation === 'control' ? "3" : "2"}
        markerEnd={selectedNotation === 'control' ? "url(#arrow-blue)" : "url(#arrow)"} 
        fill="none" 
      />
    </>
  );

  const getUmlNodes = () => {
    if (selectedSubDiagram === 'auth') {
      return [
        { 
          id: 'init', 
          type: 'initial', 
          x: 160, 
          y: 40, 
          title: 'Initial Node', 
          desc: 'Pengguna membuka modul registrasi atau halaman login.',
          component: 'src/pages/Register.tsx / Login.tsx',
          impact: 'Tidak ada mutasi basis data.'
        },
        { 
          id: 'act_auth_reg', 
          type: 'action', 
          x: 160, 
          y: 125, 
          width: 180, 
          height: 50, 
          title: 'Register Akun', 
          role: 'Calon Mahasiswa / Admin',
          desc: 'Menginput email dan kata sandi baru untuk membuat akun.',
          component: 'src/pages/Register.tsx',
          impact: 'Mengirimkan payload registrasi ke endpoint API backend.'
        },
        { 
          id: 'act_auth_save', 
          type: 'action', 
          x: 480, 
          y: 205, 
          width: 210, 
          height: 50, 
          title: 'Simpan Akun & Hash', 
          role: 'Sistem',
          desc: 'Sistem memvalidasi keunikan email, melakukan hashing password aman, dan membuat record baru.',
          component: 'server.ts (Express Register Endpoint)',
          impact: 'INSERT INTO users (email, password_hash, role = "applicant")'
        },
        { 
          id: 'act_auth_login', 
          type: 'action', 
          x: 160, 
          y: 305, 
          width: 180, 
          height: 50, 
          title: 'Login Akun', 
          role: 'Calon Mahasiswa / Admin',
          desc: 'Menginput kredensial akun yang sudah terdaftar untuk masuk ke aplikasi.',
          component: 'src/pages/Login.tsx',
          impact: 'Mengirimkan payload login (email, password).'
        },
        { 
          id: 'act_auth_verify', 
          type: 'action', 
          x: 480, 
          y: 385, 
          width: 210, 
          height: 50, 
          title: 'Verifikasi Kredensial', 
          role: 'Sistem',
          desc: 'Sistem membandingkan kata sandi terinput dengan hash yang disimpan di basis data.',
          component: 'server.ts (bcrypt.compare)',
          impact: 'SELECT password_hash FROM users WHERE email = ?'
        },
        { 
          id: 'dec_auth_valid', 
          type: 'decision', 
          x: 480, 
          y: 472, 
          title: 'Valid?',
          desc: 'Apakah email dan kata sandi cocok?',
          component: 'server.ts (Auth Middleware)',
          impact: 'Bila tidak valid, lempar HTTP 401. Bila sukses, rilis token.'
        },
        { 
          id: 'act_auth_fail', 
          type: 'action', 
          x: 800, 
          y: 460, 
          width: 180, 
          height: 50, 
          title: 'Tampilkan Error Login', 
          role: 'Sistem / DB',
          desc: 'Sistem memberikan respons penolakan masuk dan klien menampilkan notifikasi kegagalan.',
          component: 'src/pages/Login.tsx (Toast Notifikasi)',
          impact: 'Tidak ada mutasi basis data. Catat log kegagalan login.'
        },
        { 
          id: 'act_auth_success', 
          type: 'action', 
          x: 480, 
          y: 585, 
          width: 210, 
          height: 50, 
          title: 'Rilis JWT & Redirect', 
          role: 'Sistem',
          desc: 'Sistem menerbitkan JSON Web Token (JWT) yang didekripsi berisi payload role pendaftar, dan mengarahkan ke dashboard.',
          component: 'server.ts (jwt.sign) -> App.tsx (Redirect)',
          impact: 'Menyimpan JWT di cookie/localStorage klien untuk autentikasi state.'
        },
        { 
          id: 'final_auth', 
          type: 'final', 
          x: 480, 
          y: 665, 
          title: 'Selesai login',
          desc: 'Pengguna sukses masuk ke halaman panel berwenang.',
          component: 'src/pages/Dashboard.tsx',
          impact: 'Sesi aktif terbuat.'
        }
      ];
    } else if (selectedSubDiagram === 'admin') {
      return [
        { 
          id: 'init', 
          type: 'initial', 
          x: 160, 
          y: 40, 
          title: 'Initial Node', 
          desc: 'Admin membuka panel kelola PMB SIPMB.',
          component: 'src/pages/Dashboard.tsx',
          impact: 'Sinyal otorisasi divalidasi oleh sistem.'
        },
        { 
          id: 'act_adm_ann', 
          type: 'action', 
          x: 160, 
          y: 125, 
          width: 210, 
          height: 50, 
          title: 'Kelola Pengumuman', 
          role: 'Admin',
          desc: 'Membuat, merubah, atau menghapus informasi pengumuman pendaftaran prodi serta kuota penerimaan.',
          component: 'src/pages/Dashboard.tsx (Tab Pengumuman)',
          impact: 'INSERT INTO announcements / UPDATE programs'
        },
        { 
          id: 'act_adm_fee', 
          type: 'action', 
          x: 160, 
          y: 225, 
          width: 210, 
          height: 50, 
          title: 'Kelola Biaya Kuliah (UKT)', 
          role: 'Admin',
          desc: 'Menetapkan nominal biaya kuliah pendaftaran reguler dan nominal UKT semester per program studi.',
          component: 'src/pages/Dashboard.tsx (Tab Biaya)',
          impact: 'UPDATE tuition_fees SET nominal_ukt = ? WHERE program_id = ?'
        },
        { 
          id: 'act_adm_verify_doc', 
          type: 'action', 
          x: 160, 
          y: 325, 
          width: 210, 
          height: 50, 
          title: 'Verifikasi Dokumen Berkas', 
          role: 'Admin',
          desc: 'Memeriksa keabsahan ijazah, kartu keluarga, dan berkas yang diupload calon mahasiswa.',
          component: 'src/pages/Dashboard.tsx (Daftar Pendaftar)',
          impact: 'Mengubah status keabsahan dokumen berkas.'
        },
        { 
          id: 'dec_doc_valid', 
          type: 'decision', 
          x: 480, 
          y: 325, 
          title: 'Berkas Valid?',
          desc: 'Apakah dokumen lengkap dan memenuhi standar administrasi?',
          component: 'server.ts (Verify Route)',
          impact: 'Bila tidak valid, kembalikan ke pendaftar untuk direvisi.'
        },
        { 
          id: 'act_adm_verify_test', 
          type: 'action', 
          x: 160, 
          y: 425, 
          width: 210, 
          height: 50, 
          title: 'Verifikasi Hasil Tes Seleksi', 
          role: 'Admin',
          desc: 'Menginputkan dan memverifikasi skor hasil tes seleksi tertulis offline pendaftar ke dalam sistem database.',
          component: 'src/pages/Dashboard.tsx (Input Nilai)',
          impact: 'UPDATE test_attempts SET score = ?, status = "APPROVED"'
        },
        { 
          id: 'dec_test_pass', 
          type: 'decision', 
          x: 480, 
          y: 425, 
          title: 'Lolos Seleksi?',
          desc: 'Apakah nilai ujian memenuhi passing grade prodi terpilih?',
          component: 'server.ts (Admission Service)',
          impact: 'Bila lolos, sistem merilis virtual account pembayaran kuliah.'
        },
        { 
          id: 'act_adm_publish', 
          type: 'action', 
          x: 800, 
          y: 425, 
          width: 210, 
          height: 50, 
          title: 'Publish Hasil Kelulusan', 
          role: 'Admin / Sistem',
          desc: 'Admin mempublikasikan status kelulusan final yang akan tampil pada dashboard calon mahasiswa terkait.',
          component: 'server.ts (Publish API)',
          impact: 'UPDATE applications SET selection_status = "PASSED", va_ukt = "8823102..."'
        },
        { 
          id: 'final_admin', 
          type: 'final', 
          x: 800, 
          y: 505, 
          title: 'Selesai Verifikasi',
          desc: 'Siklus peninjauan pendaftar selesai.',
          component: 'None',
          impact: 'Status kelulusan terpublish penuh.'
        }
      ];
    } else {
      // student (calon mahasiswa)
      return [
        { 
          id: 'init', 
          type: 'initial', 
          x: 160, 
          y: 40, 
          title: 'Initial Node', 
          desc: 'Pendaftar masuk ke portal setelah otorisasi akun sukses.',
          component: 'src/pages/Dashboard.tsx',
          impact: 'Session Token divalidasi.'
        },
        { 
          id: 'act_reg_fill', 
          type: 'action', 
          x: 160, 
          y: 115, 
          width: 180, 
          height: 50, 
          title: 'Pendaftaran Kuliah', 
          role: 'Calon Mahasiswa',
          desc: 'Mengisi biodata lengkap dan memilih prodi/fakultas tujuan.',
          component: 'src/pages/Dashboard.tsx (Isi Biodata)',
          impact: 'INSERT INTO applications (user_id, status = "DRAFT")'
        },
        { 
          id: 'act_reg_upload', 
          type: 'action', 
          x: 160, 
          y: 215, 
          width: 180, 
          height: 50, 
          title: 'Upload Dokumen Berkas', 
          role: 'Calon Mahasiswa',
          desc: 'Mengunggah scan berkas ijazah, KK, dan pas foto.',
          component: 'src/pages/Dashboard.tsx (Upload PDF)',
          impact: 'INSERT INTO documents (file_path, type) & UPDATE applications status = "SUBMITTED"'
        },
        { 
          id: 'act_reg_pay', 
          type: 'action', 
          x: 160, 
          y: 315, 
          width: 210, 
          height: 50, 
          title: 'Pembayaran Biaya Pendaftaran', 
          role: 'Calon Mahasiswa',
          desc: 'Melakukan transfer bank ke nomor Virtual Account (VA) untuk pendaftaran seleksi.',
          component: 'src/pages/Dashboard.tsx (VA Panel)',
          impact: 'Sistem perbankan mendeteksi transaksi transfer pendaftaran.'
        },
        { 
          id: 'act_reg_verify_pay', 
          type: 'action', 
          x: 480, 
          y: 315, 
          width: 180, 
          height: 50, 
          title: 'Verifikasi Bayar PMB', 
          role: 'Sistem',
          desc: 'Sistem secara real-time mendeteksi konfirmasi pembayaran biaya pendaftaran.',
          component: 'server.ts (VA Callback Route)',
          impact: 'INSERT INTO payments (status: "PAID", nominal: 250000)'
        },
        { 
          id: 'dec_pay_ok', 
          type: 'decision', 
          x: 480, 
          y: 415, 
          title: 'Pembayaran Sukses?',
          desc: 'Apakah dana transfer terverifikasi pas?',
          component: 'server.ts (Payment Callback handler)',
          impact: 'Bila sukses, unlock akses unduh kartu tes ujian.'
        },
        { 
          id: 'act_reg_card', 
          type: 'action', 
          x: 160, 
          y: 515, 
          width: 180, 
          height: 50, 
          title: 'Ambil / Cetak Kartu Tes', 
          role: 'Calon Mahasiswa',
          desc: 'Mengunduh dan mencetak kartu ujian untuk digunakan pada ujian tertulis offline terpisah.',
          component: 'src/pages/Dashboard.tsx (Tombol Cetak)',
          impact: 'UPDATE applications SET test_status = "CARD_PRINTED"'
        },
        { 
          id: 'act_exam_offline', 
          type: 'action', 
          x: 800, 
          y: 515, 
          width: 210, 
          height: 50, 
          title: 'Ikut Tes Seleksi Tertulis', 
          role: 'Calon Mahasiswa & Panitia',
          desc: 'Mengikuti ujian saringan masuk secara luring/offline di kampus sesuai jadwal kartu tes.',
          component: 'Ujian Manual (Offline)',
          impact: 'Skor ujian direkap oleh tim penguji seleksi.'
        },
        { 
          id: 'act_reg_re_reg', 
          type: 'action', 
          x: 480, 
          y: 615, 
          width: 180, 
          height: 50, 
          title: 'Pendaftaran Ulang & UKT', 
          role: 'Calon Mahasiswa',
          desc: 'Mengakses kembali portal, mengisi konfirmasi pendaftaran ulang, serta mengupload bukti lunas UKT semester pertama.',
          component: 'src/pages/Dashboard.tsx (Konfirmasi UKT)',
          impact: 'UPDATE applications SET re_register_status = "SUBMITTED"'
        },
        { 
          id: 'dec_re_reg_valid', 
          type: 'decision', 
          x: 480, 
          y: 715, 
          title: 'UKT & Berkas Valid?',
          desc: 'Apakah bukti transfer lunas biaya kuliah (UKT) valid dan dokumen daftar ulang terpenuhi?',
          component: 'server.ts (Re-registration handler)',
          impact: 'Bila lolos verifikasi final, rilis NIM.'
        },
        { 
          id: 'act_reg_complete', 
          type: 'action', 
          x: 480, 
          y: 805, 
          width: 180, 
          height: 50, 
          title: 'Selesaikan/Ulangi Pendaftaran', 
          role: 'Calon Mahasiswa / Sistem',
          desc: 'Menyelesaikan seluruh siklus pendaftaran. Sistem merilis Nomor Induk Mahasiswa (NIM) resmi.',
          component: 'server.ts (NIM Generator)',
          impact: 'UPDATE applications SET status = "COMPLETED", nim = "2026..."'
        },
        { 
          id: 'final_reg', 
          type: 'final', 
          x: 480, 
          y: 875, 
          title: 'Selesai pendaftaran',
          desc: 'Proses penerimaan pendaftar resmi berakhir. Calon mahasiswa resmi menjadi mahasiswa aktif.',
          component: 'None',
          impact: 'Sesi diarsipkan.'
        }
      ];
    }
  };

  const getSequenceSteps = () => {
    if (selectedSubDiagram === 'auth') {
      return [
        {
          id: 'seq_auth_1',
          num: '1',
          from: 'Calon Mahasiswa',
          to: 'React Client',
          fromX: 120,
          toX: 360,
          y: 160,
          msg: '1: registerAccount(email, password)',
          details: 'Pendaftar atau Super Admin menekan tombol register di formulir.',
          phase: 'registration',
          codeFile: 'src/pages/Register.tsx',
          dbImpact: 'None (Klien memicu validasi format lokal)'
        },
        {
          id: 'seq_auth_2',
          num: '2',
          from: 'React Client',
          to: 'Express Server',
          fromX: 360,
          toX: 600,
          y: 200,
          msg: '2: POST /api/auth/register',
          details: 'Klien mengirimkan kredensial aman ke endpoint API pendaftaran.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_auth_3',
          num: '3',
          from: 'Express Server',
          to: 'Database (MySQL)',
          fromX: 600,
          toX: 840,
          y: 240,
          msg: '3: INSERT INTO users (role: "APPLICANT")',
          details: 'Server melakukan hashing password, lalu menyisipkan entri akun dengan hak akses pelamar.',
          phase: 'registration',
          codeFile: 'server.ts (bcrypt.hash)',
          dbImpact: 'INSERT INTO users (email, password_hash, role = "applicant")'
        },
        {
          id: 'seq_auth_4',
          num: '4',
          from: 'Database (MySQL)',
          to: 'Express Server',
          fromX: 840,
          toX: 600,
          y: 280,
          msg: '4: Success (User Created)',
          details: 'Database merespons bahwa row user baru sukses terbuat.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'Row User terbuat di DB'
        },
        {
          id: 'seq_auth_5',
          num: '5',
          from: 'Express Server',
          to: 'React Client',
          fromX: 600,
          toX: 360,
          y: 320,
          msg: '5: HTTP 201 (Registered)',
          details: 'Server mengembalikan respons registrasi sukses.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_auth_6',
          num: '6',
          from: 'React Client',
          to: 'Calon Mahasiswa',
          fromX: 360,
          toX: 120,
          y: 360,
          msg: '6: Show Login Form',
          details: 'Formulir dialihkan secara visual untuk mengajak pengguna melakukan login masuk.',
          phase: 'registration',
          codeFile: 'src/pages/Login.tsx',
          dbImpact: 'None'
        },
        {
          id: 'seq_auth_7',
          num: '7',
          from: 'Calon Mahasiswa',
          to: 'React Client',
          fromX: 120,
          toX: 360,
          y: 410,
          msg: '7: login(email, password)',
          details: 'Pengguna mengetikkan data kredensial pendaftaran yang baru.',
          phase: 'registration',
          codeFile: 'src/pages/Login.tsx',
          dbImpact: 'None'
        },
        {
          id: 'seq_auth_8',
          num: '8',
          from: 'React Client',
          to: 'Express Server',
          fromX: 360,
          toX: 600,
          y: 450,
          msg: '8: POST /api/auth/login',
          details: 'Klien mengirimkan data login masuk ke gateway.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_auth_9',
          num: '9',
          from: 'Express Server',
          to: 'Database (MySQL)',
          fromX: 600,
          toX: 840,
          y: 490,
          msg: '9: SELECT * FROM users WHERE email = ?',
          details: 'Sistem mencocokkan data baris email di database.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_auth_10',
          num: '10',
          from: 'Database (MySQL)',
          to: 'Express Server',
          fromX: 840,
          toX: 600,
          y: 530,
          msg: '10: User Data (Hashed Pass)',
          details: 'Database memberikan detail hash password.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_auth_11',
          num: '11',
          from: 'Express Server',
          to: 'React Client',
          fromX: 600,
          toX: 360,
          y: 580,
          msg: '11: HTTP 200 (Success JWT Token)',
          details: 'Server menerbitkan JWT token pendaftaran.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'Sesi aktif diaktifkan'
        }
      ];
    } else if (selectedSubDiagram === 'admin') {
      return [
        {
          id: 'seq_adm_1',
          num: '1',
          from: 'Admin Panitia',
          to: 'React Client',
          fromX: 120,
          toX: 360,
          y: 150,
          msg: '1: inputPengumuman(judul, kuota)',
          details: 'Admin mengisi data pengumuman pendaftaran prodi.',
          phase: 'selection',
          codeFile: 'src/pages/Dashboard.tsx',
          dbImpact: 'None'
        },
        {
          id: 'seq_adm_2',
          num: '2',
          from: 'React Client',
          to: 'Express Server',
          fromX: 360,
          toX: 600,
          y: 190,
          msg: '2: POST /api/admin/announcements',
          details: 'Client mengirim payload data pengumuman ke API.',
          phase: 'selection',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_adm_3',
          num: '3',
          from: 'Express Server',
          to: 'Database (MySQL)',
          fromX: 600,
          toX: 840,
          y: 230,
          msg: '3: INSERT INTO announcements',
          details: 'Server menyimpan data pengumuman baru ke DB.',
          phase: 'selection',
          codeFile: 'server.ts',
          dbImpact: 'INSERT INTO announcements (title, content, created_at)'
        },
        {
          id: 'seq_adm_4',
          num: '4',
          from: 'Admin Panitia',
          to: 'React Client',
          fromX: 120,
          toX: 360,
          y: 280,
          msg: '4: setBiayaKuliah(prodi, nominal_ukt)',
          details: 'Admin menetapkan data UKT prodi.',
          phase: 'selection',
          codeFile: 'src/pages/Dashboard.tsx',
          dbImpact: 'None'
        },
        {
          id: 'seq_adm_5',
          num: '5',
          from: 'React Client',
          to: 'Express Server',
          fromX: 360,
          toX: 600,
          y: 320,
          msg: '5: POST /api/admin/tuition-fees',
          details: 'Client mengirim payload nominal UKT ke server.',
          phase: 'selection',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_adm_6',
          num: '6',
          from: 'Express Server',
          to: 'Database (MySQL)',
          fromX: 600,
          toX: 840,
          y: 360,
          msg: '6: INSERT INTO tuition_fees',
          details: 'Server menyisipkan data atau mengupdate harga UKT.',
          phase: 'selection',
          codeFile: 'server.ts',
          dbImpact: 'INSERT INTO tuition_fees (program_id, amount_ukt)'
        },
        {
          id: 'seq_adm_7',
          num: '7',
          from: 'Admin Panitia',
          to: 'React Client',
          fromX: 120,
          toX: 360,
          y: 410,
          msg: '7: verifikasiBerkas(applicantId, status: "APPROVED")',
          details: 'Admin menyetujui berkas pendaftaran calon mahasiswa.',
          phase: 'selection',
          codeFile: 'src/pages/Dashboard.tsx',
          dbImpact: 'None'
        },
        {
          id: 'seq_adm_8',
          num: '8',
          from: 'React Client',
          to: 'Express Server',
          fromX: 360,
          toX: 600,
          y: 450,
          msg: '8: PATCH /api/admin/verify-documents',
          details: 'Client mengirim status verifikasi berkas.',
          phase: 'selection',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_adm_9',
          num: '9',
          from: 'Express Server',
          to: 'Database (MySQL)',
          fromX: 600,
          toX: 840,
          y: 490,
          msg: '9: UPDATE applications SET doc_status = "VERIFIED"',
          details: 'Server mengubah status dokumen pendaftaran pelamar.',
          phase: 'selection',
          codeFile: 'server.ts',
          dbImpact: 'UPDATE applications SET doc_status = "VERIFIED" WHERE id = ?'
        },
        {
          id: 'seq_adm_10',
          num: '10',
          from: 'Admin Panitia',
          to: 'React Client',
          fromX: 120,
          toX: 360,
          y: 540,
          msg: '10: inputNilaiUjian(applicantId, nilai: 85)',
          details: 'Admin memasukkan hasil ujian tertulis offline ke form.',
          phase: 'selection',
          codeFile: 'src/pages/Dashboard.tsx',
          dbImpact: 'None'
        },
        {
          id: 'seq_adm_11',
          num: '11',
          from: 'React Client',
          to: 'Express Server',
          fromX: 360,
          toX: 600,
          y: 580,
          msg: '11: POST /api/admin/test-results',
          details: 'Server memproses nilai kelulusan.',
          phase: 'selection',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_adm_12',
          num: '12',
          from: 'Express Server',
          to: 'Database (MySQL)',
          fromX: 600,
          toX: 840,
          y: 620,
          msg: '12: UPDATE test_attempts SET score = 85, status = "PASSED"',
          details: 'Sistem mengupdate data nilai dan mengesahkan status lulus.',
          phase: 'selection',
          codeFile: 'server.ts',
          dbImpact: 'UPDATE test_attempts SET score = 85, status = "PASSED"'
        }
      ];
    } else {
      // student (calon mahasiswa)
      return [
        {
          id: 'seq_std_1',
          num: '1',
          from: 'Calon Mahasiswa',
          to: 'React Client',
          fromX: 120,
          toX: 360,
          y: 150,
          msg: '1: submitFormPendaftaran(prodiId)',
          details: 'Calon mahasiswa memilih prodi dan mengisi form registrasi kuliah.',
          phase: 'registration',
          codeFile: 'src/pages/Dashboard.tsx',
          dbImpact: 'None'
        },
        {
          id: 'seq_std_2',
          num: '2',
          from: 'React Client',
          to: 'Express Server',
          fromX: 360,
          toX: 600,
          y: 190,
          msg: '2: POST /api/applications',
          details: 'Client mengirim payload form pendaftaran ke server.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_std_3',
          num: '3',
          from: 'Express Server',
          to: 'Database (MySQL)',
          fromX: 600,
          toX: 840,
          y: 230,
          msg: '3: INSERT INTO applications (status: "SUBMITTED")',
          details: 'Server membuat row pendaftaran baru.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'INSERT INTO applications (user_id, status) VALUES (?, "SUBMITTED")'
        },
        {
          id: 'seq_std_4',
          num: '4',
          from: 'Calon Mahasiswa',
          to: 'React Client',
          fromX: 120,
          toX: 360,
          y: 280,
          msg: '4: uploadDokumen(pdf_ijazah, pdf_kk)',
          details: 'Pelamar mengunggah file syarat dokumen berkas.',
          phase: 'registration',
          codeFile: 'src/pages/Dashboard.tsx',
          dbImpact: 'None'
        },
        {
          id: 'seq_std_5',
          num: '5',
          from: 'React Client',
          to: 'Express Server',
          fromX: 360,
          toX: 600,
          y: 320,
          msg: '5: POST /api/documents/upload',
          details: 'Sistem mengupload data ke server.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_std_6',
          num: '6',
          from: 'Express Server',
          to: 'Database (MySQL)',
          fromX: 600,
          toX: 840,
          y: 360,
          msg: '6: INSERT INTO documents',
          details: 'Server merekam metadata berkas.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'INSERT INTO documents (file_path, type)'
        },
        {
          id: 'seq_std_7',
          num: '7',
          from: 'Calon Mahasiswa',
          to: 'React Client',
          fromX: 120,
          toX: 360,
          y: 410,
          msg: '7: bayarPendaftaran(va_number)',
          details: 'Pendaftar membayar biaya seleksi PMB.',
          phase: 'registration',
          codeFile: 'src/pages/Dashboard.tsx',
          dbImpact: 'None'
        },
        {
          id: 'seq_std_8',
          num: '8',
          from: 'React Client',
          to: 'Express Server',
          fromX: 360,
          toX: 600,
          y: 450,
          msg: '8: POST /api/payments/verify',
          details: 'Sistem memverifikasi pelunasan uang pendaftaran.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_std_9',
          num: '9',
          from: 'Express Server',
          to: 'Database (MySQL)',
          fromX: 600,
          toX: 840,
          y: 490,
          msg: '9: UPDATE payments SET status = "PAID"',
          details: 'Status pembayaran diupdate di DB.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'UPDATE payments SET status = "PAID" WHERE user_id = ?'
        },
        {
          id: 'seq_std_10',
          num: '10',
          from: 'Calon Mahasiswa',
          to: 'React Client',
          fromX: 120,
          toX: 360,
          y: 540,
          msg: '10: cetakKartuUjian()',
          details: 'Menghasilkan file PDF kartu tes offline untuk dicetak.',
          phase: 'registration',
          codeFile: 'src/pages/Dashboard.tsx',
          dbImpact: 'None'
        },
        {
          id: 'seq_std_11',
          num: '11',
          from: 'React Client',
          to: 'Express Server',
          fromX: 360,
          toX: 600,
          y: 580,
          msg: '11: GET /api/applications/exam-card',
          details: 'Meminta sistem membuat template kartu tes bertanda tangan.',
          phase: 'registration',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_std_12',
          num: '12',
          from: 'Calon Mahasiswa',
          to: 'React Client',
          fromX: 120,
          toX: 360,
          y: 630,
          msg: '12: selesaikan/ulangiPendaftaran()',
          details: 'Calon mahasiswa menekan konfirmasi pendaftaran akhir setelah semua ujian offline selesai dan lulus.',
          phase: 'reregistration',
          codeFile: 'src/pages/Dashboard.tsx',
          dbImpact: 'None'
        },
        {
          id: 'seq_std_13',
          num: '13',
          from: 'React Client',
          to: 'Express Server',
          fromX: 360,
          toX: 600,
          y: 670,
          msg: '13: POST /api/applications/complete',
          details: 'Server memproses pendaftaran akhir.',
          phase: 'reregistration',
          codeFile: 'server.ts',
          dbImpact: 'None'
        },
        {
          id: 'seq_std_14',
          num: '14',
          from: 'Express Server',
          to: 'Database (MySQL)',
          fromX: 600,
          toX: 840,
          y: 710,
          msg: '14: UPDATE applications SET selection_status = "COMPLETED"',
          details: 'Database menyimpan status pendaftaran final.',
          phase: 'reregistration',
          codeFile: 'server.ts',
          dbImpact: 'UPDATE applications SET selection_status = "COMPLETED" WHERE user_id = ?'
        }
      ];
    }
  };

  const sequenceSteps = (getSequenceSteps() || []).map((step: any) => ({
    ...step,
    desc: step.details || '',
    isSelfLoop: step.isSelfLoop || false,
    isDashed: step.isDashed !== undefined ? step.isDashed : (step.fromX > step.toX)
  }));
  const umlNodes = getUmlNodes();

  // Sequence Diagram Steps
  const _ignored_sequenceSteps = [
    // PHASE 1: REGISTRATION (Mendaftar)
    {
      id: 'seq1',
      num: '1',
      from: 'Calon Mahasiswa',
      to: 'React Client',
      fromX: 120,
      toX: 360,
      y: 160,
      msg: '1: getFormPendaftaran()',
      isDashed: false,
      phase: 'registration',
      desc: 'Pendaftar menavigasi ke halaman registrasi dan meminta form pendaftaran.',
      codeFile: '/src/pages/Register.tsx',
      dbImpact: 'None (Read Static Configuration)'
    },
    {
      id: 'seq2',
      num: '2',
      from: 'React Client',
      to: 'Express Server',
      fromX: 360,
      toX: 600,
      y: 180,
      msg: '2: getFormPendaftaran()',
      isDashed: false,
      phase: 'registration',
      desc: 'Interface meneruskan request form pendaftaran ke Mendaftar:Controller.',
      codeFile: '/server.ts (API Handler)',
      dbImpact: 'None'
    },
    {
      id: 'seq3',
      num: '3',
      from: 'Express Server',
      to: 'React Client',
      fromX: 600,
      toX: 360,
      y: 205,
      msg: '3: formPendaftaran()',
      isDashed: true,
      phase: 'registration',
      desc: 'Controller mengembalikan struktur field form pendaftaran yang aktif.',
      codeFile: '/src/types.ts',
      dbImpact: 'None'
    },
    {
      id: 'seq4',
      num: '4',
      from: 'React Client',
      to: 'Calon Mahasiswa',
      fromX: 360,
      toX: 120,
      y: 225,
      msg: '4: formPendaftaran()',
      isDashed: true,
      phase: 'registration',
      desc: 'Interface merender form secara interaktif untuk diisi oleh Pendaftar.',
      codeFile: '/src/pages/Register.tsx',
      dbImpact: 'None'
    },
    {
      id: 'seq5',
      num: '5',
      from: 'Calon Mahasiswa',
      to: 'React Client',
      fromX: 120,
      toX: 360,
      y: 255,
      msg: '5: registrasi(dataPendaftar)',
      isDashed: false,
      phase: 'registration',
      desc: 'Pendaftar menekan tombol submit setelah mengisi biodata dan berkas syarat.',
      codeFile: '/src/pages/Register.tsx',
      dbImpact: 'None (Client Validation)'
    },
    {
      id: 'seq6',
      num: '6',
      from: 'React Client',
      to: 'Express Server',
      fromX: 360,
      toX: 600,
      y: 275,
      msg: '6: registrasi(dataPendaftar)',
      isDashed: false,
      phase: 'registration',
      desc: 'Interface mengirim payload registrasi akun ke API Server.',
      codeFile: '/src/hooks/useAuth.ts',
      dbImpact: 'None'
    },
    {
      id: 'seq7',
      num: '7',
      from: 'Express Server',
      to: 'Express Server',
      fromX: 600,
      toX: 600,
      y: 295,
      msg: '7: validasi()',
      isDashed: false,
      isSelfLoop: true,
      phase: 'registration',
      desc: 'Mendaftar:Controller melakukan sanitasi input data dan validasi kelayakan email unik.',
      codeFile: '/server.ts (Validators)',
      dbImpact: 'Checks existing records in Table Pendaftar'
    },
    {
      id: 'seq8',
      num: '8',
      from: 'Express Server',
      to: 'Database (SQL)',
      fromX: 600,
      toX: 840,
      y: 335,
      msg: '8: inputData(dataPendaftar)',
      isDashed: false,
      phase: 'registration',
      desc: 'Controller menginstruksikan Database Engine untuk menyimpan data pendaftar baru.',
      codeFile: '/src/db/schema.ts',
      dbImpact: 'INSERT INTO users / applications (status: DRAFT)'
    },
    // ALT BLOCK (Valid vs Invalid)
    {
      id: 'seq10',
      num: '10',
      from: 'Database (SQL)',
      to: 'Express Server',
      fromX: 840,
      toX: 600,
      y: 395,
      msg: '10: registrasi berhasil',
      isDashed: true,
      phase: 'registration',
      desc: 'Database mengembalikan status sukses atas penyimpanan record data.',
      codeFile: '/server.ts',
      dbImpact: 'Transaction Committed'
    },
    {
      id: 'seq11_ok',
      num: '11',
      from: 'Express Server',
      to: 'React Client',
      fromX: 600,
      toX: 360,
      y: 415,
      msg: '11: registrasi berhasil',
      isDashed: true,
      phase: 'registration',
      desc: 'Controller merespons dengan HTTP 201 Created beserta token otentikasi.',
      codeFile: '/server.ts',
      dbImpact: 'None'
    },
    {
      id: 'seq12_ok',
      num: '12',
      from: 'React Client',
      to: 'Calon Mahasiswa',
      fromX: 360,
      toX: 120,
      y: 435,
      msg: '12: registrasi berhasil',
      isDashed: true,
      phase: 'registration',
      desc: 'Interface menampilkan pesan sukses dan mengarahkan pengguna ke Dashboard.',
      codeFile: '/src/pages/Dashboard.tsx',
      dbImpact: 'None'
    },
    {
      id: 'seq11_fail',
      num: '11',
      from: 'Express Server',
      to: 'React Client',
      fromX: 600,
      toX: 360,
      y: 480,
      msg: '11: registrasi gagal',
      isDashed: true,
      phase: 'registration',
      desc: 'Jika data tidak valid, Controller merespons dengan HTTP 400 Bad Request.',
      codeFile: '/server.ts',
      dbImpact: 'Transaction Rolled Back'
    },
    {
      id: 'seq12_fail',
      num: '12',
      from: 'React Client',
      to: 'Calon Mahasiswa',
      fromX: 360,
      toX: 120,
      y: 500,
      msg: '12: registrasi gagal',
      isDashed: true,
      phase: 'registration',
      desc: 'Interface merilis tanda bahaya merah/toast error kepada pendaftar.',
      codeFile: '/src/pages/Register.tsx',
      dbImpact: 'None'
    },

    // PHASE 2: SELECTION & TESTING
    {
      id: 'seq13',
      num: '13',
      from: 'Calon Mahasiswa',
      to: 'React Client',
      fromX: 120,
      toX: 360,
      y: 565,
      msg: '13: submitBerkas()',
      isDashed: false,
      phase: 'selection',
      desc: 'Siswa mengunggah dokumen KTP/Ijazah dan melunasi pembayaran pendaftaran.',
      codeFile: '/src/pages/Documents.tsx',
      dbImpact: 'INSERT INTO documents'
    },
    {
      id: 'seq14',
      num: '14',
      from: 'React Client',
      to: 'Express Server',
      fromX: 360,
      toX: 600,
      y: 585,
      msg: '14: verifyDokumen()',
      isDashed: false,
      phase: 'selection',
      desc: 'Sistem meneruskan status pembayaran dan kelayakan berkas ke Admin Controller.',
      codeFile: '/server.ts',
      dbImpact: 'SELECT FROM documents'
    },
    {
      id: 'seq15',
      num: '15',
      from: 'Express Server',
      to: 'Database (SQL)',
      fromX: 600,
      toX: 840,
      y: 605,
      msg: '15: updateStatus(test_ready)',
      isDashed: false,
      phase: 'selection',
      desc: 'Panitia menyetujui berkas, mengubah status aplikasi ke TEST_READY.',
      codeFile: '/server.ts',
      dbImpact: 'UPDATE applications SET status = "test_ready"'
    },
    {
      id: 'seq16',
      num: '16',
      from: 'Database (SQL)',
      to: 'Calon Mahasiswa',
      fromX: 840,
      toX: 120,
      y: 635,
      msg: '16: rilisKartuUjian()',
      isDashed: true,
      phase: 'selection',
      desc: 'Sistem otomatis merilis Kartu Peserta Ujian dan kode seleksi siswa di UI.',
      codeFile: '/src/pages/Dashboard.tsx',
      dbImpact: 'None'
    },
    {
      id: 'seq17',
      num: '17',
      from: 'Calon Mahasiswa',
      to: 'React Client',
      fromX: 120,
      toX: 360,
      y: 675,
      msg: '17: ikutiUjianOnline()',
      isDashed: false,
      phase: 'selection',
      desc: 'Pendaftar menekan tombol "Mulai Ujian" di portal pada jadwal yang ditentukan.',
      codeFile: '/src/pages/CBTExam.tsx',
      dbImpact: 'None'
    },
    {
      id: 'seq18',
      num: '18',
      from: 'React Client',
      to: 'Express Server',
      fromX: 360,
      toX: 600,
      y: 695,
      msg: '18: submitJawaban()',
      isDashed: false,
      phase: 'selection',
      desc: 'Interface mengirimkan seluruh lembar jawaban ujian online ke server setelah durasi habis.',
      codeFile: '/src/pages/CBTExam.tsx',
      dbImpact: 'None'
    },
    {
      id: 'seq19',
      num: '19',
      from: 'Express Server',
      to: 'Database (SQL)',
      fromX: 600,
      toX: 840,
      y: 715,
      msg: '19: simpanNilai()',
      isDashed: false,
      phase: 'selection',
      desc: 'Controller mengkalkulasi skor ujian dan menyimpannya secara otomatis ke database.',
      codeFile: '/server.ts',
      dbImpact: 'UPDATE applications SET score = X, status = "grading"'
    },
    // ALT BLOCK (Accepted vs Rejected)
    {
      id: 'seq20',
      num: '20',
      from: 'Express Server',
      to: 'Database (SQL)',
      fromX: 600,
      toX: 840,
      y: 785,
      msg: '20: setStatus(accepted)',
      isDashed: false,
      phase: 'selection',
      desc: 'Jika skor di atas passing grade, Panitia meloloskan siswa tersebut.',
      codeFile: '/server.ts (Admin Route)',
      dbImpact: 'UPDATE applications SET status = "accepted"'
    },
    {
      id: 'seq21',
      num: '21',
      from: 'Express Server',
      to: 'Calon Mahasiswa',
      fromX: 600,
      toX: 120,
      y: 815,
      msg: '21: kirimNotifikasiLulus()',
      isDashed: true,
      phase: 'selection',
      desc: 'Controller mengirimkan notifikasi lulus di sertai nominal kewajiban UKT.',
      codeFile: '/src/pages/Dashboard.tsx',
      dbImpact: 'None'
    },
    {
      id: 'seq22',
      num: '22',
      from: 'Express Server',
      to: 'Database (SQL)',
      fromX: 600,
      toX: 840,
      y: 855,
      msg: '22: setStatus(rejected)',
      isDashed: false,
      phase: 'selection',
      desc: 'Jika skor di bawah batas minimal kelulusan, status pendaftar diset GAGAL.',
      codeFile: '/server.ts (Admin Route)',
      dbImpact: 'UPDATE applications SET status = "rejected"'
    },
    {
      id: 'seq23',
      num: '23',
      from: 'Express Server',
      to: 'Calon Mahasiswa',
      fromX: 600,
      toX: 120,
      y: 885,
      msg: '23: kirimNotifikasiGagal()',
      isDashed: true,
      phase: 'selection',
      desc: 'Interface merefleksikan pengumuman kelulusan berwarna merah dengan ucapan penyemangat.',
      codeFile: '/src/pages/Dashboard.tsx',
      dbImpact: 'None'
    },

    // PHASE 3: RE-REGISTRATION (Daftar Ulang)
    {
      id: 'seq24',
      num: '24',
      from: 'Calon Mahasiswa',
      to: 'React Client',
      fromX: 120,
      toX: 360,
      y: 945,
      msg: '24: requestDaftarUlang()',
      isDashed: false,
      phase: 'reregistration',
      desc: 'Siswa yang dinyatakan lulus menekan tombol "Daftar Ulang" di dashboard.',
      codeFile: '/src/pages/Dashboard.tsx',
      dbImpact: 'None'
    },
    {
      id: 'seq25',
      num: '25',
      from: 'Calon Mahasiswa',
      to: 'React Client',
      fromX: 120,
      toX: 360,
      y: 970,
      msg: '25: bayarUKT(nomorPendaftar)',
      isDashed: false,
      phase: 'reregistration',
      desc: 'Siswa menyetujui rincian biaya UKT dan melakukan transfer biaya registrasi ulang.',
      codeFile: '/src/pages/Payment.tsx',
      dbImpact: 'None'
    },
    {
      id: 'seq26',
      num: '26',
      from: 'React Client',
      to: 'Express Server',
      fromX: 360,
      toX: 600,
      y: 995,
      msg: '26: prosesPembayaranUKT()',
      isDashed: false,
      phase: 'reregistration',
      desc: 'Interface mengirimkan detail transaksi UKT dan melampirkan berkas bukti bayar.',
      codeFile: '/server.ts',
      dbImpact: 'INSERT INTO payments (category: "tuition")'
    },
    {
      id: 'seq27',
      num: '27',
      from: 'Express Server',
      to: 'Database (SQL)',
      fromX: 600,
      toX: 840,
      y: 1020,
      msg: '27: verifikasiUKT()',
      isDashed: false,
      phase: 'reregistration',
      desc: 'Sistem/Bank Link secara otomatis mencocokkan mutasi pembayaran UKT.',
      codeFile: '/server.ts',
      dbImpact: 'UPDATE payments SET status = "verified"'
    },
    // ALT BLOCK (UKT Valid vs Invalid)
    {
      id: 'seq28',
      num: '28',
      from: 'Express Server',
      to: 'Database (SQL)',
      fromX: 600,
      toX: 840,
      y: 1085,
      msg: '28: generateNIM()',
      isDashed: false,
      phase: 'reregistration',
      desc: 'Setelah pembayaran UKT sukses diverifikasi, Controller memicu pembuatan NIM unik.',
      codeFile: '/server.ts',
      dbImpact: 'UPDATE applications SET reRegistrationPaid = true'
    },
    {
      id: 'seq29',
      num: '29',
      from: 'Database (SQL)',
      to: 'Express Server',
      fromX: 840,
      toX: 600,
      y: 1110,
      msg: '29: rilisNIM&Akun()',
      isDashed: true,
      phase: 'reregistration',
      desc: 'Database merespons dengan Nomor Induk Mahasiswa (NIM) resmi dan status MAHASISWA_AKTIF.',
      codeFile: '/server.ts',
      dbImpact: 'UPDATE users SET role = "student", nim = "X"'
    },
    {
      id: 'seq30',
      num: '30',
      from: 'Express Server',
      to: 'Calon Mahasiswa',
      fromX: 600,
      toX: 120,
      y: 1135,
      msg: '30: pendaftaranUlangBerhasil(NIM)',
      isDashed: true,
      phase: 'reregistration',
      desc: 'Interface menampilkan Nomor Induk Mahasiswa (NIM) serta detail akun akses Portal Akademik Kampus.',
      codeFile: '/src/pages/Dashboard.tsx',
      dbImpact: 'None'
    },
    {
      id: 'seq31',
      num: '31',
      from: 'Express Server',
      to: 'Calon Mahasiswa',
      fromX: 600,
      toX: 120,
      y: 1185,
      msg: '31: pendaftaranUlangTertunda()',
      isDashed: true,
      phase: 'reregistration',
      desc: 'Jika nominal transfer UKT salah/kurang, sistem menangguhkan penerbitan NIM.',
      codeFile: '/src/pages/Dashboard.tsx',
      dbImpact: 'None'
    }
  ];

  // Detailed specifications for each Activity Diagram node
  const _ignored_umlNodes = [
    { 
      id: 'init', 
      type: 'initial', 
      x: 160, 
      y: 40, 
      title: 'Initial Node', 
      desc: 'Titik awal pendaftaran calon mahasiswa baru.',
      component: 'src/pages/Register.tsx',
      impact: 'Tidak ada mutasi basis data. Sinyal pendaftaran pertama dipicu.'
    },
    { 
      id: 'act1', 
      type: 'action', 
      x: 160, 
      y: 90, 
      width: 210, 
      height: 50, 
      title: 'Registrasi & Login Akun', 
      role: 'Mahasiswa',
      desc: 'Calon mahasiswa mendaftarkan alamat email dan kata sandi yang valid, lalu login untuk mendapatkan JWT token.',
      component: 'src/pages/Register.tsx & src/pages/Login.tsx',
      impact: 'INSERT INTO users (role: "student", status: "DRAFT")'
    },
    { 
      id: 'act2', 
      type: 'action', 
      x: 160, 
      y: 190, 
      width: 210, 
      height: 50, 
      title: 'Isi Formulir & Pilih Prodi', 
      role: 'Mahasiswa',
      desc: 'Siswa mengisi biodata diri lengkap, data asal sekolah, data orang tua, serta memilih 2 program studi prioritas.',
      component: 'src/pages/Dashboard.tsx & src/components/BiodataForm.tsx',
      impact: 'UPDATE applications SET full_name, high_school, prodi_1, prodi_2, status = "DRAFT"'
    },
    { 
      id: 'act3', 
      type: 'action', 
      x: 160, 
      y: 290, 
      width: 210, 
      height: 50, 
      title: 'Unggah Berkas & Bayar', 
      role: 'Mahasiswa',
      desc: 'Mengunggah pindaian Ijazah, KTP, Kartu Keluarga, dan Pas Foto, kemudian mentransfer biaya pendaftaran.',
      component: 'src/components/DocumentUpload.tsx & src/components/PaymentPendaftaran.tsx',
      impact: 'INSERT INTO documents & INSERT INTO payments (type: "pendaftaran", status: "PENDING")'
    },
    { 
      id: 'act4', 
      type: 'action', 
      x: 480, 
      y: 370, 
      width: 210, 
      height: 50, 
      title: 'Verifikasi Transaksi (Sistem)', 
      role: 'Sistem',
      desc: 'Sistem secara otomatis mendeteksi webhook pembayaran dari payment gateway untuk mencocokkan nominal VA.',
      component: 'server.ts (API /api/payment/callback)',
      impact: 'UPDATE payments SET status = "SUCCESS" & UPDATE applications SET status = "VERIFYING"'
    },
    { 
      id: 'dec1', 
      type: 'decision', 
      x: 480, 
      y: 470, 
      title: 'Pembayaran Valid?',
      desc: 'Gerbang logika untuk memvalidasi apakah dana pendaftaran telah diterima penuh atau gagal/expired.',
      component: 'server.ts (Payment Engine)',
      impact: 'Mengarahkan token kontrol ke langkah berikutnya jika SUCCESS, atau mereset status pembayaran jika EXPIRED.'
    },
    { 
      id: 'act5', 
      type: 'action', 
      x: 800, 
      y: 560, 
      width: 210, 
      height: 50, 
      title: 'Verifikasi Berkas Syarat', 
      role: 'Panitia',
      desc: 'Panitia verifikator memeriksa kesesuaian berkas fisik (Ijazah, KTP) yang diunggah dengan isian biodata.',
      component: 'src/pages/AdminDashboard.tsx',
      impact: 'UPDATE applications SET status = "TEST_READY" atau status = "DRAFT" (untuk revisi berkas)'
    },
    { 
      id: 'dec2', 
      type: 'decision', 
      x: 800, 
      y: 660, 
      title: 'Berkas Lengkap?',
      desc: 'Gerbang penentu kelengkapan berkas pendaftaran. Jika tidak lengkap, dikembalikan ke tahap DRAFT untuk diunggah ulang.',
      component: 'src/pages/AdminDashboard.tsx (Validation Guard)',
      impact: 'Mengarahkan status pendaftaran kembali ke DRAFT atau meloloskan ke tahap ujian tertulis.'
    },
    { 
      id: 'fork1', 
      type: 'fork', 
      x: 480, 
      y: 760, 
      width: 400, 
      height: 10, 
      title: 'Fork Node',
      desc: 'Memisahkan jalur sinkron pendaftaran menjadi 3 proses konkuren yang berjalan paralel selama ujian berlangsung.',
      component: 'src/components/OnlineExam.tsx (Parallel Lifecycle)',
      impact: 'Menyebarkan token eksekusi paralel untuk Mahasiswa, Sistem, dan Panitia Pengawas.'
    },
    { 
      id: 'pact1', 
      type: 'action', 
      x: 160, 
      y: 820, 
      width: 160, 
      height: 50, 
      title: 'Ikuti Ujian Online', 
      role: 'Mahasiswa',
      desc: 'Mahasiswa menjawab soal-soal seleksi akademik secara real-time di sistem sebelum waktu habis.',
      component: 'src/pages/ExamSession.tsx',
      impact: 'INSERT INTO exam_answers (student_id, question_id, answer)'
    },
    { 
      id: 'pact2', 
      type: 'action', 
      x: 480, 
      y: 820, 
      width: 160, 
      height: 50, 
      title: 'Batasan Ujian & Timer', 
      role: 'Sistem',
      desc: 'Sistem mengunci sesi ujian jika durasi waktu habis atau mendeteksi kecurangan tab-switching pendaftar.',
      component: 'server.ts (Exam Session Scheduler)',
      impact: 'UPDATE exam_sessions SET is_active = false, auto_submitted = true'
    },
    { 
      id: 'pact3', 
      type: 'action', 
      x: 800, 
      y: 820, 
      width: 160, 
      height: 50, 
      title: 'Pengawasan Ujian', 
      role: 'Panitia',
      desc: 'Panitia memantau log aktivitas dan integritas pendaftar selama pengerjaan tes berlangsung secara remote.',
      component: 'src/pages/AdminDashboard.tsx (Exam Monitoring)',
      impact: 'INSERT INTO system_logs (action: "MONITOR_EXAM", target_user)'
    },
    { 
      id: 'join1', 
      type: 'join', 
      x: 480, 
      y: 920, 
      width: 400, 
      height: 10, 
      title: 'Join Node',
      desc: 'Sinkronisasi aliran paralel. Menunggu ketiga proses ujian (Pengerjaan, Timer, Pengawasan) selesai sebelum melangkah.',
      component: 'server.ts (Exam Sync Guard)',
      impact: 'Menggabungkan token eksekusi paralel menjadi satu aliran kendali terpadu.'
    },
    { 
      id: 'act6', 
      type: 'action', 
      x: 800, 
      y: 980, 
      width: 210, 
      height: 50, 
      title: 'Input Nilai Kelulusan', 
      role: 'Panitia',
      desc: 'Panitia akademik memverifikasi nilai otomatis CAT (Computer Assisted Test) dan menginput bobot nilai tambahan.',
      component: 'src/pages/AdminDashboard.tsx',
      impact: 'UPDATE exam_results SET score, verified_by_admin = true'
    },
    { 
      id: 'act7', 
      type: 'action', 
      x: 480, 
      y: 1070, 
      width: 210, 
      height: 50, 
      title: 'Proses Kelulusan Otomatis', 
      role: 'Sistem',
      desc: 'Sistem melakukan perangkingan akumulasi skor berdasarkan passing grade kuota daya tampung masing-masing prodi.',
      component: 'server.ts (Ranking Algorithm)',
      impact: 'UPDATE applications SET status = "ACCEPTED" atau "REJECTED", selection_code = "LULUS_2026_XX"'
    },
    { 
      id: 'dec3', 
      type: 'decision', 
      x: 480, 
      y: 1170, 
      title: 'Apakah Lulus?',
      desc: 'Gerbang keputusan final kelulusan seleksi berdasarkan kriteria nilai minimum (passing grade).',
      component: 'server.ts (Grading Evaluator)',
      impact: 'Mengarahkan aliran pendaftar yang LULUS ke daftar ulang, dan yang GAGAL ke notifikasi penolakan.'
    },
    { 
      id: 'act8', 
      type: 'action', 
      x: 800, 
      y: 1260, 
      width: 180, 
      height: 50, 
      title: 'Kirim Notif Penolakan', 
      role: 'Panitia',
      desc: 'Sistem merilis surat penolakan resmi di dashboard pendaftar serta panduan pendaftaran jalur mandiri gelombang berikutnya.',
      component: 'src/pages/Dashboard.tsx',
      impact: 'INSERT INTO notifications (user_id, content: "MAAF_TIDAK_LULUS")'
    },
    { 
      id: 'act9', 
      type: 'action', 
      x: 160, 
      y: 1260, 
      width: 180, 
      height: 50, 
      title: 'Daftar Ulang & Bayar UKT', 
      role: 'Mahasiswa',
      desc: 'Mahasiswa baru terpilih mengonfirmasi kesediaan kuliah dan melakukan pembayaran UKT semester pertama.',
      component: 'src/pages/Dashboard.tsx (Tombol Bayar Kuliah)',
      impact: 'INSERT INTO payments (type: "ukt", status: "SUCCESS") & UPDATE applications SET status = "RE_REGISTERED"'
    },
    { 
      id: 'act10', 
      type: 'action', 
      x: 480, 
      y: 1350, 
      width: 210, 
      height: 50, 
      title: 'Rilis NIM & Akun', 
      role: 'Sistem',
      desc: 'Sistem secara otomatis mengonversi data pendaftaran yang telah lunas UKT menjadi data mahasiswa aktif dan merilis NIM.',
      component: 'server.ts (NIM Generator Service)',
      impact: 'UPDATE users SET nim = "202601002" & INSERT INTO academic_portals'
    },
    { 
      id: 'final', 
      type: 'final', 
      x: 480, 
      y: 1440, 
      title: 'Activity Final Node',
      desc: 'Seluruh tahapan pendaftaran selesai. Calon mahasiswa resmi terdaftar sebagai mahasiswa aktif UNUTN.',
      component: 'None (System Endpoint)',
      impact: 'Siklus hidup pendaftar berakhir. Token pendaftaran dihancurkan.'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full px-4 mb-20 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
              Sistem Blueprint & Arsitektur
            </h2>
            <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30">
              UML & Use Cases
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-3 text-sm md:text-base">
            Representasi lengkap arsitektur sistem SIPMB (Sistem Informasi Penerimaan Mahasiswa Baru) UNUTN.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative mb-8 -mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-max border border-slate-200 dark:border-slate-800">
          {[
            { id: 'usecase', label: 'Use Case Matrix', icon: <User size={14} /> },
            { id: 'activity', label: 'Activity Diagram', icon: <Workflow size={14} /> },
            { id: 'sequence', label: 'Sequence Diagram', icon: <Network size={14} /> },
            { id: 'class', label: 'Class Diagram (UML)', icon: <Database size={14} /> },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedElement(null);
              }}
              className={cn(
                "px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all relative z-10 whitespace-nowrap",
                activeTab === tab.id 
                  ? "text-blue-600 dark:text-blue-400 font-black" 
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-400"
              )}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabDiagrams"
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="scale-110">{tab.icon}</div> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Diagram Selector (Conditional for Activity and Sequence tabs) */}
      {(activeTab === 'activity' || activeTab === 'sequence') && (
        <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-blue-500" />
                Pilih Aliran Diagram (Sub-Diagram)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                SIPMB membagi proses sistem menjadi 3 bagian utama sesuai permintaan kebutuhan fungsional.
              </p>
            </div>
            <div className="text-[10px] bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-blue-200 dark:border-blue-900/40">
              Mode Aktif: {selectedSubDiagram === 'auth' ? 'Autentikasi' : selectedSubDiagram === 'admin' ? 'Kelola Admin' : 'Pendaftaran Mhs'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'auth',
                title: '1. Autentikasi & Akun',
                actor: 'Calon Mahasiswa & Super Admin',
                desc: 'Alur pembuatan akun baru (Register) dan Login sistem untuk memulai sesi pendaftaran.',
                color: 'border-blue-500/20 bg-blue-50/10 dark:bg-blue-950/10'
              },
              {
                id: 'admin',
                title: '2. Kelola & Verifikasi Admin',
                actor: 'Admin Panitia PMB',
                desc: 'Alur kelola pengumuman prodi, kelola biaya kuliah, verifikasi berkas, & verifikasi nilai ujian offline.',
                color: 'border-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-950/10'
              },
              {
                id: 'student',
                title: '3. Pendaftaran Calon Mahasiswa',
                actor: 'Calon Mahasiswa',
                desc: 'Upload dokumen, pendaftaran prodi, bayar pendaftaran, cetak kartu tes offline, & selesai/ulangi.',
                color: 'border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10'
              }
            ].map((sub) => {
              const isSelected = selectedSubDiagram === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubDiagram(sub.id as any)}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all relative overflow-hidden group/sub",
                    isSelected 
                      ? "border-blue-600 dark:border-blue-500 bg-white dark:bg-slate-800 shadow-md ring-4 ring-blue-500/5" 
                      : "border-slate-200 dark:border-slate-800 bg-[#fbfcfd] dark:bg-[#1a1f2c]/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 dark:bg-blue-500" />
                  )}
                  <div className={cn(
                    "font-black text-xs uppercase tracking-tight transition-colors flex items-center justify-between",
                    isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white group-hover/sub:text-blue-600 dark:group-hover/sub:text-blue-400"
                  )}>
                    <span>{sub.title}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                  </div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mt-1">
                    Aktor: {sub.actor}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 font-medium leading-relaxed">
                    {sub.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Panel */}
      <div className="bg-white dark:bg-[#151921] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-10 transition-all duration-300">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: USE CASE MATRIX */}
          {activeTab === 'usecase' && (
            <motion.div
              key="usecase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-950/40">
                <Info size={24} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Use Case Matrix Overview</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                    Menjelaskan pembagian wewenang dan aktor (Aktor Calon Mahasiswa, Panitia Akademik, Panitia Keuangan, dan Superadmin) dalam platform SIPMB. Klik aktor untuk melihat detail.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Calon Mahasiswa Card */}
                <div 
                  onClick={() => setSelectedElement('applicant')}
                  className={cn(
                    "p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-full group",
                    selectedElement === 'applicant' 
                      ? "border-blue-500 bg-blue-50/20 dark:bg-blue-900/10 shadow-lg" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-[#1a1f2c]/10"
                  )}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <User size={24} />
                    </div>
                    <h3 className="text-base font-black uppercase text-slate-900 dark:text-white tracking-tight">Calon Mahasiswa</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Applicant Role</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium leading-relaxed">
                      Aktor utama yang mendaftar secara online, mengisi profil akademis, mengunggah dokumen prasyarat, serta melakukan transaksi keuangan pembayaran kuliah.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                    <span>9 Use Cases</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Panitia Akademik Card */}
                <div 
                  onClick={() => setSelectedElement('committee_academic')}
                  className={cn(
                    "p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-full group",
                    selectedElement === 'committee_academic' 
                      ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-900/10 shadow-lg" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-[#1a1f2c]/10"
                  )}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Workflow size={24} />
                    </div>
                    <h3 className="text-base font-black uppercase text-slate-900 dark:text-white tracking-tight">Panitia Akademik</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Academic Committee</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium leading-relaxed">
                      Bertanggung jawab memverifikasi berkas akademis, menyelenggarakan seleksi tertulis, menginput nilai seleksi, dan merilis pengumuman hasil kelulusan.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">
                    <span>6 Use Cases</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Panitia Keuangan Card */}
                <div 
                  onClick={() => setSelectedElement('committee_finance')}
                  className={cn(
                    "p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-full group",
                    selectedElement === 'committee_finance' 
                      ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-900/10 shadow-lg" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-[#1a1f2c]/10"
                  )}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Layers size={24} />
                    </div>
                    <h3 className="text-base font-black uppercase text-slate-900 dark:text-white tracking-tight">Panitia Keuangan</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Finance Committee</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium leading-relaxed">
                      Memantau alur masuk dana (Biaya Pendaftaran & Biaya Kuliah/UKT), memverifikasi pembayaran manual/split, serta menetapkan konfigurasi biaya.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
                    <span>4 Use Cases</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Superadmin Card */}
                <div 
                  onClick={() => setSelectedElement('superadmin')}
                  className={cn(
                    "p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-full group",
                    selectedElement === 'superadmin' 
                      ? "border-purple-500 bg-purple-50/20 dark:bg-purple-900/10 shadow-lg" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-[#1a1f2c]/10"
                  )}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Lock size={24} />
                    </div>
                    <h3 className="text-base font-black uppercase text-slate-900 dark:text-white tracking-tight">Superadmin</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Main System Admin</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium leading-relaxed">
                      Memegang kendali penuh seluruh sistem. Mengawasi berkas log keamanan (audit trail), konfigurasi program studi, manajemen pengumuman sistem, serta hak akses operator.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs font-black uppercase text-purple-600 dark:text-purple-400">
                    <span>All System Use Cases</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Use Case Details Drawer / Panel */}
              <AnimatePresence mode="wait">
                {selectedElement && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-8 bg-slate-50 dark:bg-[#1a1f29]/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <Code size={16} className="text-blue-600 dark:text-blue-400" />
                        Daftar Use Case: {selectedElement === 'applicant' ? 'Calon Mahasiswa' : selectedElement === 'committee_academic' ? 'Panitia Akademik' : selectedElement === 'committee_finance' ? 'Panitia Keuangan' : 'Superadmin'}
                      </h4>
                      <button 
                        onClick={() => setSelectedElement(null)}
                        className="text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-3 py-1.5 rounded-xl uppercase tracking-widest transition-all"
                      >
                        Tutup Detail
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedElement === 'applicant' && [
                        { uc: 'UC-01: Registrasi Akun', d: 'Mendaftarkan akun baru pendaftar PMB dengan validasi email.' },
                        { uc: 'UC-02: Otentikasi Akun', d: 'Melakukan login dan mengamankan session akun mahasiswa.' },
                        { uc: 'UC-03: Kelola Formulir Biodata', d: 'Mengisi data diri, alamat, sekolah asal, program studi & fakultas.' },
                        { uc: 'UC-04: Unggah Dokumen Syarat', d: 'Mengunggah file KTP, Ijazah/SKL, Kartu Keluarga, & Pas Foto.' },
                        { uc: 'UC-05: Melakukan Pembayaran', d: 'Melakukan pembayaran pendaftaran & daftar ulang kuliah via VA/QRIS.' },
                        { uc: 'UC-06: Memantau Alur/Status', d: 'Melihat perkembangan tahapan verifikasi dokumen, tes, dan kelulusan.' },
                        { uc: 'UC-07: Mengunduh Kartu Ujian', d: 'Mengunduh tanda bukti kartu seleksi jika status berkas terverifikasi.' },
                        { uc: 'UC-08: Melihat Pengumuman PMB', d: 'Melihat status kelulusan seleksi dan rincian nominal biaya UKT.' },
                        { uc: 'UC-09: Mengunduh Invoice', d: 'Mengunduh kuitansi resmi/bukti bayar yang sah dari universitas.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                          <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">{item.uc}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">{item.d}</p>
                        </div>
                      ))}

                      {selectedElement === 'committee_academic' && [
                        { uc: 'UC-10: Memantau Daftar Pendaftar', d: 'Melihat seluruh daftar calon mahasiswa baru beserta status akademis.' },
                        { uc: 'UC-11: Verifikasi Berkas Akademik', d: 'Memverifikasi atau menolak kelengkapan berkas dokumen pendaftaran mahasiswa.' },
                        { uc: 'UC-12: Mengelola Kode Seleksi', d: 'Menyiapkan, merilis, dan mendistribusikan link/kartu ujian seleksi.' },
                        { uc: 'UC-13: Menginput Nilai Ujian', d: 'Mencatat nilai hasil ujian tulis calon mahasiswa ke dalam sistem.' },
                        { uc: 'UC-14: Memutus Kelulusan', d: 'Mengubah status pendaftaran menjadi Lulus (Accepted) atau Tidak Lulus (Rejected).' },
                        { uc: 'UC-15: Mengunduh Laporan Akademik', d: 'Mengunduh file laporan pendaftar berformat CSV/Excel untuk rapat rektorat.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{item.uc}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">{item.d}</p>
                        </div>
                      ))}

                      {selectedElement === 'committee_finance' && [
                        { uc: 'UC-16: Monitoring Keuangan', d: 'Melihat rekapan transaksi pembayaran pendaftaran & biaya kuliah (UKT).' },
                        { uc: 'UC-17: Verifikasi Manual Split', d: 'Memproses validasi pembayaran jika terjadi kendala pada auto-sinkron bank.' },
                        { uc: 'UC-18: Mengelola Skema Tarif Biaya', d: 'Menyesuaikan konfigurasi tarif biaya masuk & biaya kuliah per fakultas/prodi.' },
                        { uc: 'UC-19: Eksport Rekap Keuangan', d: 'Mengekspor laporan penerimaan dana untuk diintegrasikan dengan divisi keuangan kampus.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                          <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{item.uc}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">{item.d}</p>
                        </div>
                      ))}

                      {selectedElement === 'superadmin' && [
                        { uc: 'UC-20: Security Audit Log Access', d: 'Melihat seluruh rekapan log aktivitas administrator dan panitia secara detail (IP, Operator, Aksi).' },
                        { uc: 'UC-21: Broadcast Manajemen', d: 'Mengisi, mengedit, dan mempublikasikan pengumuman darurat, info pendaftaran atau info kuliah di portal depan.' },
                        { uc: 'UC-22: Pengendalian Operator PMB', d: 'Mengatur hak akses panitia pendaftaran, baik level akademik maupun keuangan.' },
                        { uc: 'UC-23: Sinkronisasi Database Pusat', d: 'Melakukan backup, sinkronisasi data dari schema lokal SQLite ke server MySQL Produksi.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                          <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">{item.uc}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">{item.d}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* TAB 2: ACTIVITY DIAGRAM (INTERACTIVE UML WITH DETAILED NODE SPECIFICATIONS) */}
          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 animate-fade-in"
            >
              {/* Informative Header */}
              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <Workflow size={24} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">UML Activity Diagram Interaktif</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                    Visualisasi alur pendaftaran SIPMB end-to-end yang memisahkan tanggung jawab (Swimlanes) antara pelamar, sistem, dan panitia. Gunakan panduan notasi di sebelah kiri untuk menyorot elemen UML, dan klik simpul (node) apa saja untuk membedah spesifikasi teknis terperinci di bawahnya.
                  </p>
                </div>
              </div>

              {/* Multi-Column Workspace: Left Guide + Right UML Canvas */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* 1. UML NOTATION GUIDE & LEGEND PANEL (4 Columns) */}
                <div className="xl:col-span-4 space-y-6">
                  <div className="p-6 bg-slate-50 dark:bg-[#1a1f2c]/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest mb-4 flex items-center gap-2">
                      <HelpCircle size={14} className="text-blue-500" />
                      Legenda Notasi UML
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-4 leading-relaxed">
                      Arahkan kursor atau klik simbol notasi di bawah ini untuk melihat definisinya dan menyorot letaknya pada diagram di samping:
                    </p>

                    <div className="space-y-2.5">
                      {[
                        { 
                          id: 'partition', 
                          label: 'Partition (Swimlane)', 
                          symbol: '║', 
                          color: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300', 
                          desc: 'Membagi jalur aktivitas berdasarkan unit organisasi atau peran aktor pengambil keputusan.',
                          details: 'Di SIPMB, kami membaginya menjadi Calon Mahasiswa (Applicant), Portal Sistem (App Engine), dan Panitia PMB (Committee).'
                        },
                        { 
                          id: 'initial', 
                          label: 'Initial Node', 
                          symbol: '●', 
                          color: 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black', 
                          desc: 'Menandai titik mula dari jalannya diagram aktivitas bisnis.',
                          details: 'Berada di jalur Calon Mahasiswa ketika pertama kali membuka modul registrasi.'
                        },
                        { 
                          id: 'action', 
                          label: 'Action Node', 
                          symbol: '▭', 
                          color: 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900', 
                          desc: 'Langkah pemrosesan tunggal atau tindakan fisik/digital yang dieksekusi oleh aktor.',
                          details: 'Diwakili oleh kotak kuning membulat di dalam bagan pendaftaran.'
                        },
                        { 
                          id: 'control', 
                          label: 'Control Flow (Arrow)', 
                          symbol: '➔', 
                          color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400', 
                          desc: 'Menunjukkan urutan eksekusi langkah dari satu simpul ke simpul berikutnya.',
                          details: 'Aliran kontrol di SIPMB digambarkan oleh panah dengan arah yang konsisten.'
                        },
                        { 
                          id: 'decision', 
                          label: 'Decision Node (Diamond)', 
                          symbol: '◇', 
                          color: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900 font-bold', 
                          desc: 'Simbol percabangan kondisional yang memiliki satu input dan beberapa pilihan output berlabel.',
                          details: 'Digunakan untuk percabangan seperti validasi pembayaran, kelengkapan berkas, atau keputusan kelulusan seleksi.'
                        },
                        { 
                          id: 'fork', 
                          label: 'Fork Node', 
                          symbol: '▬ (Split)', 
                          color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 font-bold', 
                          desc: 'Memecah satu aliran kontrol tunggal menjadi beberapa aliran konkuren (paralel).',
                          details: 'Dipakai saat melepaskan status TEST_READY, memicu pengerjaan ujian siswa dan pengawasan panitia sekaligus.'
                        },
                        { 
                          id: 'join', 
                          label: 'Join Node', 
                          symbol: '▬ (Merge)', 
                          color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 font-bold', 
                          desc: 'Menggabungkan beberapa alur konkuren kembali menjadi satu alur sekuensial setelah semuanya selesai.',
                          details: 'Menjamin proses koreksi nilai ujian tidak berjalan sebelum seluruh pengerjaan tes dan log pengawas terkumpul.'
                        },
                        { 
                          id: 'final', 
                          label: 'Activity Final Node', 
                          symbol: '◎', 
                          color: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-black', 
                          desc: 'Menghentikan seluruh aliran proses di dalam diagram.',
                          details: 'Menandai berakhirnya siklus PMB ketika NIM dan Akun Portal Akademik telah sukses diserahkan kepada siswa.'
                        }
                      ].map((not) => (
                        <div 
                          key={not.id}
                          onMouseEnter={() => setSelectedNotation(not.id)}
                          onMouseLeave={() => setSelectedNotation(null)}
                          onClick={() => setSelectedNotation(selectedNotation === not.id ? null : not.id)}
                          className={cn(
                            "p-3 rounded-2xl border text-left cursor-pointer transition-all",
                            selectedNotation === not.id
                              ? "bg-blue-50/80 dark:bg-blue-950/30 border-blue-500 shadow-xs"
                              : "bg-white dark:bg-[#151921] border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-black", not.color)}>
                              {not.symbol}
                            </span>
                            <div>
                              <span className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wide">{not.label}</span>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 leading-tight">{not.desc}</p>
                            </div>
                          </div>
                          
                          {/* Expanded detail on select */}
                          {selectedNotation === not.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed"
                            >
                              {not.details}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Node Selector Mini Stats */}
                  <div className="p-6 bg-slate-50 dark:bg-[#1a1f2c]/30 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Metrik Elemen Diagram</h4>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="p-3 bg-white dark:bg-[#151921] rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <span className="text-slate-400 block uppercase text-[8px] font-bold">Total Swimlane</span>
                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">3 Jalur</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-[#151921] rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <span className="text-slate-400 block uppercase text-[8px] font-bold">Action Nodes</span>
                        <span className="text-lg font-black text-amber-500">12 Simpul</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-[#151921] rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <span className="text-slate-400 block uppercase text-[8px] font-bold">Decision Nodes</span>
                        <span className="text-lg font-black text-emerald-500">3 Simpul</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-[#151921] rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <span className="text-slate-400 block uppercase text-[8px] font-bold">Concurrency Bars</span>
                        <span className="text-lg font-black text-purple-500">2 Batang</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. UML ACTIVITY DIAGRAM SVG CANVAS (8 Columns) */}
                <div className="xl:col-span-8 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-slate-50/20 dark:bg-slate-950/10">
                  <div className="p-4 bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-black text-slate-800 dark:text-white uppercase tracking-widest">UML Canvas - SIPMB Flow</span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      Lebar: 960px | Tinggi: {selectedSubDiagram === 'auth' ? '750px' : selectedSubDiagram === 'admin' ? '580px' : '950px'} (Geser ke samping bila terpotong)
                    </span>
                  </div>

                  <div className="overflow-x-auto p-4 md:p-8 scrollbar-thin">
                    <div 
                      className="relative w-[960px] bg-white dark:bg-[#0c1017] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-md transition-all duration-300"
                      style={{ height: selectedSubDiagram === 'auth' ? '750px' : selectedSubDiagram === 'admin' ? '580px' : '950px' }}
                    >
                      
                      {/* Vertical Swimlane Lines (Partitions) */}
                      <div className="absolute inset-0 flex pointer-events-none" style={{ zIndex: 1 }}>
                        <div className={cn(
                          "w-[320px] border-r border-slate-200 dark:border-slate-800/50 relative transition-all",
                          selectedNotation === 'partition' || selectedNotation === 'swimlane' ? "bg-blue-500/5" : ""
                        )}>
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                              <User size={12} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                              {selectedSubDiagram === 'student' ? 'Calon Mahasiswa' : selectedSubDiagram === 'admin' ? 'Admin Panitia PMB' : 'Calon Mahasiswa / Super Admin'}
                            </span>
                          </div>
                        </div>
                        <div className={cn(
                          "w-[320px] border-r border-slate-200 dark:border-slate-800/50 relative transition-all",
                          selectedNotation === 'partition' || selectedNotation === 'swimlane' ? "bg-purple-500/5" : ""
                        )}>
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                              <Server size={12} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Portal Sistem (App Engine)</span>
                          </div>
                        </div>
                        <div className={cn(
                          "w-[320px] relative transition-all",
                          selectedNotation === 'partition' || selectedNotation === 'swimlane' ? "bg-indigo-500/5" : ""
                        )}>
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                              <Shield size={12} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                              {selectedSubDiagram === 'student' ? 'Offline Desk / Kampus' : 'Database (SQL)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SVG CONNECTIONS (CONTROL FLOW LAYER) */}
                      <svg 
                        className="absolute inset-0 pointer-events-none w-[960px] transition-all duration-300" 
                        style={{ zIndex: 10, height: selectedSubDiagram === 'auth' ? '750px' : selectedSubDiagram === 'admin' ? '580px' : '950px' }}
                      >
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#64748b" />
                          </marker>
                          <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#3b82f6" />
                          </marker>
                          <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#10b981" />
                          </marker>
                          <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#ef4444" />
                          </marker>
                        </defs>

                        {/* Render active paths based on selected diagram */}
                        {selectedSubDiagram === 'auth' && getAuthActivityPaths()}
                        {selectedSubDiagram === 'admin' && getAdminActivityPaths()}
                        {selectedSubDiagram === 'student' && getStudentActivityPaths()}
                      </svg>

                      {/* TEXT LABELS OVERLAY */}
                      <div className="absolute inset-0 font-mono text-[9px] font-black pointer-events-none select-none" style={{ zIndex: 12 }}>
                        {selectedSubDiagram === 'auth' && (
                          <>
                            <span className="absolute left-[540px] top-[430px] text-rose-500 bg-white dark:bg-[#0c1017] px-1 text-center font-semibold rounded">[Tidak Valid]</span>
                            <span className="absolute left-[490px] top-[515px] text-emerald-500 bg-white dark:bg-[#0c1017] px-1 text-center font-semibold rounded">[Valid / Sukses]</span>
                          </>
                        )}
                        {selectedSubDiagram === 'admin' && (
                          <>
                            <span className="absolute left-[520px] top-[290px] text-rose-500 bg-white dark:bg-[#0c1017] px-1 text-center font-semibold rounded rotate-90">[Revisi Berkas]</span>
                            <span className="absolute left-[340px] top-[350px] text-emerald-500 bg-white dark:bg-[#0c1017] px-1 text-center font-semibold rounded">[Valid]</span>
                            <span className="absolute left-[540px] top-[400px] text-emerald-500 bg-white dark:bg-[#0c1017] px-1 text-center font-semibold rounded">[Lolos]</span>
                            <span className="absolute left-[490px] top-[460px] text-rose-500 bg-white dark:bg-[#0c1017] px-1 text-center font-semibold rounded">[Gagal]</span>
                          </>
                        )}
                        {selectedSubDiagram === 'student' && (
                          <>
                            <span className="absolute left-[260px] top-[395px] text-emerald-500 bg-white dark:bg-[#0c1017] px-1 text-center font-semibold rounded">[Ya / Lunas]</span>
                            <span className="absolute left-[540px] top-[375px] text-rose-500 bg-white dark:bg-[#0c1017] px-1 text-center font-semibold rounded rotate-90">[Gagal / Expired]</span>
                            <span className="absolute left-[490px] top-[740px] text-emerald-500 bg-white dark:bg-[#0c1017] px-1 text-center font-semibold rounded">[Selesai]</span>
                            <span className="absolute left-[560px] top-[675px] text-rose-500 bg-white dark:bg-[#0c1017] px-1 text-center font-semibold rounded rotate-90">[Pending]</span>
                          </>
                        )}
                      </div>

                      {/* UML DIAGRAM NODES INTERACTIVE COMPONENT TREE */}
                      <div className="absolute inset-0" style={{ zIndex: 20 }}>
                        {umlNodes.map((node) => {
                          const isSelected = selectedElement === node.id;
                          const isNotationHighlighted = selectedNotation === node.type;

                          // Initial Node styling
                          if (node.type === 'initial') {
                            return (
                              <div
                                key={node.id}
                                onClick={() => setSelectedElement(node.id)}
                                className={cn(
                                  "absolute w-6 h-6 rounded-full cursor-pointer group flex items-center justify-center transition-all",
                                  isSelected ? "ring-4 ring-blue-500 scale-110" : "",
                                  isNotationHighlighted ? "ring-4 ring-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)] animate-pulse" : ""
                                )}
                                style={{ 
                                  left: `${node.x - 12}px`, 
                                  top: `${node.y - 12}px` 
                                }}
                                title="Initial Node"
                              >
                                <div className="w-5 h-5 bg-slate-950 dark:bg-slate-100 rounded-full flex items-center justify-center relative shadow-md">
                                  <span className="absolute -right-24 text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Initial Node</span>
                                </div>
                              </div>
                            );
                          }

                          // Final Node styling
                          if (node.type === 'final') {
                            return (
                              <div
                                key={node.id}
                                onClick={() => setSelectedElement(node.id)}
                                className={cn(
                                  "absolute w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-all",
                                  isSelected ? "ring-4 ring-blue-500 scale-110" : "",
                                  isNotationHighlighted ? "ring-4 ring-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)] animate-pulse" : ""
                                )}
                                style={{ 
                                  left: `${node.x - 16}px`, 
                                  top: `${node.y - 16}px` 
                                }}
                                title="Activity Final Node"
                              >
                                <div className="w-7 h-7 border-2 border-slate-950 dark:border-slate-100 rounded-full flex items-center justify-center bg-white dark:bg-[#0c1017]">
                                  <div className="w-4 h-4 bg-slate-950 dark:bg-slate-100 rounded-full" />
                                </div>
                                <span className="absolute -right-28 text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Activity Final Node</span>
                              </div>
                            );
                          }

                          // Decision Node (Diamond) styling
                          if (node.type === 'decision') {
                            return (
                              <div
                                key={node.id}
                                onClick={() => setSelectedElement(node.id)}
                                className={cn(
                                  "absolute w-12 h-12 cursor-pointer transition-all flex items-center justify-center group",
                                  isSelected ? "scale-110" : "",
                                  isNotationHighlighted ? "scale-115 animate-bounce" : ""
                                )}
                                style={{ 
                                  left: `${node.x - 24}px`, 
                                  top: `${node.y - 24}px` 
                                }}
                              >
                                {/* Rotated Square (Diamond) */}
                                <div className={cn(
                                  "w-9 h-9 rotate-45 border-2 transition-all shadow-sm flex items-center justify-center bg-emerald-50/90 border-emerald-500 dark:bg-emerald-950/60 dark:border-emerald-400",
                                  isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "",
                                  isNotationHighlighted ? "border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.9)] bg-yellow-50 dark:bg-yellow-950" : ""
                                )}>
                                  {/* Small label inside or offset */}
                                  <HelpCircle size={12} className="text-emerald-600 dark:text-emerald-400 -rotate-45" />
                                </div>
                                
                                {/* Hover Indicator Text */}
                                <span className="absolute top-10 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 text-center w-32 whitespace-nowrap bg-white dark:bg-[#0c1017] px-1 rounded shadow-xs border border-slate-100 dark:border-slate-800 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                                  {node.title}
                                </span>
                              </div>
                            );
                          }

                          // Fork / Join node styling
                          if (node.type === 'fork' || node.type === 'join') {
                            return (
                              <div
                                key={node.id}
                                onClick={() => setSelectedElement(node.id)}
                                className={cn(
                                  "absolute bg-purple-600 dark:bg-purple-500 cursor-pointer rounded-full transition-all flex items-center justify-center",
                                  isSelected ? "ring-2 ring-blue-400 scale-102" : "",
                                  isNotationHighlighted ? "ring-4 ring-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)] animate-pulse" : ""
                                )}
                                style={{ 
                                  left: `${node.x - (node.width || 300) / 2}px`, 
                                  top: `${node.y}px`,
                                  width: `${node.width}px`,
                                  height: `${node.height}px`
                                }}
                              />
                            );
                          }

                          // Action Node styling
                          const w = node.width || 210;
                          const h = node.height || 50;
                          return (
                            <div
                              key={node.id}
                              onClick={() => setSelectedElement(node.id)}
                              className={cn(
                                "absolute rounded-2xl cursor-pointer p-2.5 transition-all flex flex-col justify-center border-2 shadow-xs group select-none hover:shadow-md",
                                isSelected 
                                  ? "bg-blue-600 text-white border-blue-500 scale-102 shadow-[0_4px_12px_rgba(59,130,246,0.3)]" 
                                  : "bg-amber-50/90 text-slate-900 border-amber-500/80 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-900/60 hover:border-amber-500",
                                isNotationHighlighted 
                                  ? "ring-4 ring-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.7)]" 
                                  : ""
                              )}
                              style={{ 
                                left: `${node.x - w / 2}px`, 
                                top: `${node.y}px`,
                                width: `${w}px`,
                                height: `${h}px`
                              }}
                            >
                              <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider">
                                <span className={cn(isSelected ? "text-blue-100" : "text-amber-600 dark:text-amber-400")}>ACTION NODE</span>
                                <span className={cn(isSelected ? "text-white" : "text-slate-400")}>{node.role}</span>
                              </div>
                              <h4 className={cn("text-[10px] md:text-xs font-black uppercase truncate mt-0.5", isSelected ? "text-white" : "text-slate-900 dark:text-slate-100")}>
                                {node.title}
                              </h4>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>
                </div>

              </div>

              {/* 3. DETAILED NODE SPECIFICATION INSPECTOR (EXCEL IN-DEPTH ARCHITECTURE DETAILED DIAGRAMS) */}
              <AnimatePresence mode="wait">
                {selectedElement && (
                  <motion.div
                    key={selectedElement}
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 15 }}
                    className="p-8 bg-gradient-to-b from-slate-900 to-slate-950 dark:from-slate-950 dark:to-black text-white rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden"
                  >
                    {/* Visual accents */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                    {(() => {
                      // Find matching node details
                      const matchNode = umlNodes.find(n => n.id === selectedElement);
                      if (!matchNode) return (
                        <div className="text-center py-6 text-slate-500">
                          Pilih simpul pada bagan di atas untuk membuka perincian struktur.
                        </div>
                      );

                      return (
                        <div className="space-y-6 relative z-10">
                          
                          {/* Inspector Header */}
                          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center pb-4 border-b border-slate-800">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  UML {matchNode.type.toUpperCase()} SPECIFICATION
                                </span>
                                <span className="text-[10px] font-bold text-slate-500">
                                  ID: {matchNode.id.toUpperCase()}
                                </span>
                              </div>
                              <h3 className="text-xl font-black uppercase tracking-tight text-white mt-2 flex items-center gap-2">
                                <Code size={18} className="text-blue-500" />
                                {matchNode.title}
                              </h3>
                            </div>
                            <button 
                              onClick={() => setSelectedElement(null)}
                              className="px-4 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-[10px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                            >
                              Tutup Inspector
                            </button>
                          </div>

                          {/* Detail Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            {/* Business logic column */}
                            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800">
                              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Deskripsi Proses Bisnis</span>
                              <p className="text-xs text-slate-300 font-medium leading-relaxed mt-2.5">
                                {matchNode.desc}
                              </p>
                            </div>

                            {/* Code layer column */}
                            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800">
                              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Lokasi Komponen & Kontroler</span>
                              <div className="font-mono text-[10px] bg-slate-950 p-3 rounded-xl border border-slate-900/50 text-emerald-400 mt-2.5 break-all font-bold">
                                {matchNode.component}
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium mt-2 leading-relaxed">
                                Lokasi kode program utama yang merender atau memproses aksi simpul ini dalam ekosistem full-stack SIPMB.
                              </p>
                            </div>

                            {/* Database layer column */}
                            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800">
                              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Dampak Skema Database (Write/Read)</span>
                              <p className="text-xs text-slate-300 font-medium leading-relaxed mt-2.5">
                                {matchNode.impact}
                              </p>
                              <div className="mt-3 flex items-center gap-1.5 text-[9px] font-bold text-blue-400 uppercase tracking-wider">
                                <Database size={10} />
                                persistent storage impact
                              </div>
                            </div>

                            {/* UML Compliance check column */}
                            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800">
                              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Kepatuhan Notasi UML 2.5</span>
                              <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2.5">
                                {matchNode.type === 'initial' && 'Mewakili titik masuk logis pertama ke proses bisnis. Sesuai standar, harus tepat memiliki satu panah Control Flow keluar tanpa parameter input.'}
                                {matchNode.type === 'action' && 'Merepresentasikan tugas diskrit yang tidak dapat didekomposisi lebih jauh pada level diagram ini. Mengkonsumsi sinyal input dan merilis token kendali.'}
                                {matchNode.type === 'decision' && 'Simbol evaluasi boolean. Aliran masuk divalidasi, dan token kontrol diarahkan ke satu cabang keluar yang memiliki pelindung (guard) valid.'}
                                {matchNode.type === 'fork' && 'Mendukung pemrosesan bersamaan (Concurrency). Memotong satu urutan sekuensial menjadi beberapa jalur independen yang beroperasi paralel.'}
                                {matchNode.type === 'join' && 'Sinkronisasi sinkron. Menahan semua aliran paralel keluar hingga seluruh cabang konkuren menyentuh baris join sebelum melangkah maju.'}
                                {matchNode.type === 'final' && 'Simpul terminal. Menyerap seluruh token kontrol yang aktif di diagram dan meresmikan berakhirnya seluruh rangkaian proses bisnis.'}
                              </p>
                            </div>

                          </div>

                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* General Process Lifecycle */}
              <div className="p-8 bg-slate-50 dark:bg-[#1a1f29]/30 rounded-3xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Siklus Hidup Pendaftaran (Status Transition)
                </h4>
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  {[
                    { label: 'DRAFT', desc: 'Siswa mengisi biodata dasar.' },
                    { label: 'SUBMITTED', desc: 'Biodata dikunci & dokumen disimpan.' },
                    { label: 'VERIFYING', desc: 'Berkas dicek & biaya dikonfirmasi.' },
                    { label: 'TEST_READY', desc: 'Rilis kartu ujian & kode seleksi.' },
                    { label: 'ACCEPTED / REJECTED', desc: 'Hasil final seleksi diumumkan.' }
                  ].map((s, idx) => (
                    <div key={idx} className="flex-1 w-full flex flex-col md:flex-row items-center gap-4">
                      <div className="p-4 bg-white dark:bg-[#151921] border border-slate-200 dark:border-slate-800 rounded-2xl w-full text-center hover:border-blue-500 transition-all">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 block tracking-wider">{s.label}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block mt-1 leading-relaxed">{s.desc}</span>
                      </div>
                      {idx < 4 && <ArrowRight size={16} className="text-slate-300 dark:text-slate-700 hidden lg:block shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: SEQUENCE DIAGRAM */}
          {activeTab === 'sequence' && (
            <motion.div
              key="sequence"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Header Info */}
              <div className="flex flex-col lg:flex-row justify-between gap-6 p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-950/40">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
                    <Network size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Sequence Diagram - Lifespan Penerimaan</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                      Sesuai blueprint formal UML 2.5, menggambarkan alur pesan sinkron dari registrasi awal, seleksi, pengumuman, hingga daftar ulang & penerbitan NIM. Klik salah satu pesan atau filter fase untuk menelaah arsitektur.
                    </p>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-1.5 self-center bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  {[
                    { id: 'all', label: 'Semua Aliran' },
                    { id: 'registration', label: '1. Registrasi Akun' },
                    { id: 'selection', label: '2. Seleksi & CBT' },
                    { id: 'reregistration', label: '3. Daftar Ulang' }
                  ].map((phase) => (
                    <button
                      key={phase.id}
                      onClick={() => {
                        setSeqActivePhase(phase.id as any);
                        setSelectedSeqStep(null);
                      }}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all",
                        seqActivePhase === phase.id
                          ? "bg-slate-950 text-white dark:bg-emerald-500/20 dark:text-emerald-400 border border-slate-950 dark:border-emerald-500/30"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                      )}
                    >
                      {phase.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Layout: 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Column 1: Interactive Inspector / Sidebar (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Step Selector Card */}
                  <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-300">Daftar Urutan Pesan (UML Steps)</h4>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest">
                        {sequenceSteps.filter(s => seqActivePhase === 'all' || s.phase === seqActivePhase).length} pesan
                      </span>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1 no-scrollbar">
                      {sequenceSteps
                        .filter(s => seqActivePhase === 'all' || s.phase === seqActivePhase)
                        .map((step) => {
                          const isSelected = selectedSeqStep === step.id;
                          return (
                            <div
                              key={step.id}
                              onClick={() => setSelectedSeqStep(step.id)}
                              className={cn(
                                "p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs group",
                                isSelected
                                  ? "bg-emerald-500/15 border-emerald-500 text-slate-900 dark:text-white"
                                  : "bg-white dark:bg-[#151921] border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span className={cn(
                                  "w-6 h-6 rounded-lg text-[9px] font-black flex items-center justify-center border transition-colors",
                                  isSelected
                                    ? "bg-emerald-500 text-white border-emerald-400"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                                )}>
                                  {step.num}
                                </span>
                                <div className="text-left font-bold">
                                  <span className="block truncate max-w-[200px] text-xs font-mono">{step.msg}</span>
                                  <span className="text-[8px] uppercase tracking-widest opacity-60">
                                    {step.from} ➔ {step.to}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight size={14} className={cn(
                                "text-slate-400 group-hover:translate-x-0.5 transition-transform",
                                isSelected && "text-emerald-500"
                              )} />
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Inspector detail drawer */}
                  <AnimatePresence mode="wait">
                    {selectedSeqStep ? (() => {
                      const stepMatch = sequenceSteps.find(s => s.id === selectedSeqStep);
                      if (!stepMatch) return null;

                      return (
                        <motion.div
                          key={selectedSeqStep}
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="bg-gradient-to-b from-slate-900 to-slate-950 dark:from-slate-950 dark:to-black text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <span className="px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              UML MESSAGE {stepMatch.num} DETAILED
                            </span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">
                              {stepMatch.phase.toUpperCase()}
                            </span>
                          </div>

                          <div className="space-y-3.5">
                            <div>
                              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Metode/Pesan</span>
                              <p className="font-mono text-sm text-emerald-400 font-bold mt-1 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-900/80">
                                {stepMatch.msg}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-[11px]">
                              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                                <span className="text-[8px] text-slate-500 font-black uppercase block">Pengirim</span>
                                <span className="font-bold text-slate-200 mt-1 block uppercase text-[10px]">{stepMatch.from}</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                                <span className="text-[8px] text-slate-500 font-black uppercase block">Penerima</span>
                                <span className="font-bold text-slate-200 mt-1 block uppercase text-[10px]">{stepMatch.to}</span>
                              </div>
                            </div>

                            <div>
                              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Proses Bisnis</span>
                              <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1">{stepMatch.desc}</p>
                            </div>

                            <div className="pt-2 border-t border-slate-800 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-bold text-[9px] uppercase">Berkas Terkait:</span>
                                <span className="font-mono text-[10px] text-blue-400 font-black">{stepMatch.codeFile}</span>
                              </div>
                              <div className="flex justify-between items-start text-xs">
                                <span className="text-slate-500 font-bold text-[9px] uppercase mt-0.5">Dampak DB:</span>
                                <span className="font-mono text-[9px] text-amber-400 font-bold text-right max-w-[200px] leading-tight block">{stepMatch.dbImpact}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })() : (
                      <div className="p-6 bg-slate-100 dark:bg-slate-900/10 rounded-3xl text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800">
                        Klik salah satu pesan di atas atau klik langsung pada tanda panah di diagram untuk melihat detail proses bisnis dan file kode program terkait.
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Column 2: The Master SVG UML Sequence Board (8 cols) */}
                <div className="lg:col-span-8 bg-white dark:bg-[#11151c] rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-x-auto">
                  <div className="min-w-[960px] relative pb-8">
                    
                    {/* UML Diagram Name Label */}
                    <div className="absolute top-0 left-0 bg-white dark:bg-[#11151c] border-2 border-slate-800 dark:border-slate-700 rounded-br-2xl px-5 py-2 z-20 shadow-xs flex items-center gap-2">
                      <span className="font-mono text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white">
                        {selectedSubDiagram === 'auth' ? 'sd Autentikasi (Register / Login)' : selectedSubDiagram === 'admin' ? 'sd Kelola & Verifikasi Admin' : 'sd Pendaftaran Calon Mahasiswa'}
                      </span>
                    </div>

                    {/* Lifeline Headers (Actor & Participant boxes) */}
                    <div className="grid grid-cols-4 text-center select-none relative z-10 pt-16">
                      
                      {/* Pendaftar/Admin Actor */}
                      <div className="flex flex-col items-center">
                        {/* Stick figure as UML representation */}
                        <div className="w-16 h-20 flex flex-col justify-end pb-1.5">
                          <svg width="40" height="64" className="text-slate-800 dark:text-slate-200 mx-auto transition-transform hover:scale-105" viewBox="0 0 40 64">
                            <circle cx="20" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
                            <line x1="20" y1="20" x2="20" y2="42" stroke="currentColor" strokeWidth="2.5" />
                            <line x1="8" y1="28" x2="32" y2="28" stroke="currentColor" strokeWidth="2.5" />
                            <line x1="20" y1="42" x2="10" y2="58" stroke="currentColor" strokeWidth="2.5" />
                            <line x1="20" y1="42" x2="30" y2="58" stroke="currentColor" strokeWidth="2.5" />
                          </svg>
                        </div>
                        <span className="font-mono text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-300">
                          {selectedSubDiagram === 'auth' ? ':CalonMhs / Admin' : selectedSubDiagram === 'admin' ? ':AdminPanitia' : ':CalonMahasiswa'}
                        </span>
                      </div>

                      {/* Mendaftar:Interface */}
                      <div className="flex flex-col items-center justify-end h-28">
                        <div className="px-5 py-3.5 bg-slate-900 text-white dark:bg-slate-800 rounded-xl border-2 border-slate-700 dark:border-slate-600 shadow-xs max-w-[180px] w-full font-mono text-xs font-black uppercase tracking-wide">
                          {selectedSubDiagram === 'auth' ? 'RegisterLogin:View' : selectedSubDiagram === 'admin' ? 'DashboardAdmin:View' : 'Pendaftaran:View'}
                        </div>
                      </div>

                      {/* Mendaftar:Controller */}
                      <div className="flex flex-col items-center justify-end h-28">
                        <div className="px-5 py-3.5 bg-slate-900 text-white dark:bg-slate-800 rounded-xl border-2 border-slate-700 dark:border-slate-600 shadow-xs max-w-[180px] w-full font-mono text-xs font-black uppercase tracking-wide">
                          {selectedSubDiagram === 'auth' ? 'AuthController' : selectedSubDiagram === 'admin' ? 'AdminController' : 'StudentController'}
                        </div>
                      </div>

                      {/* Tabel:Pendaftar */}
                      <div className="flex flex-col items-center justify-end h-28">
                        <div className="px-5 py-3.5 bg-slate-900 text-white dark:bg-slate-800 rounded-xl border-2 border-slate-700 dark:border-slate-600 shadow-xs max-w-[180px] w-full font-mono text-xs font-black uppercase tracking-wide">
                          {selectedSubDiagram === 'auth' ? 'Tabel:Users' : selectedSubDiagram === 'admin' ? 'Tabel:PMBData' : 'Tabel:Applications'}
                        </div>
                      </div>

                    </div>

                    {/* The Interactive UML Sequence Drawing Area */}
                    <div className="relative mt-4">
                      
                      {/* MASTER SVG LAYER FOR LIFELINES & ARROWS */}
                      <svg 
                        width="960" 
                        height={selectedSubDiagram === 'auth' ? '750' : selectedSubDiagram === 'admin' ? '780' : '1260'} 
                        className="absolute top-0 left-0 pointer-events-none z-0 transition-all duration-300"
                      >
                        <defs>
                          {/* Triangle arrowhead for messages */}
                          <marker id="uml-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor" />
                          </marker>
                          {/* Return thin arrowhead */}
                          <marker id="uml-return-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1 L 10 5 L 0 9" fill="none" stroke="currentColor" strokeWidth="2" />
                          </marker>
                        </defs>

                        {/* Lifeline vertical dashed lines */}
                        <g stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" opacity="0.6">
                          <line x1="120" y1="0" x2="120" y2={selectedSubDiagram === 'auth' ? '730' : selectedSubDiagram === 'admin' ? '760' : '1240'} />
                          <line x1="360" y1="0" x2="360" y2={selectedSubDiagram === 'auth' ? '730' : selectedSubDiagram === 'admin' ? '760' : '1240'} />
                          <line x1="600" y1="0" x2="600" y2={selectedSubDiagram === 'auth' ? '730' : selectedSubDiagram === 'admin' ? '760' : '1240'} />
                          <line x1="840" y1="0" x2="840" y2={selectedSubDiagram === 'auth' ? '730' : selectedSubDiagram === 'admin' ? '760' : '1240'} />
                        </g>

                        {/* UML Activation Bars (Focus of Control) */}
                        <g fill="#f1f5f9" stroke="#475569" strokeWidth="2" opacity="0.9">
                          {selectedSubDiagram === 'auth' && (
                            <>
                              <rect x="112" y="140" width="16" height="380" rx="3" />
                              <rect x="352" y="140" width="16" height="420" rx="3" />
                              <rect x="592" y="150" width="16" height="440" rx="3" />
                              <rect x="832" y="170" width="16" height="350" rx="3" />
                            </>
                          )}
                          {selectedSubDiagram === 'admin' && (
                            <>
                              <rect x="112" y="140" width="16" height="480" rx="3" />
                              <rect x="352" y="140" width="16" height="500" rx="3" />
                              <rect x="592" y="150" width="16" height="520" rx="3" />
                              <rect x="832" y="170" width="16" height="420" rx="3" />
                            </>
                          )}
                          {selectedSubDiagram === 'student' && (
                            <>
                              <rect x="112" y="140" width="16" height="370" rx="3" />
                              <rect x="112" y="550" width="16" height="340" rx="3" />
                              <rect x="112" y="930" width="16" height="260" rx="3" />

                              <rect x="352" y="140" width="16" height="370" rx="3" />
                              <rect x="352" y="550" width="16" height="200" rx="3" />
                              <rect x="352" y="930" width="16" height="110" rx="3" />

                              <rect x="592" y="160" width="16" height="350" rx="3" />
                              <rect x="592" y="570" width="16" height="180" rx="3" />
                              <rect x="592" y="770" width="16" height="120" rx="3" />
                              <rect x="592" y="950" width="16" height="240" rx="3" />

                              <rect x="832" y="325" width="16" height="100" rx="3" />
                              <rect x="832" y="595" width="16" height="140" rx="3" />
                              <rect x="832" y="775" width="16" height="105" rx="3" />
                              <rect x="832" y="1010" width="16" height="115" rx="3" />
                            </>
                          )}
                        </g>

                        {/* Alt Conditional Frames */}
                        {selectedSubDiagram === 'auth' && (
                          <g>
                            <rect x="50" y="350" width="850" height="180" fill="none" stroke="#475569" strokeWidth="1.5" />
                            <polygon points="50,350 110,350 120,365 50,365" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                            <text x="60" y="361" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#000" className="dark:fill-white">Alt</text>
                            <line x1="50" y1="440" x2="900" y2="440" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
                            <text x="65" y="380" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#f43f5e">[invalid/gagal]</text>
                            <text x="65" y="470" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#10b981">[valid/sukses]</text>
                          </g>
                        )}

                        {selectedSubDiagram === 'admin' && (
                          <g>
                            <rect x="50" y="300" width="850" height="180" fill="none" stroke="#475569" strokeWidth="1.5" />
                            <polygon points="50,300 110,300 120,315 50,315" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                            <text x="60" y="311" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#000" className="dark:fill-white">Alt</text>
                            <line x1="50" y1="390" x2="900" y2="390" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
                            <text x="65" y="330" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#10b981">[Lengkap/Lolos]</text>
                            <text x="65" y="420" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#f43f5e">[Revisi/Gagal]</text>
                          </g>
                        )}

                        {selectedSubDiagram === 'student' && (
                          <>
                            <g>
                              <rect x="50" y="365" width="850" height="160" fill="none" stroke="#475569" strokeWidth="1.5" />
                              <polygon points="50,365 110,365 120,380 50,380" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                              <text x="60" y="376" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#000" className="dark:fill-white">Alt</text>
                              <line x1="50" y1="455" x2="900" y2="455" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
                              <text x="65" y="395" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#0ea5e9">[valid]</text>
                              <text x="65" y="475" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#f43f5e">[invalid]</text>
                            </g>
                            <g>
                              <rect x="50" y="755" width="850" height="160" fill="none" stroke="#475569" strokeWidth="1.5" />
                              <polygon points="50,755 110,755 120,770 50,770" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                              <text x="60" y="766" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#000" className="dark:fill-white">Alt</text>
                              <line x1="50" y1="840" x2="900" y2="840" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
                              <text x="65" y="785" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#10b981">[Lulus / Accepted]</text>
                              <text x="65" y="865" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#f43f5e">[Gagal / Rejected]</text>
                            </g>
                            <g>
                              <rect x="50" y="1050" width="850" height="160" fill="none" stroke="#475569" strokeWidth="1.5" />
                              <polygon points="50,1050 110,1050 120,1065 50,1065" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
                              <text x="60" y="1061" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#000" className="dark:fill-white">Alt</text>
                              <line x1="50" y1="1150" x2="900" y2="1150" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
                              <text x="65" y="1080" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#10b981">[UKT Valid]</text>
                              <text x="65" y="1175" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#f43f5e">[UKT Invalid]</text>
                            </g>
                          </>
                        )}

                      </svg>

                      {/* ACTIVE INTERACTIVE MESSAGES */}
                      <div 
                        className="relative z-10 w-[960px] transition-all duration-300" 
                        style={{ height: selectedSubDiagram === 'auth' ? '750px' : selectedSubDiagram === 'admin' ? '780px' : '1260px' }}
                      >
                        {sequenceSteps.map((step) => {
                          const isPhaseVisible = seqActivePhase === 'all' || step.phase === seqActivePhase;
                          if (!isPhaseVisible) return null;

                          const isSelected = selectedSeqStep === step.id;
                          const fromLeft = Math.min(step.fromX, step.toX);
                          const arrowWidth = Math.abs(step.fromX - step.toX);
                          const isLeftToRight = step.fromX < step.toX;

                          // Render self-loop or horizontal arrow
                          if (step.isSelfLoop) {
                            return (
                              <div
                                key={step.id}
                                onClick={() => setSelectedSeqStep(step.id)}
                                className={cn(
                                  "absolute cursor-pointer select-none group transition-all",
                                  isSelected ? "z-30 text-emerald-500" : "text-slate-600 dark:text-slate-400 hover:text-emerald-500"
                                )}
                                style={{
                                  left: `${step.fromX}px`,
                                  top: `${step.y}px`,
                                  width: '120px',
                                  height: '40px'
                                }}
                              >
                                {/* Self Loop Arrow line using SVG */}
                                <svg width="120" height="40" className="overflow-visible">
                                  <path
                                    d="M 4 2 L 60 2 L 60 25 L 14 25"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={isSelected ? "3" : "1.8"}
                                    markerEnd="url(#uml-arrow)"
                                    className="transition-all"
                                  />
                                </svg>
                                <span className={cn(
                                  "absolute left-4 top-4 font-mono text-[9px] font-black tracking-tight whitespace-nowrap px-1 rounded",
                                  isSelected ? "bg-emerald-500/10 text-emerald-400 font-bold" : "bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-300"
                                )}>
                                  {step.msg}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={step.id}
                              onClick={() => setSelectedSeqStep(step.id)}
                              className={cn(
                                "absolute cursor-pointer select-none transition-all flex flex-col items-center group",
                                isSelected ? "z-30 text-emerald-500" : "text-slate-700 dark:text-slate-300 hover:text-emerald-500"
                              )}
                              style={{
                                left: `${fromLeft}px`,
                                top: `${step.y - 12}px`,
                                width: `${arrowWidth}px`,
                                height: '24px'
                              }}
                            >
                              {/* Label text placed centered on top of line */}
                              <span className={cn(
                                "font-mono text-[9px] font-black tracking-tight px-1.5 py-0.5 rounded transition-all",
                                isSelected
                                  ? "bg-emerald-500 text-white font-bold scale-102 shadow-xs"
                                  : "bg-white/90 dark:bg-[#11151c]/90 text-slate-800 dark:text-slate-200 group-hover:text-emerald-500"
                              )}>
                                {step.msg}
                              </span>

                              {/* Arrow drawing */}
                              <svg width="100%" height="8" className="overflow-visible mt-1">
                                <line
                                  x1={isLeftToRight ? "4" : `${arrowWidth - 4}`}
                                  y1="4"
                                  x2={isLeftToRight ? `${arrowWidth - 10}` : "10"}
                                  y2="4"
                                  stroke="currentColor"
                                  strokeWidth={isSelected ? "3" : "1.8"}
                                  strokeDasharray={step.isDashed ? "5 4" : "none"}
                                  markerEnd={step.isDashed ? "url(#uml-return-arrow)" : "url(#uml-arrow)"}
                                  className="transition-all"
                                />
                              </svg>

                              {/* Glowing selection effect behind arrow */}
                              {isSelected && (
                                <div className="absolute inset-0 bg-emerald-500/5 blur-sm -z-10 rounded-lg pointer-events-none border border-emerald-500/20" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: CLASS DIAGRAM (UML) */}
          {activeTab === 'class' && (
            <motion.div
              key="class"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6 p-6 bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-950/40">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
                    <Database size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Class Diagram (UML Relasional Database)</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                      Representasi formal struktur entitas database, field, method, serta relasi kardinalitas (Association, Composition, dan Aggregation) lengkap dengan penunjuk arah panah (arrow) UML relasional. Klik kelas untuk menyalakan relasi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Master Relative UML Canvas Box */}
              <div className="bg-slate-50 dark:bg-[#11151c] rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 p-6 md:p-8 overflow-x-auto shadow-xs">
                
                {/* Fixed size layout mapped precisely */}
                <div className="relative min-w-[1020px] h-[550px]" style={{ width: '1020px' }}>
                  
                  {/* MASTER SVG CONNECTOR ARROWS LAYER */}
                  <svg width="1020" height="550" className="absolute top-0 left-0 pointer-events-none z-0 overflow-visible">
                    <defs>
                      {/* Navigation Arrowhead */}
                      <marker id="class-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 10 5 L 0 8.5 Z" fill="currentColor" />
                      </marker>
                      {/* Composition Filled Diamond */}
                      <marker id="class-composition" viewBox="0 0 16 10" refX="0" refY="5" markerWidth="10" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 5 L 8 1 L 16 5 L 8 9 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                      </marker>
                      {/* Aggregation Hollow Diamond */}
                      <marker id="class-aggregation" viewBox="0 0 16 10" refX="0" refY="5" markerWidth="10" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 5 L 8 1 L 16 5 L 8 9 Z" fill="#ffffff" stroke="currentColor" strokeWidth="2" className="dark:fill-[#11151c]" />
                      </marker>
                    </defs>

                    {/* RELATION 1: User ──(Composition 1 to 1)──> StudentApplication */}
                    <g className={cn("transition-all duration-300", 
                      (hoveredClass === 'user' || hoveredClass === 'application') ? "text-blue-500 opacity-100" : "text-slate-400 dark:text-slate-600"
                    )}>
                      {/* Connection line */}
                      <line x1="290" y1="145" x2="380" y2="145" 
                        stroke="currentColor" 
                        strokeWidth={(hoveredClass === 'user' || hoveredClass === 'application') ? "3.5" : "2"}
                        markerStart="url(#class-composition)"
                        markerEnd="url(#class-arrow)"
                      />
                      {/* Cardinality Texts */}
                      <text x="310" y="135" className="font-mono text-[10px] font-bold fill-slate-500 dark:fill-slate-400">1</text>
                      <text x="355" y="135" className="font-mono text-[10px] font-bold fill-slate-500 dark:fill-slate-400">0..1</text>
                      <text x="325" y="160" className="font-mono text-[9px] font-black fill-slate-400 italic">compose</text>
                    </g>

                    {/* RELATION 2: User ──(Composition 1 to Many)──> RegistrationDocument */}
                    <g className={cn("transition-all duration-300", 
                      (hoveredClass === 'user' || hoveredClass === 'document') ? "text-indigo-500 opacity-100" : "text-slate-400 dark:text-slate-600"
                    )}>
                      {/* Connection line */}
                      <line x1="165" y1="250" x2="165" y2="320" 
                        stroke="currentColor" 
                        strokeWidth={(hoveredClass === 'user' || hoveredClass === 'document') ? "3.5" : "2"}
                        markerStart="url(#class-composition)"
                        markerEnd="url(#class-arrow)"
                      />
                      <text x="175" y="270" className="font-mono text-[10px] font-bold fill-slate-500 dark:fill-slate-400">1</text>
                      <text x="175" y="305" className="font-mono text-[10px] font-bold fill-slate-500 dark:fill-slate-400">0..4</text>
                      <text x="120" y="290" className="font-mono text-[9px] font-black fill-slate-400 italic">has_docs</text>
                    </g>

                    {/* RELATION 3: StudentApplication ──(Aggregation 1 to Many)──> Payment */}
                    <g className={cn("transition-all duration-300", 
                      (hoveredClass === 'application' || hoveredClass === 'payment') ? "text-emerald-500 opacity-100" : "text-slate-400 dark:text-slate-600"
                    )}>
                      {/* Connection line */}
                      <line x1="515" y1="270" x2="515" y2="320" 
                        stroke="currentColor" 
                        strokeWidth={(hoveredClass === 'application' || hoveredClass === 'payment') ? "3.5" : "2"}
                        markerStart="url(#class-aggregation)"
                        markerEnd="url(#class-arrow)"
                      />
                      <text x="525" y="285" className="font-mono text-[10px] font-bold fill-slate-500 dark:fill-slate-400">1</text>
                      <text x="525" y="305" className="font-mono text-[10px] font-bold fill-slate-500 dark:fill-slate-400">0..*</text>
                      <text x="460" y="295" className="font-mono text-[9px] font-black fill-slate-400 italic">records</text>
                    </g>

                    {/* RELATION 4: User ──(Association 1 to Many)──> ActivityLog */}
                    <g className={cn("transition-all duration-300", 
                      (hoveredClass === 'user' || hoveredClass === 'activitylog') ? "text-rose-500 opacity-100" : "text-slate-400 dark:text-slate-600"
                    )}>
                      {/* Routed Path: from User right side -> under announcement -> down to ActivityLog top */}
                      <path d="M 290 200 L 700 200 L 700 320" 
                        fill="none"
                        stroke="currentColor" 
                        strokeWidth={(hoveredClass === 'user' || hoveredClass === 'activitylog') ? "3.5" : "2"}
                        markerEnd="url(#class-arrow)"
                      />
                      <text x="310" y="190" className="font-mono text-[10px] font-bold fill-slate-500 dark:fill-slate-400">1</text>
                      <text x="680" y="305" className="font-mono text-[10px] font-bold fill-slate-500 dark:fill-slate-400">0..*</text>
                      <text x="625" y="215" className="font-mono text-[9px] font-black fill-slate-400 italic">tracks_action</text>
                    </g>

                    {/* RELATION 5: User ──(Dependency)──> Announcement */}
                    <g className={cn("transition-all duration-300", 
                      (hoveredClass === 'user' || hoveredClass === 'announcement') ? "text-purple-500 opacity-100" : "text-slate-400 dark:text-slate-600"
                    )}>
                      {/* Horizontal line over StudentApplication */}
                      <path d="M 165 40 L 165 15 L 835 15 L 835 40" 
                        fill="none"
                        stroke="currentColor" 
                        strokeWidth={(hoveredClass === 'user' || hoveredClass === 'announcement') ? "3" : "1.8"}
                        strokeDasharray="5 4"
                        markerEnd="url(#class-arrow)"
                      />
                      <text x="180" y="30" className="font-mono text-[10px] font-bold fill-slate-500 dark:fill-slate-400">1</text>
                      <text x="815" y="30" className="font-mono text-[10px] font-bold fill-slate-500 dark:fill-slate-400">0..*</text>
                      <text x="480" y="30" className="font-mono text-[9px] font-black fill-slate-400 italic">publishes</text>
                    </g>

                  </svg>

                  {/* LAYER 2: INTERACTIVE CLASS CARDS */}
                  
                  {/* CLASS: User (left: 40px, top: 40px) */}
                  <div
                    onMouseEnter={() => setHoveredClass('user')}
                    onMouseLeave={() => setHoveredClass(null)}
                    onClick={() => setSelectedClass('user')}
                    className={cn(
                      "absolute w-[250px] bg-white dark:bg-[#151921] rounded-2xl border-2 overflow-hidden shadow-xs transition-all duration-300 z-10 cursor-pointer select-none",
                      hoveredClass === 'user' ? "border-blue-500 scale-102 shadow-md" : "border-slate-300 dark:border-slate-800"
                    )}
                    style={{ left: '40px', top: '40px', height: '210px' }}
                  >
                    <div className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                      <span className="font-mono text-[11px] font-black uppercase tracking-widest">class User</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-blue-600 rounded">Entity</span>
                    </div>
                    <div className="p-3.5 space-y-1 text-[10px] border-b border-slate-100 dark:border-slate-800/80 font-mono">
                      <p className="text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> fullName: string</p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> email: string <span className="text-slate-400 dark:text-slate-600">// Unique</span></p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> phone: string</p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> role: UserRole</p>
                    </div>
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-900/20 font-mono text-[9px] space-y-0.5">
                      <p className="text-slate-600 dark:text-slate-400"><span className="text-purple-500">[]</span> register(): boolean</p>
                      <p className="text-slate-600 dark:text-slate-400"><span className="text-purple-500">[]</span> login(): Session</p>
                    </div>
                  </div>

                  {/* CLASS: StudentApplication (left: 380px, top: 40px) */}
                  <div
                    onMouseEnter={() => setHoveredClass('application')}
                    onMouseLeave={() => setHoveredClass(null)}
                    onClick={() => setSelectedClass('application')}
                    className={cn(
                      "absolute w-[270px] bg-white dark:bg-[#151921] rounded-2xl border-2 overflow-hidden shadow-xs transition-all duration-300 z-10 cursor-pointer select-none",
                      hoveredClass === 'application' ? "border-teal-500 scale-102 shadow-md" : "border-slate-300 dark:border-slate-800"
                    )}
                    style={{ left: '380px', top: '40px', height: '230px' }}
                  >
                    <div className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                      <span className="font-mono text-[11px] font-black uppercase tracking-widest">class StudentApplication</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-teal-600 rounded">Entity</span>
                    </div>
                    <div className="p-3.5 space-y-1 text-[10px] border-b border-slate-100 dark:border-slate-800/80 font-mono">
                      <p className="text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                      <p className="text-slate-500"><span className="text-blue-500">+</span> userId: string <span className="text-slate-400 dark:text-slate-600">// FK</span></p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> major: string</p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> status: ApplicationStatus</p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> participantNumber: string</p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> score: number</p>
                    </div>
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-900/20 font-mono text-[9px] space-y-0.5">
                      <p className="text-slate-600 dark:text-slate-400"><span className="text-purple-500">[]</span> createDraft(): void</p>
                      <p className="text-slate-600 dark:text-slate-400"><span className="text-purple-500">[]</span> submit(): void</p>
                    </div>
                  </div>

                  {/* CLASS: Announcement (left: 710px, top: 40px) */}
                  <div
                    onMouseEnter={() => setHoveredClass('announcement')}
                    onMouseLeave={() => setHoveredClass(null)}
                    onClick={() => setSelectedClass('announcement')}
                    className={cn(
                      "absolute w-[250px] bg-white dark:bg-[#151921] rounded-2xl border-2 overflow-hidden shadow-xs transition-all duration-300 z-10 cursor-pointer select-none",
                      hoveredClass === 'announcement' ? "border-purple-500 scale-102 shadow-md" : "border-slate-300 dark:border-slate-800"
                    )}
                    style={{ left: '710px', top: '40px', height: '180px' }}
                  >
                    <div className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                      <span className="font-mono text-[11px] font-black uppercase tracking-widest">class Announcement</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-purple-600 rounded">Entity</span>
                    </div>
                    <div className="p-3.5 space-y-1 text-[10px] border-b border-slate-100 dark:border-slate-800/80 font-mono">
                      <p className="text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> title: string</p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> content: string</p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> type: string</p>
                    </div>
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-900/20 font-mono text-[9px] space-y-0.5">
                      <p className="text-slate-600 dark:text-slate-400"><span className="text-purple-500">[]</span> publish(): void</p>
                    </div>
                  </div>

                  {/* CLASS: Document (left: 40px, top: 320px) */}
                  <div
                    onMouseEnter={() => setHoveredClass('document')}
                    onMouseLeave={() => setHoveredClass(null)}
                    onClick={() => setSelectedClass('document')}
                    className={cn(
                      "absolute w-[250px] bg-white dark:bg-[#151921] rounded-2xl border-2 overflow-hidden shadow-xs transition-all duration-300 z-10 cursor-pointer select-none",
                      hoveredClass === 'document' ? "border-indigo-500 scale-102 shadow-md" : "border-slate-300 dark:border-slate-800"
                    )}
                    style={{ left: '40px', top: '320px', height: '190px' }}
                  >
                    <div className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                      <span className="font-mono text-[11px] font-black uppercase tracking-widest">class Document</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-indigo-600 rounded">Entity</span>
                    </div>
                    <div className="p-3.5 space-y-1 text-[10px] border-b border-slate-100 dark:border-slate-800/80 font-mono">
                      <p className="text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                      <p className="text-slate-500"><span className="text-blue-500">+</span> userId: string <span className="text-slate-400 dark:text-slate-600">// FK</span></p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> type: string</p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> url: string</p>
                    </div>
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-900/20 font-mono text-[9px] space-y-0.5">
                      <p className="text-slate-600 dark:text-slate-400"><span className="text-purple-500">[]</span> upload(): string</p>
                    </div>
                  </div>

                  {/* CLASS: Payment (left: 380px, top: 320px) */}
                  <div
                    onMouseEnter={() => setHoveredClass('payment')}
                    onMouseLeave={() => setHoveredClass(null)}
                    onClick={() => setSelectedClass('payment')}
                    className={cn(
                      "absolute w-[270px] bg-white dark:bg-[#151921] rounded-2xl border-2 overflow-hidden shadow-xs transition-all duration-300 z-10 cursor-pointer select-none",
                      hoveredClass === 'payment' ? "border-emerald-500 scale-102 shadow-md" : "border-slate-300 dark:border-slate-800"
                    )}
                    style={{ left: '380px', top: '320px', height: '190px' }}
                  >
                    <div className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                      <span className="font-mono text-[11px] font-black uppercase tracking-widest">class Payment</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-600 rounded">Entity</span>
                    </div>
                    <div className="p-3.5 space-y-1 text-[10px] border-b border-slate-100 dark:border-slate-800/80 font-mono">
                      <p className="text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                      <p className="text-slate-500"><span className="text-blue-500">+</span> userId: string <span className="text-slate-400 dark:text-slate-600">// FK</span></p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> amount: number</p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> status: string</p>
                    </div>
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-900/20 font-mono text-[9px] space-y-0.5">
                      <p className="text-slate-600 dark:text-slate-400"><span className="text-purple-500">[]</span> verify(): boolean</p>
                    </div>
                  </div>

                  {/* CLASS: ActivityLog (left: 710px, top: 320px) */}
                  <div
                    onMouseEnter={() => setHoveredClass('activitylog')}
                    onMouseLeave={() => setHoveredClass(null)}
                    onClick={() => setSelectedClass('activitylog')}
                    className={cn(
                      "absolute w-[250px] bg-white dark:bg-[#151921] rounded-2xl border-2 overflow-hidden shadow-xs transition-all duration-300 z-10 cursor-pointer select-none",
                      hoveredClass === 'activitylog' ? "border-rose-500 scale-102 shadow-md" : "border-slate-300 dark:border-slate-800"
                    )}
                    style={{ left: '710px', top: '320px', height: '190px' }}
                  >
                    <div className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                      <span className="font-mono text-[11px] font-black uppercase tracking-widest">class ActivityLog</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-rose-600 rounded">Audit</span>
                    </div>
                    <div className="p-3.5 space-y-1 text-[10px] border-b border-slate-100 dark:border-slate-800/80 font-mono">
                      <p className="text-slate-500"><span className="text-blue-500">+</span> id: string <span className="text-slate-400 dark:text-slate-600">// PK</span></p>
                      <p className="text-slate-500"><span className="text-blue-500">+</span> userId: string <span className="text-slate-400 dark:text-slate-600">// FK</span></p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> action: string</p>
                      <p className="text-slate-700 dark:text-slate-300"><span className="text-blue-500">+</span> timestamp: number</p>
                    </div>
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-900/20 font-mono text-[9px] space-y-0.5">
                      <p className="text-slate-600 dark:text-slate-400"><span className="text-purple-500">[]</span> writeLog(): void</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Class Specification Drawer */}
              <AnimatePresence mode="wait">
                {selectedClass && (
                  <motion.div
                    key={selectedClass}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="p-6 bg-[#0c1017] text-white rounded-3xl border border-slate-800 shadow-xl"
                  >
                    {(() => {
                      const spec = {
                        user: {
                          title: 'Class User',
                          desc: 'Merepresentasikan identitas akun utama pendaftar maupun panitia (Admin). Berperan sebagai otentikasi sentral.',
                          relations: 'Memiliki relasi Komposisi ke StudentApplication (1-to-1) dan RegistrationDocument (1-to-Many), serta Asosiasi ke ActivityLog.'
                        },
                        application: {
                          title: 'Class StudentApplication',
                          desc: 'Inti data seleksi calon mahasiswa. Menyimpan data program studi yang dilamar, status seleksi, nilai ujian, serta status daftar ulang.',
                          relations: 'Menerima relasi Komposisi dari User (1-to-1) dan melakukan Agregasi ke Class Payment.'
                        },
                        document: {
                          title: 'Class Document',
                          desc: 'Menyimpan berkas syarat administrasi (Ijazah, KTP, KK, Foto). Keberadaan berkas terikat erat dengan siklus hidup User.',
                          relations: 'Merupakan bagian Komposisi dari User (1-to-Many).'
                        },
                        payment: {
                          title: 'Class Payment',
                          desc: 'Mencatat seluruh mutasi dana pendaftaran dan transfer UKT. Memiliki verifikasi status pembayaran pendaftaran dan UKT.',
                          relations: 'Merupakan bagian Agregasi dari StudentApplication (1-to-Many).'
                        },
                        announcement: {
                          title: 'Class Announcement',
                          desc: 'Informasi pengumuman publik atau internal, diposting oleh Operator/Superadmin.',
                          relations: 'Memiliki relasi dependensi tidak langsung dari Class User.'
                        },
                        activitylog: {
                          title: 'Class ActivityLog',
                          desc: 'Audit trail log untuk mencatat aktivitas penting admin panitia demi keamanan sistem penerimaan.',
                          relations: 'Terkait via asosiasi langsung dari Class User pengirim perintah.'
                        }
                      }[selectedClass];

                      return (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                            <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider">{spec?.title} Specification</h4>
                            <button onClick={() => setSelectedClass(null)} className="text-[10px] font-bold text-rose-400 uppercase tracking-widest hover:underline">Tutup</button>
                          </div>
                          <p className="text-xs text-slate-300 font-medium leading-relaxed">{spec?.desc}</p>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-900"><span className="text-amber-400 font-bold">Relasi UML:</span> {spec?.relations}</p>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Informational Notation Guide */}
              <div className="p-8 bg-slate-50 dark:bg-[#1a1f29]/30 rounded-3xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Legenda Notasi Panah UML 2.5 Relasional</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-2.5 bg-slate-800 dark:bg-white rounded-sm relative shrink-0">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-slate-800 dark:border-l-white" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 dark:bg-white rotate-45 transform origin-center" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white uppercase text-[10px] tracking-tight">Composition (Komposisi)</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      Dilambangkan dengan <span className="font-bold">Diamond Terisi</span> di ujung pemilik. Menunjukkan kepemilikan kuat; jika kelas pemilik dihapus, kelas anak ikut terhapus otomatis (Life-cycle binding). Contoh: <span className="font-bold">User ⇄ Document</span>.
                    </p>
                  </div>

                  <div className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-2.5 bg-slate-800 dark:bg-white rounded-sm relative shrink-0">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-slate-800 dark:border-l-white" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white dark:bg-[#151921] border border-slate-800 dark:border-white rotate-45 transform origin-center" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white uppercase text-[10px] tracking-tight">Aggregation (Agregasi)</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      Dilambangkan dengan <span className="font-bold">Diamond Kosong</span> di ujung pemilik. Hubungan bagian-seluruh ("has-a") di mana siklus hidup anak tidak terikat mutlak dengan pemilik. Contoh: <span className="font-bold">StudentApplication ⇄ Payment</span>.
                    </p>
                  </div>

                  <div className="p-4 bg-white dark:bg-[#151921] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-0.5 bg-slate-800 dark:bg-white relative shrink-0">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-slate-800 dark:border-l-white" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white uppercase text-[10px] tracking-tight">Association (Asosiasi)</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      Garis lurus dengan <span className="font-bold">Mata Panah Biasa</span>. Menggambarkan hubungan referensial di mana satu kelas menggunakan fungsionalitas kelas lainnya tanpa kepemilikan struktural. Contoh: <span className="font-bold">User ⇄ ActivityLog</span>.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
