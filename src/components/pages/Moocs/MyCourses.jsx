import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyCourses } from "../../../services/api";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const data = await fetchMyCourses(token);
        setCourses(data);
      } catch (err) {
        setError("No se pudieron cargar tus cursos.");
      }
      setLoading(false);
    };
    loadCourses();
  }, []);

  const handleEdit = (id) => {
    navigate(`/course-builder?id=${id}`); // Puedes ajustar la ruta según tu lógica de edición
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este curso?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8000/api/moocs/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Error al eliminar el curso.");
    }
  };

  if (loading) return <div className="p-8">Cargando tus cursos...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-[#8B0D37]">Mis cursos</h1>
      <button
        className="mb-4 px-4 py-2 bg-[#8B0D37] text-white rounded hover:bg-[#6E0B2A] font-semibold float-right"
        onClick={() => navigate('/course-builder')}
      >
        + Crear nuevo curso
      </button>
      {courses.length === 0 ? (
        <div className="text-gray-600">No has creado ningún curso aún.</div>
      ) : (
        <table className="w-full bg-white shadow rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Imagen</th>
              <th className="py-2 px-4 text-left">Título</th>
              <th className="py-2 px-4 text-left">Categoría</th>
              <th className="py-2 px-4 text-left">Fecha creación</th>
              <th className="py-2 px-4 text-left">Estado</th>
              <th className="py-2 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">
                  <img src={course.image_url} alt={course.title} className="w-16 h-12 object-cover rounded shadow" />
                </td>
                <td className="py-2 px-4 font-semibold">{course.title}</td>
                <td className="py-2 px-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {course.category}
                  </span>
                </td>
                <td className="py-2 px-4 text-sm text-gray-600">
                  {course.fecha_creacion ? new Date(course.fecha_creacion).toLocaleDateString() : '-'}
                </td>
                <td className="py-2 px-4">
                  {course.is_popular ? <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mr-1">Popular</span> : null}
                  {course.is_new ? <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1">Nuevo</span> : null}
                  {course.is_trending ? <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">Tendencia</span> : null}
                  {!course.is_popular && !course.is_new && !course.is_trending && <span className="text-gray-400 text-xs">-</span>}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => handleEdit(course.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(course.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyCourses; 