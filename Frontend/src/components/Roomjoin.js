// src/components/RoomJoin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RoomJoin() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId.trim()) {
      navigate(`/editor/${roomId}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Join a Code Room</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
}

export default RoomJoin;
