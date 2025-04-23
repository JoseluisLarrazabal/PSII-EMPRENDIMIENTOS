// src/App.jsx (versión alternativa)
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import SubNav from "./components/SubNav";
import Footer from "./components/Footer";
import Home from "./components/pages/Home";
import QuienesSomos from "./components/pages/QuienesSomos";
import Login from "./components/pages/Login";
import MoocsPage from "./components/pages/MoocsPage";

// Componente para controlar la visualización de elementos de navegación
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  
  return (
    <div>
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <SubNav />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/moocs" element={<MoocsPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;