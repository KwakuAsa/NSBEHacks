import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, html, #root {
    height: 100%;
    font-family: 'DM Sans', sans-serif;
    background: #f4f4f4;
  }

  .dashboard-wrapper {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* SIDEBAR */
  .sidebar {
    width: 240px;
    background: #0a0a0a;
    display: flex;
    flex-direction: column;
    padding: 32px 20px;
    flex-shrink: 0;
  }

  .sidebar-brand {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: #fff;
    margin-bottom: 48px;
    padding-left: 12px;
  }

  .sidebar-brand span { color: #ff4b4b; }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    cursor: pointer;
    color: rgba(255,255,255,0.45);
    font-size: 0.92rem;
    font-weight: 500;
    transition: all 0.2s ease;
    margin-bottom: 4px;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
  }

  .nav-item:hover {
    background: #1a1a1a;
    color: rgba(255,255,255,0.8);
  }

  .nav-item.active {
    background: #ff4b4b;
    color: #fff;
  }

  .nav-icon {
    font-size: 1.1rem;
    width: 20px;
    text-align: center;
  }

  /* MAIN CONTENT */
  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 48px;
  }

  .page-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    color: #0a0a0a;
    letter-spacing: -1px;
    margin-bottom: 8px;
  }

  .page-subtitle {
    color: rgba(0,0,0,0.4);
    font-size: 0.92rem;
    margin-bottom: 40px;
    font-weight: 300;
  }

  .logout-btn {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  color: rgba(255,255,255,0.35);
  font-size: 0.92rem;
  font-weight: 500;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #1a1a1a;
  color: #ff4b4b;
}

  /* DASHBOARD BUTTONS GRID */
  .button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    max-width: 800px;
  }

  .dash-btn {
    background: #fff;
    border: 1.5px solid #ebebeb;
    border-radius: 14px;
    padding: 28px 24px;
    cursor: pointer;
    width: 600px;
    text-align: left;
    transition: all 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }

  .dash-btn:hover {
    border-color: #ff4b4b;
    box-shadow: 0 4px 20px rgba(255,75,75,0.08);
    transform: translateY(-2px);
  }

  .dash-btn-icon {
    font-size: 1.6rem;
    margin-bottom: 12px;
    display: block;
  }

  .dash-btn-label {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: #0a0a0a;
    display: block;
    margin-bottom: 4px;
  }

  .dash-btn-desc {
    font-size: 0.8rem;
    color: rgba(0,0,0,0.4);
    font-weight: 300;
  }

  /* EXPLORE PAGE */
  .explore-search-row {
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 600px;
  }

  .explore-input {
    flex: 1;
    padding: 14px 20px;
    border: 1.5px solid #e0e0e0;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    outline: none;
    background: #fff;
    transition: border-color 0.2s;
  }

  .explore-input:focus {
    border-color: #ff4b4b;
    box-shadow: 0 0 0 3px rgba(255,75,75,0.08);
  }

  .explore-input::placeholder {
    color: rgba(0,0,0,0.3);
  }

  .plus-btn {
    width: 48px;
    height: 48px;
    background: #ff4b4b;
    border: none;
    border-radius: 12px;
    color: #fff;
    font-size: 1.4rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s, transform 0.1s;
  }

  .plus-btn:hover {
    background: #e03c3c;
    transform: scale(1.05);
  }

  /* BLANK PAGE */
  .blank-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60%;
    color: rgba(0,0,0,0.2);
    font-size: 0.9rem;
    font-style: italic;
  }

  /* RESPONSIVE RULES */
  @media (max-width: 720px) {
    .dashboard-wrapper {
      flex-direction: column;
      height: auto;
    }

    .sidebar {
      width: 100%;
      flex-direction: row;
      padding: 12px 14px;
      gap: 8px;
      align-items: center;
      overflow-x: auto;
    }

    .sidebar-brand { margin-bottom: 0; padding-left: 6px; font-size: 1.05rem; }

    .nav-item { white-space: nowrap; padding: 10px 12px; border-radius: 10px; }

    .main-content {
      padding: 18px;
    }

    .button-grid {
      grid-template-columns: 1fr;
      gap: 12px;
      max-width: 100%;
      width: 100%;
    }

    .dash-btn { width: 100%; padding: 18px 16px; }

    .explore-search-row { flex-direction: column; align-items: stretch; max-width: 100%; }

    .explore-input { width: 100%; }

    .plus-btn { width: 100%; margin-top: 8px; height: 48px; border-radius: 10px; }

    .blank-page { height: auto; padding: 18px; }
  }
`;

const dashboardButtons = [
  { icon: "📋", label: "My Applications", desc: "Track your job applications" },
  { icon: "🎯", label: "Job Matches", desc: "AI-curated opportunities" },
  { icon: "📄", label: "My Resumes", desc: "Manage your resume versions" },
  { icon: "🔍", label: "Explore Jobs", desc: "Browse new listings" },
  { icon: "📊", label: "Analytics", desc: "View your progress" },
  { icon: "⚙️", label: "Settings", desc: "Manage your account" },
];

function DashboardPage() {
  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">What do we wanna explore today?</p>
      <div className="button-grid">
        {dashboardButtons.map((btn) => (
          <button className="dash-btn" key={btn.label}>
            <span className="dash-btn-icon">{btn.icon}</span>
            <span className="dash-btn-label">{btn.label}</span>
            <span className="dash-btn-desc">{btn.desc}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function ExplorePage() {
  const [query, setQuery] = useState("");
  return (
    <>
      <h1 className="page-title">Explore</h1>
      <p className="page-subtitle">Search for opportunities.</p>
      <div className="explore-search-row">
        <input
          className="explore-input"
          type="text"
          placeholder="Search jobs, companies, roles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="plus-btn">+</button>
      </div>
    </>
  );
}

function ResumesPage() {
  return (
    <>
      <h1 className="page-title">Resumes</h1>
      <p className="page-subtitle">Manage your resumes.</p>
      <div className="blank-page">Nothing here yet.</div>
    </>
  );
}

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  function handleLogout() {
    // Clear any stored tokens/session here if needed
    navigate("/");
  }
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "explore", label: "Explore", icon: "🔍" },
    { id: "resumes", label: "Resumes", icon: "📄" },
  ];

  function renderPage() {
    if (activePage === "dashboard") return <DashboardPage />;
    if (activePage === "explore") return <ExplorePage />;
    if (activePage === "resumes") return <ResumesPage />;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-wrapper">
        <div className="sidebar">
          <div className="sidebar-brand">Beacon<span></span></div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Log Out
          </button>
        </div>
        <div className="main-content">
          {renderPage()}
        </div>
      </div>
    </>
  );
}
