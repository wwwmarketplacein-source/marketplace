// C:\Users\Devika S\Downloads\vantor_market_place\vantor_market_place\frontend\my-react-app\src\Pages\Registration&Login.jsx
import { useState, useEffect } from "react";
import { api } from "../api";

const COUNTRIES = [
  "Australia", "Belgium", "Brazil", "Canada", "China", "Denmark",
  "France", "Germany", "India", "Ireland", "Italy", "Japan",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Poland",
  "Singapore", "South Africa", "South Korea", "Spain", "Sweden",
  "Switzerland", "United Arab Emirates", "United Kingdom", "United States",
];

const INDUSTRIES = [
  "Technology", "Finance & Banking", "Healthcare", "Manufacturing",
  "Logistics & Supply Chain", "Retail & E-commerce", "Energy & Utilities",
  "Construction & Real Estate", "Media & Entertainment", "Education",
  "Professional Services", "Other",
];

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Logo({ size = "md" }) {
  const sz = size === "lg" ? { text: "22px", dot: "8px" } : { text: "18px", dot: "6px" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
      <div style={{
        width: sz.dot, height: sz.dot,
        background: "#2563EB",
        borderRadius: "50%",
        boxShadow: "0 0 10px rgba(37,99,235,0.6)",
      }} />
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: sz.text,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "-0.3px",
      }}>
        Marketplace<span style={{ color: "#2563EB" }}>.com</span>
      </span>
    </div>
  );
}

function Input({ label, id, type = "text", placeholder, value, onChange, error, hint, required, suffix }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor={id} style={{
        display: "block", marginBottom: "6px",
        fontSize: "13px", fontWeight: 500,
        color: "#94A3B8", letterSpacing: "0.02em",
      }}>
        {label}{required && <span style={{ color: "#2563EB", marginLeft: "2px" }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "#0D1629",
            border: error ? "1.5px solid #EF4444" : "1.5px solid #1E2D4A",
            borderRadius: "8px",
            padding: suffix ? "11px 44px 11px 14px" : "11px 14px",
            fontSize: "14px",
            color: "#E2E8F0",
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            fontFamily: "inherit",
          }}
          onFocus={e => {
            e.target.style.borderColor = "#2563EB";
            e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? "#EF4444" : "#1E2D4A";
            e.target.style.boxShadow = "none";
          }}
        />
        {suffix && (
          <div style={{
            position: "absolute", right: "12px", top: "50%",
            transform: "translateY(-50%)", color: "#475569", cursor: "pointer",
          }}>
            {suffix}
          </div>
        )}
      </div>
      {error && <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#EF4444" }}>{error}</p>}
      {hint && !error && <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#475569" }}>{hint}</p>}
    </div>
  );
}

function Select({ label, id, value, onChange, options, placeholder, required, error }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor={id} style={{
        display: "block", marginBottom: "6px",
        fontSize: "13px", fontWeight: 500, color: "#94A3B8",
      }}>
        {label}{required && <span style={{ color: "#2563EB", marginLeft: "2px" }}>*</span>}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        style={{
          width: "100%", boxSizing: "border-box",
          background: "#0D1629",
          border: error ? "1.5px solid #EF4444" : "1.5px solid #1E2D4A",
          borderRadius: "8px",
          padding: "11px 14px",
          fontSize: "14px",
          color: value ? "#E2E8F0" : "#475569",
          outline: "none",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
        onFocus={e => {
          e.target.style.borderColor = "#2563EB";
          e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? "#EF4444" : "#1E2D4A";
          e.target.style.boxShadow = "none";
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#EF4444" }}>{error}</p>}
    </div>
  );
}

function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div style={{ marginTop: "8px", marginBottom: "16px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: "3px", borderRadius: "2px",
            background: i < score ? colors[score - 1] : "#1E2D4A",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: c.ok ? "#10B981" : "#475569" }}>
            <span style={{ opacity: c.ok ? 1 : 0.4 }}><CheckIcon /></span>
            {c.label}
          </div>
        ))}
      </div>
      {score > 0 && (
        <p style={{ fontSize: "12px", color: colors[score - 1], marginTop: "4px", fontWeight: 500 }}>
          {labels[score - 1]} password
        </p>
      )}
    </div>
  );
}

