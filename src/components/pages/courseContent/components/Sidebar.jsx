import React from "react";

const Sidebar = ({ slides, currentSlide, setCurrentSlide }) => (
  <aside className="w-64 bg-white border-r p-4">
    <h2 className="font-bold mb-4 text-[#8B0D37] text-lg tracking-wide">Contenido del curso</h2>
    <ul>
      {slides.map((s, idx) => (
        <li key={s.id} className="mb-1">
          <button
            className={`flex items-center w-full text-left px-3 py-2 rounded transition 
              ${
                idx === currentSlide
                  ? "bg-[#8B0D37] text-white font-semibold shadow"
                  : "hover:bg-gray-100 text-gray-800"
              }
            `}
            onClick={() => setCurrentSlide(idx)}
          >
            {/* Icono de video */}
            <svg
              className={`w-5 h-5 mr-2 ${
                idx === currentSlide ? "text-white" : "text-[#8B0D37]"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <rect x="3" y="5" width="15" height="14" rx="2" stroke="currentColor" />
              <polygon points="16,12 10,16 10,8" fill="currentColor" />
            </svg>
            <span className="truncate">{s.title}</span>
            {/* Quiz icono si hay quiz */}
            {s.quiz && s.quiz.length > 0 && (
              <svg
                className={`w-4 h-4 ml-2 ${
                  idx === currentSlide ? "text-white" : "text-[#8B0D37]"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" />
                <path d="M8 12h8M12 8v8" stroke="currentColor" />
              </svg>
            )}
          </button>
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar;