import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { UserProfile } from './types';

// Components & Pages
import Shell from './components/layout/Shell';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import Documents from './pages/Documents';
import PaymentPage from './pages/Payment';
import Announcements from './pages/Announcements';
import Fees from './pages/Fees';
import AdminDashboard from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch profile
        const profileRef = doc(db, 'users', firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as UserProfile);
        } else {
          // No profile found - user might be in process of role selection or unauthorized
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Memuat portal PMB...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!(user && profile) ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/register" 
          element={!(user && profile) ? <Register /> : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/" 
          element={user && profile ? <Shell user={user} profile={profile} /> : <Navigate to="/login" replace />}
        >
          <Route index element={profile?.role === 'applicant' ? <Dashboard /> : <Navigate to="/admin" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="registration" element={<Registration />} />
          <Route path="documents" element={<Documents />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="fees" element={<Fees />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
