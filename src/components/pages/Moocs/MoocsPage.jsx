// src/components/pages/moocs/MoocsPage.jsx
import React, { useState, useEffect } from "react";
import HeroSearch from "./HeroSearch";
import CourseCategory from "./CourseCategory";
import FilterSection from "./FilterSection";
import {
  fetchAllMoocsData,
  fetchSubjects,
  fetchSchools,
} from "../../../services/api";
import LoadingSpinner from "../../LoadingSpinner";

const MoocsPage = () => {
  // Estados para datos
  const [categories, setCategories] = useState([]);
  const [coursesByCategory, setCoursesByCategory] = useState({});
  const [originalCoursesByCategory, setOriginalCoursesByCategory] = useState(
    {}
  );
  const [specialCourses, setSpecialCourses] = useState({
    popular: [],
    new: [],
    trending: [],
  });
  const [originalSpecialCourses, setOriginalSpecialCourses] = useState({
    popular: [],
    new: [],
    trending: [],
  });
  const [subjects, setSubjects] = useState([]);
  const [schools, setSchools] = useState([]);

  // Estados para la interfaz de usuario
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [activeSubjectFilters, setActiveSubjectFilters] = useState([]);
  const [activeSchoolFilter, setActiveSchoolFilter] = useState(null);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Cargar todos los datos de cursos con una sola petición
        const allData = await fetchAllMoocsData();

        setCategories(allData.categories);
        setCoursesByCategory(allData.coursesByCategory);
        setOriginalCoursesByCategory(allData.coursesByCategory);

        setSpecialCourses(allData.specialCategories);
        setOriginalSpecialCourses(allData.specialCategories);

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

  // Efecto para aplicar filtros cuando cambien
  useEffect(() => {
    if (loading) return;

    // Si no hay filtros activos, restaurar datos originales
    if (activeSubjectFilters.length === 0 && !activeSchoolFilter) {
      setCoursesByCategory(originalCoursesByCategory);
      setSpecialCourses(originalSpecialCourses);
      return;
    }

    // Función para verificar si un curso cumple con los filtros
    const matchesFilters = (course) => {
      let matchesSubject = true;
      let matchesSchool = true;

      // Verificar filtro de materias si está activo
      if (activeSubjectFilters.length > 0) {
        console.log(`Curso: ${course.title}, subject_ids:`, course.subject_ids);
        console.log("Filtros activos:", activeSubjectFilters);
        // Verificamos si el curso tiene las materias seleccionadas
        const courseSubjects = course.subject_ids || [];
        matchesSubject = activeSubjectFilters.some((id) =>
          courseSubjects.includes(id)
        );
        matchesSubject = activeSubjectFilters.some((id) =>
          courseSubjects.includes(id)
        );
        console.log(`¿Coincide? ${matchesSubject}`);
      }

      // Verificar filtro de escuela si está activo
      if (activeSchoolFilter) {
        matchesSchool = course.school_id === activeSchoolFilter;
      }

      return matchesSubject && matchesSchool;
    };

    // Filtrar cursos por categoría
    const filteredCoursesByCategory = {};
    Object.keys(originalCoursesByCategory).forEach((category) => {
      filteredCoursesByCategory[category] =
        originalCoursesByCategory[category].filter(matchesFilters);
    });

    // Filtrar cursos especiales
    const filteredSpecialCourses = {
      popular: originalSpecialCourses.popular.filter(matchesFilters),
      new: originalSpecialCourses.new.filter(matchesFilters),
      trending: originalSpecialCourses.trending.filter(matchesFilters),
    };

    setCoursesByCategory(filteredCoursesByCategory);
    setSpecialCourses(filteredSpecialCourses);
  }, [
    activeSubjectFilters,
    activeSchoolFilter,
    loading,
    originalCoursesByCategory,
    originalSpecialCourses,
  ]);

  // Manejador para cambios en filtros de materias
  const handleSubjectFilterChange = (selectedSubjects) => {
    setActiveSubjectFilters(selectedSubjects);
  };

  // Manejador para cambios en filtros de escuelas
  const handleSchoolFilterChange = (selectedSchool) => {
    setActiveSchoolFilter(selectedSchool.length > 0 ? selectedSchool[0] : null);
  };

  // Renderizado condicional para loading y error
  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <HeroSearch />

      {/* Categorías principales */}
      {categories.map((category) => {
        const categoryName = category.category;
        const categoryCourses = coursesByCategory[categoryName] || [];

        // Solo mostrar categorías que tengan cursos después de aplicar filtros
        if (categoryCourses.length === 0) return null;

        return (
          <CourseCategory
            key={category.id || categoryName}
            title={categoryName}
            courses={categoryCourses}
          />
        );
      })}

      {/* Filtros por tema */}
      <FilterSection
        title="Filter by popular subjects"
        type="subjects"
        items={subjects}
        activeFilters={activeSubjectFilters}
        onFilterChange={handleSubjectFilterChange}
      />

      {/* Cursos especiales - Solo se muestran si hay cursos después de filtrar */}
      {specialCourses.popular.length > 0 && (
        <CourseCategory
          title="Explore courses and programs"
          courses={specialCourses.popular}
        />
      )}

      {specialCourses.new.length > 0 && (
        <CourseCategory title="New" courses={specialCourses.new} />
      )}

      {specialCourses.trending.length > 0 && (
        <CourseCategory title="Trending" courses={specialCourses.trending} />
      )}

      {/* Filtros por escuela */}
      <FilterSection
        title="Filter by popular schools and partners"
        type="schools"
        items={schools}
        activeFilters={activeSchoolFilter ? [activeSchoolFilter] : []}
        onFilterChange={handleSchoolFilterChange}
      />
    </div>
  );
};

export default MoocsPage;
