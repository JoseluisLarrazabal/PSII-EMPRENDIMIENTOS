// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import SubNav from "./components/SubNav";
import Footer from "./components/Footer";

import Home from "./components/pages/Home";
import QuienesSomos from "./components/pages/QuienesSomos";
import Login from "./components/pages/Login";
import Register from "./components/login/Register"; // <-- Importar Register.jsx
import Mentoring from "./components/pages/Mentoring";
import Contact from "./components/pages/Contact";
import Revenue from "./components/pages/Revenue";
import Partners from "./components/pages/Partners";
import Inspiring from "./components/pages/Inspiring";
import Challengers from "./components/pages/Challengers";
import Eventos from "./components/pages/Eventos";
import Servicios from "./components/pages/Servicios";
import MoocsPage from "./components/pages/MoocsPage";
import CrudRevenue from "./components/pages/CrudRevenue";
import CrudPartner from "./components/pages/CrudPartner";

// Componente para controlar la visualización de elementos de navegación
function AppContent() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/login" || location.pathname === "/register"; 
  // Ocultar si estamos en login o en register

  return (
    <div>
      {!hideNavAndFooter && <Navbar />}
      {!hideNavAndFooter && <SubNav />}
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* Agregar ruta de Register */}
          <Route path="/mentoring" element={<Mentoring />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/servicios/revenue" element={<Revenue />} />
          <Route path="/servicios/partners" element={<Partners />} />
          <Route path="/servicios/inspiring" element={<Inspiring />} />
          <Route path="/servicios/challengers" element={<Challengers />} />
          <Route path="/servicios/moocs" element={<MoocsPage />} />
          <Route path="/crud-revenue" element={<CrudRevenue />} />
          <Route path="/crud-partner" element={<CrudPartner />} />
        </Routes>
      </main>

      {!hideNavAndFooter && <Footer />}
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
