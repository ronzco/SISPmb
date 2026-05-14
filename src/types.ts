export type ApplicationStatus = 'draft' | 'submitted' | 'verifying' | 'test_ready' | 'accepted' | 'rejected';
export type UserRole = 'applicant' | 'admin' | 'superadmin' | 'committee_academic' | 'committee_finance';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: number;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface StudentApplication {
  id: string;
  userId: string;
  fullName: string;
  email?: string;
  program: string;
  status: ApplicationStatus;
  submittedAt?: number;
  updatedAt: number;
  major?: string;
  participantNumber?: string;
  selectionCode?: string;
  score?: number;
  reRegistrationPaid?: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: number;
  ip?: string;
}

export interface RegistrationDocument {
  id: string;
  userId: string;
  type: string;
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: number;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: 'pending' | 'success' | 'failed';
  category?: string; // Added optional category
  transactionId: string;
  paidAt?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'urgent';
  createdAt: number;
}

export interface FeeConfig {
  id: string;
  description: string;
  amount: number;
  updatedAt: number;
}
