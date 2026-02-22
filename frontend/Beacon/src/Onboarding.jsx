import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    font-family: 'DM Sans', sans-serif;
  }

  .onboard-wrapper {
    min-height: 100vh;
    background: #f5f5dc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  .onboard-brand {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: #7d2500;
    margin-bottom: 48px;
    letter-spacing: -0.5px;
  }

  .bubble-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    max-width: 520px;
  }

  .bubble {
    background: #fff;
    border-radius: 20px;
    padding: 32px 36px;
    box-shadow: 0 4px 24px #315e4c;
    animation: popIn 0.3s ease;
  }

  @keyframes popIn {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .bubble-welcome {
    font-family: 'Playfair Display', sans-serif;
    font-weight: 800;
    font-size: 1.5rem;
    color: #315e4c;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .bubble-sub {
    color: #315e4c;
    font-size: 0.92rem;
    font-weight: 300;
    margin-bottom: 24px;
  }

  .bubble-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: rgba(0,0,0,0.45);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
    display: block;
  }

  .bubble-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    outline: none;
    background: #fafafa;
    transition: border-color 0.2s;
    margin-bottom: 16px;
    color: #0a0a0a;
  }

  .bubble-input:focus {
    border-color: #e2725c;
    box-shadow: 0 0 0 3px rgba(255,75,75,0.08);
    background: #fff;
  }

  .bubble-select {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    outline: none;
    background: #fafafa;
    transition: border-color 0.2s;
    margin-bottom: 16px;
    color: #0a0a0a;
    appearance: none;
    cursor: pointer;
  }

  .bubble-select:focus {
    border-color: #e2725c;
    box-shadow: 0 0 0 3px rgba(255,75,75,0.08);
    background: #fff;
  }

  .dropzone {
    border: 2px dashed #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    background: #fafafa;
    margin-bottom: 8px;
  }

  .dropzone:hover {
    border-color: #e2725c;
    background: rgba(255,75,75,0.02);
  }

  .dropzone-icon {
    font-size: 1.8rem;
    margin-bottom: 8px;
    display: block;
  }

  .dropzone-text {
    font-size: 0.85rem;
    color: rgba(0,0,0,0.4);
  }

  .dropzone-text span {
    color: #e2725c;
    font-weight: 500;
    cursor: pointer;
  }

  .dropzone-filename {
    font-size: 0.85rem;
    color: #0a0a0a;
    margin-top: 8px;
    font-weight: 500;
  }

  .optional-tag {
    font-size: 0.75rem;
    color: rgba(0,0,0,0.3);
    margin-left: 6px;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
  }

  .arrow-btn {
    width: 44px;
    height: 44px;
    background: #e2725c;
    border: none;
    border-radius: 50%;
    color: #fff;
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    transition: background 0.2s, transform 0.15s;
    flex-shrink: 0;
  }

  .arrow-btn:hover {
    background: #e2725c;
    transform: scale(1.08);
  }

  .arrow-btn:disabled {
    background: #ddd;
    cursor: not-allowed;
    transform: none;
  }

  .finish-btn {
    width: 100%;
    padding: 14px;
    background: #e2725c;
    border: none;
    border-radius: 12px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.2s, transform 0.1s;
  }

  .finish-btn:hover {
    background: #e2725c;
    transform: translateY(-1px);
  }

  .step-dots {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin-bottom: 32px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ddd;
    transition: background 0.2s, width 0.2s;
  }

  .dot.active {
    background: #e2725c;
    width: 24px;
    border-radius: 4px;
  }
`;

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const first_name = location.state?.first_name || "there";
  const userId = location.state?.userId;
  const [step, setStep] = useState(0);
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [education, setEducation] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [graduationYear, setGraduationYear] = useState("");

  function handleFileDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (file) setResumeFile(file);
  }

  async function handleFinish() {
  console.log("userId:", userId);
  console.log("sending:", { dob, city, education_level: education });

  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      dob,
      city,
      education_level: education,
      graduation_year: graduationYear,
    }),
    });

    const data = await res.json();
    console.log("response:", data);

  } catch (err) {
    console.error("Failed to save profile:", err);
  }

  navigate("/dashboard");
}

  return (
    <>
      <style>{styles}</style>
      <div className="onboard-wrapper">
        <div className="onboard-brand">Beacon<span>.</span></div>

        {/* Step dots */}
        <div className="step-dots">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`dot ${step === i ? "active" : ""}`} />
          ))}
        </div>

        <div className="bubble-container">

          {/* STEP 0 — Welcome */}
          {step === 0 && (
            <div className="bubble">
              <p className="bubble-welcome">Welcome to Beacon, {first_name} 👋</p>
              <p className="bubble-sub">Let's set up your profile real quick.</p>
              <button className="arrow-btn" onClick={() => setStep(1)}>→</button>
            </div>
          )}

          {/* STEP 1 — DOB + City */}
          {step === 1 && (
            <div className="bubble">
              <p className="bubble-welcome">A little about you</p>
              <p className="bubble-sub">Tell us your date of birth and where you're based.</p>

              <label className="bubble-label">Date of Birth</label>
              <input
                className="bubble-input"
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
              />

              <label className="bubble-label">City</label>
              <input
                className="bubble-input"
                type="text"
                placeholder="e.g. New York, NY"
                value={city}
                onChange={e => setCity(e.target.value)}
              />

              <button
                className="arrow-btn"
                onClick={() => setStep(2)}
                disabled={!dob || !city}
              >
                →
              </button>
            </div>
          )}

          {/* STEP 2 — Education + Resume */}
          {step === 2 && (
            <div className="bubble">
              <p className="bubble-welcome">Education, Grad Year & Resume</p>
              <p className="bubble-sub">Help us match you with the right opportunities.</p>

              <label className="bubble-label">Education Level</label>
              <select
                className="bubble-select"
                value={education}
                onChange={e => setEducation(e.target.value)}
              >
                <option value="" disabled>Select your level...</option>
                <option value="Highschool">Highschool</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Masters">Masters</option>
                <option value="PHD">PHD</option>
              </select>

              <label className="bubble-label">Graduation Year</label>
              <input
                className="bubble-input"
                type="number"
                placeholder="e.g. 2026"
                min="1990"
                max="2035"
                value={graduationYear}
                onChange={e => setGraduationYear(e.target.value)}
              />

              <label className="bubble-label">
                Resume <span className="optional-tag">(optional)</span>
              </label>
              <div
                className="dropzone"
                onDrop={handleFileDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => document.getElementById("resume-upload").click()}
              >
                <span className="dropzone-icon">📎</span>
                <p className="dropzone-text">
                  Drag & drop or <span>browse</span> to upload
                </p>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleFileDrop}
                />
                {resumeFile && (
                  <p className="dropzone-filename">✅ {resumeFile.name}</p>
                )}
              </div>

              <button
                className="arrow-btn"
                style={{ marginTop: 16 }}
                onClick={() => setStep(3)}
                disabled={!education}
              >
                →
              </button>
            </div>
          )}

          {/* STEP 3 — Finish */}
          {step === 3 && (
            <div className="bubble">
              <p className="bubble-welcome">You're all set! 🎉</p>
              <p className="bubble-sub">Your profile is ready. Let's get you into the dashboard.</p>
              <button className="finish-btn" onClick={handleFinish}>
                Go to Dashboard →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
