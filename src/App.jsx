import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx'; // Importa el componente Home
import Inspiring from './pages/Inspiring.jsx'; // Importa la nueva página Inspiring
import Challenger from './pages/Challenger.jsx';


function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal que renderiza la página de inicio (Home.jsx) */}
        <Route path="/" element={<Home />} />
        <Route path="/inspiring" element={<Inspiring />} />
        <Route path="/challenger" element={<Challenger />} />

        {/* Otras rutas que puedas agregar más adelante */}
        {/* <Route path="/noticias" element={<Noticias />} /> */}
        {/* <Route path="/eventos" element={<Eventos />} /> */}
        {/* <Route path="/mentores" element={<Mentores />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
