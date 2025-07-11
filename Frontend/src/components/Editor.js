import React, { useState, useEffect, useRef } from "react";
import MonacoEditor from "react-monaco-editor";
import * as monaco from "monaco-editor";

const CodeEditor = () => {
  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState("");
  const [username, setUsername] = useState("");
  const [lastEditor, setLastEditor] = useState("No one yet");

  const socket = useRef(null);
  const preventBroadcast = useRef(false);

  // Ask for username on load
  useEffect(() => {
    const name = prompt("Enter your name:");
    setUsername(name || "Anonymous");

    socket.current = new WebSocket("ws://localhost:5000/ws/room123");

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.code !== code) {
        preventBroadcast.current = true;
        setCode(message.code);
        setLastEditor(message.user);
      }
    };

    socket.current.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.current.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => socket.current.close();
  }, []);

  useEffect(() => {
    if (preventBroadcast.current) {
      preventBroadcast.current = false;
      return;
    }
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ user: username, code }));
    }
  }, [code]);

  useEffect(() => {
    if (language === "cpp") {
      monaco.languages.register({ id: "cpp" });
      monaco.languages.setMonarchTokensProvider("cpp", cppTokens);
    } else if (language === "java") {
      monaco.languages.register({ id: "java" });
      monaco.languages.setMonarchTokensProvider("java", javaTokens);
    } else if (language === "python") {
      monaco.languages.register({ id: "python" });
      monaco.languages.setMonarchTokensProvider("python", pythonTokens);
    }
  }, [language]);

  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const toggleTheme = () => setTheme(theme === "vs-dark" ? "light" : "vs-dark");

  const handleRunCode = async () => {
    try {
      const response = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await response.json();
      setOutput(data.output || data.error || "No output");
    } catch (err) {
      setOutput("Server error: " + err.message);
    }
  };

  const handleAIDebug = async () => {
    try {
      const response = await fetch("http://localhost:5000/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await response.json();
      alert("AI Suggestion:\n\n" + data.suggestion);
    } catch (err) {
      alert("AI Debug failed: " + err.message);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: theme === "vs-dark" ? "#121212" : "#f0f0f0" }}>
      {/* Toolbar */}
      <div style={{ padding: "10px 16px", backgroundColor: theme === "vs-dark" ? "#1e1e1e" : "#ffffff", borderBottom: "1px solid #ccc", display: "flex", alignItems: "center" }}>
        <select value={language} onChange={handleLanguageChange} style={{ marginRight: "10px", padding: "6px" }}>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>

        <button onClick={toggleTheme} style={buttonStyle(theme)}>
          {theme === "vs-dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button onClick={handleAIDebug} style={buttonStyle(theme, "#00d1b2")}>
          🧠 AI Debug
        </button>

        <button onClick={handleRunCode} style={buttonStyle(theme, "#ffc107")}>
          ▶️ Run
        </button>

        <span style={{ marginLeft: "auto", fontSize: "14px", color: theme === "vs-dark" ? "#ccc" : "#444" }}>
          ✏️ Last edited by: <strong>{lastEditor}</strong>
        </span>
      </div>

      {/* Monaco Editor */}
      <div style={{ flexGrow: 1 }}>
        <MonacoEditor
          height="100%"
          width="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={(newCode) => setCode(newCode)}
          options={{
            selectOnLineNumbers: true,
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: "on",
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output */}
      <div style={{
        backgroundColor: theme === "vs-dark" ? "#1e1e1e" : "#ffffff",
        padding: "12px 16px",
        borderTop: "1px solid #ccc",
        height: "150px",
        overflowY: "auto",
        color: theme === "vs-dark" ? "#dcdcdc" : "#222",
        fontFamily: "monospace",
        fontSize: "14px",
        whiteSpace: "pre-wrap"
      }}>
        <strong>Output:</strong>
        <pre style={{ marginTop: "10px" }}>{output || "Click ▶ Run to see output here."}</pre>
      </div>
    </div>
  );
};

const buttonStyle = (theme, color = "#4CAF50") => ({
  padding: "6px 12px",
  marginLeft: "10px",
  backgroundColor: color,
  color: theme === "vs-dark" ? "#000" : "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold"
});

// === LANGUAGE TOKEN PROVIDERS ===

const cppTokens = {
  tokenizer: {
    root: [
      [/#include/, "keyword"],
      [/\b(int|float|double|return|cout|cin|std|endl)\b/, "keyword"],
      [/".*?"/, "string"],
      [/\d+/, "number"],
      [/[{}()\[\]]/, "@brackets"],
      [/\/\/.*$/, "comment"]
    ]
  }
};

const javaTokens = {
  tokenizer: {
    root: [
      [/\b(public|private|protected|class|static|void|main|new|return|if|else)\b/, "keyword"],
      [/".*?"/, "string"],
      [/\d+/, "number"],
      [/[{}()\[\]]/, "@brackets"],
      [/\/\/.*$/, "comment"]
    ]
  }
};

const pythonTokens = {
  tokenizer: {
    root: [
      [/\b(def|return|if|else|elif|import|as|from|for|while|class|try|except)\b/, "keyword"],
      [/".*?"/, "string"],
      [/\d+/, "number"],
      [/[{}()\[\]]/, "@brackets"],
      [/#.*$/, "comment"]
    ]
  }
};

export default CodeEditor;
