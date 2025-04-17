// src/components/login/LoginLinks.jsx
import React from "react";
import { Link } from "react-router-dom";

function LoginLinks() {
  return (
    <div className="mt-6 space-y-2">
      <div className="text-center">
        <Link to="/help" className="text-blue-600 hover:text-blue-800 text-sm">
          ¿Qué es esto?
        </Link>
      </div>
      
      <div className="text-center">
        <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm">
          Olvidé mi Contraseña!
        </Link>
      </div>
      
      <div className="text-center">
        <Link to="/register" className="text-blue-600 hover:text-blue-800 text-sm">
          No tengo un ID. Crearte uno
        </Link>
      </div>
    </div>
  );
}

export default LoginLinks;