function PrimaryButton({ children, onClick, loading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: "100%", padding: "13px",
        background: disabled || loading ? "#1E3A7A" : "#2563EB",
        color: "#fff", border: "none",
        borderRadius: "8px", fontSize: "14px",
        fontWeight: 600, cursor: disabled || loading ? "not-allowed" : "pointer",
        letterSpacing: "0.01em",
        transition: "background 0.15s, transform 0.1s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        fontFamily: "inherit",
      }}
      onMouseEnter={e => { if (!disabled && !loading) e.target.style.background = "#1D4ED8"; }}
      onMouseLeave={e => { if (!disabled && !loading) e.target.style.background = "#2563EB"; }}
      onMouseDown={e => { if (!disabled && !loading) e.target.style.transform = "scale(0.99)"; }}
      onMouseUp={e => { e.target.style.transform = "scale(1)"; }}
    >
      {loading && (
        <div style={{
          width: "16px", height: "16px",
          border: "2px solid rgba(255,255,255,0.3)",
          borderTopColor: "#fff",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
      )}
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", padding: "13px",
        background: "transparent",
        color: "#94A3B8",
        border: "1.5px solid #1E2D4A",
        borderRadius: "8px", fontSize: "14px",
        fontWeight: 500, cursor: "pointer",
        transition: "border-color 0.15s, color 0.15s",
        fontFamily: "inherit",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.color = "#E2E8F0"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E2D4A"; e.currentTarget.style.color = "#94A3B8"; }}
    >
      {children}
    </button>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "28px" }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: i < current ? "24px" : "28px",
            height: i < current ? "24px" : "28px",
            borderRadius: "50%",
            background: i + 1 === current ? "#2563EB" : i + 1 < current ? "#1D4ED8" : "#0D1629",
            border: i + 1 === current ? "2px solid #2563EB" : i + 1 < current ? "2px solid #1D4ED8" : "1.5px solid #1E2D4A",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 600,
            color: i + 1 <= current ? "#fff" : "#475569",
            transition: "all 0.3s",
            flexShrink: 0,
          }}>
            {i + 1 < current ? <CheckIcon /> : i + 1}
          </div>
          {i < total - 1 && (
            <div style={{
              width: "40px", height: "1.5px",
              background: i + 1 < current ? "#2563EB" : "#1E2D4A",
              transition: "background 0.3s",
            }} />
          )}
        </div>
      ))}
      <span style={{ marginLeft: "12px", fontSize: "12px", color: "#475569", fontWeight: 500 }}>
        Step {current} of {total}
      </span>
    </div>
  );
}

