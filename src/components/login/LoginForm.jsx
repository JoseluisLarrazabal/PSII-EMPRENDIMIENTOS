// src/components/login/LoginForm.jsx
import React, { useState } from "react";
import LoginLogo from "./LoginLogo"; // Ensure casing matches the actual file path
import LoginLinks from "./LoginLinks";  // Ensure casing matches the actual file path
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();  // Hook for redirection after successful login

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
      // Verificar las credenciales llamando al backend
      const response = await fetch("http://localhost:8000/login", { // Suponiendo que la API de login está en esta URL
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Si las credenciales son correctas, redirigir al dashboard o al lugar correspondiente
        navigate("/");
      } else {
        // Si las credenciales son incorrectas
        setError(result.message || "Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <LoginLogo />
      
      <h1 className="text-gray-700 text-xl mb-6 text-center">
        Inicia sesión con tu ID (@univalle.edu)
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
            placeholder="Tu contraseña"
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
