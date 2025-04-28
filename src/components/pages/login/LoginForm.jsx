// src/components/login/LoginForm.jsx
import React, { useState } from "react";
import LoginLogo from "./LoginLogo"; // Ensure casing matches the actual file path
import LoginLinks from "./LoginLinks";  // Ensure casing matches the actual file path
// Fix casing for the import statement
function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Aquí iría la lógica de autenticación
      // Por ejemplo: await authService.login(formData.email, formData.password);
      console.log("Iniciando sesión con:", formData);
      
      // Simulamos un retraso para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir al usuario después del login exitoso
      // navigate("/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <LoginLogo />
      
      <h1 className="text-gray-700 text-xl mb-6 text-center">
        Inicia sesion con tu ID (@univalle.edu)
      </h1>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ID@univalle.edu"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Your ID Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#8B0D37] text-white py-2 px-4 rounded hover:bg-[#6d0a2b] transition-colors ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
      
      {/* Enlaces de ayuda */}
      <LoginLinks />
    </div>
  );
}

export default LoginForm;