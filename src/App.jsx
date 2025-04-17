import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PROGRAMAS from "./components/PROGRAMAS";
import EVENTOS from "./components/Eventos";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-white shadow px-6 py-4 flex gap-6 text-lg font-semibold">
          <Link to="/" className="hover:text-cyan-600">Programas</Link>
          <Link to="/eventos" className="hover:text-cyan-600">Eventos</Link>
        </nav>

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<PROGRAMAS />} />
          <Route path="/eventos" element={<EVENTOS />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
