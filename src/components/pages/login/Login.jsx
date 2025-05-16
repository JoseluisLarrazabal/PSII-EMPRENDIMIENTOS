// src/components/pages/Login.jsx
import React from "react";
<<<<<<< HEAD:src/components/pages/Login.jsx
import LoginBackground from "../login/LoginBackground"; // Asegúrate de que coincida con la estructura real
import LoginForm from "../login/LoginForm"; 
import Registrer from "../login/Register";
=======
import LoginBackground from "./LoginBackground"; // Asegúrate de que coincida con la estructura real
import LoginForm from "./LoginForm"; 
>>>>>>> 377fb1009013093f21714151949ea93949a47e48:src/components/pages/login/Login.jsx

function Login() {
  // Podríamos ocultar Navbar, SubNav y Footer para esta página
  React.useEffect(() => {
    // Ocultar elementos de navegación solo en la página de login
    document.body.classList.add('login-page');
    
    return () => {
      // Restaurar al salir del componente
      document.body.classList.remove('login-page');
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Lado izquierdo - Imagen de fondo */}
      <LoginBackground />
      
      {/* Lado derecho - Formulario de login */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;