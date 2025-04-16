// src/App.js
import React from "react";
import Navbar from "./components/Navbar";
import SubNav from "./components/SubNav";
import Carousel from "./components/Carousel";
import ServiceCards from "./components/ServiceCards";
import SuccessStories from "./components/SuccessStories";
import ImportantDates from "./components/ImportantDates";
import SocialMediaGallery from "./components/SocialMediaGallery"; // Importa el nuevo componente
import InstitutionalBanner from "./components/InstitutionalBanner"; // Importa el nuevo componente

function App() {
  return (
    <div>
      <Navbar />
      <SubNav />
      <Carousel />
      {/* Contenedor principal con nuevo grid y espaciado */}
      <div className="max-w-[1200px] mx-auto px-12 py-8">
        <div className="grid grid-cols-12 gap-16">
          {/* Área principal - 8 columnas */}
          <div className="col-span-8">
            <ServiceCards />
            <div className="mt-16">
              <ImportantDates />
            </div>
          </div>
          {/* Sidebar - 4 columnas */}
          <div className="col-span-4">
            <SuccessStories />
          </div>
        </div>
        <div className="h-px bg-gray-300 mb-6"></div>
      </div>
      <h2 className="font-montserrat font-normal text-base text-center">
        Explora nuestros emprendimientos en redes sociales
      </h2>
      <SocialMediaGallery />
      {/* Banner Institucional con dimensiones controladas por el contenedor */}
      <div className="max-w-[1200px] mx-auto my-12">
        <InstitutionalBanner />
      </div>
    </div>
  );
}

export default App;
