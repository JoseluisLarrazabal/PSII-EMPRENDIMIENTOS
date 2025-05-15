import React, { useState } from "react";

const Quiz = ({ quiz }) => {
  const [selected, setSelected] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (qIdx, optIdx) => {
    setSelected({ ...selected, [qIdx]: optIdx });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResult(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      {quiz.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="mb-2 font-semibold">{q.question}</p>
          <ul>
            {q.options.map((opt, j) => {
              let optionStyle = "";
              if (showResult) {
                if (j === q.answer) optionStyle = "bg-green-100 text-green-700 font-bold";
                else if (selected[i] === j) optionStyle = "bg-red-100 text-red-700";
              }
              return (
                <li key={j}>
                  <label className={`flex items-center rounded px-2 py-1 mb-1 cursor-pointer ${optionStyle}`}>
                    <input
                      type="radio"
                      name={`quiz-${i}`}
                      checked={selected[i] === j}
                      onChange={() => handleSelect(i, j)}
                      className="mr-2"
                      disabled={showResult}
                    />
                    {opt}
                    {showResult && (
                      <span className="ml-2">
                        {j === q.answer
                          ? "✅"
                          : selected[i] === j
                          ? "❌"
                          : ""}
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-[#8B0D37] text-white rounded hover:bg-[#6E0B2A]"
        disabled={showResult}
      >
        Comprobar respuestas
      </button>
      {showResult && (
        <div className="mt-4 text-green-700 font-semibold">
          ¡Quiz enviado! Las respuestas correctas están resaltadas en verde.
        </div>
      )}
    </form>
  );
};

export default Quiz;