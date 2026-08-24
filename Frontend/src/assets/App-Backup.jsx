import { useState } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  async function reviewCode() {
    if (!code.trim()) return;

    setLoading(true);
    setReview("");

    try {
      const response = await axios.post(
        "http://localhost:3000/ai/get-review",
        { code }
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
    <main>

      {/* LEFT PANEL */}
      <section className="left">

        {/* HEADER */}
        <div className="panel-header">

          <div className="brand">
            <div className="brand-icon">◈</div>

            <div>
              <h1>CODE-MATE</h1>
              <span>Smart AI Code Reviewer</span>
            </div>
          </div>

          <div className="ai-status">
            <span className="status-dot"></span>
            AI ENGINE ONLINE
          </div>

        </div>

        {/* EDITOR HEADER */}
        <div className="editor-header">

          <div className="editor-title">
            <span className="editor-dot"></span>
            CODE EDITOR
          </div>

          <select className="language-select" defaultValue="javascript">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C / C++</option>
          </select>

        </div>

        {/* CODE EDITOR */}
        <div className="code">

          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(
                code,
                prism.languages.javascript,
                "javascript"
              )
            }
            padding={18}
            style={{
              fontFamily:
                '"Fira Code", "Fira Mono", Consolas, monospace',
              fontSize: 15,
              lineHeight: 1.7,
              minHeight: "100%",
              width: "100%",
            }}
          />

        </div>

        {/* REVIEW BUTTON */}
        <button
          onClick={reviewCode}
          className={`review ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="button-spinner"></span>
              ANALYZING CODE...
            </>
          ) : (
            <>
              ⚡ ANALYZE CODE
            </>
          )}
        </button>

      </section>


      {/* RIGHT PANEL */}
      <section className="right">

        {/* REVIEW HEADER */}
        <div className="review-header">

          <div>
            <span className="review-eyebrow">
              AI ANALYSIS
            </span>

            <h2>
              {loading
                ? "Analyzing your code..."
                : review
                ? "Review Complete"
                : "AI Code Review"}
            </h2>
          </div>

          <div className="ai-orb">
            <span></span>
          </div>

        </div>


        {/* LOADING STATE */}
        {loading && (
          <div className="analysis-state">

            <div className="analysis-animation">
              <div className="analysis-ring"></div>
              <div className="analysis-core">AI</div>
            </div>

            <h3>Analyzing Code</h3>

            <p>
              Code-Mate is examining your code for
              quality, bugs, security and performance.
            </p>

            <div className="analysis-steps">

              <div className="analysis-step active">
                <span>✓</span>
                Syntax analysis
              </div>

              <div className="analysis-step active">
                <span>✓</span>
                Logic analysis
              </div>

              <div className="analysis-step scanning">
                <span>◉</span>
                Security scan
              </div>

              <div className="analysis-step">
                <span>○</span>
                Performance analysis
              </div>

            </div>

          </div>
        )}


        {/* EMPTY STATE */}
        {!loading && !review && (
          <div className="empty-review">

            <div className="empty-icon">
              ◈
            </div>

            <h2>
              Ready to review your code?
            </h2>

            <p>
              Enter your code in the editor and let
              Code-Mate analyze it using AI.
            </p>

            <div className="feature-row">

              <span>🐛 Bug Detection</span>
              <span>🔐 Security</span>
              <span>⚡ Performance</span>

            </div>

          </div>
        )}


        {/* REVIEW RESULT */}
        {!loading && review && (
          <div className="review-content">

            <div className="complete-badge">
              <span>✓</span>
              ANALYSIS COMPLETE
            </div>

            <Markdown
              rehypePlugins={[rehypeHighlight]}
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

    </main>
  );
}

export default App;