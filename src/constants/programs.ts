export interface Program {
  id: string;
  name: string;
}

export interface Faculty {
  id: string;
  name: string;
  programs: Program[];
}

export const FACULTIES: Faculty[] = [
  {
    id: 'FEB',
    name: 'Fakultas Ekonomi dan Bisnis',
    programs: [
      { id: 'FEB-AKT', name: 'Program Studi Akuntansi' },
      { id: 'FEB-IE', name: 'Program Studi Ilmu Ekonomi' },
      { id: 'FEB-MNJ', name: 'Program Studi Manajemen' },
    ]
  },
  {
    id: 'FH',
    name: 'Fakultas Hukum',
    programs: [
      { id: 'FH-HK', name: 'Program Studi Ilmu Hukum' },
    ]
  },
  {
    id: 'FISIP',
    name: 'Fakultas Ilmu Sosial dan Ilmu Politik',
    programs: [
      { id: 'FISIP-HI', name: 'Program Studi Ilmu Hubungan Internasional' },
      { id: 'FISIP-IK', name: 'Program Studi Ilmu Komunikasi' },
      { id: 'FISIP-PP', name: 'Program Studi Politik dan Pemerintahan' },
      { id: 'FISIP-SOS', name: 'Program Studi Sosiologi' },
    ]
  },
  {
    id: 'FK',
    name: 'Fakultas Kedokteran',
    programs: [
      { id: 'FK-PD', name: 'Program Studi Pendidikan Dokter' },
      { id: 'FK-KEP', name: 'Program Studi Ilmu Keperawatan' },
      { id: 'FK-GZ', name: 'Program Studi Gizi Kesehatan' },
    ]
  },
  {
    id: 'FKH',
    name: 'Fakultas Kehutanan',
    programs: [
      { id: 'FKH-KH', name: 'Program Studi Kehutanan' },
    ]
  },
  {
    id: 'FMIPA',
    name: 'Fakultas MIPA',
    programs: [
      { id: 'FMIPA-ELINS', name: 'Program Studi Elektronika dan Instrumentasi' },
      { id: 'FMIPA-IKOMP', name: 'Program Studi Ilmu Komputer' },
      { id: 'FMIPA-MTK', name: 'Program Studi Matematika' },
      { id: 'FMIPA-KIM', name: 'Program Studi Kimia' },
    ]
  },
  {
    id: 'FT',
    name: 'Fakultas Teknik',
    programs: [
      { id: 'FT-ARS', name: 'Program Studi Arsitektur' },
      { id: 'FT-TI', name: 'Program Studi Teknik Industri' },
      { id: 'FT-TE', name: 'Program Studi Teknik Elektro' },
      { id: 'FT-TS', name: 'Program Studi Teknik Sipil' },
      { id: 'FT-TINFO', name: 'Program Studi Teknologi Informasi' },
    ]
  },
  {
    id: 'FPSI',
    name: 'Fakultas Psikologi',
    programs: [
      { id: 'FPSI-PSI', name: 'Program Studi Psikologi' },
    ]
  }
];

export const getProgramById = (programId: string) => {
  for (const faculty of FACULTIES) {
    const program = faculty.programs.find(p => p.id === programId);
    if (program) return program;
  }
  return null;
};

export const getFacultyByProgramId = (programId: string) => {
  return FACULTIES.find(f => f.programs.some(p => p.id === programId));
};
