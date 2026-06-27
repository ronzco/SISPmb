import React from 'react';

const translateSubDiagramKey = (key: string): string => {
  const mapping: Record<string, string> = {
    'auth_register': 'register',
    'auth_login': 'login',
    'admin_announcements': 'announcements',
    'admin_tuition': 'fee_configs',
    'admin_verify_docs': 'verif_docs',
    'admin_verify_test': 'verif_test',
    'student_upload': 'upload_docs',
    'student_reg': 'pendaftaran_kuliah',
    'student_pay': 'pembayaran',
    'student_card': 'cetak_kartu',
    'student_complete': 'selesai_pendaftaran'
  };
  return mapping[key] || key;
};

export const getCanvasHeight = (selectedSubDiagram: string): number => {
  const key = translateSubDiagramKey(selectedSubDiagram);
  switch (key) {
    case 'register': return 750;
    case 'login': return 580;
    case 'announcements': return 580;
    case 'fee_configs': return 500;
    case 'verif_docs': return 520;
    case 'verif_test': return 680;
    case 'upload_docs': return 500;
    case 'pendaftaran_kuliah': return 500;
    case 'pembayaran': return 580;
    case 'cetak_kartu': return 580;
    case 'selesai_pendaftaran': return 760;
    default: return 600;
  }
};

export const getActivityPaths = (selectedSubDiagram: string, selectedNotation: string | null): React.ReactNode => {
  const isCtrl = selectedNotation === 'control';
  const sCol = isCtrl ? "#3b82f6" : "#64748b";
  const sW = isCtrl ? "3" : "2";
  const mEnd = isCtrl ? "url(#arrow-blue)" : "url(#arrow)";

  const key = translateSubDiagramKey(selectedSubDiagram);
  switch (key) {
    case 'register':
      return (
        <>
          {/* init (160, 50) -> act_fo_form (x:800, y:110, w:220) left edge (690, 135) */}
          <path d="M 160 50 L 160 135 L 690 135" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_fo_form (800, 160) -> act_fill_paper (x:160, y:200, w:220) right edge (270, 225) */}
          <path d="M 800 160 L 800 225 L 270 225" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_fill_paper (160, 250) -> act_fo_input (x:800, y:290, w:220) left edge (690, 315) */}
          <path d="M 160 250 L 160 315 L 690 315" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_fo_input (800, 340) -> act_sys_create (x:480, y:380, w:220) right edge (590, 405) */}
          <path d="M 800 340 L 800 405 L 590 405" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_sys_create (480, 430) -> dec_registered (x:480, y:470) top tip (480, 446) */}
          <path d="M 480 430 L 480 446" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_registered (504, 470) -> act_fo_success (x:800, y:560) top edge (800, 560) */}
          <path d="M 504 470 L 800 470 L 800 560" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_registered (456, 470) -> act_fo_form (x:800, y:110) left edge (690, 135) [return failure] */}
          <path d="M 455 470 L 320 470 L 320 135 L 690 135" stroke="#ef4444" strokeWidth={sW} markerEnd="url(#arrow-red)" fill="none" />
          {/* act_fo_success (800, 610) -> final (480, 650) right edge (496, 650) */}
          <path d="M 800 610 L 800 650 L 496 650" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
        </>
      );
    case 'login':
      return (
        <>
          {/* init (160, 50) -> act_input_cred (x:160, y:130) top edge (160, 130) */}
          <path d="M 160 50 L 160 130" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_input_cred (160, 180) -> act_sys_verify (x:480, y:220) left edge (370, 245) */}
          <path d="M 160 180 L 160 245 L 370 245" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_sys_verify (480, 270) -> dec_login_valid (x:480, y:310) top tip (480, 286) */}
          <path d="M 480 270 L 480 286" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_login_valid (480, 334) -> act_sys_token (x:480, y:400) top edge (480, 400) */}
          <path d="M 480 334 L 480 400" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_login_valid (504, 310) -> act_show_error (x:800, y:310) left edge (700, 335) [failure return] */}
          <path d="M 504 310 L 600 310 L 600 335 L 700 335" stroke="#ef4444" strokeWidth={sW} markerEnd="url(#arrow-red)" fill="none" />
          {/* act_show_error (800, 360) -> act_input_cred (x:160, y:130) right edge (260, 155) */}
          <path d="M 800 360 L 800 155 L 260 155" stroke="#ef4444" strokeWidth={sW} markerEnd="url(#arrow-red)" fill="none" />
          {/* act_sys_token (480, 450) -> final (480, 490) top edge (480, 474) */}
          <path d="M 480 450 L 480 474" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
        </>
      );
    case 'announcements':
      return (
        <>
          {/* init (160, 50) -> act_draft_ann (160, 130) */}
          <path d="M 160 50 L 160 130" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_draft_ann (160, 180) -> act_publish_ann (160, 220) */}
          <path d="M 160 180 L 160 220" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_publish_ann (160, 270) -> act_send_notif (x:480, y:310) left edge (370, 335) */}
          <path d="M 160 270 L 160 335 L 370 335" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_send_notif (480, 360) -> act_view_notif (x:800, y:400) left edge (690, 425) */}
          <path d="M 480 360 L 480 425 L 690 425" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_view_notif (800, 450) -> final (x:480, y:490) right edge (496, 490) */}
          <path d="M 800 450 L 800 490 L 496 490" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
        </>
      );
    case 'fee_configs':
      return (
        <>
          {/* init (160, 50) -> act_set_fees (160, 130) */}
          <path d="M 160 50 L 160 130" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_set_fees (160, 180) -> act_save_fees (x:480, y:220) left edge (380, 245) */}
          <path d="M 160 180 L 160 245 L 380 245" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_save_fees (480, 270) -> act_apply_bill (x:480, y:310) top edge (480, 310) */}
          <path d="M 480 270 L 480 310" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_apply_bill (480, 360) -> final (x:480, y:400) top edge (480, 384) */}
          <path d="M 480 360 L 480 384" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
        </>
      );
    case 'verif_docs':
      return (
        <>
          {/* init (800, 50) -> act_check_docs (800, 130) */}
          <path d="M 800 50 L 800 130" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_check_docs (800, 180) -> dec_docs_match (800, 196) */}
          <path d="M 800 180 L 800 196" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_docs_match (800, 244) -> act_archive_docs (x:480, y:310) right edge (585, 335) [success path] */}
          <path d="M 800 244 L 800 335 L 585 335" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_docs_match (776, 220) -> act_contact_student (x:160, y:220) right edge (265, 245) [failure path] */}
          <path d="M 776 220 L 776 245 L 265 245" stroke="#ef4444" strokeWidth={sW} markerEnd="url(#arrow-red)" fill="none" />
          {/* act_contact_student (160, 270) -> act_re_upload (160, 310) */}
          <path d="M 160 270 L 160 310" stroke="#ef4444" strokeWidth={sW} markerEnd="url(#arrow-red)" fill="none" />
          {/* act_re_upload (160, 360) -> loop back to right edge of act_check_docs (905, 155) */}
          <path d="M 160 360 L 160 380 L 925 380 L 925 155 L 905 155" stroke="#3b82f6" strokeWidth={sW} markerEnd="url(#arrow-blue)" fill="none" />
          {/* act_archive_docs (480, 360) -> final (480, 420) top edge (480, 404) */}
          <path d="M 480 360 L 480 404" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
        </>
      );
    case 'verif_test':
      return (
        <>
          {/* init (160, 50) -> act_check_answers (x:800, y:130) left edge (690, 155) */}
          <path d="M 160 50 L 160 155 L 690 155" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_check_answers (800, 180) -> act_input_score (800, 220) */}
          <path d="M 800 180 L 800 220" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_input_score (800, 270) -> act_calc_passing (x:480, y:310) right edge (590, 335) */}
          <path d="M 800 270 L 800 335 L 590 335" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_calc_passing (480, 360) -> dec_pass_test (480, 376) */}
          <path d="M 480 360 L 480 376" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_pass_test (480, 424) -> act_set_accepted (480, 490) */}
          <path d="M 480 424 L 480 490" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_pass_test (504, 400) -> act_set_rejected (x:800, y:490) left edge (690, 515) */}
          <path d="M 504 400 L 650 400 L 650 515 L 690 515" stroke="#ef4444" strokeWidth={sW} markerEnd="url(#arrow-red)" fill="none" />
          {/* act_set_accepted (480, 540) -> final (480, 580) top edge (480, 564) */}
          <path d="M 480 540 L 480 564" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_set_rejected (800, 540) -> final (480, 580) right edge (496, 580) */}
          <path d="M 800 540 L 800 580 L 496 580" stroke="#ef4444" strokeWidth={sW} markerEnd="url(#arrow-red)" fill="none" />
        </>
      );
    case 'upload_docs':
      return (
        <>
          {/* init (160, 50) -> act_select_files (160, 130) */}
          <path d="M 160 50 L 160 130" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_select_files (160, 180) -> act_upload_req (160, 220) */}
          <path d="M 160 180 L 160 220" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_upload_req (160, 270) -> act_store_cloud (x:480, y:310) left edge (370, 335) */}
          <path d="M 160 270 L 160 335 L 370 335" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_store_cloud (480, 360) -> final (x:480, y:400) top edge (480, 384) */}
          <path d="M 480 360 L 480 384" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
        </>
      );
    case 'pendaftaran_kuliah':
      return (
        <>
          {/* init (160, 50) -> act_fill_biodata (160, 130) */}
          <path d="M 160 50 L 160 130" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_fill_biodata (160, 180) -> act_select_prodi (160, 220) */}
          <path d="M 160 180 L 160 220" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_select_prodi (160, 270) -> act_save_data (x:480, y:310) left edge (370, 335) */}
          <path d="M 160 270 L 160 335 L 370 335" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_save_data (480, 360) -> final (480, 400) top edge (480, 384) */}
          <path d="M 480 360 L 480 384" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
        </>
      );
    case 'pembayaran':
      return (
        <>
          {/* init (160, 50) -> act_pay_cash (160, 130) */}
          <path d="M 160 50 L 160 130" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_pay_cash (160, 180) -> act_verify_cash (x:800, y:220) left edge (695, 245) */}
          <path d="M 160 180 L 160 245 L 695 245" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_verify_cash (800, 270) -> act_sys_payment (800, 310) */}
          <path d="M 800 270 L 800 310" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_sys_payment (800, 360) -> act_print_receipt (x:480, y:400) right edge (585, 425) */}
          <path d="M 800 360 L 800 425 L 585 425" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_print_receipt (480, 450) -> final (480, 490) top edge (480, 474) */}
          <path d="M 480 450 L 480 474" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
        </>
      );
    case 'cetak_kartu':
      return (
        <>
          {/* init (160, 50) -> act_check_eligibility (x:480, y:130) left edge (375, 155) */}
          <path d="M 160 50 L 160 155 L 375 155" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_check_eligibility (480, 180) -> dec_eligible (480, 196) */}
          <path d="M 480 180 L 480 196" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_eligible (480, 244) -> act_generate_card (480, 310) [success path] */}
          <path d="M 480 244 L 480 310" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_eligible (456, 220) -> act_download_print (x:160, y:400) top edge (160, 400) [bypass failure/not ready] */}
          <path d="M 456 220 L 160 220 L 160 400" stroke="#ef4444" strokeWidth={sW} markerEnd="url(#arrow-red)" fill="none" />
          {/* dec_eligible (504, 220) -> act_show_warning (x:800, y:220) left edge (695, 245) */}
          <path d="M 504 220 L 504 245 L 695 245" stroke="#ef4444" strokeWidth={sW} markerEnd="url(#arrow-red)" fill="none" />
          {/* act_generate_card (480, 360) -> act_download_print (x:160, y:400) right edge (265, 425) */}
          <path d="M 480 360 L 480 425 L 265 425" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_download_print (160, 450) -> final (160, 490) top edge (160, 474) */}
          <path d="M 160 450 L 160 474" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
        </>
      );
    case 'selesai_pendaftaran':
      return (
        <>
          {/* init (160, 50) -> dec_final_status (x:480, y:130) left tip (456, 130) */}
          <path d="M 160 50 L 160 130 L 456 130" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_final_status (480, 154) -> act_pay_ukt (x:160, y:220) right edge (265, 245) [success pass] */}
          <path d="M 480 154 L 480 245 L 265 245" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_pay_ukt (160, 270) -> act_sign_commit (160, 310) */}
          <path d="M 160 270 L 160 310" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_sign_commit (160, 360) -> act_publish_nim (x:800, y:400) left edge (690, 425) */}
          <path d="M 160 360 L 160 425 L 690 425" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* dec_final_status (456, 130) -> act_fail_retry (x:160, y:490) top edge (160, 490) [failure path] */}
          <path d="M 456 130 L 160 130 L 160 490" stroke="#ef4444" strokeWidth={sW} markerEnd="url(#arrow-red)" fill="none" />
          {/* act_fail_retry (160, 540) -> act_reset_app (x:480, y:580) left edge (375, 605) */}
          <path d="M 160 540 L 160 605 L 375 605" stroke="#ef4444" strokeWidth={sW} markerEnd="url(#arrow-red)" fill="none" />
          {/* act_reset_app (480, 630) -> final_success (x:480, y:670) top edge (480, 654) */}
          <path d="M 480 630 L 480 654" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
          {/* act_publish_nim (800, 450) -> final_success (x:480, y:670) right edge (496, 670) */}
          <path d="M 800 450 L 800 670 L 496 670" stroke={sCol} strokeWidth={sW} markerEnd={mEnd} fill="none" />
        </>
      );
    default:
      return null;
  }
};

