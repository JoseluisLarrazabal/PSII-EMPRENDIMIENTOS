// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SubNav from "./components/SubNav";
import Footer from "./components/Footer";
// Rutas corregidas para las páginas
import Home from "./components/pages/Home";
import QuienesSomos from "./components/pages/QuienesSomos";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <SubNav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;