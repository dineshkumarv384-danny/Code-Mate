import { useState, useRef } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authName, setAuthName] = useState("");
const [authEmail, setAuthEmail] = useState("");
const [authPassword, setAuthPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
    const panelRefs = useRef([]);

  function handlePanelMouseMove(event, index) {
    const panel = panelRefs.current[index];

    if (!panel) return;

    const rect = panel.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    panel.style.setProperty("--mouse-x", `${x}px`);
    panel.style.setProperty("--mouse-y", `${y}px`);
  }

  function handlePanelMouseLeave(index) {
    const panel = panelRefs.current[index];

    if (!panel) return;

    panel.style.setProperty("--mouse-x", "50%");
    panel.style.setProperty("--mouse-y", "50%");
  }
  const [activePage, setActivePage] = useState("review");
  const [language, setLanguage] = useState("javascript");

  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [dashboard, setDashboard] = useState({
    totalReviews: 0,
    languageStats: [],
    recentReviews: [],
    reviewActivity: []
});
async function handleAuth() {
      if (!authEmail.trim() || !authPassword.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    if (authMode === "register" && !authName.trim()) {
      alert("Please enter your name.");
      return;
    }
  try {
    if (authMode === "register") {
      await axios.post("http://localhost:3000/auth/register", {
        name: authName,
        email: authEmail,
        password: authPassword,
      });

      alert("Account created successfully. Please sign in.");
      setAuthMode("login");
      setAuthPassword("");
    } else {
      const response = await axios.post("http://localhost:3000/auth/login", {
  email: authEmail,
  password: authPassword,
});
localStorage.setItem("token", response.data.token);

      setIsAuthenticated(true);
    }
  } catch (error) {
    console.error("Authentication failed:", error);
    alert(
      error.response?.data?.message ||
      "Authentication failed. Please check your details."
    );
  }
}
  async function loadHistory() {
    try {
        const response = await axios.get(
    "http://localhost:3000/api/history",
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }
);

        setHistory(response.data);
    } catch (error) {
        console.error("Failed to load history:", error);
    }
}
async function loadDashboard() {
    try {
        const response = await axios.get(
    "http://localhost:3000/api/dashboard",
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }
);

        setDashboard(response.data);
    } catch (error) {
        console.error("Failed to load dashboard:", error);
    }
}
async function deleteReview(id) {
    try {
        await axios.delete(
            `http://localhost:3000/api/history/${id}`
        );

        setHistory((currentHistory) =>
            currentHistory.filter((item) => item._id !== id)
        );
    } catch (error) {
        console.error("Failed to delete review:", error);
    }
}

  function clearCode() {
  setCode("");
  setReview("");
  setLoading(false);
}
  async function reviewCode() {
    if (!code.trim()) return;

    setLoading(true);
    setReview("");

    try {
      const response = await axios.post(
  "http://localhost:3000/ai/get-review",
  { code, language },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

      setReview(response.data);
    } catch (error) {
      console.error(error);

      setReview(
        "### ⚠ Review Failed\n\nUnable to connect to the AI reviewer. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }

    if (!isAuthenticated) {
  return (
    <div className="auth-page">

      {/* ================= AUTH BACKGROUND ================= */}

      <div className="auth-background">

        <div className="code-glow glow-one"></div>
        <div className="code-glow glow-two"></div>

        <div className="floating-code code-one">
          {"</>"}
        </div>

        <div className="floating-code code-two">
          {"{ }"}
        </div>

        <div className="floating-code code-three">
          {"AI"}
        </div>

      </div>


      {/* ================= AUTH LAYOUT ================= */}

      <div className="auth-layout">


        {/* ================= LOGIN / REGISTER CARD ================= */}

        <div className="auth-card">

          <div className="auth-brand">

            <div className="auth-logo">
              ◈
            </div>

            <div>
              <h1>CODE-MATE</h1>
              <span>AI CODE REVIEWER</span>
            </div>

          </div>


          <h2>
            {authMode === "login"
              ? "Welcome Back"
              : "Create Account"}
          </h2>


          <p className="auth-subtitle">
            {authMode === "login"
              ? "Continue your journey to write better code."
              : "Create your developer account and start reviewing code."}
          </p>


       <div className={`auth-form ${authMode === "register" ? "auth-register" : "auth-login"}`}>


            {/* ================= NAME ================= */}

            {authMode === "register" && (
              <div className="auth-input-group">

                <label>NAME</label>

                <input
                  type="text"
                  placeholder="Your name"
                  value={authName}
                  onChange={(event) =>
                    setAuthName(event.target.value)
                  }
                />

              </div>
            )}


            {/* ================= EMAIL ================= */}

            <div className="auth-input-group">

              <label>EMAIL</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={authEmail}
                onChange={(event) =>
                  setAuthEmail(event.target.value)
                }
              />

            </div>


            {/* ================= PASSWORD ================= */}

            <div className="auth-input-group">

              <label>PASSWORD</label>

              <div className="password-input-wrapper">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={authPassword}
                  onChange={(event) =>
                    setAuthPassword(event.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>

            </div>


            {/* ================= AUTH BUTTON ================= */}

            <button
              className="auth-demo-button"
              onClick={handleAuth}
            >
              {authMode === "login"
                ? "⚡ SIGN IN"
                : "✦ CREATE ACCOUNT"}
            </button>


            {/* ================= SWITCH LOGIN / REGISTER ================= */}

            <p className="auth-switch">

              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}

              <button
                type="button"
                className="auth-link"
                onClick={() =>
                  setAuthMode(
                    authMode === "login"
                      ? "register"
                      : "login"
                  )
                }
              >
                {authMode === "login"
                  ? "Create account"
                  : "Sign in"}
              </button>

            </p>


          </div>

        </div>


        {/* ================= AI VISUAL PANEL ================= */}

        <div className="auth-visual">
          <div className="ai-scan-line"></div>

  <div className="visual-floating-code floating-one">
    const review = AI.analyze(code);
  </div>

  <div className="visual-floating-code floating-two">
    ✓ Syntax detected
  </div>

  <div className="visual-floating-code floating-three">
    {"{ quality: high }"}
  </div>

  <div className="visual-code-core">
  <div className="visual-core-ring"></div>

  <span className="ai-orbit-particle particle-one"></span>
  <span className="ai-orbit-particle particle-two"></span>
  <span className="ai-orbit-particle particle-three"></span>

  <div className="visual-code-symbol">
    &lt;/&gt;
  </div>
</div>
  <div className="ai-connection-line"></div>
  <div className="ai-data-pulse"></div>

          <div className="visual-code-symbol">
            &lt;/&gt;
          </div>

          <h2>
            Code smarter.
          </h2>

          <p>
            Review better.
          </p>

          <div className="visual-status">

            <span className="status-dot"></span>

            AI ENGINE ONLINE

          </div>

        </div>


      </div>

    </div>
  );
}
  return (
    <main className="app-shell">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        <div className="brand-section">

          <div className="brand-logo">
            ◈
          </div>

          <div className="brand-text">
            <h1>CODE-MATE</h1>
            <span>AI CODE REVIEWER</span>
          </div>

        </div>


        <div className="sidebar-divider"></div>


        <nav className="navigation">

          <p className="nav-label">
            WORKSPACE
          </p>

          <button
            className={`nav-item ${
              activePage === "dashboard" ? "active" : ""
            }`}
            onClick={() => {
    setActivePage("dashboard");
    loadDashboard();
}}
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </button>


          <button
            className={`nav-item ${
              activePage === "review" ? "active" : ""
            }`}
            onClick={() => setActivePage("review")}
          >
            <span className="nav-icon">⌘</span>
            <span>Code Review</span>
          </button>


          <button
    className={`nav-item ${
        activePage === "history" ? "active" : ""
    }`}
    onClick={() => {
        setActivePage("history");
        loadHistory();
    }}
>
    <span className="nav-icon">◷</span>
    <span>History</span>
</button>


          <p className="nav-label second">
            INSIGHTS
          </p>


          <button
            className={`nav-item ${
              activePage === "analytics" ? "active" : ""
            }`}
            onClick={() => setActivePage("analytics")}
          >
            <span className="nav-icon">◫</span>
            <span>Analytics</span>
          </button>


          <button
            className={`nav-item ${
              activePage === "learn" ? "active" : ""
            }`}
            onClick={() => setActivePage("learn")}
          >
            <span className="nav-icon">✦</span>
            <span>Learn</span>
          </button>

        </nav>


        <div className="sidebar-bottom">

          <button
            className={`nav-item ${
              activePage === "settings" ? "active" : ""
            }`}
            onClick={() => setActivePage("settings")}
          >
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </button>


          <div className="user-card">

            <div className="user-avatar">
              DK
            </div>

            <div className="user-info">
              <strong>Code-Mate Team</strong>
              <span>Developer</span>
            </div>

            <span className="user-menu">
              ⋮
            </span>

          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <section className="main-area">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="page-heading">

            <span className="page-kicker">
              WORKSPACE
            </span>

            <h2>
              {activePage === "review"
                ? "Code Review"
                : activePage.charAt(0).toUpperCase() +
                  activePage.slice(1)}
            </h2>

          </div>


          <div className="topbar-actions">

            <div className="engine-status">

              <span className="status-dot"></span>

              <span>
                AI ENGINE
              </span>

              <strong>
                ONLINE
              </strong>

            </div>

          </div>

        </header>


        {/* =================================================
            REVIEW WORKSPACE
        ================================================= */}

        {activePage === "review" && (

          <div className="workspace">

            {/* CODE PANEL */}

            <section className="glass-panel editor-panel">

              <div className="panel-toolbar">

                <div className="panel-title">

                  <span className="panel-dot blue"></span>

                  <span>
                    CODE EDITOR
                  </span>

                </div>


                <select
  className="language-select"
  value={language}
  onChange={(event) => setLanguage(event.target.value)}
>
                  <option value="javascript">
                    JavaScript
                  </option>

                  <option value="python">
                    Python
                  </option>

                  <option value="java">
                    Java
                  </option>

                  <option value="cpp">
                    C / C++
                  </option>
                </select>

              </div>


              <div className="editor-container">

                <Editor
                  value={code}
                  onValueChange={(value) =>
                    setCode(value)
                  }
                  highlight={(value) =>
                    prism.highlight(
                      value,
                      prism.languages.javascript,
                      "javascript"
                    )
                  }
                  padding={20}
                  style={{
                    fontFamily:
                      '"Fira Code", "Fira Mono", Consolas, monospace',
                    fontSize: 14,
                    lineHeight: 1.7,
                    minHeight: "100%",
                    width: "100%",
                  }}
                />

              </div>


              <div className="editor-footer">

                <div className="editor-info">
                  JavaScript
                </div>
                <div className="editor-actions">
<button
  className="clear-button"
  onClick={clearCode}
  disabled={loading}
>
  <span>⌫</span>
  CLEAR
</button>

                <button
                  className={`review-button ${
                    loading ? "loading" : ""
                  }`}
                  onClick={reviewCode}
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span className="button-spinner"></span>
                      ANALYZING...
                    </>
                  ) : (
                    <>
                      <span>⚡</span>
                      ANALYZE CODE
                    </>
                  )}

                </button>

              </div>
              </div>

            </section>


            {/* AI PANEL */}

            <section className="glass-panel review-panel">

              <div className="panel-toolbar">

                <div className="panel-title">

                  <span className="panel-dot purple"></span>

                  <span>
                    AI REVIEW
                  </span>

                </div>


                <div className="ai-mini-status">
                  ◉ GEMINI
                </div>

              </div>


              {!loading && !review && (

                <div className="review-empty">

                  <div className="ai-orb">

                    <span>
                      AI
                    </span>

                  </div>

                  <h3>
                    Ready to analyze
                  </h3>

                  <p>
                    Write or paste your code into the
                    editor and let Code-Mate identify
                    bugs, security issues and
                    improvements.
                  </p>


                  <div className="review-capabilities">

                    <span>
                      🐛 Bugs
                    </span>

                    <span>
                      🔐 Security
                    </span>

                    <span>
                      ⚡ Performance
                    </span>

                  </div>

                </div>

              )}


              {loading && (

                <div className="analysis-state">

                  <div className="analysis-orb">

                    <div className="analysis-ring"></div>

                    <div className="analysis-core">
                      AI
                    </div>

                  </div>


                  <h3>
                    Analyzing your code
                  </h3>

                  <p>
                    Code-Mate is examining your code...
                  </p>


                  <div className="analysis-list">

                    <div className="analysis-item completed">
                      <span>✓</span>
                      Syntax analysis
                    </div>

                    <div className="analysis-item completed">
                      <span>✓</span>
                      Logic analysis
                    </div>

                    <div className="analysis-item scanning">
                      <span>◉</span>
                      Security analysis
                    </div>

                    <div className="analysis-item">
                      <span>○</span>
                      Performance analysis
                    </div>

                  </div>

                </div>

              )}


              {!loading && review && (

                <div className="review-result">

                  <div className="complete-badge">
                    <span>✓</span>
                    ANALYSIS COMPLETE
                  </div>


                  <Markdown
                    rehypePlugins={[
                      rehypeHighlight
                    ]}
                    components={{

                      h1: ({ children }) => (
                        <h2 className="review-heading">
                          {children}
                        </h2>
                      ),

                      h2: ({ children }) => (
                        <h2 className="review-heading">
                          {children}
                        </h2>
                      ),

                      h3: ({ children }) => (
                        <h3 className="review-subheading">
                          {children}
                        </h3>
                      ),

                      p: ({ children }) => (
                        <p className="review-paragraph">
                          {children}
                        </p>
                      ),

                      ul: ({ children }) => (
                        <ul className="review-list">
                          {children}
                        </ul>
                      ),

                      ol: ({ children }) => (
                        <ol className="review-list">
                          {children}
                        </ol>
                      ),

                      pre: ({ children }) => (
                        <pre className="review-code">
                          {children}
                        </pre>
                      ),

                    }}
                  >
                    {review}
                  </Markdown>

                </div>

              )}

            </section>

          </div>

        )}


        {/* =================================================
            FUTURE PAGES
        ================================================= */}
       {activePage === "dashboard" && (
    <div className="dashboard-page">
        <h2>Dashboard</h2>

        <div className="dashboard-stats">
            <div className="dashboard-card">
                <span className="dashboard-card-label">
                    Total Reviews
                </span>

                <span className="dashboard-card-value">
                    {dashboard.totalReviews}
                </span>
            </div>

            <div className="dashboard-card">
                <span className="dashboard-card-label">
                    Languages Used
                </span>

                <span className="dashboard-card-value">
                    {dashboard.languageStats.length}
                </span>
            </div>
        </div>

        <div className="dashboard-section">
            <h3>Reviews by Language</h3>

            {dashboard.languageStats.length === 0 ? (
                <p>No review data available.</p>
            ) : (
                dashboard.languageStats.map((item) => (
                    <div
                        className="language-stat"
                        key={item._id}
                    >
                        <span>{item._id}</span>
                        <span>{item.count} reviews</span>
                    </div>
                ))
            )}
        </div>

        <div className="dashboard-section">
            <h3>Recent Reviews</h3>

            {dashboard.recentReviews.length === 0 ? (
                <p>No recent reviews.</p>
            ) : (
                dashboard.recentReviews.map((item) => (
                    <div
                        className="recent-review"
                        key={item._id}
                    >
                        <span>{item.language}</span>

                        <span>
                            {new Date(
                                item.createdAt
                            ).toLocaleString()}
                        </span>
                    </div>
                ))
            )}
    </div>
    <div className="dashboard-section">
    <h3>Review Activity</h3>

    {dashboard.reviewActivity.length === 0 ? (
        <p>No activity data available.</p>
    ) : (
        dashboard.reviewActivity.map((item) => (
            <div className="activity-stat" key={item._id}>
                <span>{item._id}</span>
                <span>{item.count} reviews</span>
            </div>
        ))
    )}
    </div>
</div>
)}
{activePage === "history" && (
    <div className="history-page">
        <h2>Review History</h2>

        {history.length === 0 ? (
            <p>No reviews found yet.</p>
        ) : (
            history.map((item) => (
                <div className="history-card" key={item._id}>
                    <div className="history-card-header">
                        <span>{item.language}</span>

                        <span>
                            {new Date(item.createdAt).toLocaleString()}
                                <button
        className="history-delete-button"
        onClick={() => deleteReview(item._id)}
    >
        DELETE
    </button>

                        </span>
                    </div>

                    <pre>{item.code}</pre>

                    <Markdown>
                        {item.review}
                    </Markdown>
                </div>
            ))
        )}
    </div>
)}




        {activePage !== "review" &&
    activePage !== "dashboard" &&
    activePage !== "history" && (

          <div className="coming-soon">

            <div className="coming-icon">
              ◈
            </div>

            <span>
              CODE-MATE
            </span>

            <h2>
              {activePage.charAt(0).toUpperCase() +
                activePage.slice(1)}
            </h2>

            <p>
              This module is coming next.
              We're building Code-Mate one
              layer at a time.
            </p>

          </div>

        )}

      </section>

    </main>
  );
}

export default App;
