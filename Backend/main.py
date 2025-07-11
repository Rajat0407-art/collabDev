from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess

app = FastAPI()

# CORS settings (important for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket manager for collaborative editing
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = []
        self.active_connections[room].append(websocket)

    def disconnect(self, websocket: WebSocket, room: str):
        self.active_connections[room].remove(websocket)

    async def broadcast(self, room: str, message: str):
        for connection in self.active_connections.get(room, []):
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(room_id, data)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)

# For running code
class CodeRequest(BaseModel):
    language: str
    code: str

@app.post("/run")
async def run_code(req: CodeRequest):
    if req.language == "python":
        result = subprocess.run(["python3", "-c", req.code], capture_output=True, text=True)
        return {"output": result.stdout, "error": result.stderr}
    return {"error": "Language not supported yet"}

@app.post("/debug")
async def debug_code(req: CodeRequest):
    # Placeholder AI logic
    return {"suggestion": f"Suggestion for code in {req.language}:\nCheck indentation or syntax."}
