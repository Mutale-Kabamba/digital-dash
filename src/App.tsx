import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './assets/css/style.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Returns from './pages/Returns';
import SME from './pages/SME';

// Tools
import NAPSATool from './tools/NAPSATool';
import NHIMATool from './tools/NHIMATool';
import InvoiceTool from './tools/InvoiceTool';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dash" element={<Dashboard />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/sme" element={<SME />} />
            <Route path="/tools/napsa" element={<NAPSATool />} />
            <Route path="/tools/nhima" element={<NHIMATool />} />
            <Route path="/tools/invoice" element={<InvoiceTool />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
