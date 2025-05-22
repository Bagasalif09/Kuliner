import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TenantMenuPage from './pages/TenantMenuPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tenant/:id" element={<TenantMenuPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
