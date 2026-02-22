import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./images/5.png";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, html, #root {
    height: 100%;
    font-family: 'Playfair Display', sans-serif;
    background: #f5f5dc;
  }

  .dashboard-wrapper {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* SIDEBAR */
  .sidebar {
    width: 240px;
    background: #315e4c;
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

  .sidebar-brand span { color: #e2725c; }

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
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.8);
  }

  .nav-item.active {
    background: #e2725c;
    color: #fff;
  }

  .nav-icon {
    font-size: 1.1rem;
    width: 20px;
    text-align: center;
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 48px;
  }

  .page-title {
    font-family: 'Playfair Display', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    color: #315e4c;
    letter-spacing: -1px;
    margin-bottom: 8px;
  }

  .page-subtitle {
    color: #315e4c;
    font-size: 0.92rem;
    margin-bottom: 32px;
    font-weight: 300;
    opacity: 0.7;
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
    background: rgba(255,255,255,0.07);
    color: #e2725c;
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
    font-family: 'Playfair Display', sans-serif;
    font-size: 0.95rem;
    outline: none;
    background: #fff;
    transition: border-color 0.2s;
  }

  .explore-input:focus {
    border-color: #e2725c;
    box-shadow: 0 0 0 3px rgba(226,114,92,0.1);
  }

  .explore-input::placeholder { color: rgba(49,94,76,0.4); }

  .plus-btn {
    width: 48px;
    height: 48px;
    background: #e2725c;
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

  .plus-btn:hover { transform: scale(1.05); }

  .blank-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60%;
    color: rgba(0,0,0,0.2);
    font-size: 0.9rem;
    font-style: italic;
  }

  @media (max-width: 720px) {
    .dashboard-wrapper { flex-direction: column; height: auto; }
    .sidebar {
      width: 100%;
      flex-direction: row;
      padding: 12px 14px;
      gap: 8px;
      align-items: center;
      overflow-x: auto;
    }
    .sidebar-brand { margin-bottom: 0; font-size: 1.05rem; }
    .nav-item { white-space: nowrap; padding: 10px 12px; }
    .main-content { padding: 18px; }
    .explore-search-row { flex-direction: column; align-items: stretch; max-width: 100%; }
    .plus-btn { width: 100%; margin-top: 8px; height: 48px; border-radius: 10px; }
  }

  .logo-wrapper {
    display: inline-block;
    padding: 2px;
    border-radius: 90%;
    background: linear-gradient(135deg, #12100f2d, #e7d7c734);
  }

  .logo-wrapper img {
    width: 170px;
    height: 170px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 25px;
  }
`;

// ─── MILESTONE BOX ────────────────────────────────────────────────────────────
function MilestoneBox({ milestone, checked, onToggle }) {
  const [open, setOpen] = useState(false);
  const total = milestone.tasks.length;
  const done = milestone.tasks.filter(t => checked[t.id]).length;
  const allDone = done === total;
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <div style={{
      background: allDone ? "#f0faf5" : "#fff",
      border: `2px solid ${allDone ? "#315e4c" : open ? "#e2725c" : "#e8e3d8"}`,
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: open ? "0 6px 20px rgba(226,114,92,0.12)" : "0 2px 8px rgba(49,94,76,0.06)",
      transition: "all 0.2s ease",
      width: "100%",
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "none", border: "none",
          padding: "11px 13px 10px", cursor: "pointer", textAlign: "left",
          display: "flex", flexDirection: "column", gap: "7px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
          <div style={{
            fontSize: "11.5px", fontWeight: "800",
            color: allDone ? "#315e4c" : "#1c1c1c",
            fontFamily: "'Playfair Display', sans-serif", lineHeight: 1.3, flex: 1,
          }}>
            {allDone && "✅ "}{milestone.title}
          </div>
          <span style={{
            fontSize: "10px", color: "#e2725c", flexShrink: 0, marginTop: "2px",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.18s",
          }}>▾</span>
        </div>

        <div style={{
          width: "100%", height: "4px", background: "rgba(49,94,76,0.1)",
          borderRadius: "2px", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: allDone ? "#315e4c" : "#e2725c",
            borderRadius: "2px", transition: "width 0.3s ease",
          }} />
        </div>

        <div style={{
          fontSize: "9px", color: "rgba(49,94,76,0.45)",
          fontFamily: "'Playfair Display', sans-serif", fontWeight: 500,
        }}>{done}/{total} tasks done</div>
      </button>

      {open && (
        <div style={{
          borderTop: "1px solid #ebe8df", padding: "10px 11px",
          display: "flex", flexDirection: "column", gap: "5px", background: "#fafaf7",
        }}>
          <div style={{
            fontSize: "9px", color: "#e2725c", fontStyle: "italic",
            fontFamily: "'Playfair Display', sans-serif", marginBottom: "4px", lineHeight: 1.4,
          }}>🎯 {milestone.definitionOfDone}</div>

          {milestone.tasks.map(task => {
            const isDone = !!checked[task.id];
            return (
              <div
                key={task.id}
                onClick={() => onToggle(task.id)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "8px",
                  padding: "7px 9px", borderRadius: "9px",
                  background: isDone ? "rgba(49,94,76,0.08)" : "#fff",
                  border: `1.5px solid ${isDone ? "rgba(49,94,76,0.22)" : "#ebe8df"}`,
                  cursor: "pointer", transition: "all 0.18s ease",
                }}
              >
                <div style={{
                  flexShrink: 0, width: "15px", height: "15px",
                  borderRadius: "4px",
                  border: `2px solid ${isDone ? "#315e4c" : "#cdc6bb"}`,
                  background: isDone ? "#315e4c" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: "1px", transition: "all 0.15s ease",
                }}>
                  {isDone && <span style={{ color: "#fff", fontSize: "9px", lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: "10.5px", fontWeight: "600",
                    color: isDone ? "rgba(49,94,76,0.5)" : "#315e4c",
                    fontFamily: "'Playfair Display', sans-serif",
                    textDecoration: isDone ? "line-through" : "none",
                    marginBottom: "2px", transition: "all 0.18s",
                  }}>{task.title}</div>
                  <div style={{
                    fontSize: "9px",
                    color: isDone ? "rgba(49,94,76,0.35)" : "#9a8f83",
                    fontFamily: "'Playfair Display', sans-serif",
                    lineHeight: 1.4, transition: "color 0.18s",
                  }}>{task.whyItMatters}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ROADMAP CARD ─────────────────────────────────────────────────────────────
function RoadmapCard({ roadmap }) {
  const [checked, setChecked] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allTasks = roadmap.phases.flatMap(p =>
    p.milestones.flatMap(m => m.tasks)
  );
  const allDone = allTasks.length > 0 && allTasks.every(t => checked[t.id]);

  async function toggleTask(taskId, phaseId, milestoneId) {
    const newVal = !checked[taskId];
    setChecked(prev => ({ ...prev, [taskId]: newVal })); // update UI instantly

    // only call backend when checking ON (completing)
    if (newVal) {
      try {
        await fetch(`/api/roadmap/${roadmap.id}/tasks/${taskId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phaseId, milestoneId }),
        });
      } catch (err) {
        console.error("Failed to save task completion:", err);
      }
    }
  }
  const allMilestones = roadmap.phases.flatMap(p => p.milestones);
  const totalTasks = allMilestones.reduce((a, m) => a + m.tasks.length, 0);
  const doneTasks = Object.values(checked).filter(Boolean).length;
  const overallPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  let globalIndex = 0;
  const phasesWithIndex = roadmap.phases.map(phase => ({
    ...phase,
    milestones: phase.milestones.map(m => ({ ...m, globalIndex: globalIndex++ })),
  }));

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e8e3d8",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 2px 16px rgba(49,94,76,0.08)",
    }}>
      {/* Header */}
      <div style={{
        background: "#315e4c", padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>{roadmap.emoji}</span>
          <div>
            <div style={{
              fontSize: "14px", fontWeight: "800", color: "#f5f5dc",
              fontFamily: "'Playfair Display', sans-serif", letterSpacing: "-0.3px",
            }}>{roadmap.targetTitle}</div>
            <div style={{
              fontSize: "9px", color: "rgba(245,245,220,0.5)",
              fontFamily: "'Playfair Display', sans-serif",
              textTransform: "uppercase", letterSpacing: "0.07em",
              fontWeight: 500, marginTop: "2px",
            }}>
              {roadmap.phases.length} phases · {allMilestones.length} milestones · {totalTasks} tasks
            </div>
          </div>
        </div>
        <div style={{
          background: "rgba(245,245,220,0.1)",
          border: "1.5px solid rgba(245,245,220,0.15)",
          borderRadius: "10px", padding: "5px 10px", textAlign: "center",
        }}>
          <div style={{
            fontSize: "15px", fontWeight: "800",
            color: overallPct === 100 ? "#6EE7B7" : "#f5f5dc",
            fontFamily: "'Playfair Display', sans-serif",
          }}>{overallPct}%</div>
          <div style={{
            fontSize: "7.5px", color: "rgba(245,245,220,0.4)",
            textTransform: "uppercase", letterSpacing: "0.06em",
            fontFamily: "'Playfair Display', sans-serif",
          }}>done</div>
        </div>
      </div>

      {/* Zigzag body */}
      <div style={{ padding: "24px 20px 16px", position: "relative" }}>
        {/* Center spine */}
        <div style={{
          position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px",
          background: "linear-gradient(to bottom, rgba(226,114,92,0.18), rgba(49,94,76,0.18))",
          transform: "translateX(-50%)", zIndex: 0,
        }} />

        {phasesWithIndex.map((phase) => (
          <div key={phase.id} style={{ marginBottom: "4px" }}>
            {/* Phase pill */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "14px", position: "relative", zIndex: 1,
            }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(226,114,92,0.18)" }} />
              <div style={{
                background: "#e2725c", color: "#fff",
                fontSize: "8px", fontWeight: "800",
                fontFamily: "'Playfair Display', sans-serif",
                textTransform: "uppercase", letterSpacing: "0.1em",
                padding: "3px 12px", borderRadius: "20px", flexShrink: 0,
              }}>{phase.title}</div>
              <div style={{ flex: 1, height: "1px", background: "rgba(226,114,92,0.18)" }} />
            </div>

            {phase.milestones.map((milestone) => {
              const isLeft = milestone.globalIndex % 2 === 0;
              return (
                <div key={milestone.id} style={{
                  display: "flex", alignItems: "flex-start",
                  marginBottom: "18px", position: "relative", zIndex: 1,
                }}>
                  {isLeft ? (
                    <>
                      <div style={{ width: "calc(50% - 32px)" }}>
                        <MilestoneBox
                          milestone={milestone}
                          checked={checked}
                          onToggle={(taskId) => toggleTask(taskId, phase.id, milestone.id)}
                        />
                      </div>
                      <div style={{
                        width: "64px", flexShrink: 0,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", paddingTop: "12px", gap: "2px",
                        position: "relative",
                      }}>
                        <div style={{
                          position: "absolute", top: "17px", left: 0,
                          width: "50%", height: "2px", background: "rgba(226,114,92,0.4)",
                        }} />
                        <div style={{
                          width: "11px", height: "11px", borderRadius: "50%",
                          background: "#e2725c", border: "3px solid #fff",
                          boxShadow: "0 0 0 2px #e2725c", zIndex: 2, position: "relative",
                        }} />
                        <div style={{ fontSize: "11px", color: "#e2725c", transform: "rotate(90deg)", marginTop: "2px" }}>▾</div>
                      </div>
                      <div style={{ flex: 1 }} />
                    </>
                  ) : (
                    <>
                      <div style={{ flex: 1 }} />
                      <div style={{
                        width: "64px", flexShrink: 0,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", paddingTop: "12px", gap: "2px",
                        position: "relative",
                      }}>
                        <div style={{
                          position: "absolute", top: "17px", right: 0,
                          width: "50%", height: "2px", background: "rgba(49,94,76,0.4)",
                        }} />
                        <div style={{
                          width: "11px", height: "11px", borderRadius: "50%",
                          background: "#315e4c", border: "3px solid #fff",
                          boxShadow: "0 0 0 2px #315e4c", zIndex: 2, position: "relative",
                        }} />
                        <div style={{ fontSize: "11px", color: "#315e4c", transform: "rotate(90deg)", marginTop: "2px" }}>▾</div>
                      </div>
                      <div style={{ width: "calc(50% - 32px)" }}>
                        <MilestoneBox milestone={milestone} checked={checked} onToggle={toggleTask} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* Submit button */}
      <div style={{ padding: "0 20px 20px" }}>
        <button
          disabled={!allDone || submitted}
          onClick={() => setSubmitted(true)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            fontFamily: "'Syne', sans-serif",
            fontWeight: "700",
            fontSize: "0.88rem",
            letterSpacing: "0.02em",
            cursor: submitted ? "default" : allDone ? "pointer" : "not-allowed",
            transition: "all 0.25s ease",
            background: submitted
              ? "rgba(49,94,76,0.15)"
              : allDone
              ? "#e2725c"
              : "rgba(0,0,0,0.1)",
            color: submitted
              ? "rgba(49,94,76,0.5)"
              : allDone
              ? "#fff"
              : "rgba(0,0,0,0.3)",
          }}
        >
          {submitted ? "✓ Already Submitted" : "Submit Roadmap"}
        </button>
      </div>
    </div>
  );
}

// ─── ADD ROADMAP BUTTON ───────────────────────────────────────────────────────
function AddRoadmapCard({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `2px dashed ${hov ? "#e2725c" : "rgba(49,94,76,0.22)"}`,
        borderRadius: "20px", padding: "20px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
        cursor: "pointer",
        background: hov ? "rgba(226,114,92,0.03)" : "rgba(245,245,220,0.4)",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{
        width: "30px", height: "30px", borderRadius: "50%",
        background: hov ? "#e2725c" : "rgba(49,94,76,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "17px", color: hov ? "#fff" : "#315e4c", transition: "all 0.2s",
      }}>+</div>
      <span style={{
        fontFamily: "'Playfair Display', sans-serif", fontSize: "11.5px", fontWeight: "700",
        color: hov ? "#e2725c" : "rgba(49,94,76,0.4)",
        textTransform: "uppercase", letterSpacing: "0.07em", transition: "color 0.2s",
      }}>Generate New Roadmap</span>
    </div>
  );
}

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const SAMPLE_ROADMAPS = [
  {
    id: "rm1", targetTitle: "Software Engineer", emoji: "💻",
    phases: [
      {
        id: "p1", title: "Foundation",
        milestones: [
          {
            id: "m1", title: "Core Programming",
            definitionOfDone: "Write clean, working code in at least one language.",
            tasks: [
              { id: "t1", title: "Learn Python basics", whyItMatters: "Most in-demand language for entry-level roles." },
              { id: "t2", title: "Understand data structures", whyItMatters: "Arrays, hashmaps, trees appear in every interview." },
              { id: "t3", title: "Practice LeetCode Easy", whyItMatters: "Builds pattern recognition for coding problems." },
            ],
          },
          {
            id: "m2", title: "Version Control",
            definitionOfDone: "GitHub profile with at least 3 repos.",
            tasks: [
              { id: "t4", title: "Set up Git locally", whyItMatters: "All professional code is version-controlled." },
              { id: "t5", title: "Learn branching & pull requests", whyItMatters: "You'll do this daily on the job." },
            ],
          },
        ],
      },
      {
        id: "p2", title: "Applied Skills",
        milestones: [
          {
            id: "m3", title: "Build a Web App",
            definitionOfDone: "Deployed app with authentication and a database.",
            tasks: [
              { id: "t6", title: "Learn React fundamentals", whyItMatters: "React dominates front-end hiring." },
              { id: "t7", title: "Connect a REST API", whyItMatters: "Full-stack ability expected at most companies." },
              { id: "t8", title: "Deploy on Vercel or Render", whyItMatters: "Employers want live projects, not just code." },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "rm2", targetTitle: "Data Analyst", emoji: "📊",
    phases: [
      {
        id: "p1", title: "Data Fundamentals",
        milestones: [
          {
            id: "m1", title: "SQL Mastery",
            definitionOfDone: "Write complex queries with JOINs, CTEs, and window functions.",
            tasks: [
              { id: "t1", title: "Complete SQLZoo tutorial", whyItMatters: "SQL is in 95% of analyst job descriptions." },
              { id: "t2", title: "Query a real dataset on BigQuery", whyItMatters: "Shows practical application beyond exercises." },
            ],
          },
          {
            id: "m2", title: "Visualization",
            definitionOfDone: "Published dashboard on Tableau Public with 3+ chart types.",
            tasks: [
              { id: "t3", title: "Learn Tableau basics", whyItMatters: "Most common BI tool in job postings." },
              { id: "t4", title: "Design an executive dashboard", whyItMatters: "Shows you can speak to non-technical stakeholders." },
            ],
          },
        ],
      },
    ],
  },
];

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);

  // load on mount
  useEffect(() => {
    async function load() {
      const userId = localStorage.getItem("userId");
      const res = await fetch(`/api/roadmap/${userId}`);
      const data = await res.json();

      const mapped = (data.roadmaps || []).map(row => ({
        id: row.id,
        targetTitle: row.target_title,
        emoji: row.target_type === "hobby" ? "🎨" : "💼",
        phases: row.raw_json.phases,
      }));

      setRoadmaps(mapped);
      setLoading(false);
    }
    load();
  }, []);

  async function handleGenerate({ targetType, industry, targetTitle }) {
    setGenerating(true);
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch("/api/roadmaps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, targetTitle, targetType, industry, useResume: false }),
      });
      const { roadmap } = await res.json();
      setRoadmaps(prev => [...prev, {
        id: roadmap.id,
        targetTitle: roadmap.target_title,
        emoji: targetType === "hobby" ? "🎨" : "💼",
        phases: roadmap.raw_json.phases,
      }]);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <p style={{ color: "#315e4c", fontFamily: "Playfair Display", padding: "20px" }}>Loading your roadmaps...</p>;

  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Your active career roadmaps</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 500px))",
        gap: "20px",
        alignItems: "start",
      }}>
        {roadmaps.map(rm => (
          <RoadmapCard key={rm.id} roadmap={rm} />
        ))}
        <AddRoadmapCard onClick={() => setShowModal(true)} />
      </div>

      {showModal && (
        <GenerateModal
          onClose={() => !generating && setShowModal(false)}
          onSubmit={handleGenerate}
          loading={generating}
        />
      )}
    </>
  );
}
// ─── OTHER PAGES ──────────────────────────────────────────────────────────────
function ExplorePage() {
  const [step, setStep] = useState("form"); // "form" | "loading" | "results"
  const [results, setResults] = useState(null);
  const [form, setForm] = useState({
    problem_solving_style: "",
    public_speaking_preference: "",
    math_preference: "",
    work_environment: "",
    work_with: "",
    interests: "",
  });

  function update(field, val) {
    setForm(prev => ({ ...prev, [field]: val }));
  }

  const canSubmit =
    form.problem_solving_style &&
    form.public_speaking_preference &&
    form.math_preference &&
    form.work_environment &&
    form.work_with;

  async function handleSubmit() {
    setStep("loading");
    try {
      const userId = localStorage.getItem("userId");
      console.log("userId:", userId);

      const res = await fetch("/api/explore/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...form,
          interests: form.interests
            .split(",")
            .map(s => s.trim())
            .filter(Boolean),
        }),
      });

      console.log("status:", res.status);
      const data = await res.json();
      console.log("data:", data);

      setResults(data);
      setStep("results");
    } catch (err) {
      console.error(err);
      setStep("form");
    }
  }

  const optionBtn = (field, value, label) => (
    <button
      key={value}
      onClick={() => update(field, value)}
      style={{
        padding: "9px 16px",
        borderRadius: "10px",
        border: `1.5px solid ${form[field] === value ? "#e2725c" : "#e8e3d8"}`,
        background: form[field] === value ? "#e2725c" : "#fff",
        color: form[field] === value ? "#fff" : "#315e4c",
        fontFamily: "'Syne', sans-serif",
        fontWeight: "600",
        fontSize: "0.82rem",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >{label}</button>
  );

  const labelStyle = {
    fontSize: "0.72rem", fontWeight: "700",
    color: "rgba(49,94,76,0.5)", textTransform: "uppercase",
    letterSpacing: "0.09em", display: "block",
    marginBottom: "8px", fontFamily: "'Syne', sans-serif",
  };

  const sectionStyle = { marginBottom: "22px" };

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (step === "loading") return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "60vh", gap: "16px",
    }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "50%",
        border: "3px solid #e8e3d8",
        borderTop: "3px solid #e2725c",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{
        fontFamily: "'Syne', sans-serif", fontWeight: "700",
        color: "#315e4c", fontSize: "0.95rem",
      }}>Finding your best career matches...</p>
    </div>
  );

  // ── RESULTS ──────────────────────────────────────────────────────────────
  if (step === "results" && results) {
    const careers = results?.result?.careers || [];
    const summary = results?.result?.summary || "";

    return (
      <>
        <h1 className="page-title">Your Matches</h1>
        <p style={{
          color: "#315e4c", fontSize: "0.92rem",
          marginBottom: "24px", fontWeight: "300",
          fontFamily: "'DM Sans', sans-serif",
          maxWidth: "600px", lineHeight: 1.6, opacity: 0.8,
        }}>{summary}</p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 380px))",
          gap: "16px", marginBottom: "32px",
        }}>
          {careers.map((career, i) => (
            <div key={i} style={{
              background: "#fff",
              border: "1.5px solid #e8e3d8",
              borderRadius: "16px", padding: "20px",
              boxShadow: "0 2px 12px rgba(49,94,76,0.07)",
            }}>
              {/* Title + score */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: "12px",
              }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: "800",
                  fontSize: "0.95rem", color: "#315e4c",
                  flex: 1, lineHeight: 1.3,
                }}>{career.title}</div>
                <div style={{
                  background: career.fitScore >= 80
                    ? "#315e4c"
                    : career.fitScore >= 60
                    ? "#e2725c"
                    : "#e8e3d8",
                  color: career.fitScore >= 60 ? "#fff" : "#999",
                  borderRadius: "8px", padding: "4px 10px",
                  fontFamily: "'Syne', sans-serif", fontWeight: "800",
                  fontSize: "0.85rem", flexShrink: 0, marginLeft: "10px",
                }}>{career.fitScore}%</div>
              </div>

              {/* Fit bar */}
              <div style={{
                width: "100%", height: "4px",
                background: "rgba(49,94,76,0.1)",
                borderRadius: "2px", overflow: "hidden", marginBottom: "12px",
              }}>
                <div style={{
                  height: "100%", width: `${career.fitScore}%`,
                  background: career.fitScore >= 80 ? "#315e4c" : "#e2725c",
                  borderRadius: "2px",
                }} />
              </div>

              {/* Why points */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {(career.why || []).map((point, j) => (
                  <div key={j} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <div style={{
                      flexShrink: 0, width: "5px", height: "5px",
                      borderRadius: "50%", background: "#e2725c", marginTop: "6px",
                    }} />
                    <p style={{
                      fontSize: "0.8rem", color: "#666",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.5, margin: 0,
                    }}>{point}</p>
                  </div>
                ))}
              </div>

              {/* Generate roadmap */}
              <button
                style={{
                  marginTop: "14px", width: "100%",
                  padding: "9px", borderRadius: "10px",
                  border: "1.5px solid #e2725c",
                  background: "transparent", color: "#e2725c",
                  fontFamily: "'Syne', sans-serif", fontWeight: "700",
                  fontSize: "0.8rem", cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#e2725c";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#e2725c";
                }}
                onClick={() => alert(`Hook up: generate roadmap for "${career.title}"`)}
              >
                Generate Roadmap →
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => { setStep("form"); setResults(null); }}
          style={{
            padding: "10px 20px", borderRadius: "10px",
            border: "1.5px solid rgba(49,94,76,0.25)",
            background: "transparent", color: "rgba(49,94,76,0.6)",
            fontFamily: "'Syne', sans-serif", fontWeight: "700",
            fontSize: "0.82rem", cursor: "pointer",
          }}
        >← Run Again</button>
      </>
    );
  }

  // ── FORM ─────────────────────────────────────────────────────────────────
  return (
    <>
      <h1 className="page-title">Explore</h1>
      <p className="page-subtitle">Answer a few questions and we'll find your best career matches.</p>

      <div style={{
        background: "#fff", border: "1.5px solid #e8e3d8",
        borderRadius: "20px", padding: "32px 28px",
        maxWidth: "560px",
        boxShadow: "0 2px 16px rgba(49,94,76,0.07)",
      }}>
        <div style={sectionStyle}>
          <label style={labelStyle}>Problem Solving Style</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {optionBtn("problem_solving_style", "Analytical", "Analytical")}
            {optionBtn("problem_solving_style", "Creative", "Creative")}
            {optionBtn("problem_solving_style", "Practical", "Practical")}
            {optionBtn("problem_solving_style", "Collaborative", "Collaborative")}
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>Public Speaking</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {optionBtn("public_speaking_preference", "Enjoy", "I enjoy it")}
            {optionBtn("public_speaking_preference", "Neutral", "Neutral")}
            {optionBtn("public_speaking_preference", "Avoid", "I'd rather not")}
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>Math Preference</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {optionBtn("math_preference", "Low", "Not my thing")}
            {optionBtn("math_preference", "Medium", "I can manage")}
            {optionBtn("math_preference", "High", "I love it")}
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>Work Environment</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {optionBtn("work_environment", "Remote", "Remote")}
            {optionBtn("work_environment", "Office", "Office")}
            {optionBtn("work_environment", "Hybrid", "Hybrid")}
            {optionBtn("work_environment", "Outdoor", "Outdoor")}
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>I prefer working with</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {optionBtn("work_with", "Data", "Data")}
            {optionBtn("work_with", "People", "People")}
            {optionBtn("work_with", "Systems", "Systems")}
            {optionBtn("work_with", "PhysicalTools", "Physical Tools")}
            {optionBtn("work_with", "Ideas", "Ideas")}
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>
            Interests <span style={{ color: "rgba(49,94,76,0.35)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(comma separated, optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. music, cooking, gaming, travel..."
            value={form.interests}
            onChange={e => update("interests", e.target.value)}
            style={{
              width: "100%", padding: "11px 14px",
              border: "1.5px solid #e8e3d8", borderRadius: "10px",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
              outline: "none", background: "#fafaf7", color: "#1c1c1c",
            }}
          />
        </div>

        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          style={{
            width: "100%", padding: "13px",
            background: canSubmit ? "#315e4c" : "rgba(49,94,76,0.2)",
            border: "none", borderRadius: "12px",
            color: canSubmit ? "#f5f5dc" : "rgba(49,94,76,0.4)",
            fontFamily: "'Syne', sans-serif", fontWeight: "700",
            fontSize: "0.95rem",
            cursor: canSubmit ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
          }}
        >
          Find My Matches →
        </button>
      </div>
    </>
  );
}

function ResumesPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    try {
      const res = await fetch(`/api/resumes/${userId}`);
      const data = await res.json();
      setResumes(data.resumes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch(`/api/resumes/${userId}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) loadResumes(); // refresh list
      else console.error(data.message);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSetCurrent(resumeId) {
    try {
      await fetch(`/api/resumes/${userId}/current/${resumeId}`, {
        method: "PATCH",
      });
      loadResumes();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDownload(resumeId, fileName) {
    try {
      const res = await fetch(`/api/resumes/${userId}/download/${resumeId}`);
      const data = await res.json();
      // open signed URL in new tab
      window.open(data.signedUrl, "_blank");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <h1 className="page-title">Resumes</h1>
      <p className="page-subtitle">Manage your resume versions.</p>

      {/* Upload box */}
      <div
        onClick={() => document.getElementById("resume-input").click()}
        style={{
          maxWidth: "560px",
          border: "2px dashed rgba(49,94,76,0.25)",
          borderRadius: "16px",
          padding: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          cursor: "pointer",
          background: "rgba(245,245,220,0.4)",
          marginBottom: "24px",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#e2725c"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(49,94,76,0.25)"}
      >
        <input
          id="resume-input"
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          background: "rgba(49,94,76,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px",
        }}>📎</div>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontWeight: "700",
          color: "rgba(49,94,76,0.5)", fontSize: "0.88rem",
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          {uploading ? "Uploading..." : "Upload New Resume (PDF)"}
        </span>
      </div>

      {/* Resume list */}
      {loading ? (
        <p style={{ color: "#315e4c", fontFamily: "'DM Sans', sans-serif", opacity: 0.6 }}>Loading...</p>
      ) : resumes.length === 0 ? (
        <p style={{ color: "#315e4c", fontFamily: "'DM Sans', sans-serif", opacity: 0.4, fontStyle: "italic" }}>No resumes uploaded yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "560px" }}>
          {resumes.map(r => (
            <div key={r.id} style={{
              background: "#fff",
              border: `1.5px solid ${r.is_current ? "#315e4c" : "#e8e3d8"}`,
              borderRadius: "14px",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              boxShadow: "0 2px 8px rgba(49,94,76,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "18px" }}>📄</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: "700",
                    fontSize: "0.88rem", color: "#315e4c",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{r.file_name}</div>
                  <div style={{
                    fontSize: "0.75rem", color: "rgba(49,94,76,0.4)",
                    fontFamily: "'DM Sans', sans-serif", marginTop: "2px",
                  }}>
                    {new Date(r.created_at).toLocaleDateString()}
                    {r.is_current && (
                      <span style={{
                        marginLeft: "8px", background: "#315e4c",
                        color: "#f5f5dc", fontSize: "0.65rem",
                        padding: "2px 7px", borderRadius: "20px",
                        fontWeight: "700", letterSpacing: "0.05em",
                      }}>CURRENT</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                {!r.is_current && (
                  <button
                    onClick={() => handleSetCurrent(r.id)}
                    style={{
                      padding: "6px 12px", borderRadius: "8px",
                      border: "1.5px solid rgba(49,94,76,0.25)",
                      background: "transparent", color: "#315e4c",
                      fontFamily: "'Syne', sans-serif", fontWeight: "600",
                      fontSize: "0.75rem", cursor: "pointer",
                    }}
                  >Set Current</button>
                )}
                <button
                  onClick={() => handleDownload(r.id, r.file_name)}
                  style={{
                    padding: "6px 12px", borderRadius: "8px",
                    border: "1.5px solid #e2725c",
                    background: "transparent", color: "#e2725c",
                    fontFamily: "'Syne', sans-serif", fontWeight: "600",
                    fontSize: "0.75rem", cursor: "pointer",
                  }}
                >Download</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── DASHBOARD SHELL ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  function handleLogout() {
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
          <div className="logo-wrapper">
            <img src={logo} alt="Logo" />
          </div>
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