import React, { useEffect } from 'react';
import backgroundImage from '/fondo.jpg'; // Asegúrate de que esta ruta sea correcta

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Overlay oscuro */}
        <div className="bg-black bg-opacity-60 min-h-screen w-full px-4 py-10 text-white">
          {/* Encabezado */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              ¡Es Fácil Contactarnos!
            </h2>
            <p className="text-lg">Completa el formulario y con gusto te atenderemos</p>
          </div>

          {/* Formulario */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-xl bg-white bg-opacity-90 rounded-lg p-8 shadow-lg text-black">
              <form className="space-y-4">
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                  type="text"
                  placeholder="Ej. María Hernández"
                />
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                  type="email"
                  placeholder="Ej. maria@ejemplo.com"
                />
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                  type="tel"
                  placeholder="71234567"
                />
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                >
                  <option>- Selecciona -</option>
                  <option>Consulta</option>
                  <option>Soporte</option>
                </select>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                  placeholder="Escribe tu mensaje..."
                  rows="4"
                ></textarea>

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
              <span className="text-white hover:text-[#880043] transition cursor-pointer">
                <i className="fab fa-facebook"></i>
              </span>
              <span className="text-white hover:text-[#880043] transition cursor-pointer">
                <i className="fab fa-instagram"></i>
              </span>
              <span className="text-white hover:text-[#880043] transition cursor-pointer">
                <i className="fab fa-youtube"></i>
              </span>
              <span className="text-white hover:text-[#880043] transition cursor-pointer">
                <i className="fab fa-linkedin"></i>
              </span>
            </div>

            <div className="mt-4 text-white">
              <p>También podemos estar en contacto a través de nuestras redes sociales.</p>
              <p>Encuéntranos como: <strong>@incuvalab_oficial</strong></p>
            </div>
          </div>

          {/* Botón para volver al inicio */}
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


    </>
  );
};

export default ContactPage;
