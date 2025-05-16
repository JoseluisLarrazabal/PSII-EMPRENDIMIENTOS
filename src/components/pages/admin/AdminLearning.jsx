import React from "react";

const AdminLearning = ({
  learningList,
  showForm,
  currentLearning,
  formData,
  handleInputChange,
  handleSubmit,
  setShowForm,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#8B0D37]">Gestión de MOOCs</h2>
        <button
          onClick={() => {
            setShowForm(true);
            if (currentLearning) currentLearning(null);
          }}
          className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6d0a2b]"
        >
          Añadir MOOC
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-medium mb-4">
            {currentLearning ? "Editar MOOC" : "Añadir Nuevo MOOC"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Inputs */}
              {[
                ["Título", "title"],
                ["Proveedor", "provider"],
                ["URL de Imagen", "image_url"],
                ["URL de Logo", "logo_url"],
                ["Tipo", "type"],
                ["Categoría", "category"],
              ].map(([label, name]) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteo de Cursos
                </label>
                <input
                  type="number"
                  name="course_count"
                  value={formData.course_count || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Checkbox fields */}
              {[
                ["Popular", "is_popular"],
                ["Nuevo", "is_new"],
                ["Tendencia", "is_trending"],
              ].map(([label, name]) => (
                <div key={name} className="flex items-center">
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name] || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#8B0D37] focus:ring-[#8B0D37] border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    {label}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#8B0D37] text-white rounded hover:bg-[#6d0a2b]"
              >
                {currentLearning ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr>
              {[
                "Título",
                "Proveedor",
                "Categoría",
                "Tipo",
                "Cursos",
                "Logo",
                "Imagen",
                "Estado",
                "Acciones",
              ].map((header) => (
                <th
                  key={header}
                  className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left font-semibold text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {learningList.map((mooc) => (
              <tr key={mooc.id}>
                <td className="py-2 px-4 border-b border-gray-200">{mooc.title}</td>
                <td className="py-2 px-4 border-b border-gray-200">{mooc.provider}</td>
                <td className="py-2 px-4 border-b border-gray-200">{mooc.category}</td>
                <td className="py-2 px-4 border-b border-gray-200">{mooc.type}</td>
                <td className="py-2 px-4 border-b border-gray-200">{mooc.course_count}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {mooc.logo_url && (
                    <img src={mooc.logo_url} alt="Logo" className="h-10 w-auto object-contain" />
                  )}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {mooc.image_url && (
                    <img src={mooc.image_url} alt="Imagen" className="h-10 w-auto object-contain" />
                  )}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {mooc.is_popular && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1">
                      Popular
                    </span>
                  )}
                  {mooc.is_new && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                      Nuevo
                    </span>
                  )}
                  {mooc.is_trending && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      Tendencia
                    </span>
                  )}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    onClick={() => handleEdit(mooc)}
                    className="mr-2 text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(mooc.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLearning;
