import { useState } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {

  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)

  async function reviewCode() {
    try {
      setLoading(true)

      const response = await axios.post(
        'http://localhost:3000/ai/get-review',
        { code }
      )

      setReview(response.data)
    } catch (error) {
      console.error(error)
      setReview('❌ Unable to get the code review. Please make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>

      {/* LEFT SIDE */}
      <div className="left">

        <div className="code">
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code =>
              prism.highlight(
                code,
                prism.languages.javascript,
                "javascript"
              )
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 16,
              minHeight: "100%",
              width: "100%",
              outline: "none"
            }}
          />
        </div>

        <button
          onClick={reviewCode}
          className="review"
          disabled={loading}
        >
          {loading ? "Reviewing..." : "Review"}
        </button>

      </div>

      {/* RIGHT SIDE */}
      <div className="right">

        {review ? (
          <div className="review-content">
            <Markdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => (
                  <h1 className="review-heading">{children}</h1>
                ),

                h2: ({ children }) => (
                  <h2 className="review-heading">{children}</h2>
                ),

                h3: ({ children }) => (
                  <h3 className="review-heading">{children}</h3>
                ),

                p: ({ children }) => (
                  <p className="review-paragraph">{children}</p>
                ),

                ul: ({ children }) => (
                  <ul className="review-list">{children}</ul>
                ),

                ol: ({ children }) => (
                  <ol className="review-list">{children}</ol>
                ),

                li: ({ children }) => (
                  <li>{children}</li>
                ),

                pre: ({ children }) => (
                  <pre className="review-code">
                    {children}
                  </pre>
                ),

                code: ({ children, className }) => (
                  <code className={className || ""}>
                    {children}
                  </code>
                )
              }}
            >
              {review}
            </Markdown>
          </div>
        ) : (
          <div className="empty-review">
            <h2>AI Code Review</h2>
            <p>
              Enter your code on the left and click Review to get
              an AI-powered analysis.
            </p>
          </div>
        )}

      </div>

    </main>
  )
}

export default App