import React, { useState } from "react";
import { api } from "../api";

const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const UploadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const SectionTitle = ({ children }) => (
    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <ShieldIcon /> {children}
    </h3>
);

const FileUploadSlot = ({ label, description, id, onFileChange, file }) => (
    <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500, color: "#94A3B8" }}>{label}</label>
        <div style={{
            border: "1.5px dashed #1E2D4A", borderRadius: "10px", padding: "16px",
            textAlign: "center", background: "#080E1C", cursor: "pointer", transition: "all 0.2s"
        }} onClick={() => document.getElementById(id).click()}>
            <input type="file" id={id} hidden onChange={onFileChange} />
            <UploadIcon />
            <p style={{ margin: "8px 0 2px", fontSize: "13px", color: file ? "#10B981" : "#E2E8F0" }}>
                {file?.name || "Click to upload or drag & drop"}
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: "#475569" }}>{description}</p>
        </div>
    </div>
);

export default function KYBPage({ token, onNext }) {
    const [formData, setFormData] = useState({
        address: "",
        city: "",
        postalCode: "",
        turnover: "",
        incorpDoc: null,
        taxDoc: null,
        bankDoc: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFile = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.files[0] || null });
    };

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Please register or sign in before submitting KYB.");
            return;
        }

        const payload = new FormData();
        payload.append("addressLine1", formData.address);
        payload.append("city", formData.city);
        payload.append("postalCode", formData.postalCode);
        payload.append("turnoverTier", formData.turnover);

        [formData.incorpDoc, formData.taxDoc, formData.bankDoc]
            .filter(Boolean)
            .forEach((file) => payload.append("documents", file));

        setLoading(true);
        try {
            await api.submitKYB(token, payload);
            onNext();
        } catch (err) {
            setError(err.message || "Unable to submit KYB details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
                    <div style={{ width: "32px", height: "4px", background: "#2563EB", borderRadius: "2px" }} />
                    <div style={{ width: "32px", height: "4px", background: "#2563EB", borderRadius: "2px" }} />
                    <div style={{ width: "32px", height: "4px", background: "#1E2D4A", borderRadius: "2px" }} />
                </div>
                <h2 style={{ color: "#F1F5F9", fontSize: "22px", fontWeight: 700, margin: 0 }}>Know Your Business (KYB)</h2>
                <p style={{ color: "#64748B", fontSize: "14px", marginTop: "4px" }}>Step 2: Verify legal entity details</p>
            </div>

            <div style={{
                background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)",
                borderRadius: "8px", padding: "12px", marginBottom: "24px"
            }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#93C5FD", lineHeight: "1.5" }}>
                    <strong>Note:</strong> Verification is a manual process. Our compliance team will review these documents within 24-48 hours.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <SectionTitle>Office Information</SectionTitle>
                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#94A3B8" }}>Address Line 1 (HQ) *</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. 123 Tech Park, Whitefield"
                        value={formData.address}
                        onChange={handleChange("address")}
                        style={{ width: "100%", padding: "11px", background: "#0D1629", border: "1.5px solid #1E2D4A", borderRadius: "8px", color: "#fff", outline: "none" }}
                    />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#94A3B8" }}>City *</label>
                        <input type="text" required placeholder="Bengaluru" value={formData.city} onChange={handleChange("city")} style={{ width: "100%", padding: "11px", background: "#0D1629", border: "1.5px solid #1E2D4A", borderRadius: "8px", color: "#fff" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#94A3B8" }}>Postal Code *</label>
                        <input type="text" required placeholder="560066" value={formData.postalCode} onChange={handleChange("postalCode")} style={{ width: "100%", padding: "11px", background: "#0D1629", border: "1.5px solid #1E2D4A", borderRadius: "8px", color: "#fff" }} />
                    </div>
                </div>

                <SectionTitle>Business Scale</SectionTitle>
                <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#94A3B8" }}>Annual Turnover Tier *</label>
                    <select required value={formData.turnover} onChange={handleChange("turnover")} style={{ width: "100%", padding: "11px", background: "#0D1629", border: "1.5px solid #1E2D4A", borderRadius: "8px", color: "#E2E8F0", cursor: "pointer" }}>
                        <option value="">Select Turnover Range</option>
                        <option value="micro">Under INR 10 Lakhs</option>
                        <option value="small">INR 10 Lakhs - INR 50 Lakhs</option>
                        <option value="medium">INR 50 Lakhs - INR 5 Crores</option>
                        <option value="large">Above INR 5 Crores</option>
                    </select>
                </div>

                <SectionTitle>Document Vault</SectionTitle>
                <FileUploadSlot
                    id="incorp" label="Certificate of Incorporation *"
                    description="PDF format (Max 5MB)" file={formData.incorpDoc}
                    onFileChange={handleFile("incorpDoc")}
                />
                <FileUploadSlot
                    id="tax" label="GST/Tax Certificate *"
                    description="Verify your business tax ID" file={formData.taxDoc}
                    onFileChange={handleFile("taxDoc")}
                />
                <FileUploadSlot
                    id="bank" label="Cancelled Cheque / Bank Statement *"
                    description="For escrow and payment verification" file={formData.bankDoc}
                    onFileChange={handleFile("bankDoc")}
                />

                <div style={{ textAlign: "center", padding: "16px 0", borderTop: "1px solid #1E2D4A", marginTop: "12px" }}>
                    {error && <p style={{ color: "#EF4444", fontSize: "12px", margin: "0 0 12px" }}>{error}</p>}
                    <p style={{ fontSize: "11px", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <ShieldIcon /> AES-256 Encrypted Infrastructure
                    </p>
                    <button type="submit" disabled={loading} style={{
                        width: "100%", padding: "14px", background: loading ? "#1E3A7A" : "#2563EB", color: "#fff",
                        border: "none", borderRadius: "8px", fontWeight: 600, marginTop: "16px", cursor: loading ? "not-allowed" : "pointer"
                    }}>
                        {loading ? "Saving..." : "Save & Continue to KYC ->"}
                    </button>
                </div>
            </form>
        </div>
    );
}
