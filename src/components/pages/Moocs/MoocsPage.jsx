import React, { useState, useEffect } from "react";
import HeroSearch from "./HeroSearch";
import CourseCategory from "./CourseCategory";
import FilterSection from "./FilterSection";
import EmptyState from "./EmptyState"; // Nuevo componente
import { fetchAllMoocsData, fetchSubjects, fetchSchools } from "../../../services/api";
import LoadingSpinner from "../../LoadingSpinner";

const MoocsPage = () => {
  // Estados para datos
  const [categories, setCategories] = useState([]);
  const [coursesByCategory, setCoursesByCategory] = useState({});
  const [originalCoursesByCategory, setOriginalCoursesByCategory] = useState({});
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

  // Estados de carga mejorados para diferentes secciones
  const [loadingStates, setLoadingStates] = useState({
    courses: true,
    subjects: true,
    schools: true,
    filtering: false,
  });

  // Estados de error mejorados
  const [errorStates, setErrorStates] = useState({
    courses: null,
    subjects: null,
    schools: null,
    filtering: null,
  });

  // Estados para filtros
  const [activeSubjectFilters, setActiveSubjectFilters] = useState([]);
  const [activeSchoolFilter, setActiveSchoolFilter] = useState(null);
  // Estado para controlar si hay resultados después de filtrar
  const [hasFilteredResults, setHasFilteredResults] = useState(true);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      // Reiniciar errores
      setErrorStates({
        courses: null,
        subjects: null,
        schools: null,
        filtering: null,
      });

      try {
        // Iniciar carga de cursos
        setLoadingStates(prev => ({ ...prev, courses: true }));
        const allData = await fetchAllMoocsData();

        setCategories(allData.categories);
        setCoursesByCategory(allData.coursesByCategory);
        setOriginalCoursesByCategory(allData.coursesByCategory);
        setSpecialCourses(allData.specialCategories);
        setOriginalSpecialCourses(allData.specialCategories);
        setLoadingStates(prev => ({ ...prev, courses: false }));
      } catch (err) {
        console.error("Error cargando cursos:", err);
        setErrorStates(prev => ({ 
          ...prev, 
          courses: "Error cargando cursos. Por favor, intenta nuevamente." 
        }));
        setLoadingStates(prev => ({ ...prev, courses: false }));
      }

      try {
        // Iniciar carga de materias
        setLoadingStates(prev => ({ ...prev, subjects: true }));
        const subjectsData = await fetchSubjects();
        setSubjects(subjectsData);
        setLoadingStates(prev => ({ ...prev, subjects: false }));
      } catch (err) {
        console.error("Error cargando materias:", err);
        setErrorStates(prev => ({ 
          ...prev, 
          subjects: "Error cargando materias. Por favor, intenta nuevamente." 
        }));
        setLoadingStates(prev => ({ ...prev, subjects: false }));
      }

      try {
        // Iniciar carga de escuelas
        setLoadingStates(prev => ({ ...prev, schools: true }));
        const schoolsData = await fetchSchools();
        setSchools(schoolsData);
        setLoadingStates(prev => ({ ...prev, schools: false }));
      } catch (err) {
        console.error("Error cargando escuelas:", err);
        setErrorStates(prev => ({ 
          ...prev, 
          schools: "Error cargando escuelas. Por favor, intenta nuevamente." 
        }));
        setLoadingStates(prev => ({ ...prev, schools: false }));
      }
    };

    loadData();
  }, []);

  // Efecto para aplicar filtros cuando cambien
  useEffect(() => {
    if (loadingStates.courses) return;

    try {
      // Indicador visual de que se están aplicando filtros
      setLoadingStates(prev => ({ ...prev, filtering: true }));

      // Si no hay filtros activos, restaurar datos originales
      if (activeSubjectFilters.length === 0 && !activeSchoolFilter) {
        setCoursesByCategory(originalCoursesByCategory);
        setSpecialCourses(originalSpecialCourses);
        setHasFilteredResults(true);
        setLoadingStates(prev => ({ ...prev, filtering: false }));
        return;
      }

      // Función para verificar si un curso cumple con los filtros
      const matchesFilters = (course) => {
        let matchesSubject = true;
        let matchesSchool = true;

        // Verificar filtro de materias si está activo
        if (activeSubjectFilters.length > 0) {
          const courseSubjects = course.subject_ids || [];
          matchesSubject = activeSubjectFilters.some((id) =>
            courseSubjects.includes(id)
          );
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

      // Verificar si hay resultados después de filtrar
      const totalCoursesFiltered = 
        Object.values(filteredCoursesByCategory).flat().length + 
        filteredSpecialCourses.popular.length + 
        filteredSpecialCourses.new.length + 
        filteredSpecialCourses.trending.length;
      
      setHasFilteredResults(totalCoursesFiltered > 0);
      setCoursesByCategory(filteredCoursesByCategory);
      setSpecialCourses(filteredSpecialCourses);
      
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
      setErrorStates(prev => ({ ...prev, filtering: "Error al aplicar filtros." }));
    } finally {
      setLoadingStates(prev => ({ ...prev, filtering: false }));
    }
  }, [
    activeSubjectFilters,
    activeSchoolFilter,
    loadingStates.courses,
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

  // Manejador para reintentar carga
  const handleRetry = (section) => {
    // Reiniciar el error específico
    setErrorStates(prev => ({ ...prev, [section]: null }));
    
    // Realizar la carga de datos nuevamente
    const loadData = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, [section]: true }));
        
        if (section === 'courses') {
          const allData = await fetchAllMoocsData();
          setCategories(allData.categories);
          setCoursesByCategory(allData.coursesByCategory);
          setOriginalCoursesByCategory(allData.coursesByCategory);
          setSpecialCourses(allData.specialCategories);
          setOriginalSpecialCourses(allData.specialCategories);
        } else if (section === 'subjects') {
          const subjectsData = await fetchSubjects();
          setSubjects(subjectsData);
        } else if (section === 'schools') {
          const schoolsData = await fetchSchools();
          setSchools(schoolsData);
        }
        
        setLoadingStates(prev => ({ ...prev, [section]: false }));
      } catch (err) {
        console.error(`Error al reintentar carga de ${section}:`, err);
        setErrorStates(prev => ({ 
          ...prev, 
          [section]: `Error cargando ${section}. Por favor, intenta nuevamente.` 
        }));
        setLoadingStates(prev => ({ ...prev, [section]: false }));
      }
    };
    
    loadData();
  };

  // Renderizado principal ajustado para mostrar estados específicos
  return (
    <div className="min-h-screen bg-white">
      <HeroSearch />

      {/* Estado de error global para cursos */}
      {errorStates.courses ? (
        <div className="text-center py-10">
          <p className="text-red-600 mb-4">{errorStates.courses}</p>
          <button 
            onClick={() => handleRetry('courses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      ) : loadingStates.courses ? (
        <div className="py-20">
          <LoadingSpinner message="Cargando cursos..." />
        </div>
      ) : (
        <>
          {/* Mensaje cuando no hay resultados de filtrado */}
          {!hasFilteredResults && (activeSubjectFilters.length > 0 || activeSchoolFilter) && (
            <EmptyState 
              message="No se encontraron cursos con los filtros seleccionados"
              actionText="Limpiar filtros"
              onAction={() => {
                setActiveSubjectFilters([]);
                setActiveSchoolFilter(null);
              }}
            />
          )}

          {/* Categorías principales - solo si hay resultados */}
          {hasFilteredResults && (
            <>
              {/* Indicador de filtrado activo */}
              {loadingStates.filtering && (
                <div className="text-center py-4 text-blue-600">
                  <div className="inline-block animate-pulse">
                    Aplicando filtros...
                  </div>
                </div>
              )}

              {/* Categorías de cursos */}
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
            </>
          )}

          {/* Filtros por tema */}
          {errorStates.subjects ? (
            <div className="text-center py-6">
              <p className="text-red-600 mb-4">{errorStates.subjects}</p>
              <button 
                onClick={() => handleRetry('subjects')}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Reintentar carga de materias
              </button>
            </div>
          ) : loadingStates.subjects ? (
            <div className="py-8">
              <LoadingSpinner message="Cargando materias..." size="small" />
            </div>
          ) : (
            <FilterSection
              title="Filter by popular subjects"
              type="subjects"
              items={subjects}
              activeFilters={activeSubjectFilters}
              onFilterChange={handleSubjectFilterChange}
            />
          )}

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
          {errorStates.schools ? (
            <div className="text-center py-6">
              <p className="text-red-600 mb-4">{errorStates.schools}</p>
              <button 
                onClick={() => handleRetry('schools')}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Reintentar carga de escuelas
              </button>
            </div>
          ) : loadingStates.schools ? (
            <div className="py-8">
              <LoadingSpinner message="Cargando escuelas..." size="small" />
            </div>
          ) : (
            <FilterSection
              title="Filter by popular schools and partners"
              type="schools"
              items={schools}
              activeFilters={activeSchoolFilter ? [activeSchoolFilter] : []}
              onFilterChange={handleSchoolFilterChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MoocsPage;