import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx'; // Importa el componente Home

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal que renderiza la página de inicio (Home.jsx) */}
        <Route path="/" element={<Home />} />
        {/* Otras rutas que puedas agregar más adelante */}
        {/* <Route path="/noticias" element={<Noticias />} /> */}
        {/* <Route path="/eventos" element={<Eventos />} /> */}
        {/* <Route path="/mentores" element={<Mentores />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
