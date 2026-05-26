import React, { useState } from "react";
import { api } from "../api";

const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const CameraIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const SectionTitle = ({ children, icon: Icon }) => (
    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Icon /> {children}
    </h3>
);

export default function KYCPage({ token, onComplete, onBack }) {
    const [kycData, setKycData] = useState({
        designation: "",
        phone: "",
        idType: "",
        idNumber: "",
        selfieFile: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const set = (field) => (e) => {
        setKycData({ ...kycData, [field]: e.target.value });
    };

    const handleFile = (e) => {
        setKycData({ ...kycData, selfieFile: e.target.files[0] || null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Please register or sign in before submitting KYC.");
            return;
        }

        const payload = new FormData();
        payload.append("designation", kycData.designation);
        payload.append("phone", kycData.phone);
        payload.append("idType", kycData.idType);
        payload.append("idNumber", kycData.idNumber);
        if (kycData.selfieFile) {
            payload.append("selfie", kycData.selfieFile);
        }

        setLoading(true);
        try {
            await api.submitKYC(token, payload);
            onComplete();
        } catch (err) {
            setError(err.message || "Unable to submit KYC details.");
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
                    <div style={{ width: "32px", height: "4px", background: "#2563EB", borderRadius: "2px" }} />
                </div>
                <h2 style={{ color: "#F1F5F9", fontSize: "22px", fontWeight: 700, margin: 0 }}>Identity Verification (KYC)</h2>
                <p style={{ color: "#64748B", fontSize: "14px", marginTop: "4px" }}>Step 3: Verify authorized signatory</p>
            </div>

            <form onSubmit={handleSubmit}>
                <SectionTitle icon={UserIcon}>Professional Role</SectionTitle>
                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#94A3B8" }}>Current Designation *</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. CEO, Director, Procurement Head"
                        value={kycData.designation}
                        onChange={set("designation")}
                        style={{ width: "100%", padding: "11px", background: "#0D1629", border: "1.5px solid #1E2D4A", borderRadius: "8px", color: "#fff", outline: "none" }}
                    />
                </div>

                <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#94A3B8" }}>Work Phone Number *</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <div style={{ padding: "11px", background: "#080E1C", border: "1.5px solid #1E2D4A", borderRadius: "8px", color: "#475569", fontSize: "14px" }}>+91</div>
                        <input
                            type="tel"
                            required
                            placeholder="98765 43210"
                            value={kycData.phone}
                            onChange={set("phone")}
                            style={{ flex: 1, padding: "11px", background: "#0D1629", border: "1.5px solid #1E2D4A", borderRadius: "8px", color: "#fff", outline: "none" }}
                        />
                    </div>
                </div>

                <SectionTitle icon={UserIcon}>Government Identity</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#94A3B8" }}>ID Type *</label>
                        <select required value={kycData.idType} onChange={set("idType")} style={{ width: "100%", padding: "11px", background: "#0D1629", border: "1.5px solid #1E2D4A", borderRadius: "8px", color: "#E2E8F0" }}>
                            <option value="">Select ID</option>
                            <option value="aadhaar">Aadhaar Card</option>
                            <option value="pan">PAN Card</option>
                            <option value="passport">Passport</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#94A3B8" }}>ID Number *</label>
                        <input type="text" required placeholder="Enter Number" value={kycData.idNumber} onChange={set("idNumber")} style={{ width: "100%", padding: "11px", background: "#0D1629", border: "1.5px solid #1E2D4A", borderRadius: "8px", color: "#fff" }} />
                    </div>
                </div>

                <div style={{
                    background: "#080E1C", border: "1.5px dashed #1E2D4A", borderRadius: "10px",
                    padding: "20px", textAlign: "center", marginBottom: "24px"
                }}>
                    <CameraIcon />
                    <h4 style={{ color: "#E2E8F0", fontSize: "14px", margin: "12px 0 4px" }}>Selfie with ID Document</h4>
                    <p style={{ color: "#475569", fontSize: "11px", lineHeight: "1.5", marginBottom: "16px" }}>
                        Please upload a clear photo of yourself holding your selected ID card next to your face.
                    </p>
                    <input type="file" id="selfie" hidden onChange={handleFile} />
                    <button
                        type="button"
                        onClick={() => document.getElementById("selfie").click()}
                        style={{ padding: "8px 16px", background: "transparent", border: "1.5px solid #2563EB", borderRadius: "6px", color: "#2563EB", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                    >
                        {kycData.selfieFile ? "Change Photo" : "Upload Selfie"}
                    </button>
                    {kycData.selfieFile && <p style={{ color: "#10B981", fontSize: "11px", marginTop: "8px" }}>{kycData.selfieFile.name} uploaded</p>}
                </div>

                {error && <p style={{ color: "#EF4444", fontSize: "12px", margin: "0 0 12px", textAlign: "center" }}>{error}</p>}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", borderTop: "1px solid #1E2D4A", paddingTop: "20px" }}>
                    <button
                        type="button"
                        onClick={onBack}
                        style={{ padding: "14px", background: "transparent", border: "1.5px solid #1E2D4A", borderRadius: "8px", color: "#94A3B8", fontWeight: 600, cursor: "pointer" }}
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: "14px", background: loading ? "#1E3A7A" : "#2563EB", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
                    >
                        {loading ? "Submitting..." : "Complete Verification ->"}
                    </button>
                </div>
            </form>

            <p style={{ textAlign: "center", color: "#475569", fontSize: "11px", marginTop: "16px" }}>
                Your personal data is encrypted and used strictly for identity verification purposes.
            </p>
        </div>
    );
}
