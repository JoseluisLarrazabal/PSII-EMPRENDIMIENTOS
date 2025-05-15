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
          <p className="mb-2">{q.question}</p>
          <ul>
            {q.options.map((opt, j) => (
              <li key={j}>
                <label>
                  <input
                    type="radio"
                    name={`quiz-${i}`}
                    checked={selected[i] === j}
                    onChange={() => handleSelect(i, j)}
                    className="mr-2"
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
            ))}
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
          Quiz enviado. Revisa tus respuestas.
        </div>
      )}
    </form>
  );
};

export default Quiz;