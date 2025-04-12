// src/App.js
import React from "react";
import Navbar from "./components/Navbar";
import SubNav from "./components/SubNav";
import Carousel from "./components/Carousel";
import ServiceCards from "./components/ServiceCards";
import SuccessStories from "./components/SuccessStories";
import ImportantDates from "./components/ImportantDates";

function App() {
  return (
    <div>
      <Navbar />
      <SubNav />
      <Carousel />

      {/* Contenedor principal con nuevo grid y espaciado */}
      <div className="max-w-[1200px] mx-auto px-12 py-8">
        <div className="grid grid-cols-12 gap-16">
          {" "}
          {/* Aumentamos el gap a 16 */}
          {/* Área principal - 8 columnas */}
          <div className="col-span-8">
            <ServiceCards />
            <div className="mt-16">
              {" "}
              {/* Aumentamos el espacio vertical */}
              <ImportantDates />
            </div>
          </div>
          {/* Sidebar - 4 columnas */}
          <div className="col-span-4">
            <SuccessStories />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
