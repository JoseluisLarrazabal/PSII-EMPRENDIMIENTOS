import React, { useState, useEffect } from 'react';

const CrudProyecto = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    nombre_estudiante: '',
    semestre: '',
    carrera: '',
    contacto: '',
    nombre_proyecto: '',
    descripcion_proyecto: '',
    tipo_proyecto: '',
    requerimiento: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/proyectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          nombre_estudiante: '',
          semestre: '',
          carrera: '',
          contacto: '',
          nombre_proyecto: '',
          descripcion_proyecto: '',
          tipo_proyecto: '',
          requerimiento: '',
        });
        setShowSuccessModal(true);
        setShowErrorModal(false);
      } else throw new Error('Error al enviar el formulario');
    } catch (err) {
      setError('Hubo un error al enviar. Intenta más tarde.');
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl border-t-[10px] border-[#880043] font-montserrat"
      >
        <h2 className="text-2xl font-bold text-[#880043] mb-6 text-center">Registro de Proyecto</h2>

        {/* Campos */}
        {[
          { label: 'Nombre del estudiante', name: 'nombre_estudiante' },
          { label: 'Semestre del estudiante', name: 'semestre' },
          { label: 'Carrera', name: 'carrera' },
          { label: 'Contacto', name: 'contacto' },
          { label: 'Nombre del proyecto', name: 'nombre_proyecto' },
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block mb-1 text-[#8d8d8d]">{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
              required
            />
          </div>
        ))}

        {/* Descripción */}
        <div className="mb-4">
          <label className="block mb-1 text-[#8d8d8d]">Descripción del proyecto</label>
          <textarea
            name="descripcion_proyecto"
            value={formData.descripcion_proyecto}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          ></textarea>
        </div>

        {/* Tipo de proyecto */}
        <div className="mb-4">
          <label className="block mb-1 text-[#8d8d8d]">Tipo de proyecto</label>
          <select
            name="tipo_proyecto"
            value={formData.tipo_proyecto}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="Proyecto de aula">Proyecto de aula</option>
            <option value="Proyecto de titulación">Proyecto de titulación</option>
            <option value="Proyecto personal">Proyecto personal</option>
          </select>
        </div>

        {/* Requerimiento */}
        <div className="mb-6">
          <label className="block mb-1 text-[#8d8d8d]">Requerimiento</label>
          <textarea
            name="requerimiento"
            value={formData.requerimiento}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          ></textarea>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-[#66b5cb] text-white py-3 rounded-full font-semibold"
        >
          Enviar
        </button>
      </form>

      {/* Modales */}
      {showErrorModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-red-600 text-2xl font-semibold mb-4">Error</h3>
            <p className="text-[#8d8d8d]">{error}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-4 w-full bg-[#880043] text-white py-3 rounded-full font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-green-600 text-2xl font-semibold mb-4">¡Formulario enviado!</h3>
            <p className="text-[#8d8d8d]">Tu proyecto fue registrado exitosamente.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 w-full bg-[#66b5cb] text-white py-3 rounded-full font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudProyecto;
