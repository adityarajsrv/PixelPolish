import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ImageUploader from './components/ImageUploader'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enhancer" element={<ImageUploader />} />
      </Routes>
    </Router>
  );
};

export default App;
