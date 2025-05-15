import React from "react";

const Sidebar = ({ slides, currentSlide, setCurrentSlide }) => (
  <aside className="w-64 bg-white border-r p-4">
    <h2 className="font-bold mb-4">Contenido del curso</h2>
    <ul>
      {slides.map((s, idx) => (
        <li key={s.id}>
          <button
            className={`block w-full text-left px-2 py-2 rounded ${
              idx === currentSlide ? "bg-[#8B0D37] text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => setCurrentSlide(idx)}
          >
            {s.title}
          </button>
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;