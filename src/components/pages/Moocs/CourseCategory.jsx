// src/components/pages/moocs/CourseCategory.jsx
import React from 'react';
import CourseCard from './CourseCard';
// No es necesario importar transitions.css aquí ya que lo importamos en MoocsPage

const CourseCategory = ({ title, courses }) => {
    return (
      <section className="py-8 md:py-12 fade-in">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#00262D] mb-8 slide-in">{title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.map((course, index) => (
              <div 
                key={course.id || index} 
                className="stagger-item"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CourseCard key={index} course={course} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

export default CourseCategory;