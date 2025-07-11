# 💻 Collaborative Code Editor with AI Copilot

A modern, real-time collaborative code editing platform that lets multiple users edit code together seamlessly — with plans to integrate an AI copilot for intelligent code suggestions, debugging, and auto-corrections.

---

## 🚀 Features

✅ Real-time collaborative code editing using WebSockets  
✅ Language selection support (Python, Java, C++, JavaScript, and more)  
✅ Beautiful, fast, and responsive code editor powered by CodeMirror  
✅ Dark and light theme toggle  
✅ Syntax highlighting and formatting  
✅ Integrated code execution (per language) — run and see output side-by-side  
✅ User-friendly UI with clean modular design  

⚡ **Upcoming (In Progress):**  
- AI Copilot integration for intelligent suggestions, debugging, and code completion

---

## 🛠️ Tech Stack

- **Frontend:** React (TypeScript), Tailwind CSS, CodeMirror
- **Backend:** Python (FastAPI), WebSockets
- **Real-time:** FastAPI WebSocket endpoints
- **AI Copilot (upcoming):** OpenAI or Gemini API for code suggestions

---

## 💻 Installation

```bash
git clone https://github.com/yourusername/collab-code-editor.git
cd collab-code-editor

cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

cd frontend
npm install
npm run dev

OPENAI_API_KEY=your_api_key_here

collab-code-editor/
│
├── backend/
│   ├── main.py
│   ├── websocket_manager.py
│   ├── ai_copilot.py  # (in progress)
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Editor.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Toolbar.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
├── README.md





