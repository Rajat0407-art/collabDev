// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomJoin from './components/Roomjoin';
import Editor from './components/Editor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomJoin />} />
        <Route path="/editor/:roomId" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
