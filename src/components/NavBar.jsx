import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <div className="nav-links">
        <Link to="/about">Acerca de nosotros</Link>
        <Link to="/services">Nuestros servicios</Link>
        <Link to="/crowdfunding">Crowd Funding</Link>
        <Link to="/support">Apoya a emprendedor</Link>
        <Link to="/apply">Postulaciones</Link>
      </div>
    </nav>
  );
};

export default Navbar;