function LoginPage({ onNavigate, onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setError("");
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      onAuthSuccess({
        token: data.token,
        user: data.user,
      }, "login");
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <Logo size="lg" />
        <h1 style={{ margin: "20px 0 6px", fontSize: "22px", fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.3px" }}>
          Welcome back
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "#475569" }}>
          Sign in to your workspace
        </p>
      </div>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "8px", padding: "12px 14px", marginBottom: "20px",
          display: "flex", alignItems: "flex-start", gap: "10px",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ margin: 0, fontSize: "13px", color: "#FCA5A5", lineHeight: "1.5" }}>{error}</p>
        </div>
      )}

      <div style={{ position: "relative" }}>
        <Input
          label="Work email" id="email" type="email"
          placeholder="you@company.com"
          value={email} onChange={e => setEmail(e.target.value)}
          error={fieldErrors.email} required
        />
      </div>

      <Input
        label="Password" id="password"
        type={showPass ? "text" : "password"}
        placeholder="Enter your password"
        value={password} onChange={e => setPassword(e.target.value)}
        error={fieldErrors.password} required
        suffix={
          <span onClick={() => setShowPass(v => !v)} style={{ color: "#64748B" }}>
            <EyeIcon open={showPass} />
          </span>
        }
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", marginTop: "-4px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <div
            onClick={() => setRemember(v => !v)}
            style={{
              width: "16px", height: "16px", borderRadius: "4px",
              border: remember ? "none" : "1.5px solid #1E2D4A",
              background: remember ? "#2563EB" : "#0D1629",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {remember && <CheckIcon />}
          </div>
          <span style={{ fontSize: "13px", color: "#64748B" }}>Remember me</span>
        </label>
        <button style={{
          background: "none", border: "none", padding: 0,
          fontSize: "13px", color: "#2563EB", cursor: "pointer", fontFamily: "inherit",
        }}>Forgot password?</button>
      </div>

      <PrimaryButton onClick={handleSubmit} loading={loading}>
        {!loading && "Sign In"}
        {loading && "Signing in…"}
      </PrimaryButton>

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "#1E2D4A" }} />
          <span style={{ fontSize: "12px", color: "#334155" }}>NEW TO MARKETPLACE</span>
          <div style={{ flex: 1, height: "1px", background: "#1E2D4A" }} />
        </div>
        <button
          onClick={() => onNavigate("register")}
          style={{
            width: "100%", padding: "12px",
            background: "transparent",
            border: "1.5px solid #1E2D4A",
            borderRadius: "8px",
            color: "#94A3B8", fontSize: "13px",
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.color = "#E2E8F0"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E2D4A"; e.currentTarget.style.color = "#94A3B8"; }}
        >
          Register your company →
        </button>
      </div>
    </div>
  );
}