export const getPathLabelsOverlay = (selectedSubDiagram: string): React.ReactNode => {
  const key = translateSubDiagramKey(selectedSubDiagram);
  switch (key) {
    case 'register':
      return (
        <>
          <span className="absolute left-[280px] top-[480px] text-rose-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-rose-200">[Gagal / Duplikat Email]</span>
          <span className="absolute left-[580px] top-[480px] text-emerald-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-emerald-200">[Sukses / Unik]</span>
        </>
      );
    case 'login':
      return (
        <>
          <span className="absolute left-[540px] top-[290px] text-rose-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-rose-200">[Salah Password]</span>
          <span className="absolute left-[490px] top-[360px] text-emerald-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-emerald-200">[Kredensial Cocok]</span>
        </>
      );
    case 'verif_docs':
      return (
        <>
          <span className="absolute left-[420px] top-[200px] text-rose-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-rose-200">[Butuh Revisi]</span>
          <span className="absolute left-[690px] top-[280px] text-emerald-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-emerald-200">[Sesuai / Valid]</span>
        </>
      );
    case 'verif_test':
      return (
        <>
          <span className="absolute left-[490px] top-[440px] text-emerald-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-emerald-200">[Skor &gt;= Passing Grade]</span>
          <span className="absolute left-[640px] top-[440px] text-rose-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-rose-200">[Skor &lt; Passing Grade]</span>
        </>
      );
    case 'cetak_kartu':
      return (
        <>
          <span className="absolute left-[220px] top-[200px] text-rose-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-rose-200">[Belum Lunas/Belum Verif]</span>
          <span className="absolute left-[490px] top-[260px] text-emerald-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-emerald-200">[Lunas &amp; Terverifikasi]</span>
        </>
      );
    case 'selesai_pendaftaran':
      return (
        <>
          <span className="absolute left-[260px] top-[150px] text-rose-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-rose-200">[Gagal / Gagal Tes Tulis]</span>
          <span className="absolute left-[300px] top-[200px] text-emerald-500 bg-white dark:bg-[#0c1017] px-1 text-center font-bold text-[10px] rounded border border-emerald-200">[Lolos / Diterima]</span>
        </>
      );
    default:
      return null;
  }
};

