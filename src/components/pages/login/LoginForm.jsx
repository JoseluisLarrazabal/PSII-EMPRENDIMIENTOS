<<<<<<< HEAD
// src/components/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ruta corregida
import LoginLogo from "../login/LoginLogo";
import LoginLinks from "../login/LoginLinks";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
=======
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
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
<<<<<<< HEAD
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      login(data.token, data.user);
      
      if (data.user?.rol === 'Administrador') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
=======
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
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  const handleGuestAccess = () => {
    navigate('/');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <LoginLogo />
      <h1 className="text-xl text-center my-4">Inicia sesión con tu correo electrónico</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="w-full p-2 border rounded"
          required
        />
        
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
          required
        />
=======
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
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf
        
        <button
          type="submit"
          disabled={isLoading}
<<<<<<< HEAD
          className={`w-full p-2 rounded text-white ${isLoading ? 'bg-gray-400' : 'bg-[#8B0D37] hover:bg-[#6d0a2b]'}`}
        >
          {isLoading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="my-4 flex items-center">
        <div className="flex-grow border-t"></div>
        <span className="mx-2">o</span>
        <div className="flex-grow border-t"></div>
      </div>

      <button
        onClick={handleGuestAccess}
        className={`w-full p-2 rounded font-medium transition-colors duration-200 ${
          isLoading ? 'bg-[#8d8d8d] text-white' : 'bg-[#8B0D37] hover:bg-[#6d0a2b] text-white'
        }`}
      >
        Continuar como invitado
      </button>

      <LoginLinks />
    </div>
  );
};
=======
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
>>>>>>> edcf309b50af2762a25fad97f381424ce31ededf

export default LoginForm;