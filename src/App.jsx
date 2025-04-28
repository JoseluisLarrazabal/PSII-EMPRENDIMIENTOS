// src/App.jsx (versión alternativa)
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import SubNav from "./components/SubNav";
import Footer from "./components/Footer";
import Home from "./components/pages/home/Home";
import QuienesSomos from "./components/pages/quienesSomos/QuienesSomos";
import Login from "./components/pages/login/Login";
import Mentoring from "./components/pages/Mentoring";
import Contact from "./components/pages/Contact";
import Revenue from "./components/pages/Revenue";
import Partners from  "./components/pages/Partners";
import Inspiring from "./components/pages/Inspiring";
import Challengers from "./components/pages/Challengers";
import Eventos from "./components/pages/Eventos";
import Servicios from "./components/pages/Servicios";
import MoocsPage from "./components/pages/moocs/MoocsPage";

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
          <Route path="/login" element={<Login />} />
          <Route path="/mentoring" element={<Mentoring />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/servicios/revenue" element={<Revenue />} />
          <Route path="/servicios/partners" element={<Partners />} />
          <Route path="/servicios/inspiring" element={<Inspiring />} />         
          <Route path="/servicios/challengers" element={<Challengers />} />
          <Route path="/servicios/moocs" element={<MoocsPage />} />
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