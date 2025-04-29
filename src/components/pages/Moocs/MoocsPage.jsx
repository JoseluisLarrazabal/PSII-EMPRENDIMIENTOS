// src/components/pages/MoocsPage.jsx
import React from 'react';
import HeroSearch from './HeroSearch';
import CourseCategory from './CourseCategory';
import FilterSection from './FilterSection';
import { executiveEducationCourses, mastersDegrees, bachelorDegrees, 
         popularCourses, newCourses, trendingCourses, subjectFilters, schoolFilters } from './data';

const MoocsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSearch />
      
      <CourseCategory title="Executive Education" courses={executiveEducationCourses} />
      <CourseCategory title="Master's Degrees" courses={mastersDegrees} />
      <CourseCategory title="Bachelor's Degrees" courses={bachelorDegrees} />
      
      {/* Using FilterSection for subjects */}
      <FilterSection 
        title="Filter by popular subjects" 
        type="subjects"
        items={subjectFilters} 
      />
      
      <CourseCategory title="Explore courses and programs" courses={popularCourses} />
      <CourseCategory title="New" courses={newCourses} />
      <CourseCategory title="Trending" courses={trendingCourses} />
      
      {/* Using FilterSection for schools */}
      <FilterSection 
        title="Filter by popular schools and partners"
        type="schools"
        items={schoolFilters} 
      />
    </div>
  );
};

export default MoocsPage;