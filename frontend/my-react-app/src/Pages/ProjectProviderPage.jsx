import React, { useEffect, useState } from "react";
import { api } from "../api";

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const ShieldCheck = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 11 11 13 15 9" />
    </svg>
);

const emptyForm = {
    title: "",
    category: "",
    description: "",
    requirements: "",
    minBudget: "",
    maxBudget: "",
    deadline: "",
    ndaRequired: false
};

export default function ProjectProviderPage({ token }) {
    const [form, setForm] = useState(emptyForm);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const loadProjects = () => {
        api.listProjects(token, true)
            .then((data) => setProjects(data.projects || []))
            .catch(() => setProjects([]));
    };

    useEffect(() => {
        loadProjects();
    }, [token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await api.createProject(token, {
                ...form,
                skills: form.requirements,
            });
            setForm(emptyForm);
            setMessage("Project published successfully.");
            loadProjects();
        } catch (err) {
            setMessage(err.message || "Unable to publish project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: "32px", alignItems: "start" }}>
            <div style={{ maxWidth: "800px", animation: "fadeIn 0.5s ease" }}>
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#F1F5F9", margin: "0 0 8px" }}>Create New Project</h1>
                    <p style={{ color: "#94A3B8", fontSize: "14px" }}>Define your project requirements and budget to attract top-tier vendors.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ background: "rgba(13, 22, 41, 0.4)", border: "1px solid #1E2D4A", borderRadius: "16px", padding: "32px", backdropFilter: "blur(12px)" }}>
                    <div style={{ marginBottom: "32px" }}>
                        <h3 style={{ fontSize: "12px", color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <EditIcon /> 01. General Information
                        </h3>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94A3B8" }}>Project Title *</label>
                            <input name="title" type="text" required value={form.title} onChange={handleChange} placeholder="e.g. Enterprise Cybersecurity Audit 2026" style={inputStyle} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div>
                                <label style={labelStyle}>Category *</label>
                                <select name="category" required value={form.category} onChange={handleChange} style={inputStyle}>
                                    <option value="">Select Category</option>
                                    <option value="Cybersecurity">Cybersecurity</option>
                                    <option value="Software Development">Software Development</option>
                                    <option value="Industrial IoT">Industrial IoT</option>
                                    <option value="Cloud Services">Cloud Services</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Target Deadline *</label>
                                <input name="deadline" type="date" required value={form.deadline} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: "32px" }}>
                        <h3 style={sectionStyle}>
                            <EditIcon /> 02. Scope & Budget (INR)
                        </h3>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={labelStyle}>Detailed Description *</label>
                            <textarea name="description" rows="4" required value={form.description} onChange={handleChange} placeholder="Describe the project goals and delivery expectations..." style={{ ...inputStyle, resize: "none" }} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div>
                                <label style={labelStyle}>Minimum Budget *</label>
                                <input name="minBudget" type="number" required value={form.minBudget} onChange={handleChange} placeholder="500000" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Maximum Budget *</label>
                                <input name="maxBudget" type="number" required value={form.maxBudget} onChange={handleChange} placeholder="1500000" style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: "40px" }}>
                        <h3 style={sectionStyle}>
                            <EditIcon /> 03. Compliance & Files
                        </h3>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={labelStyle}>Technical Requirements</label>
                            <input name="requirements" type="text" value={form.requirements} onChange={handleChange} placeholder="e.g. ISO 27001, Python, AWS" style={inputStyle} />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "rgba(37, 99, 235, 0.05)", border: "1px solid rgba(37, 99, 235, 0.2)", borderRadius: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <ShieldCheck />
                                <div>
                                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#E2E8F0" }}>Require NDA Signature</p>
                                    <p style={{ margin: 0, fontSize: "11px", color: "#475569" }}>Vendors must sign an NDA before viewing details.</p>
                                </div>
                            </div>
                            <input name="ndaRequired" type="checkbox" checked={form.ndaRequired} onChange={handleChange} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                        </div>
                    </div>

                    {message && <p style={{ color: message.includes("success") ? "#10B981" : "#EF4444", fontSize: "13px" }}>{message}</p>}

                    <div style={{ display: "flex", gap: "16px" }}>
                        <button type="submit" disabled={loading} style={{ flex: 1, padding: "14px", background: loading ? "#1E3A7A" : "#2563EB", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
                            {loading ? "Publishing..." : "Publish Project Listing"}
                        </button>
                        <button type="button" onClick={() => setForm(emptyForm)} style={{ padding: "14px 24px", background: "transparent", border: "1.5px solid #1E2D4A", color: "#94A3B8", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                            Clear
                        </button>
                    </div>
                </form>
            </div>

            <aside style={{ background: "rgba(13, 22, 41, 0.4)", border: "1px solid #1E2D4A", borderRadius: "16px", padding: "20px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#F1F5F9", fontSize: "15px" }}>My Projects</h3>
                {projects.length === 0 && <p style={{ color: "#64748B", fontSize: "13px" }}>No projects published yet.</p>}
                {projects.map((project) => (
                    <div key={project.id} style={{ padding: "12px 0", borderTop: "1px solid #1E2D4A" }}>
                        <p style={{ margin: "0 0 4px", color: "#E2E8F0", fontSize: "13px", fontWeight: 600 }}>{project.title}</p>
                        <p style={{ margin: 0, color: "#64748B", fontSize: "11px" }}>{project.bids?.length || 0} bids received</p>
                    </div>
                ))}
            </aside>
        </div>
    );
}

const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    color: "#94A3B8"
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    background: "#080E1C",
    border: "1.5px solid #1E2D4A",
    borderRadius: "8px",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box"
};

const sectionStyle = {
    fontSize: "12px",
    color: "#2563EB",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
};