function RegisterPage({ onNavigate, onAuthSuccess }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    companyName: "", tradingName: "", regNumber: "", companyType: "",
    industry: "", country: "", website: "", confirmed: false,
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email) e.email = "Work email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = "Legal company name is required";
    if (!form.regNumber.trim()) e.regNumber = "Registration number is required";
    if (!form.companyType) e.companyType = "Please select a company type";
    if (!form.industry) e.industry = "Please select an industry";
    if (!form.country) e.country = "Please select a country";
    return e;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.confirmed) e.confirmed = "You must confirm the information is accurate";
    return e;
  };

  const nextStep = () => {
    const errs = step === 1 ? validateStep1() : validateStep2();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const submit = async () => {
    const errs = validateStep3();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const role = form.companyType === "Buyers" ? "BUYER" : "VENDOR";
      const data = await api.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        companyName: form.companyName,
        tradingName: form.tradingName,
        registrationNumber: form.regNumber,
        businessType: form.companyType,
        industry: form.industry,
        country: form.country,
        websiteUrl: form.website,
        role,
      });

      setSubmitted(true);
      onAuthSuccess({
        token: data.token,
        user: data.user,
      }, "register");
    } catch (err) {
      setErrors({
        submit: err.message || "Unable to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0", animation: "fadeIn 0.5s ease" }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "rgba(16,185,129,0.1)", border: "2px solid #10B981",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ color: "#F1F5F9", fontSize: "22px", fontWeight: 700, margin: "0 0 10px" }}>Application Submitted</h2>
        <p style={{ color: "#64748B", fontSize: "14px", lineHeight: "1.6", margin: "0 0 24px" }}>
          Thank you, {form.firstName}. Your company registration is under review.<br />
          Verification typically takes 1–2 business days.
        </p>
        <div style={{
          background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)",
          borderRadius: "8px", padding: "14px 16px", marginBottom: "24px", textAlign: "left",
        }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#93C5FD", lineHeight: "1.6" }}>
            We'll send a confirmation to <strong style={{ color: "#BFDBFE" }}>{form.email}</strong> once your account is verified and marketplace access is granted.
          </p>
        </div>
        <button
          onClick={() => onNavigate("login")}
          style={{
            background: "none", border: "none", color: "#2563EB",
            fontSize: "14px", cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
          }}
        >
          ← Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <Logo />
        <h1 style={{ margin: "16px 0 4px", fontSize: "20px", fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.3px" }}>
          Register your company
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: "#475569" }}>
          Enterprise access starts here
        </p>
      </div>

      <StepIndicator current={step} total={3} />

      {step === 1 && (
        <div style={{ animation: "slideIn 0.3s ease" }}>
          <p style={{ fontSize: "12px", color: "#2563EB", fontWeight: 600, letterSpacing: "0.08em", marginBottom: "16px", textTransform: "uppercase" }}>
            Account Details
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            <Input label="First name" id="firstName" placeholder="John" value={form.firstName} onChange={set("firstName")} error={errors.firstName} required />
            <Input label="Last name" id="lastName" placeholder="Smith" value={form.lastName} onChange={set("lastName")} error={errors.lastName} required />
          </div>
          <Input label="Work email" id="email" type="email" placeholder="john@company.com" value={form.email} onChange={set("email")} error={errors.email} required />
          <Input
            label="Password" id="password"
            type={showPass ? "text" : "password"}
            placeholder="Create a strong password"
            value={form.password} onChange={set("password")}
            error={errors.password} required
            suffix={<span onClick={() => setShowPass(v => !v)}><EyeIcon open={showPass} /></span>}
          />
          <PasswordStrength password={form.password} />
          <Input
            label="Confirm password" id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password"
            value={form.confirmPassword} onChange={set("confirmPassword")}
            error={errors.confirmPassword} required
            suffix={<span onClick={() => setShowConfirm(v => !v)}><EyeIcon open={showConfirm} /></span>}
          />
          <div style={{ marginTop: "8px" }}>
            <PrimaryButton onClick={nextStep}>Continue →</PrimaryButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ animation: "slideIn 0.3s ease" }}>
          <p style={{ fontSize: "12px", color: "#2563EB", fontWeight: 600, letterSpacing: "0.08em", marginBottom: "16px", textTransform: "uppercase" }}>
            Company Information
          </p>
          <Input label="Legal company name" id="companyName" placeholder="Acme Holdings Ltd." value={form.companyName} onChange={set("companyName")} error={errors.companyName} required />
          <Input label="Trading name" id="tradingName" placeholder="Acme (if different)" value={form.tradingName} onChange={set("tradingName")} hint="Optional — leave blank if same as legal name" />
          <Input label="Company registration number" id="regNumber" placeholder="e.g. 12345678" value={form.regNumber} onChange={set("regNumber")} error={errors.regNumber} required />

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 500, color: "#94A3B8" }}>
              Company type<span style={{ color: "#2563EB", marginLeft: "2px" }}>*</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {["Vendors", "Buyers", "Both"].map(t => (
                <div
                  key={t}
                  onClick={() => setForm(f => ({ ...f, companyType: t }))}
                  style={{
                    padding: "10px 8px", borderRadius: "8px", textAlign: "center",
                    border: form.companyType === t ? "1.5px solid #2563EB" : "1.5px solid #1E2D4A",
                    background: form.companyType === t ? "rgba(37,99,235,0.1)" : "#0D1629",
                    color: form.companyType === t ? "#93C5FD" : "#64748B",
                    fontSize: "13px", fontWeight: 500, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
            {errors.companyType && <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#EF4444" }}>{errors.companyType}</p>}
          </div>

          <Select label="Industry" id="industry" value={form.industry} onChange={set("industry")} options={INDUSTRIES} placeholder="Select industry" required error={errors.industry} />
          <Select label="Country" id="country" value={form.country} onChange={set("country")} options={COUNTRIES} placeholder="Select country" required error={errors.country} />
          <Input label="Website URL" id="website" type="url" placeholder="https://company.com" value={form.website} onChange={set("website")} hint="Optional" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "8px" }}>
            <SecondaryButton onClick={() => setStep(1)}>← Back</SecondaryButton>
            <PrimaryButton onClick={nextStep}>Continue →</PrimaryButton>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ animation: "slideIn 0.3s ease" }}>
          <p style={{ fontSize: "12px", color: "#2563EB", fontWeight: 600, letterSpacing: "0.08em", marginBottom: "16px", textTransform: "uppercase" }}>
            Review & Submit
          </p>

          <div style={{ background: "#080E1C", border: "1px solid #1E2D4A", borderRadius: "10px", padding: "18px", marginBottom: "16px" }}>
            <SectionHeader>Contact</SectionHeader>
            <ReviewRow label="Name" value={`${form.firstName} ${form.lastName}`} />
            <ReviewRow label="Email" value={form.email} />

            <SectionHeader style={{ marginTop: "14px" }}>Company</SectionHeader>
            <ReviewRow label="Legal Name" value={form.companyName} />
            {form.tradingName && <ReviewRow label="Trading Name" value={form.tradingName} />}
            <ReviewRow label="Reg. Number" value={form.regNumber} />
            <ReviewRow label="Type" value={form.companyType} />
            <ReviewRow label="Industry" value={form.industry} />
            <ReviewRow label="Country" value={form.country} />
            {form.website && <ReviewRow label="Website" value={form.website} />}
          </div>

          <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginBottom: "8px" }}>
            <div
              onClick={() => setForm(f => ({ ...f, confirmed: !f.confirmed }))}
              style={{
                width: "16px", height: "16px", borderRadius: "4px",
                border: form.confirmed ? "none" : "1.5px solid #1E2D4A",
                background: form.confirmed ? "#2563EB" : "#0D1629",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, cursor: "pointer", marginTop: "1px",
              }}
            >
              {form.confirmed && <CheckIcon />}
            </div>
            <span style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.6" }}>
              I confirm all information is accurate and I am authorised to register this company on behalf of my organisation.
            </span>
          </label>
          {errors.confirmed && <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#EF4444" }}>{errors.confirmed}</p>}
          {errors.submit && <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#EF4444" }}>{errors.submit}</p>}

          <div style={{
            background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)",
            borderRadius: "8px", padding: "12px 14px", marginBottom: "20px", marginTop: "12px",
          }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748B", lineHeight: "1.6" }}>
              <span style={{ color: "#93C5FD", fontWeight: 600 }}>KYB Verification:</span>{" "}
              After registration, your account will undergo Know Your Business verification before marketplace access is granted. This typically takes 1–2 business days.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <SecondaryButton onClick={() => setStep(2)}>← Back</SecondaryButton>
            <PrimaryButton onClick={submit} loading={loading}>
              {!loading && "Create Account"}
              {loading && "Submitting…"}
            </PrimaryButton>
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => onNavigate("login")}
          style={{ background: "none", border: "none", color: "#475569", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}
        >
          Already have an account?{" "}
          <span style={{ color: "#2563EB", fontWeight: 500 }}>Sign in</span>
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#2563EB", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
      {children}
    </p>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px", gap: "12px" }}>
      <span style={{ fontSize: "12px", color: "#475569", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: "13px", color: "#CBD5E1", textAlign: "right", wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}

export default function MarketplaceAuth({ onAuthSuccess }) {
  const [page, setPage] = useState("login");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        input::placeholder { color: #2D3E57; }
        select option { background: #0D1629; color: #E2E8F0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E2D4A; border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 30% 20%, #0F1E3D 0%, #050A14 55%, #000508 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "8%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "5%",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div style={{
          width: "100%", maxWidth: page === "register" ? "480px" : "420px",
          background: "rgba(10,17,35,0.95)",
          border: "1px solid #1A2540",
          borderRadius: "14px",
          padding: "36px 36px 32px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(37,99,235,0.05)",
          transition: "max-width 0.3s ease",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "60%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.4), transparent)",
          }} />

          {page === "login" && <LoginPage onNavigate={setPage} onAuthSuccess={onAuthSuccess} />}
          {page === "register" && <RegisterPage onNavigate={setPage} onAuthSuccess={onAuthSuccess} />}
        </div>

        <div style={{
          position: "absolute", bottom: "20px",
          fontSize: "11px", color: "#1E2D4A",
          letterSpacing: "0.02em",
        }}>
          © 2026 Marketplace.com · Privacy · Terms
        </div>
      </div>
    </>
  );
}
