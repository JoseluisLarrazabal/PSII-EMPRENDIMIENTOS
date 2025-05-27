import React from "react";

const Resources = ({ resources }) => (
  <div>
    <h4 className="font-semibold mb-2">Recursos para descargar</h4>
    <ul>
      {resources.map((r, i) => (
        <li key={i}>
          <a href={r.url} className="text-[#8B0D37] underline" download>
            {r.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Resources;