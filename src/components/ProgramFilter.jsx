const ProgramFilter = () => {
    const programs = [
      {
        title: "Master's Program",
        description: "Earn a full master's degree from top ranked universities",
        features: ["Graduate-level", "Master's Degree", "Affordable & flexible"],
        color: "#E04D95"
      },
      // Additional programs would be defined here
    ];
    
    return (
      <section className="py-8 md:py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#00262D] mb-4">Filter by programs</h2>
          <h3 className="text-xl font-medium text-[#00262D] mb-8">Get a degree or certificate with edX online</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {programs.map((program, index) => (
              <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                <div className="h-2" style={{ backgroundColor: program.color }}></div>
                <div className="p-4 bg-[#00262D] text-white h-full">
                  <h4 className="text-xl font-bold mb-2">{program.title}</h4>
                  <p className="text-sm mb-4">{program.description}</p>
                  
                  <ul className="space-y-2">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="h-5 w-5 text-teal-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };