import React from 'react';

const Card = ({ image, title, link }) => {
  return (
    <div className="flex flex-col items-center p-6 m-4 border border-gray-300 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-md"
      />
      {/* Botón debajo de la imagen */}
      <div className="w-full mt-2">
        <a
          href={link}
          className="block text-center py-2 text-white bg-[#66B5CB] rounded-b-lg hover:bg-[#66A0B0] transition-colors duration-300"
        >
          {title}
        </a>
      </div>
    </div>
  );
};

export default Card;
