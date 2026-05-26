// C:\Users\Devika S\Downloads\vantor_market_place\vantor_market_place\frontend\my-react-app\src\App.jsx

import React, { useEffect, useMemo, useState } from 'react';
import MarketplaceAuth from './Pages/Registration&Login';
import KYBPage from './Pages/KYBPage';
import KYCPage from './Pages/KYCPage';
import DashboardLayout from './Pages/DashboardLayout';
import ProjectProviderPage from './Pages/ProjectProviderPage';
import ServiceProviderPage from './Pages/ServiceProviderPage';
import { api } from './api';

function App() {
  // Logic: 'auth' -> 'kyb' -> 'kyc' -> 'dashboard'
  const [view, setView] = useState('auth');
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("vantor_session");
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    if (!session?.token || view !== "dashboard") return;

    api.getDashboard(session.token)
      .then(setDashboard)
      .catch((err) => setDashboardError(err.message || "Unable to load dashboard."));
  }, [session?.token, view]);

  const handleAuthSuccess = (authSession, source) => {
    setSession(authSession);
    localStorage.setItem("vantor_session", JSON.stringify(authSession));
    if (source === "login") {
      setView('dashboard');
      setActiveTab('dashboard');
      return;
    }

    setView('kyb');
  };

  const handleKYBComplete = () => {
    setView('kyc');
  };

  const handleKYCComplete = () => {
    alert("KYC Submitted. Moving to your dashboard.");
    setView('dashboard');
    setActiveTab('dashboard');
  };

  const logout = () => {
    localStorage.removeItem("vantor_session");
    setSession(null);
    setDashboard(null);
    setView("auth");
  };

  const roleLabel = session?.user?.role === "BUYER" ? "Project Provider" : "Vendor";
  const userName = useMemo(() => {
    const user = dashboard?.user || session?.user;
    return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "User";
  }, [dashboard?.user, session?.user]);
  const companyName = dashboard?.user?.company?.legalName || "Vantor Company";
  const kybStatus = dashboard?.user?.company?.kybStatus || "PENDING";

  const renderDashboardContent = () => {
    if (dashboardError) {
      return <p style={{ color: "#EF4444" }}>{dashboardError}</p>;
    }

    if (!dashboard) {
      return <p style={{ color: "#94A3B8" }}>Loading dashboard...</p>;
    }

    if (activeTab === "dashboard") {
      return (
        <div>
          <h1 style={{ margin: "0 0 8px", color: "#F1F5F9", fontSize: "24px" }}>Welcome, {userName}</h1>
          <p style={{ margin: "0 0 28px", color: "#94A3B8", fontSize: "14px" }}>Your {roleLabel.toLowerCase()} workspace is connected to the live backend.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "18px" }}>
            <MetricCard label="Published Projects" value={dashboard.stats.publishedProjects} />
            <MetricCard label={session?.user?.role === "BUYER" ? "My Projects" : "Active Bids"} value={session?.user?.role === "BUYER" ? dashboard.stats.myProjects : dashboard.stats.activeBids} />
            <MetricCard label="KYB Status" value={kybStatus} />
          </div>
        </div>
      );
    }

    if (activeTab === "profile") {
      return (
        <div style={{ maxWidth: "720px", background: "rgba(13, 22, 41, 0.4)", border: "1px solid #1E2D4A", borderRadius: "16px", padding: "28px" }}>
          <h1 style={{ margin: "0 0 20px", color: "#F1F5F9", fontSize: "22px" }}>Company Profile</h1>
          <ProfileRow label="Company" value={companyName} />
          <ProfileRow label="User" value={userName} />
          <ProfileRow label="Email" value={dashboard.user.email} />
          <ProfileRow label="Role" value={roleLabel} />
          <ProfileRow label="KYB Status" value={kybStatus} />
          <ProfileRow label="KYC Submitted" value={dashboard.user.kycRecord ? "Yes" : "No"} />
        </div>
      );
    }

    if (session?.user?.role === "BUYER") {
      return <ProjectProviderPage token={session.token} />;
    }

    return <ServiceProviderPage token={session.token} stats={dashboard.stats} />;
  };

  return (
    <div className="App">
      {/* Conditional Rendering: 
          It only shows the page that matches the current 'view' state 
      */}

      {view === 'auth' && (
        <MarketplaceAuth onAuthSuccess={handleAuthSuccess} />
      )}

      {view === 'kyb' && (
        <KYBPage token={session?.token} onNext={handleKYBComplete} />
      )}

      {view === 'kyc' && (
        <KYCPage
          token={session?.token}
          onComplete={handleKYCComplete}
          onBack={() => setView('kyb')}
        />
      )}

      {view === 'dashboard' && (
        <DashboardLayout
          userRole={roleLabel}
          userName={userName}
          companyName={companyName}
          kybStatus={kybStatus}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={logout}
        >
          {renderDashboardContent()}
        </DashboardLayout>
      )}
    </div>
  );
}

const ProfileRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #1E2D4A", padding: "14px 0", gap: "20px" }}>
    <span style={{ color: "#64748B", fontSize: "13px" }}>{label}</span>
    <span style={{ color: "#E2E8F0", fontSize: "13px", fontWeight: 600, textAlign: "right" }}>{value}</span>
  </div>
);

const MetricCard = ({ label, value }) => (
  <div style={{ background: "rgba(13, 22, 41, 0.4)", border: "1px solid #1E2D4A", borderRadius: "16px", padding: "22px" }}>
    <p style={{ margin: "0 0 10px", color: "#64748B", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
    <p style={{ margin: 0, color: "#F1F5F9", fontSize: "24px", fontWeight: 700 }}>{value}</p>
  </div>
);

export default App;
