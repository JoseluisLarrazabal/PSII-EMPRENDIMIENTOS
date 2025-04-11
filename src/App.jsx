import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/NavBar";

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<h1></h1>} />
        <Route path="/about" element={<h2>Acerca de Nosotros</h2>} />
        <Route path="/services" element={<h2>Servicios</h2>} />
        <Route path="/crowdfunding" element={<h2>Crowd Funding</h2>} />
        <Route path="/support" element={<h2>Apoya a Emprendedor</h2>} />
        <Route path="/apply" element={<h2>Postulaciones</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
