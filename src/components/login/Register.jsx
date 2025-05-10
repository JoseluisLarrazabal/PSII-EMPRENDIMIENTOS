import React, { useState } from "react";
import LoginLogo from "../login/LoginLogo";
import { Link, useNavigate } from "react-router-dom";

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    rol: "Administrador"  // Valor por defecto, puedes cambiarlo según lo que necesites
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage(""); // Limpiar el mensaje de éxito al intentar registrar

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    // Validar el formato del email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@univalle\.edu$/;
    if (!emailRegex.test(formData.email)) {
      setError("El correo electrónico debe ser válido y tener el dominio '@univalle.edu'.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Registrando usuario:", formData);

      // Hacer una solicitud POST a la API de Express
      const response = await fetch("http://localhost:8000/usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password, // Solo enviamos la contraseña, ya que la encriptación se maneja en el backend
          rol: formData.rol // Enviar el rol al backend
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Si el registro es exitoso, mostrar el mensaje de éxito y redirigir al login
        setSuccessMessage("Usuario registrado correctamente");
        setTimeout(() => {
          navigate("/login"); // Redirigir al login después de unos segundos
        }, 2000); // 2 segundos para mostrar el mensaje
      } else {
        // Si ocurre un error, muestra el mensaje de error
        setError(result.message || "Error al registrar. Intenta nuevamente.");
      }
    } catch (err) {
      setError("Error al registrar. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado Izquierdo - Formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <LoginLogo />
          <h1 className="text-gray-700 text-xl mb-6 text-center">
            Crea una cuenta con tu ID (@univalle.edu)
          </h1>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Crea una contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirma tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                required
              />
            </div>

            <div>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                required
              >
                <option value="Administrador">Administrador</option>
                <option value="Emprendedor">Emprendedor</option>
                <option value="Mentor">Mentor</option>
                <option value="Institución">Institución</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#8B0D37] text-white py-2 px-4 rounded hover:bg-[#6d0a2b] transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <p className="text-sm text-blue-600 text-center space-x-2 mt-8">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>

      {/* Lado Derecho - Imagen */}
      <div
        className="hidden md:flex w-1/2 items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/registro-bg.jpg')" }}
      >
        {/* Aquí la imagen de fondo */}
      </div>
    </div>
  );
}

export default RegisterForm;
