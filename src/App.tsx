import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConnectPage } from './pages/ConnectPage';
import { ProfilePage } from './pages/ProfilePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { SetupPage } from './pages/SetupPage';
import { Navbar } from './components/Navbar';
import { WalletContextProvider, useWallet } from './context/WalletContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isConnected, userProfile } = useWallet();
  const location = useLocation();

  if (!isConnected) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (isConnected && !userProfile && location.pathname !== '/setup') {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const showNavbar = !['/', '/setup'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<ConnectPage />} />
        <Route path="/setup" element={
          <ProtectedRoute>
            <SetupPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <WalletContextProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </WalletContextProvider>
  );
}

export default App;