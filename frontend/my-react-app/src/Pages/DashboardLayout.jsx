import React from "react";

const IconWrapper = ({ children }) => (
    <span style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</span>
);

const DashboardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);

const ProjectIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "8px",
            cursor: "pointer", transition: "all 0.2s", marginBottom: "4px", border: "none", textAlign: "left",
            background: active ? "rgba(37, 99, 235, 0.15)" : "transparent",
            color: active ? "#2563EB" : "#94A3B8", fontFamily: "inherit"
        }}
    >
        <IconWrapper><Icon /></IconWrapper>
        <span style={{ fontSize: "14px", fontWeight: active ? 600 : 500 }}>{label}</span>
    </button>
);

export default function DashboardLayout({
    children,
    userRole,
    userName,
    companyName,
    kybStatus,
    activeTab,
    onTabChange,
    onLogout
}) {
    return (
        <div style={{
            minHeight: "100vh", background: "radial-gradient(ellipse at 30% 20%, #0F1E3D 0%, #050A14 55%, #000508 100%)",
            display: "flex", color: "#E2E8F0", fontFamily: "'DM Sans', sans-serif"
        }}>
            <aside style={{
                width: "260px", borderRight: "1px solid #1E2D4A", padding: "32px 16px",
                display: "flex", flexDirection: "column", position: "fixed", height: "100vh", background: "rgba(10, 17, 35, 0.8)", backdropFilter: "blur(10px)"
            }}>
                <div style={{ padding: "0 16px", marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "10px", height: "10px", background: "#2563EB", borderRadius: "50%", boxShadow: "0 0 12px #2563EB" }} />
                        <span style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" }}>Marketplace<span style={{ color: "#2563EB" }}>.</span></span>
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    <NavItem icon={DashboardIcon} label="Dashboard" active={activeTab === "dashboard"} onClick={() => onTabChange("dashboard")} />
                    <NavItem icon={ProjectIcon} label={userRole === "Vendor" ? "Project Listings" : "My Projects"} active={activeTab === "projects"} onClick={() => onTabChange("projects")} />
                    <NavItem icon={UserIcon} label="Company Profile" active={activeTab === "profile"} onClick={() => onTabChange("profile")} />
                </nav>

                <div style={{ padding: "16px", borderTop: "1px solid #1E2D4A", marginTop: "auto" }}>
                    <p style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Logged in as</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#1E2D4A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 600, color: "#2563EB" }}>
                            {userName ? userName[0].toUpperCase() : "U"}
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>{userName}</p>
                            <p style={{ margin: 0, fontSize: "11px", color: "#475569" }}>{userRole}</p>
                        </div>
                    </div>
                    <button type="button" onClick={onLogout} style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #1E2D4A", background: "transparent", color: "#94A3B8", cursor: "pointer" }}>
                        Sign out
                    </button>
                </div>
            </aside>

            <main style={{ marginLeft: "260px", flex: 1, display: "flex", flexDirection: "column" }}>
                <header style={{
                    height: "72px", borderBottom: "1px solid #1E2D4A", display: "flex", alignItems: "center",
                    justifyContent: "space-between", padding: "0 40px", background: "rgba(5, 10, 20, 0.4)", backdropFilter: "blur(8px)"
                }}>
                    <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>{activeTab === "projects" ? "Projects" : activeTab === "profile" ? "Company Profile" : "Dashboard"}</h2>

                    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "20px",
                            background: kybStatus === "APPROVED" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                            border: kybStatus === "APPROVED" ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(245, 158, 11, 0.2)"
                        }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: kybStatus === "APPROVED" ? "#10B981" : "#F59E0B" }} />
                            <span style={{ fontSize: "11px", fontWeight: 600, color: kybStatus === "APPROVED" ? "#10B981" : "#F59E0B", textTransform: "uppercase" }}>
                                KYB {kybStatus || "PENDING"}
                            </span>
                        </div>

                        <div style={{ height: "24px", width: "1px", background: "#1E2D4A" }} />

                        <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>{companyName}</p>
                            <p style={{ margin: 0, fontSize: "11px", color: "#475569" }}>Admin Access</p>
                        </div>
                    </div>
                </header>

                <section style={{ padding: "40px", overflowY: "auto", flex: 1 }}>
                    {children}
                </section>
            </main>
        </div>
    );
}
