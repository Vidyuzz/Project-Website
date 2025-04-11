// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './NavBar';
import TextEditor from './TextEditor';
import App1 from './ParentComponent';
import ImageUpload from './Image';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<App1 />} /> {/* Default route */}
        <Route path="/Image" element={<ImageUpload />} />
        <Route path="/TextEditor" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
