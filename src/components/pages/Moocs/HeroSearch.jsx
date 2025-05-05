import React, { useState } from 'react';

const HeroSearch = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const trendingTags = ["Python", "Excel", "Data Sciences", "Marketing"];
  
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(inputValue);
  };
  
  const handleTrendingClick = (tag) => {
    setInputValue(tag);
    onSearch(tag);
  };
  
  return (
    <div className="w-full bg-[#00262D] py-12 px-4 md:py-16">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-white text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Construye tus Skills. Certificate.<br/>
          Mejora tu carrera de Emprendedor.
        </h1>
        
        <form onSubmit={handleSubmit} className="flex w-full max-w-lg">
          <input 
            type="text" 
            placeholder="Que quieres aprender?" 
            className="flex-grow p-3 text-gray-700 rounded-l-md border-0 focus:ring-2 focus:ring-[#8B0D37]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-[#8B0D37] hover:bg-[#6E0B2A] text-white px-6 py-3 rounded-r-md transition-colors"
          >
            Search
          </button>
        </form>
        
        <div className="flex items-center mt-5 flex-wrap gap-2">
          <span className="text-white font-medium mr-2">Trending:</span>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag, index) => (
              <button 
                key={index} 
                onClick={() => handleTrendingClick(tag)}
                className="px-3 py-1 bg-gray-700 bg-opacity-30 text-white rounded-md text-sm hover:bg-opacity-50 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;