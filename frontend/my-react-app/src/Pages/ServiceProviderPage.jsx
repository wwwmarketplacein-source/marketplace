import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const BriefcaseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const LockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const formatMoney = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0));

const ProjectCard = ({ project, onBid }) => (
    <div style={{
        background: "rgba(13, 22, 41, 0.4)", border: "1px solid #1E2D4A", borderRadius: "12px",
        padding: "20px", marginBottom: "16px", transition: "transform 0.2s, border-color 0.2s",
        position: "relative", overflow: "hidden"
    }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E2D4A"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div>
                <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "#F1F5F9", fontWeight: 600 }}>{project.title}</h4>
                <p style={{ margin: 0, fontSize: "12px", color: "#2563EB", fontWeight: 600, textTransform: "uppercase" }}>{project.category}</p>
            </div>
            <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#10B981" }}>INR {formatMoney(project.maxBudget)}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#475569" }}>Max Budget</p>
            </div>
        </div>

        <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: "1.5", margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {project.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748B" }}>
                <BriefcaseIcon /> <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
            </div>

            {project.ndaRequired && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#F59E0B", background: "rgba(245, 158, 11, 0.1)", padding: "4px 8px", borderRadius: "4px" }}>
                    <LockIcon /> NDA Required
                </div>
            )}
        </div>

        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(30, 45, 74, 0.5)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {(project.skills || []).map(skill => (
                    <span key={skill} style={{ fontSize: "10px", background: "#0D1629", color: "#94A3B8", padding: "3px 8px", borderRadius: "12px", border: "1px solid #1E2D4A" }}>
                        {skill}
                    </span>
                ))}
            </div>
            <button type="button" onClick={() => onBid(project)} style={{ background: "#2563EB", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                Submit Bid
            </button>
        </div>
    </div>
);

export default function ServiceProviderPage({ token, stats }) {
    const [projects, setProjects] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let active = true;

        api.listProjects(token)
            .then((data) => {
                if (active) setProjects(data.projects || []);
            })
            .catch((err) => setMessage(err.message || "Unable to load projects."))
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [token]);

    const visibleProjects = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        if (!normalized) return projects;

        return projects.filter((project) => {
            return [project.title, project.category, project.description, ...(project.skills || [])]
                .join(" ")
                .toLowerCase()
                .includes(normalized);
        });
    }, [projects, query]);

    const handleBid = async (project) => {
        const amount = Math.max(Number(project.minBudget || 0), Math.round(Number(project.maxBudget || 0) * 0.9));
        try {
            await api.submitBid(token, project.id, {
                amount,
                proposal: `We can deliver ${project.title} with a verified specialist team.`
            });
            setMessage("Bid submitted successfully.");
        } catch (err) {
            setMessage(err.message || "Unable to submit bid.");
        }
    };

    return (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", gap: "20px" }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#F1F5F9", margin: "0 0 8px" }}>Project Marketplace</h1>
                    <p style={{ color: "#94A3B8", fontSize: "14px", margin: 0 }}>Discover high-ticket B2B opportunities verified by Marketplace.</p>
                </div>

                <div style={{ position: "relative", width: "300px" }}>
                    <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}><SearchIcon /></div>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px 10px 40px", background: "rgba(13, 22, 41, 0.4)", border: "1.5px solid #1E2D4A", borderRadius: "8px", color: "#fff", outline: "none" }}
                    />
                </div>
            </div>

            {message && <p style={{ color: message.includes("success") ? "#10B981" : "#EF4444", fontSize: "13px" }}>{message}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
                <div>
                    {loading && <p style={{ color: "#94A3B8" }}>Loading projects...</p>}
                    {!loading && visibleProjects.length === 0 && <p style={{ color: "#94A3B8" }}>No matching projects yet.</p>}
                    {visibleProjects.map(p => <ProjectCard key={p.id} project={p} onBid={handleBid} />)}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", borderRadius: "16px", padding: "20px", color: "#fff" }}>
                        <h5 style={{ margin: "0 0 4px", fontSize: "12px", textTransform: "uppercase", opacity: 0.8 }}>Marketplace Standing</h5>
                        <p style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: 700 }}>KYB Verified</p>
                        <div style={{ height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", marginBottom: "8px" }}>
                            <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: "2px" }} />
                        </div>
                        <p style={{ margin: 0, fontSize: "11px" }}>Your company is eligible for all high-ticket bids.</p>
                    </div>

                    <div style={{ background: "rgba(13, 22, 41, 0.4)", border: "1px solid #1E2D4A", borderRadius: "16px", padding: "20px" }}>
                        <h5 style={{ margin: "0 0 16px", fontSize: "13px", color: "#F1F5F9", fontWeight: 600 }}>Active Statistics</h5>
                        <StatRow label="Active Bids" value={stats?.activeBids || 0} />
                        <StatRow label="Profile Views" value={stats?.profileViews || 0} />
                        <StatRow label="Saved Projects" value={stats?.savedProjects || 0} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatRow = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "12px" }}>
        <span style={{ color: "#94A3B8" }}>{label}</span>
        <span style={{ color: "#F1F5F9", fontWeight: 600 }}>{value}</span>
    </div>
);
