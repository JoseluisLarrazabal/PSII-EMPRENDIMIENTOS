// src/pages/moocs/MoocsPage.jsx
import React, { useState, useEffect } from "react";
import HeroSearch from "./HeroSearch";
import CourseCategory from "./CourseCategory";
import FilterSection from "./FilterSection";
import {
  fetchCategories,
  fetchCoursesByCategory,
  fetchSubjects,
  fetchSchools,
} from "../../../services/api";
import LoadingSpinner from "../../LoadingSpinner"; // Crear este componente

const MoocsPage = () => {
  const [categories, setCategories] = useState([]);
  const [coursesByCategory, setCoursesByCategory] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Cargar categorías
        const categoriesData = await fetchCategories();
        console.log('Categorías recibidas:', categoriesData);  // AÑADE ESTA LÍNEA
        
        setCategories(categoriesData);

        // Cargar cursos para cada categoría
        const coursesData = {};
        for (const category of categoriesData) {
          const courses = await fetchCoursesByCategory(category);
          coursesData[category] = courses;
        }

        // Cargar cursos especiales
        const popularCourses = await fetchCoursesByCategory("popular");
        const newCourses = await fetchCoursesByCategory("new");
        const trendingCourses = await fetchCoursesByCategory("trending");

        setCoursesByCategory({
          ...coursesData,
          popular: popularCourses,
          new: newCourses,
          trending: trendingCourses,
        });

        // Cargar datos de filtrado
        const subjectsData = await fetchSubjects();
        const schoolsData = await fetchSchools();

        setSubjects(subjectsData);
        setSchools(schoolsData);

        setLoading(false);
      } catch (err) {
        setError("Error cargando datos. Por favor, intenta nuevamente.");
        setLoading(false);
        console.error(err);
      }
    };

    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <HeroSearch />

      {categories.map((category) => {
        // Adaptar para manejar tanto strings como objetos
        const categoryName =
          typeof category === "string" ? category : category.category;

        return (
          <CourseCategory
            key={
              typeof category === "string"
                ? category
                : category.id || JSON.stringify(category)
            }
            title={categoryName}
            courses={coursesByCategory[categoryName] || []}
          />
        );
      })}

      {/* Filtros por tema */}
      <FilterSection
        title="Filter by popular subjects"
        type="subjects"
        items={subjects}
      />

      {/* Cursos especiales */}
      <CourseCategory
        title="Explore courses and programs"
        courses={coursesByCategory["popular"] || []}
      />
      <CourseCategory title="New" courses={coursesByCategory["new"] || []} />
      <CourseCategory
        title="Trending"
        courses={coursesByCategory["trending"] || []}
      />

      {/* Filtros por escuela */}
      <FilterSection
        title="Filter by popular schools and partners"
        type="schools"
        items={schools}
      />
    </div>
  );
};

export default MoocsPage;
