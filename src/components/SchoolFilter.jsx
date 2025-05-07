const SchoolFilter = () => {
    const schools = [
      {
        name: "Harvard University",
        subjects: ["Data Analysis & Statistics", "Humanities", "Computer Science", "Biology & Life Sciences", "Art & Culture"]
      },
      {
        name: "Massachusetts Institute of Technology",
        subjects: ["Business & Management", "Engineering", "Data Analysis & Statistics", "Economics & Finance", "Computer Science"]
      }
    ];
    
    return (
      <section className="py-8 md:py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#00262D] mb-8">Filter by popular schools and partners</h2>
          
          {schools.map((school, index) => (
            <div key={index} className="mb-10">
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
      </section>
    );
  };