export const getUmlNodes = (selectedSubDiagram: string): any[] => {
  const key = translateSubDiagramKey(selectedSubDiagram);
  switch (key) {
    case 'register':
      return [
        { id: 'init', type: 'initial', x: 160, y: 40, title: 'Buka Portal SIPMB', desc: 'Calon Mahasiswa mengakses website Portal Penerimaan Mahasiswa Baru.', component: 'src/pages/Register.tsx', impact: 'Tidak ada' },
        { id: 'act_fo_form', type: 'action', x: 800, y: 110, width: 220, height: 50, title: 'Cek Duplikasi Email', role: 'Sistem Database SIPMB', desc: 'Sistem mengecek keunikan alamat email calon mahasiswa di database.', component: 'server.ts (API Engine)', impact: 'SELECT count(*) FROM users WHERE email = ?' },
        { id: 'act_fill_paper', type: 'action', x: 160, y: 200, width: 220, height: 50, title: 'Isi Form Registrasi', role: 'Calon Mahasiswa', desc: 'Calon mahasiswa mengisi nama, email, dan password pada form digital.', component: 'src/pages/Register.tsx', impact: 'Tidak ada' },
        { id: 'act_fo_input', type: 'action', x: 800, y: 290, width: 220, height: 50, title: 'Enkripsi & Simpan Kredensial', role: 'Sistem Database SIPMB', desc: 'Sistem mengamankan sandi menggunakan hashing bcrypt lalu menyimpan data akun baru.', component: 'server.ts & Firestore/DB', impact: 'INSERT INTO users (email, password_hash, role="applicant")' },
        { id: 'act_sys_create', type: 'action', x: 480, y: 380, width: 220, height: 50, title: 'Verifikasi & Validasi Token', role: 'Portal SIPMB Server', desc: 'Sistem memvalidasi kecocokan data input dan memicu pembuatan sesi registrasi pendaftar.', component: 'server.ts (POST /api/auth/register)', impact: 'Generate JWT token' },
        { id: 'dec_registered', type: 'decision', x: 480, y: 470, title: 'Registrasi Sukses?', desc: 'Pengecekan apakah pembuatan akun digital pelamar berhasil disimpan di database.' },
        { id: 'act_fo_success', type: 'action', x: 800, y: 560, width: 220, height: 50, title: 'Kirim Email Aktivasi', role: 'Sistem Database SIPMB', desc: 'Sistem otomatis men-trigger pengiriman surel konfirmasi dan kredensial login aktif.', component: 'server.ts (Notifier Engine)', impact: 'Email verifikasi terkirim' },
        { id: 'final', type: 'final', x: 480, y: 650, title: 'Selesai', desc: 'Akun pendaftar aktif dan pendaftar dialihkan otomatis ke halaman login.', component: 'Database State', impact: 'Account status = ACTIVE' }
      ];
    case 'login':
      return [
        { id: 'init', type: 'initial', x: 160, y: 40, title: 'Mulai', desc: 'Pengguna membuka form Login SIPMB digital.', component: 'src/pages/Login.tsx', impact: 'Tidak ada' },
        { id: 'act_input_cred', type: 'action', x: 160, y: 130, width: 200, height: 50, title: 'Masukkan Kredensial', role: 'Calon Mahasiswa / Admin', desc: 'Pengguna memasukkan email dan kata sandi pada halaman login online.', component: 'src/pages/Login.tsx', impact: 'Tidak ada' },
        { id: 'act_sys_verify', type: 'action', x: 480, y: 220, width: 220, height: 50, title: 'Verifikasi Kredensial', role: 'Portal SIPMB System', desc: 'Sistem memvalidasi email & mencocokkan password dengan bcrypt hash di database.', component: 'server.ts (POST /api/auth/login)', impact: 'SELECT * FROM users WHERE email = ?' },
        { id: 'dec_login_valid', type: 'decision', x: 480, y: 310, title: 'Kredensial Valid?', desc: 'Pengecekan apakah email & password cocok di database.' },
        { id: 'act_sys_token', type: 'action', x: 480, y: 400, width: 200, height: 50, title: 'Rilis Token JWT', role: 'Portal SIPMB System', desc: 'Sistem merilis secure token JWT berisi informasi identitas dan hak akses role pendaftar.', component: 'server.ts (jwt.sign)', impact: 'Rilis JWT Cookie / Browser Storage' },
        { id: 'act_show_error', type: 'action', x: 800, y: 310, width: 200, height: 50, title: 'Catat Audit Log Gagal', role: 'Sistem Database SIPMB', desc: 'Sistem mencatat log kegagalan autentikasi di database demi melindungi akun dari brute-force.', component: 'server.ts (Logger)', impact: 'INSERT INTO audit_logs (email, action="LOGIN_FAILED")' },
        { id: 'final', type: 'final', x: 480, y: 490, title: 'Selesai', desc: 'Pengguna masuk sesi terautentikasi dan diredirect ke dashboard yang sesuai.', component: 'Dashboard Redirection', impact: 'Sesi Aktif' }
      ];
    case 'announcements':
      return [
        { id: 'init', type: 'initial', x: 160, y: 40, title: 'Mulai', desc: 'Admin Panitia PMB masuk ke modul Kelola Pengumuman.', component: 'src/pages/AdminDashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_draft_ann', type: 'action', x: 160, y: 130, width: 200, height: 50, title: 'Tulis Draft Pengumuman', role: 'Admin Panitia PMB', desc: 'Admin menyusun konten pengumuman seleksi administrasi, jadwal tes, atau kelulusan.', component: 'src/pages/AdminDashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_publish_ann', type: 'action', x: 160, y: 220, width: 200, height: 50, title: 'Publikasi Pengumuman', role: 'Admin Panitia PMB', desc: 'Admin mengirimkan dan mempublikasikan pengumuman di portal sistem.', component: 'src/pages/AdminDashboard.tsx', impact: 'INSERT INTO announcements (title, content, type, date)' },
        { id: 'act_send_notif', type: 'action', x: 480, y: 310, width: 220, height: 50, title: 'Kirim Notifikasi Blast', role: 'Portal SIPMB System', desc: 'Sistem mengirimkan pemberitahuan otomatis secara paralel via SMS & Email Gateway.', component: 'server.ts (Notifier Engine)', impact: 'Mengirim email/SMS ke daftar pelamar' },
        { id: 'act_view_notif', type: 'action', x: 800, y: 400, width: 220, height: 50, title: 'Lihat Pengumuman', role: 'Calon Mahasiswa', desc: 'Pendaftar menerima notifikasi & memeriksa konten pengumuman di dashboard masing-masing.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'final', type: 'final', x: 480, y: 490, title: 'Selesai', desc: 'Pengumuman resmi disebarkan & diarsipkan secara transparan di sistem.', component: 'System State', impact: 'Announcements published' }
      ];
    case 'fee_configs':
      return [
        { id: 'init', type: 'initial', x: 160, y: 40, title: 'Mulai', desc: 'Panitia Keuangan membuka menu Konfigurasi Tarif Biaya Kampus.', component: 'src/pages/AdminDashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_set_fees', type: 'action', x: 160, y: 130, width: 200, height: 50, title: 'Atur Rincian Tarif Biaya', role: 'Admin Keuangan', desc: 'Mengatur nominal biaya pendaftaran gelombang baru & rincian biaya UKT per program studi.', component: 'src/pages/AdminDashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_save_fees', type: 'action', x: 480, y: 220, width: 200, height: 50, title: 'Simpan Konfigurasi', role: 'Portal SIPMB System', desc: 'Sistem memvalidasi format nominal biaya lalu memperbarui tabel konfigurasi biaya di DB.', component: 'server.ts (API POST /api/fee-configs)', impact: 'INSERT / UPDATE fee_configs SET amount = ?' },
        { id: 'act_apply_bill', type: 'action', x: 480, y: 310, width: 220, height: 50, title: 'Integrasikan Tagihan', role: 'Portal SIPMB System', desc: 'Sistem menerapkan tarif baru ke form isian mahasiswa & merilis billing otomatis.', component: 'server.ts (Billing Engine)', impact: 'Sync dengan formulir & tagihan pendaftar baru' },
        { id: 'final', type: 'final', x: 480, y: 400, title: 'Selesai', desc: 'Konfigurasi tarif biaya berhasil diperbarui & langsung aktif digunakan.', component: 'System State', impact: 'Fee configurations applied' }
      ];
    case 'verif_docs':
      return [
        { id: 'init', type: 'initial', x: 800, y: 40, title: 'Pemicu Berkas Masuk', desc: 'Dokumen pendaftaran masuk ke antrean database dengan status SUBMITTED.', component: 'src/pages/AdminDashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_check_docs', type: 'action', x: 800, y: 130, width: 210, height: 50, title: 'Tampilkan Berkas di Portal', role: 'Sistem Database SIPMB', desc: 'Sistem menyajikan berkas scan KK, KTP, dan Ijazah digital pada antarmuka admin verifikasi.', component: 'src/pages/AdminDashboard.tsx', impact: 'Tidak ada' },
        { id: 'dec_docs_match', type: 'decision', x: 800, y: 220, title: 'Berkas Valid?', desc: 'Evaluasi apakah berkas yang diunggah memenuhi syarat & datanya cocok.' },
        { id: 'act_archive_docs', type: 'action', x: 480, y: 310, width: 210, height: 50, title: 'Update Status & Log', role: 'Portal SIPMB System', desc: 'Sistem mengubah status aplikasi pendaftar menjadi VERIFIED & mengarsipkan file.', component: 'server.ts (API PUT /api/admin/applications/:id/verify)', impact: 'UPDATE applications SET status = "VERIFIED"' },
        { id: 'act_contact_student', type: 'action', x: 160, y: 220, width: 210, height: 50, title: 'Notifikasi Revisi Otomatis', role: 'Sistem Mailer SIPMB', desc: 'Sistem otomatis mengirimkan email notifikasi revisi berisi rincian berkas yang ditolak/perlu diperbaiki.', component: 'server.ts (Notification)', impact: 'Kirim notifikasi revisi dokumen' },
        { id: 'act_re_upload', type: 'action', x: 160, y: 310, width: 210, height: 50, title: 'Unggah Ulang Berkas', role: 'Calon Mahasiswa', desc: 'Siswa membaca catatan revisi di dashboard, lalu mengunggah file revisi baru berformat PDF/Image.', component: 'src/pages/Dashboard.tsx', impact: 'UPDATE documents SET file_path = ?, status = "SUBMITTED"' },
        { id: 'final', type: 'final', x: 480, y: 420, title: 'Selesai', desc: 'Dokumen pendaftaran calon mahasiswa berhasil terverifikasi penuh.', component: 'System State', impact: 'Application status = VERIFIED' }
      ];
    case 'verif_test':
      return [
        { id: 'init', type: 'initial', x: 160, y: 40, title: 'Mulai Ujian CBT', desc: 'Siswa memulai sesi ujian saringan masuk melalui CBT (Computer Based Test) online.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_check_answers', type: 'action', x: 800, y: 130, width: 220, height: 50, title: 'Kalkulasi Nilai CBT', role: 'Sistem Database SIPMB', desc: 'Sistem menghitung total jawaban benar secara real-time setelah siswa menyelesaikan ujian CBT.', component: 'server.ts (CBT Engine)', impact: 'Tidak ada' },
        { id: 'act_input_score', type: 'action', x: 800, y: 220, width: 220, height: 50, title: 'Simpan Skor Hasil CBT', role: 'Sistem Database SIPMB', desc: 'Sistem mengunggah skor nilai ujian akhir ke database peserta ujian secara otomatis.', component: 'server.ts (CBT Submit)', impact: 'Tidak ada' },
        { id: 'act_calc_passing', type: 'action', x: 480, y: 310, width: 220, height: 50, title: 'Evaluasi Passing Grade', role: 'Portal SIPMB System', desc: 'Sistem mencocokkan skor nilai dengan ambang batas (passing grade) program studi pilihan.', component: 'server.ts (API PUT /api/admin/applications/:id/score)', impact: 'UPDATE applications SET score = ?' },
        { id: 'dec_pass_test', type: 'decision', x: 480, y: 400, title: 'Lolos Passing Grade?', desc: 'Menilai apakah total nilai tes tulis memenuhi atau melampaui batas minimum kelulusan.' },
        { id: 'act_set_accepted', type: 'action', x: 480, y: 490, width: 220, height: 50, title: 'Set Lulus & Rilis UKT', role: 'Portal SIPMB System', desc: 'Sistem mengubah status menjadi ACCEPTED, merilis tagihan UKT & form pernyataan pendaftaran ulang.', component: 'server.ts (Status Engine)', impact: 'UPDATE applications SET status = "ACCEPTED", selection_code = "LULUS_2026_XX"' },
        { id: 'act_set_rejected', type: 'action', x: 800, y: 490, width: 220, height: 50, title: 'Set Tidak Lolos', role: 'Portal SIPMB System', desc: 'Sistem menetapkan status REJECTED & memunculkan informasi pendaftaran ulang di gelombang depan.', component: 'server.ts (Status Engine)', impact: 'UPDATE applications SET status = "REJECTED"' },
        { id: 'final', type: 'final', x: 480, y: 580, title: 'Selesai', desc: 'Hasil seleksi ujian CBT online disimpan dan siap dipublikasikan.', component: 'System State', impact: 'Applications status updated' }
      ];
    case 'upload_docs':
      return [
        { id: 'init', type: 'initial', x: 160, y: 40, title: 'Mulai', desc: 'Calon Mahasiswa login and masuk ke formulir unggah berkas persyaratan.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_select_files', type: 'action', x: 160, y: 130, width: 210, height: 50, title: 'Pilih File Scan Berkas', role: 'Calon Mahasiswa', desc: 'Memilih file Ijazah, KTP, KK, & Pas Foto dengan ukuran maks. 2MB per file.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_upload_req', type: 'action', x: 160, y: 220, width: 210, height: 50, title: 'Kirim Unggahan Berkas', role: 'Calon Mahasiswa', desc: 'Mengirim berkas pendaftaran terunggah lewat form digital di dashboard.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_store_cloud', type: 'action', x: 480, y: 310, width: 220, height: 50, title: 'Simpan Path Berkas', role: 'Portal SIPMB System', desc: 'Sistem menyimpan fisik dokumen ke server storage & mencatat path-nya ke database.', component: 'server.ts (API POST /api/documents/upload)', impact: 'INSERT INTO documents (user_id, file_path, doc_type, status = "submitted")' },
        { id: 'final', type: 'final', x: 480, y: 400, title: 'Selesai', desc: 'Semua dokumen persyaratan berhasil diunggah dengan status SUBMITTED.', component: 'System State', impact: 'Documents saved' }
      ];
    case 'pendaftaran_kuliah':
      return [
        { id: 'init', type: 'initial', x: 160, y: 40, title: 'Mulai', desc: 'Calon Mahasiswa membuka menu pendaftaran kuliah di dashboard.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_fill_biodata', type: 'action', x: 160, y: 130, width: 210, height: 50, title: 'Isi Formulir Biodata', role: 'Calon Mahasiswa', desc: 'Mengisi data diri lengkap, alamat, NISN, asal sekolah, nama orang tua, & nilai rapor.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_select_prodi', type: 'action', x: 160, y: 220, width: 210, height: 50, title: 'Pilih Program Studi', role: 'Calon Mahasiswa', desc: 'Memilih 2 Program Studi (Pilihan 1 & Pilihan 2) yang dituju.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_save_data', type: 'action', x: 480, y: 310, width: 220, height: 50, title: 'Kunci & Simpan Data', role: 'Portal SIPMB System', desc: 'Sistem memvalidasi kelengkapan isian form lalu menyimpannya sebagai draft aktif.', component: 'server.ts (API POST /api/applications/draft)', impact: 'INSERT INTO applications (user_id, major, second_major, status = "draft")' },
        { id: 'final', type: 'final', x: 480, y: 400, title: 'Selesai', desc: 'Data aplikasi pendaftaran kuliah berhasil terkunci & tersimpan dengan status DRAFT.', component: 'System State', impact: 'Draft application created' }
      ];
    case 'pembayaran':
      return [
        { id: 'init', type: 'initial', x: 160, y: 40, title: 'Mulai Pembayaran', desc: 'Siswa melihat rincian tagihan pembayaran pendaftaran di dashboard pendaftar.', component: 'src/pages/Payment.tsx', impact: 'Tidak ada' },
        { id: 'act_pay_cash', type: 'action', x: 160, y: 130, width: 210, height: 50, title: 'Transfer Virtual Account', role: 'Calon Mahasiswa', desc: 'Siswa melakukan transfer bank ke nomor Virtual Account (VA) tagihan yang tertera di portal.', component: 'src/pages/Payment.tsx', impact: 'Tidak ada' },
        { id: 'act_verify_cash', type: 'action', x: 800, y: 220, width: 210, height: 50, title: 'Notifikasi Webhook Lunas', role: 'Sistem Database SIPMB', desc: 'Sistem Gateway Finansial (Midtrans / Bank API) mengirimkan callback/webhook pembayaran sukses secara real-time.', component: 'Payment Gateway API', impact: 'Tidak ada' },
        { id: 'act_sys_payment', type: 'action', x: 800, y: 310, width: 220, height: 50, title: 'Update Status Lunas DB', role: 'Sistem Database SIPMB', desc: 'Sistem memvalidasi signature webhook, lalu memperbarui status pembayaran di database menjadi PAID.', component: 'server.ts (POST /api/payment/callback)', impact: 'UPDATE applications SET payment_status = "PAID", payment_date = NOW()' },
        { id: 'act_print_receipt', type: 'action', x: 480, y: 400, width: 210, height: 50, title: 'Generate Kuitansi PDF', role: 'Portal SIPMB System', desc: 'Sistem menghasilkan file kuitansi PDF resmi yang bisa diunduh langsung dari dashboard pendaftar.', component: 'server.ts (Receipt Engine)', impact: 'INSERT INTO payments (application_id, amount, status = "COMPLETED")' },
        { id: 'final', type: 'final', x: 480, y: 490, title: 'Selesai', desc: 'Status pembayaran berubah menjadi PAID (Lunas) secara otomatis, pendaftar dapat lanjut ke tahap berikutnya.', component: 'System State', impact: 'payment_status = PAID' }
      ];
    case 'cetak_kartu':
      return [
        { id: 'init', type: 'initial', x: 160, y: 40, title: 'Mulai', desc: 'Calon Mahasiswa masuk ke dashboard mengecek ketersediaan kartu ujian.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_check_eligibility', type: 'action', x: 480, y: 130, width: 210, height: 50, title: 'Validasi Kelayakan', role: 'Portal SIPMB System', desc: 'Sistem menguji kelengkapan berkas (VERIFIED) & kelunasan biaya (PAID) otomatis.', component: 'server.ts (API GET /api/applications/my-card)', impact: 'SELECT status, payment_status FROM applications' },
        { id: 'dec_eligible', type: 'decision', x: 480, y: 220, title: 'Layak Ujian?', desc: 'Pengecekan apakah berkas admin telah lolos seleksi berkas & biaya telah lunas.' },
        { id: 'act_generate_card', type: 'action', x: 480, y: 310, width: 220, height: 50, title: 'Rilis Nomor & Kartu', role: 'Portal SIPMB System', desc: 'Sistem merilis Nomor Peserta Seleksi Ujian Tulis dan melahirkan kartu ujian berformat PDF.', component: 'server.ts (Card Generator)', impact: 'UPDATE applications SET participant_number = "PMB2026XXX" (jika belum ada)' },
        { id: 'act_download_print', type: 'action', x: 160, y: 400, width: 210, height: 50, title: 'Unduh & Cetak Kartu', role: 'Calon Mahasiswa', desc: 'Mendownload file PDF kartu ujian peserta PMB lalu mencetaknya fisik.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_show_warning', type: 'action', x: 800, y: 220, width: 210, height: 50, title: 'Tampilkan Peringatan', role: 'Portal SIPMB System', desc: 'Tampil pesan: "Kartu belum rilis. Tunggu verifikasi berkas oleh Panitia PMB".', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'final', type: 'final', x: 160, y: 490, title: 'Selesai', desc: 'Pendaftar berhasil mengunduh Kartu Ujian Digital PDF yang siap digunakan untuk login aplikasi CBT.', component: 'Dashboard State', impact: 'Kartu ujian digital disimpan' }
      ];
    case 'selesai_pendaftaran':
      return [
        { id: 'init', type: 'initial', x: 160, y: 40, title: 'Mulai', desc: 'Calon mahasiswa memeriksa hasil akhir kelulusan tes tulis offline di portal.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'dec_final_status', type: 'decision', x: 480, y: 130, title: 'Lulus Seleksi?', desc: 'Evaluasi apakah status aplikasi bernilai ACCEPTED atau REJECTED.' },
        { id: 'act_pay_ukt', type: 'action', x: 160, y: 220, width: 210, height: 50, title: 'Bayar UKT Online via VA', role: 'Calon Mahasiswa', desc: 'Siswa membayar tagihan Uang Kuliah Tunggal (UKT) awal secara online via bank transfer / Virtual Account.', component: 'src/pages/Payment.tsx', impact: 'Tidak ada' },
        { id: 'act_sign_commit', type: 'action', x: 160, y: 310, width: 210, height: 50, title: 'Upload Pakta Integritas', role: 'Calon Mahasiswa', desc: 'Siswa mengunduh surat komitmen tata tertib, menandatanganinya di atas e-meterai, lalu mengunggahnya kembali ke portal.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_publish_nim', type: 'action', x: 800, y: 400, width: 220, height: 50, title: 'Terbitkan NIM Otomatis', role: 'Sistem Database SIPMB', desc: 'Sistem men-generate NIM resmi secara otomatis dan membuat akun Portal Akademik Mahasiswa Aktif.', component: 'server.ts (API POST /api/admin/applications/:id/complete)', impact: 'UPDATE applications SET status = "COMPLETED", student_nim = "NIM2026XXXX"' },
        { id: 'act_fail_retry', type: 'action', x: 160, y: 490, width: 210, height: 50, title: 'Ulangi Pendaftaran', role: 'Calon Mahasiswa', desc: 'Bagi siswa gagal diperkenankan menekan tombol "Ulangi" untuk ikut seleksi gelombang berikutnya.', component: 'src/pages/Dashboard.tsx', impact: 'Tidak ada' },
        { id: 'act_reset_app', type: 'action', x: 480, y: 580, width: 210, height: 50, title: 'Reset Status Aplikasi', role: 'Portal SIPMB System', desc: 'Sistem mereset data seleksi & merubah status kembali ke DRAFT agar bisa isi form ulang.', component: 'server.ts (API POST /api/applications/retry)', impact: 'UPDATE applications SET status = "DRAFT", score = NULL, selection_code = NULL' },
        { id: 'final_success', type: 'final', x: 480, y: 670, title: 'Selesai', desc: 'Proses penerimaan selesai penuh. Mahasiswa terdaftar aktif dalam pangkalan data akademis (SIAKAD).', component: 'System Academic State', impact: 'Siswa Aktif Baru' }
      ];
    default:
      return [];
  }
};

export const getSequenceSteps = (selectedSubDiagram: string): any[] => {
  const key = translateSubDiagramKey(selectedSubDiagram);
  switch (key) {
    case 'register':
      return [
        { id: 'seq_reg_1', num: '1', from: 'Calon Mahasiswa', to: 'React Client', fromX: 120, toX: 360, y: 120, msg: '1: submitRegistration(name, email, password)', details: 'Pendaftar mengisi form pendaftaran online & menekan tombol Register.', phase: 'registration', codeFile: 'src/pages/Register.tsx', dbImpact: 'None' },
        { id: 'seq_reg_2', num: '2', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 165, msg: '2: POST /api/auth/register', details: 'Sistem React mengirimkan data enkripsi registrasi ke backend.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_reg_3', num: '3', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 210, msg: '3: SELECT count(*) FROM users WHERE email = ?', details: 'Sistem database mengecek keunikan email pendaftar.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'SELECT count(*) FROM users WHERE email = ?' },
        { id: 'seq_reg_4', num: '4', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 255, msg: '4: return user_count (0)', details: 'Database mengonfirmasi bahwa email belum pernah terdaftar.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_reg_5', num: '5', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 300, msg: '5: INSERT INTO users (email, password_hash, role="applicant")', details: 'Endpoint mengamankan sandi menggunakan bcrypt hash lalu mendaftarkan akun baru.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'INSERT INTO users (email, password_hash, role="applicant")' },
        { id: 'seq_reg_6', num: '6', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 345, msg: '6: success (user_record)', details: 'MySQL berhasil menyisipkan baris pendaftar baru.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_reg_7', num: '7', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 390, msg: '7: success (201 Created with JWT)', details: 'Mengembalikan respon sukses beserta token sesi otomatis.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_reg_8', num: '8', from: 'React Client', to: 'Calon Mahasiswa', fromX: 360, toX: 120, y: 435, msg: '8: Tampilkan Registrasi Berhasil & Kirim Aktivasi', details: 'Dashboard menampilkan pesan sukses dan mengirimkan tautan aktivasi akun via email.', phase: 'registration', codeFile: 'src/pages/Register.tsx', dbImpact: 'None', isDashed: true }
      ];
    case 'login':
      return [
        { id: 'seq_login_1', num: '1', from: 'Calon Mahasiswa', to: 'React Client', fromX: 120, toX: 360, y: 120, msg: '1: inputCredentials(email, password)', details: 'Pengguna menginput email & kata sandi pada halaman login.', phase: 'registration', codeFile: 'src/pages/Login.tsx', dbImpact: 'None' },
        { id: 'seq_login_2', num: '2', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 170, msg: '2: POST /api/auth/login', details: 'Mengirimkan payload aman ke server API login.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_login_3', num: '3', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 220, msg: '3: SELECT * FROM users WHERE email = ?', details: 'Server mengambil data akun pendaftar berdasarkan email.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'SELECT * FROM users WHERE email = ?' },
        { id: 'seq_login_4', num: '4', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 270, msg: '4: return user_record (password_hash)', details: 'Menyajikan record data pendaftar beserta hash sandi bcrypt.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_login_5', num: '5', from: 'Express Server', to: 'Express Server', fromX: 600, toX: 650, y: 320, msg: '5: bcrypt.compare(password, hash)', details: 'Membandingkan kecocokan kata sandi yang dikirimkan.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isSelfLoop: true },
        { id: 'seq_login_6', num: '6', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 370, msg: '6: success (200 OK with JWT Cookie)', details: 'Rilis HttpOnly Cookie JWT bertanda tangan aman.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_login_7', num: '7', from: 'React Client', to: 'Calon Mahasiswa', fromX: 360, toX: 120, y: 420, msg: '7: Redirect to Dashboard', details: 'Sesi diaktifkan penuh, pendaftar diredirect masuk ke portal.', phase: 'registration', codeFile: 'src/pages/Login.tsx', dbImpact: 'None', isDashed: true }
      ];
    case 'announcements':
      return [
        { id: 'seq_ann_1', num: '1', from: 'Admin Panitia PMB', to: 'React Client', fromX: 120, toX: 360, y: 120, msg: '1: draftAnnouncement(title, content)', details: 'Admin mengetik isi pengumuman info kelulusan, jadwal atau berita.', phase: 'selection', codeFile: 'src/pages/AdminDashboard.tsx', dbImpact: 'None' },
        { id: 'seq_ann_2', num: '2', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 170, msg: '2: POST /api/announcements', details: 'Mengirim draf pengumuman PMB ke backend API.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_ann_3', num: '3', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 220, msg: '3: INSERT INTO announcements', details: 'Server menyimpan data pengumuman berstatus PUBLISHED di DB.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'INSERT INTO announcements (title, content, type, created_at)' },
        { id: 'seq_ann_4', num: '4', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 270, msg: '4: success (announcement_id)', details: 'MySQL sukses merekam baris pengumuman baru.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_ann_5', num: '5', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 320, msg: '5: success (201 Published)', details: 'Kembalikan respon sukses pengumuman resmi berhasil disebarkan.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_ann_6', num: '6', from: 'Express Server', to: 'Calon Mahasiswa', fromX: 600, toX: 120, y: 370, msg: '6: SMS/Email Blast notification', details: 'Sistem trigger SMS/Email notifier ke semua calon siswa baru.', phase: 'selection', codeFile: 'Notifier Engine', dbImpact: 'None', isDashed: true }
      ];
    case 'fee_configs':
      return [
        { id: 'seq_fee_1', num: '1', from: 'Admin Panitia PMB', to: 'React Client', fromX: 120, toX: 360, y: 120, msg: '1: setFeeConfig(description, amount)', details: 'Mengisi nominal tarif pendaftaran dan UKT.', phase: 'selection', codeFile: 'src/pages/AdminDashboard.tsx', dbImpact: 'None' },
        { id: 'seq_fee_2', num: '2', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 170, msg: '2: POST /api/fee-configs', details: 'Kirim payload update tarif biaya ke backend.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_fee_3', num: '3', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 220, msg: '3: INSERT/UPDATE fee_configs', details: 'Simpan konfigurasi rincian biaya kuliah di tabel database.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'INSERT / UPDATE fee_configs SET amount = ?' },
        { id: 'seq_fee_4', num: '4', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 270, msg: '4: success', details: 'Pembaruan tarif lunas tersimpan.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_fee_5', num: '5', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 320, msg: '5: return updated_configs (200 OK)', details: 'Form pendaftaran akan langsung menggunakan tarif terbaru.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isDashed: true }
      ];
    case 'verif_docs':
      return [
        { id: 'seq_vd_1', num: '1', from: 'Admin Panitia PMB', to: 'React Client', fromX: 120, toX: 360, y: 120, msg: '1: getSubmittedDocuments()', details: 'Membuka dashboard kelola & verifikasi dokumen pendaftar.', phase: 'selection', codeFile: 'src/pages/AdminDashboard.tsx', dbImpact: 'None' },
        { id: 'seq_vd_2', num: '2', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 170, msg: '2: GET /api/admin/applications?status=submitted', details: 'Meminta data pendaftaran berstatus submitted.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_vd_3', num: '3', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 220, msg: '3: SELECT * FROM applications JOIN documents', details: 'Mengambil data aplikasi pendaftar beserta list berkas unggahan.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'SELECT * FROM applications JOIN documents WHERE status = "submitted"' },
        { id: 'seq_vd_4', num: '4', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 270, msg: '4: return list_applications', details: 'Kembalikan dataset list berkas pendaftaran.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_vd_5', num: '5', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 320, msg: '5: renderApplicationsList()', details: 'Render list data verifikasi di browser Admin.', phase: 'selection', codeFile: 'src/pages/AdminDashboard.tsx', dbImpact: 'None', isDashed: true },
        { id: 'seq_vd_6', num: '6', from: 'Admin Panitia PMB', to: 'React Client', fromX: 120, toX: 360, y: 370, msg: '6: verifyDocument(id, status="VERIFIED")', details: 'Panitia menekan tombol SETUJU/VERIFIED jika berkas cocok.', phase: 'selection', codeFile: 'src/pages/AdminDashboard.tsx', dbImpact: 'None' },
        { id: 'seq_vd_7', num: '7', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 420, msg: '7: PUT /api/admin/applications/:id/verify', details: 'Kirim payload persetujuan verifikasi dokumen.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_vd_8', num: '8', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 470, msg: '8: UPDATE applications SET status = "VERIFIED"', details: 'Ubah status kelayakan administrasi mahasiswa baru.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'UPDATE applications SET status = "VERIFIED" WHERE id = ?' },
        { id: 'seq_vd_9', num: '9', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 520, msg: '9: success', details: 'Database berhasil mencatat status VERIFIED.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_vd_10', num: '10', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 570, msg: '10: updateStatusUI()', details: 'Status ter-update di UI Admin PMB.', phase: 'selection', codeFile: 'src/pages/AdminDashboard.tsx', dbImpact: 'None', isDashed: true }
      ];
    case 'verif_test':
      return [
        { id: 'seq_vt_1', num: '1', from: 'Calon Mahasiswa', to: 'React Client', fromX: 120, toX: 360, y: 120, msg: '1: submitCbtAnswers(answers_array)', details: 'Siswa menyelesaikan ujian saringan masuk online (CBT) & mengirim jawaban.', phase: 'selection', codeFile: 'src/pages/Dashboard.tsx', dbImpact: 'None' },
        { id: 'seq_vt_2', num: '2', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 170, msg: '2: POST /api/cbt/submit', details: 'Mengirimkan dataset pilihan ganda siswa ke server CBT Engine.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_vt_3', num: '3', from: 'Express Server', to: 'Express Server', fromX: 600, toX: 650, y: 220, msg: '3: calculateCbtScore()', details: 'Sistem CBT mencocokkan jawaban dengan kunci secara instan & menghitung skor.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isSelfLoop: true },
        { id: 'seq_vt_4', num: '4', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 270, msg: '4: UPDATE applications SET score = ?, status="VERIFIED_TEST"', details: 'Menyimpan nilai ujian hasil CBT siswa ke tabel aplikasi di database.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'UPDATE applications SET score = ?, status="VERIFIED_TEST" WHERE user_id = ?' },
        { id: 'seq_vt_5', num: '5', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 320, msg: '5: success', details: 'Sistem database berhasil mencatat perolehan skor ujian.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_vt_6', num: '6', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 370, msg: '6: UPDATE applications SET status="ACCEPTED", selection_code="LULUS_2026_X"', details: 'Ubah status kelulusan otomatis jika skor &gt;= passing grade.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'UPDATE applications SET status="ACCEPTED", selection_code="LULUS_2026_X" WHERE user_id = ?' },
        { id: 'seq_vt_7', num: '7', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 420, msg: '7: success', details: 'Database berhasil memperbarui kelulusan seleksi.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_vt_8', num: '8', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 470, msg: '8: return test_result (200 OK)', details: 'Mengembalikan respon kelulusan dan rincian skor pendaftar.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_vt_9', num: '9', from: 'React Client', to: 'Calon Mahasiswa', fromX: 360, toX: 120, y: 520, msg: '9: Tampilkan Pengumuman CBT', details: 'Dashboard pendaftar menyajikan pengumuman skor serta info kelulusan real-time.', phase: 'selection', codeFile: 'src/pages/Dashboard.tsx', dbImpact: 'None', isDashed: true }
      ];
    case 'upload_docs':
      return [
        { id: 'seq_ud_1', num: '1', from: 'Calon Mahasiswa', to: 'React Client', fromX: 120, toX: 360, y: 120, msg: '1: selectAndUploadFile(file, docType)', details: 'Memilih file KK, KTP, Ijazah atau SKL berformat PDF/PNG.', phase: 'registration', codeFile: 'src/pages/Dashboard.tsx', dbImpact: 'None' },
        { id: 'seq_ud_2', num: '2', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 170, msg: '2: POST /api/documents/upload', details: 'Mengirimkan payload Multipart FormData berisi file digital berkas pendaftar.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_ud_3', num: '3', from: 'Express Server', to: 'Express Server', fromX: 600, toX: 650, y: 220, msg: '3: Save file to Storage', details: 'Server menulis file ke directory penyimpanan local/cloud aman.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isSelfLoop: true },
        { id: 'seq_ud_4', num: '4', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 270, msg: '4: INSERT INTO documents (url, status="pending")', details: 'Mencatat url path dokumen ter-upload di database.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'INSERT INTO documents (id, user_id, type, url, status="pending")' },
        { id: 'seq_ud_5', num: '5', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 320, msg: '5: success', details: 'MySQL sukses mencatat berkas baru.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_ud_6', num: '6', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 370, msg: '6: return success (200 OK)', details: 'Menampilkan berkas berhasil diunggah di dashboard pendaftar.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true }
      ];
    case 'pendaftaran_kuliah':
      return [
        { id: 'seq_pk_1', num: '1', from: 'Calon Mahasiswa', to: 'React Client', fromX: 120, toX: 360, y: 120, msg: '1: fillBiodataForm(nama, alamat, school, major)', details: 'Mengisi biodata lengkap & pilihan Program Studi.', phase: 'registration', codeFile: 'src/pages/Dashboard.tsx', dbImpact: 'None' },
        { id: 'seq_pk_2', num: '2', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 170, msg: '2: POST /api/applications/draft', details: 'Kirim draf formulir pendaftaran kuliah pendaftar.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_pk_3', num: '3', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 220, msg: '3: INSERT/UPDATE applications SET status="draft"', details: 'Simpan data pendaftaran sebagai Draf di database.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'INSERT INTO applications (id, user_id, full_name, program, status="draft")' },
        { id: 'seq_pk_4', num: '4', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 270, msg: '4: return application_id', details: 'Baris data pendaftaran kuliah tersimpan.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_pk_5', num: '5', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 320, msg: '5: return success (200 OK)', details: 'Menampilkan respon data pendaftaran kuliah disimpan.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true }
      ];
    case 'pembayaran':
      return [
        { id: 'seq_pay_1', num: '1', from: 'Calon Mahasiswa', to: 'React Client', fromX: 120, toX: 360, y: 120, msg: '1: requestPaymentVa()', details: 'Pendaftar meminta rilis tagihan biaya pendaftaran di halaman Payment.', phase: 'registration', codeFile: 'src/pages/Payment.tsx', dbImpact: 'None' },
        { id: 'seq_pay_2', num: '2', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 170, msg: '2: POST /api/payment/request-va', details: 'Mengirim permintaan rilis nomor rekening Virtual Account.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_pay_3', num: '3', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 220, msg: '3: createVaBilling(user_id, amount)', details: 'Mencatat billing pendaftaran aktif dengan nomor Virtual Account bank terkait.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'INSERT INTO payments (user_id, billing_id, va_number, status="PENDING")' },
        { id: 'seq_pay_4', num: '4', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 270, msg: '4: return va_details', details: 'Mengirimkan detail VA pendaftaran kembali ke server.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_pay_5', num: '5', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 320, msg: '5: displayVaDetails()', details: 'Menampilkan nomor VA dan tata cara transfer bank di UI pelamar.', phase: 'registration', codeFile: 'src/pages/Payment.tsx', dbImpact: 'None', isDashed: true },
        { id: 'seq_pay_6', num: '6', from: 'Calon Mahasiswa', to: 'Express Server', fromX: 120, toX: 600, y: 370, msg: '6: payViaBankTransfer(va_number)', details: 'Siswa mentransfer dana sesuai nominal VA dari M-Banking / ATM.', phase: 'registration', codeFile: 'Bank Gateway App', dbImpact: 'None' },
        { id: 'seq_pay_7', num: '7', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 420, msg: '7: Webhook Callback / Notification', details: 'Sistem Bank mengirim callback lunas, database langsung set status PAID.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'UPDATE applications SET payment_status="PAID"; UPDATE payments SET status="COMPLETED";' },
        { id: 'seq_pay_8', num: '8', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 470, msg: '8: success', details: 'Data pelunasan berhasil tersimpan di DB.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_pay_9', num: '9', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 520, msg: '9: paymentConfirmed() & generateReceipt()', details: 'Sistem merilis kuitansi digital resmi PDF di dashboard pendaftar.', phase: 'registration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true }
      ];
    case 'cetak_kartu':
      return [
        { id: 'seq_ck_1', num: '1', from: 'Calon Mahasiswa', to: 'React Client', fromX: 120, toX: 360, y: 120, msg: '1: getUjianCardEligibility()', details: 'Membuka menu Ujian di dashboard pendaftar.', phase: 'selection', codeFile: 'src/pages/Dashboard.tsx', dbImpact: 'None' },
        { id: 'seq_ck_2', num: '2', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 170, msg: '2: GET /api/applications/my-card', details: 'Meminta generate kartu ujian tulis offline.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_ck_3', num: '3', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 220, msg: '3: SELECT status, payment_status FROM applications', details: 'Verifikasi kelengkapan berkas VERIFIED & lunas biaya PAID.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'SELECT status, payment_status FROM applications WHERE user_id = ?' },
        { id: 'seq_ck_4', num: '4', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 270, msg: '4: return verification_and_payment_states', details: 'Menyajikan record data validasi status.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_ck_5', num: '5', from: 'Express Server', to: 'Express Server', fromX: 600, toX: 650, y: 320, msg: '5: generateParticipantNumberAndPDF()', details: 'Merilis nomor peserta seleksi ujian tulis & generate PDF.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'UPDATE applications SET participant_number = "PMB2026XXX"', isSelfLoop: true },
        { id: 'seq_ck_6', num: '6', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 370, msg: '6: return card_pdf_stream', details: 'Server mengirimkan file PDF stream kartu ujian.', phase: 'selection', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_ck_7', num: '7', from: 'React Client', to: 'Calon Mahasiswa', fromX: 360, toX: 120, y: 420, msg: '7: Tampilkan tombol Download & Cetak', details: 'Kartu ujian terbit, pendaftar siap mengunduh & mencetak kartu.', phase: 'selection', codeFile: 'src/pages/Dashboard.tsx', dbImpact: 'None', isDashed: true }
      ];
    case 'selesai_pendaftaran':
      return [
        { id: 'seq_sp_1', num: '1', from: 'Calon Mahasiswa', to: 'React Client', fromX: 120, toX: 360, y: 120, msg: '1: getFinalSelectionResult()', details: 'Pendaftar memeriksa hasil kelulusan seleksi tes tulis offline di portal.', phase: 'reregistration', codeFile: 'src/pages/Dashboard.tsx', dbImpact: 'None' },
        { id: 'seq_sp_2', num: '2', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 165, msg: '2: GET /api/applications/my-status', details: 'Meminta status pendaftaran akhir pendaftar.', phase: 'reregistration', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_sp_3', num: '3', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 210, msg: '3: SELECT status, selection_code FROM applications', details: 'Mendapatkan status seleksi ACCEPTED atau REJECTED.', phase: 'reregistration', codeFile: 'server.ts', dbImpact: 'SELECT status, selection_code FROM applications WHERE user_id = ?' },
        { id: 'seq_sp_4', num: '4', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 255, msg: '4: return status', details: 'Database menyajikan status akhir pendaftaran.', phase: 'reregistration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_sp_5', num: '5', from: 'Calon Mahasiswa', to: 'React Client', fromX: 120, toX: 360, y: 300, msg: '5: payUktOnlineAndUploadCommitment()', details: 'Siswa membayar biaya UKT online melalui Virtual Account bank serta mengunggah pakta integritas bertanda tangan e-meterai.', phase: 'reregistration', codeFile: 'src/pages/Dashboard.tsx', dbImpact: 'None' },
        { id: 'seq_sp_6', num: '6', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 345, msg: '6: POST /api/reregister/submit', details: 'Mengirimkan bukti pembayaran UKT dan scan dokumen komitmen.', phase: 'reregistration', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_sp_7', num: '7', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 390, msg: '7: UPDATE applications SET status="COMPLETED", student_nim="NIM2026XX"', details: 'Mengubah status pendaftaran secara final & sistem otomatis melahirkan NIM.', phase: 'reregistration', codeFile: 'server.ts', dbImpact: 'UPDATE applications SET status="COMPLETED", student_nim="NIM2026XX" WHERE id = ?' },
        { id: 'seq_sp_8', num: '8', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 435, msg: '8: success', details: 'MySQL berhasil memutakhirkan baris mahasiswa baru.', phase: 'reregistration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_sp_9', num: '9', from: 'Express Server', to: 'React Client', fromX: 600, toX: 360, y: 480, msg: '9: reregistationSuccess(200 OK with NIM)', details: 'Mengirimkan NIM resmi beserta kredensial login SIAKAD.', phase: 'reregistration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true },
        { id: 'seq_sp_10', num: '10', from: 'Calon Mahasiswa', to: 'React Client', fromX: 120, toX: 360, y: 525, msg: '10: [Gagal] Klik Ulangi Pendaftaran', details: 'Pendaftar gagal menekan tombol Ulangi untuk mengulang di Gelombang berikutnya.', phase: 'reregistration', codeFile: 'src/pages/Dashboard.tsx', dbImpact: 'None' },
        { id: 'seq_sp_11', num: '11', from: 'React Client', to: 'Express Server', fromX: 360, toX: 600, y: 570, msg: '11: POST /api/applications/retry', details: 'Trigger pembersihan draf nilai & reset status.', phase: 'reregistration', codeFile: 'server.ts', dbImpact: 'None' },
        { id: 'seq_sp_12', num: '12', from: 'Express Server', to: 'Database (MySQL)', fromX: 600, toX: 840, y: 615, msg: '12: UPDATE applications SET status="draft", score=NULL, selection_code=NULL', details: 'Reset record aplikasi kembali ke status draf awal.', phase: 'reregistration', codeFile: 'server.ts', dbImpact: 'UPDATE applications SET status="draft", score=NULL, selection_code=NULL WHERE user_id = ?' },
        { id: 'seq_sp_13', num: '13', from: 'Database (MySQL)', to: 'Express Server', fromX: 840, toX: 600, y: 660, msg: '13: success', details: 'MySQL sukses mereset aplikasi.', phase: 'reregistration', codeFile: 'server.ts', dbImpact: 'None', isDashed: true }
      ];
    default:
      return [];
  }
};
