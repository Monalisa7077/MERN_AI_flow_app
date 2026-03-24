import React, { useState } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("AI response will appear here...");
  const [loading, setLoading] = useState(false);

  const nodes = [
    {
      id: "1",
      data: {
        label: (
          <div className="node-content">
            <div className="node-header">📝 Input</div>
            <textarea
              placeholder="Enter your prompt..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="prompt-textarea"
            />
          </div>
        ),
      },
      position: { x: 80, y: 150 },
      style: {
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        border: "1px solid rgba(0, 255, 255, 0.3)",
        borderRadius: "16px",
        padding: "12px",
        width: "280px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 255, 255, 0.1)",
      },
    },
    {
      id: "2",
      data: {
        label: (
          <div className="node-content">
            <div className="node-header">🤖 Response</div>
            <div className="response-box">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="response-text">{output}</div>
              )}
            </div>
          </div>
        ),
      },
      position: { x: 480, y: 150 },
      style: {
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        border: "1px solid rgba(0, 255, 255, 0.3)",
        borderRadius: "16px",
        padding: "12px",
        width: "300px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 255, 255, 0.1)",
      },
    },
  ];

  const edges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "#00ffff", strokeWidth: 2 },
      markerEnd: { type: "arrowclosed", color: "#00ffff" },
    },
  ];

  const runFlow = async () => {
    if (!input) {
      setOutput("⚠️ Please enter a prompt");
      return;
    }

    try {
      setLoading(true);
      setOutput("");

      // ✅ FIX 1: Correct API endpoint
      const res = await axios.post(
        "https://mern-ai-flow-app-2.onrender.com/api/ask-ai",
        {
          prompt: input,
        }
      );

      // ✅ FIX 2: Correct response key
      setOutput(res.data.response || "No response from AI");
    } catch (error) {
      console.error("Error:", error);
      setOutput("❌ Cannot connect to backend. Check server.");
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    if (
      !output ||
      output.includes("❌") ||
      output === "AI response will appear here..."
    ) {
      alert("Nothing valid to save");
      return;
    }

    try {
      // ✅ FIX 3: Removed localhost
      await axios.post(
        "https://mern-ai-flow-app-2.onrender.com/api/save",
        {
          prompt: input,
          response: output,
        }
      );

      alert("✅ Saved to MongoDB");
    } catch (error) {
      console.error(error);
      alert("❌ Save failed");
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <h1>MERN AI Flow</h1>
        </div>
        <div className="button-group">
          <button onClick={runFlow} className="btn-primary">
            <span>▶</span> Run Flow
          </button>
          <button onClick={saveData} className="btn-secondary">
            <span>💾</span> Save
          </button>
        </div>
      </div>

      <div className="flow-container">
        <ReactFlow nodes={nodes} edges={edges} fitView />
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0a0a0f;
          overflow: hidden;
        }

        .app-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%);
        }

        /* Header Styles */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 255, 255, 0.2);
          z-index: 10;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 28px;
          filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.6));
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        .header h1 {
          background: linear-gradient(135deg, #ffffff 0%, #00ffff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: 1.8rem;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .button-group {
          display: flex;
          gap: 16px;
        }

        .btn-primary, .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .btn-primary {
          background: linear-gradient(135deg, #00ffff, #0099ff);
          color: #0a0a0f;
          box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 255, 255, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(0, 255, 255, 0.3);
          backdrop-filter: blur(5px);
        }

        .btn-secondary:hover {
          background: rgba(0, 255, 255, 0.15);
          border-color: rgba(0, 255, 255, 0.6);
          transform: translateY(-2px);
        }

        /* Flow Container */
        .flow-container {
          flex: 1;
          position: relative;
          background: radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.03) 0%, transparent 50%);
        }

        /* Node Content Styles */
        .node-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .node-header {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #00ffff;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
        }

        .prompt-textarea {
          width: 100%;
          min-height: 100px;
          background: rgba(10, 10, 20, 0.8);
          border: 1px solid rgba(0, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px;
          color: #ffffff;
          font-family: inherit;
          font-size: 0.9rem;
          resize: vertical;
          transition: all 0.3s ease;
        }

        .prompt-textarea:focus {
          outline: none;
          border-color: #00ffff;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
        }

        .prompt-textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .response-box {
          min-height: 100px;
          background: rgba(10, 10, 20, 0.6);
          border-radius: 12px;
          padding: 12px;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .response-text {
          color: #e0e0e0;
          font-size: 0.9rem;
          line-height: 1.5;
          word-break: break-word;
          white-space: pre-wrap;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #00ffff;
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(0, 255, 255, 0.2);
          border-top-color: #00ffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Custom ReactFlow Edge Styles */
        .react-flow__edge-path {
          stroke: #00ffff;
          stroke-width: 2;
        }

        .react-flow__edge-animated path {
          stroke-dasharray: 5;
          animation: dashdraw 0.5s linear infinite;
        }

        @keyframes dashdraw {
          from {
            stroke-dashoffset: 10;
          }
        }

        /* Custom Node Handle Styles */
        .react-flow__handle {
          background: #00ffff;
          width: 8px;
          height: 8px;
          border: none;
        }

        .react-flow__handle-right {
          right: -4px;
        }

        .react-flow__handle-left {
          left: -4px;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.4);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
}

export default App;