// FilterSection.jsx
import React from 'react';

const FilterSection = ({ title, subtitle, type, items }) => {
  // Adaptación para la estructura de datos de la API
  const renderSubjects = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((subject) => (
        <a 
          key={subject.id} 
          href={`#${subject.slug}`} 
          className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors"
        >
          <div className="w-12 h-12 mr-3 flex-shrink-0">
            <img src={subject.icon_url} alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[#00262D] font-medium">{subject.name}</span>
        </a>
      ))}
    </div>
  );

  const renderSchools = () => (
    <div>
      {items.map((school) => (
        <div key={school.id} className="mb-10">
          <h3 className="text-xl font-bold text-[#00262D] mb-4">{school.name}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {school.subjects.map((subject, idx) => (
              <a 
                key={idx} 
                href={`#${subject.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-5 py-4 bg-gray-50 hover:bg-gray-100 rounded-md text-center text-[#00262D] font-medium transition-colors"
              >
                {subject}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#00262D] mb-4">{title}</h2>
        {subtitle && <h3 className="text-xl font-medium text-[#00262D] mb-8">{subtitle}</h3>}
        
        {type === 'subjects' && renderSubjects()}
        {type === 'programs' && renderPrograms()}
        {type === 'schools' && renderSchools()}
      </div>
    </section>
  );
};

export default FilterSection;