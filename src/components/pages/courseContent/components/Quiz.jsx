import React, { useState } from "react";

const Quiz = ({ quiz }) => {
  const [selected, setSelected] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qIdx, optIdx) => {
    setSelected({ ...selected, [qIdx]: optIdx });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Contar aciertos
    let correct = 0;
    quiz.forEach((q, i) => {
      if (selected[i] === q.answer) correct++;
    });
    setScore(correct);
    setShowResult(true);
  };

  const handleRetry = () => {
    setSelected({});
    setShowResult(false);
    setScore(0);
  };

  // Deshabilitar submit si no todas las preguntas están respondidas
  const allAnswered = quiz.length > 0 && quiz.every((_, i) => typeof selected[i] === "number");

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
                      aria-label={`Opción ${j + 1} para pregunta ${i + 1}`}
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
          {showResult && selected[i] === undefined && (
            <div className="text-red-600 text-sm">No respondiste esta pregunta.</div>
          )}
        </div>
      ))}
      {!showResult && (
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-[#8B0D37] text-white rounded hover:bg-[#6E0B2A]"
          disabled={!allAnswered}
        >
          Comprobar respuestas
        </button>
      )}
      {!allAnswered && !showResult && (
        <div className="mt-2 text-red-600 text-sm">
          Responde todas las preguntas antes de enviar.
        </div>
      )}
      {showResult && (
        <div className="mt-4 text-green-700 font-semibold">
          ¡Quiz enviado! Respuestas correctas: {score} de {quiz.length}.
          <button
            type="button"
            className="ml-4 px-3 py-1 bg-gray-200 rounded text-[#8B0D37] hover:bg-gray-300"
            onClick={handleRetry}
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </form>
  );
};

export default Quiz;