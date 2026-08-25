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
  async function loadHistory() {
    try {
        const response = await axios.get(
            "http://localhost:3000/api/history"
        );

        setHistory(response.data);
    } catch (error) {
        console.error("Failed to load history:", error);
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
        { code,language }
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
            onClick={() => setActivePage("dashboard")}
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




        {activePage !== "review" && (

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
