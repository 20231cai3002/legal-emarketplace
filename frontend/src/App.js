import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterCitizenPage from './pages/RegisterCitizenPage';
import RegisterProviderPage from './pages/RegisterProviderPage';
import CitizenDashboard from './pages/CitizenDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/citizen" element={<RegisterCitizenPage />} />
          <Route path="/register/provider" element={<RegisterProviderPage />} />
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;