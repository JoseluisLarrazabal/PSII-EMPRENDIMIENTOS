import React, { useState, useEffect } from 'react';
import backgroundImage from '/fondo.jpg'; 
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    correo: '',
    telefono: '',
    seleccion: '',
    mensaje: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombres || !formData.correo || !formData.telefono || !formData.seleccion || !formData.mensaje) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          mensaje_enviado: formData.mensaje
        }),
      });

      const data = await response.json();
      alert(data.message);

      // Reset form
      setFormData({
        nombres: '',
        correo: '',
        telefono: '',
        seleccion: '',
        mensaje: ''
      });
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Hubo un error al enviar el formulario.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen w-full px-4 py-10 text-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">¡Es Fácil Contactarnos!</h2>
          <p className="text-lg">Completa el formulario y con gusto te atenderemos</p>
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full max-w-xl bg-white bg-opacity-90 rounded-lg p-8 shadow-lg text-black">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                type="text"
                placeholder="Ej. María Hernández"
              />
              <input
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                type="email"
                placeholder="Ej. maria@ejemplo.com"
              />
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                type="tel"
                placeholder="71234567"
              />
              <select
                name="seleccion"
                value={formData.seleccion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="">- Selecciona -</option>
                <option value="Consulta">Consulta</option>
                <option value="Soporte">Soporte</option>
              </select>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Escribe tu mensaje..."
                rows="4"
              ></textarea>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-[#66B5CB] text-white py-2 rounded hover:bg-[#80a7b2] transition duration-300"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="text-center mt-10">
          <div className="flex justify-center space-x-6 text-3xl">
            <FaFacebook className="hover:text-[#880043] cursor-pointer" />
            <FaInstagram className="hover:text-[#880043] cursor-pointer" />
            <FaYoutube className="hover:text-[#880043] cursor-pointer" />
            <FaLinkedin className="hover:text-[#880043] cursor-pointer" />
          </div>
          <div className="mt-4 text-white">
            <p>También podemos estar en contacto a través de nuestras redes sociales.</p>
            <p>Encuéntranos como: <strong>@incuvalab_oficial</strong></p>
          </div>
        </div>

        {/* Botón volver al inicio */}
        <div className="text-center mt-10">
          <a
            href="/"
            className="inline-block px-6 py-2 border border-white rounded text-white hover:bg-white hover:text-[#66B5CB] transition duration-300"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
