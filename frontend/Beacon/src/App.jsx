import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css');

  * { box-sizing: border-box; }

  body, html, #root {
    height: 100%;
    margin: 0;
    font-family: 'DM Sans', sans-serif;
  }

  .auth-wrapper {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* LEFT PANEL */
  .left-panel {
    width: 50%;
    background: #0a0a0a;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 64px 72px;
    position: relative;
    overflow: hidden;
  }

  .left-panel::before {
    content: '';
    position: absolute;
    top: -120px;
    left: -120px;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(255,75,75,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .left-panel::after {
    content: '';
    position: absolute;
    bottom: -80px;
    right: -80px;
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, rgba(255,75,75,0.10) 0%, transparent 70%);
    pointer-events: none;
  }

  .brand {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.6rem;
    color: #fff;
    letter-spacing: -0.5px;
    margin-bottom: 56px;
  }

  .brand span {
    color: #ff4b4b;
  }
 
  .form-heading {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2.6rem;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -1px;
    margin-bottom: 8px;
  }

  .form-subheading {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.45);
    margin-bottom: 40px;
    font-weight: 300;
  }

  .toggle-row {
    display: flex;
    gap: 0;
    margin-bottom: 36px;
    background: #1a1a1a;
    border-radius: 10px;
    padding: 4px;
    width: 100%;
  }

  .toggle-btn {
    flex: 1;
    padding: 10px 0;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.4);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .toggle-btn.active {
    background: #ff4b4b;
    color: #fff;
  }

  .field-label-custom {
    font-size: 0.78rem;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
    display: block;
  }

  .input-dark {
    background: #141414 !important;
    border: 1.5px solid #2a2a2a !important;
    color: #fff !important;
    border-radius: 10px !important;
    padding: 14px 16px !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.95rem !important;
    width: 100%;
    transition: border-color 0.2s ease !important;
    outline: none;
  }

  .input-dark::placeholder {
    color: rgba(255,255,255,0.2) !important;
  }

  .input-dark:focus {
    border-color: #ff4b4b !important;
    box-shadow: 0 0 0 3px rgba(255,75,75,0.12) !important;
  }

  .submit-btn {
    width: 100%;
    padding: 14px;
    background: #ff4b4b;
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 8px;
    letter-spacing: 0.02em;
    transition: background 0.2s ease, transform 0.1s ease;
  }

  .submit-btn:hover {
    background: #e03c3c;
    transform: translateY(-1px);
  }

  .submit-btn:active {
    transform: translateY(0);
  }

  .divider-text {
    text-align: center;
    color: rgba(255,255,255,0.2);
    font-size: 0.8rem;
    margin: 20px 0;
    position: relative;
  }

  .divider-text::before,
  .divider-text::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: rgba(255,255,255,0.08);
  }

  .divider-text::before { left: 0; }
  .divider-text::after { right: 0; }

  .oauth-btn {
    width: 100%;
    padding: 12px;
    background: #1a1a1a;
    border: 1.5px solid #2a2a2a;
    border-radius: 10px;
    color: rgba(255,255,255,0.7);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: border-color 0.2s, background 0.2s;
  }

  .oauth-btn:hover {
    border-color: #444;
    background: #222;
  }

  .forgot-link {
    text-align: right;
    margin-top: -4px;
    margin-bottom: 20px;
  }

  .forgot-link a {
    font-size: 0.82rem;
    color: #ff4b4b;
    text-decoration: none;
    font-weight: 500;
  }

  /* RIGHT PANEL */
  .right-panel {
    width: 50%;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 64px;
    position: relative;
    overflow: hidden;
  }

  .right-panel::before {
    content: '';
    position: absolute;
    top: 10%;
    right: -60px;
    width: 320px;
    height: 320px;
    border: 2px solid rgba(0,0,0,0.04);
    border-radius: 50%;
  }

  .right-panel::after {
    content: '';
    position: absolute;
    bottom: 10%;
    left: -80px;
    width: 400px;
    height: 400px;
    border: 2px solid rgba(0,0,0,0.04);
    border-radius: 50%;
  }

  .right-tagline {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 3rem;
    color: #0a0a0a;
    line-height: 1.05;
    letter-spacing: -2px;
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }

  .right-tagline .accent {
    color: #ff4b4b;
  }

  .right-sub {
    font-size: 1rem;
    color: rgba(0,0,0,0.4);
    text-align: center;
    max-width: 320px;
    line-height: 1.6;
    font-weight: 300;
    position: relative;
    z-index: 1;
  }

  .decorative-bar {
    width: 48px;
    height: 4px;
    background: #ff4b4b;
    border-radius: 2px;
    margin: 28px auto;
  }

  .feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
    z-index: 1;
  }

  .feature-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(0,0,0,0.55);
    font-size: 0.9rem;
    margin-bottom: 14px;
    font-weight: 400;
  }

  .feature-dot {
    width: 8px;
    height: 8px;
    background: #ff4b4b;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .form-field {
    margin-bottom: 18px;
    width: 100%;
  }
`;

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    setError("");
    const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
        mode === "login"
        ? { email, password }
        : { email, password, first_name, last_name }
),
      });

      const data = await res.json();
      console.log("register response:", data);

      if (!res.ok) {
        setError(data.message);
        return;
      }

      if (mode === "login") {
        navigate("/dashboard");
      } else {
        navigate("/onboarding", { state: { first_name, userId: data.userId } });      }

    } catch (err) {
      setError("Error. Is backend running?");
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="auth-wrapper">
        {/* LEFT: Form Panel */}
        <div className="left-panel">
          <div className="brand">Beacon<span></span></div>

          <h1 className="form-heading">
            {mode === "login" ? "Welcome back." : "Get started."}
          </h1>
          <p className="form-subheading">
            {mode === "login"
              ? "Sign in to your account~"
              : "Create your account in seconds~"}
          </p>

          {/* Toggle */}
          <div className="toggle-row">
            <button
              className={`toggle-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => { setMode("login"); setEmail(""); setPassword(""); setFirstName(""); setLastName(""); }}
            >
              Log In
            </button>
            <button
              className={`toggle-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => { setMode("signup"); setEmail(""); setPassword(""); }}
            >
              Create Account
            </button>
          </div>


          {/* First Name */}
          {mode === "signup" && (
            <div className="form-field">
              <label className="field-label-custom">First Name</label>
              <input
                className="input-dark"
                type="text"
                placeholder="Jane"
                value={first_name}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
          )}
 
          {/* Last Name */}  
          {mode === "signup" && (
            <div className="form-field">
              <label className="field-label-custom">Last Name</label>
              <input
                className="input-dark"
                type="text"
                placeholder="Doe"
                value={last_name}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
          )}

          {/* Email (Log-in) */}
          {mode === "login" && (
          <div className="form-field">
            <label className="field-label-custom">Email</label>
            <input
              className="input-dark"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          )}

          {/* Email (Sign-Up) */}
          {mode === "signup" && (
          <div className="form-field">
            <label className="field-label-custom">Email</label>
            <input
              className="input-dark"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          )}

          {/* Password  (Log-in) */}
          {mode === "login" && (
          <div className="form-field">
            <label className="field-label-custom">Password</label>
            <input
              className="input-dark"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          )}

          {/* Password  (Sign-Up) */}
          {mode === "signup" && (
          <div className="form-field">
            <label className="field-label-custom">Password</label>
            <input
              className="input-dark"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          )}

          {mode === "login" && (
            <div className="forgot-link">
              <a href="#">Forgot password?</a>
            </div>
          )}

          {error && <p style={{ color: "#ff4b4b", fontSize: "0.85rem", marginBottom: 8 }}>{error}</p>}
          <button className="submit-btn" onClick={handleSubmit}>
            {mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        {/* RIGHT: White Brand Panel */}
        <div className="right-panel">
          <h2 className="right-tagline">
            Build faster.<br />Ship <span className="accent">smarter.</span>
          </h2>
          <div className="decorative-bar" />
          <p className="right-sub">
            Everything your team needs — unified in one powerful workspace designed for modern teams.
          </p>
          <ul className="feature-list" style={{ marginTop: 36 }}>
            <li><span className="feature-dot" /> Real-time collaboration</li>
            <li><span className="feature-dot" /> End-to-end encryption</li>
            <li><span className="feature-dot" /> Seamless integrations</li>
            <li><span className="feature-dot" /> Analytics & reporting</li>
          </ul>
        </div>
      </div>
    </>
  );
}
