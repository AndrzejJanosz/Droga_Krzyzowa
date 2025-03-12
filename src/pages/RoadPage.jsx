import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from "react-icons/md";
import roads from '../assets/data/roadsData';
import { Eye, Map, Download } from "lucide-react";

const RoadPage = () => {
  // Stan przechowujący ID otwartej/rozwiniętej drogi
  const [expandedRoadId, setExpandedRoadId] = useState(null);

  // Efekt do animacji pojawiania się elementów
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('active');
      }, 50 * index);
    });
  }, []);

  // Funkcja do przełączania rozwinięcia opcji pobierania
  const toggleRoadExpand = (roadId) => {
    setExpandedRoadId(prevId => prevId === roadId ? null : roadId);
  };

  // Funkcja do pobierania plików
  const handleDownload = (file, filename) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen px-4 py-16 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-950">
      {/* Subtelne tło z efektem */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 right-0 h-40 transform -translate-y-1/2 bg-purple-600/5 blur-3xl"></div>
      
      {/* Zawartość strony z animacją */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        {/* Tytuł z efektem pojawiania się */}
        <h1 className="mb-8 text-2xl font-bold tracking-wide text-center text-white transition-all duration-700 opacity-0 md:text-3xl lg:text-4xl fade-in">
          <span className="block mb-1">TRASY DRÓG KRZYŻOWYCH</span>
        </h1>
        
        {/* Podtytuł */}
        <p className="max-w-lg mb-8 text-center text-gray-300 transition-all duration-700 delay-100 opacity-0 fade-in">
          Poniżej znajdziesz listę parafialnych terenowych dróg krzyżowych. 
          Kliknij na ikonę pobierania, aby zobaczyć opcje pobrania opisu i śladu trasy.
        </p>
        
        {/* Lista dróg */}
        <div className="w-full mb-20 transition-all duration-700 delay-200 opacity-0 fade-in">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roads.map((road, index) => (
              <div 
                key={road.id}
                className={`relative transition-all duration-300 border shadow-lg bg-gray-800/50 backdrop-blur-md rounded-xl border-purple-500/10 hover:border-purple-500/30 hover:shadow-purple-500/10 opacity-0 fade-in overflow-hidden`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Główny kafelek z nazwą i numerem */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 mr-4 text-lg font-bold text-white border rounded-full bg-purple-600/20 backdrop-blur-sm border-purple-500/20">
                      {road.id}
                    </div>
                    <h2 className="text-lg font-medium text-white">{road.name}</h2>
                  </div>
                  <button 
                    onClick={() => toggleRoadExpand(road.id)}
                    className="flex items-center justify-center w-10 h-10 text-2xl text-white transition-transform duration-300 rounded-full hover:bg-purple-600/20"
                    style={{ transform: expandedRoadId === road.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <MdDownloadForOffline />
                  </button>
                </div>
                
                {/* Rozwijane opcje pobierania */}
                <div 
                  className="transition-all duration-300 border-t bg-gray-700/30 border-purple-500/10"
                  style={{ 
                    maxHeight: expandedRoadId === road.id ? '200px' : '0',
                    opacity: expandedRoadId === road.id ? 1 : 0,
                    overflow: 'hidden',
                    padding: expandedRoadId === road.id ? '12px' : '0 12px'
                  }}
                >
                  {/* Informacje o trasie */}
                  <div className="mb-3 text-sm text-gray-200">
                    <p className="mb-1"><span className="font-medium">Przebieg trasy:</span> {road.shortdescription}</p>
                    <p><span className="font-medium">Dystans:</span> {road.KM}<> km</></p>
                  </div>
                  
                  {/* Przyciski pobierania */}
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleDownload(road.description, `road${road.id}.pdf`)}
                      className="flex items-center justify-center w-full p-3 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-purple-600/30 border-purple-500/30 hover:bg-purple-600/50 hover:-translate-y-1"
                    >
                      <Download className="w-4 h-4 mr-2" /> Opis
                    </button>
                    <button 
                      onClick={() => handleDownload(road.track, `road${road.id}.kml`)}
                      className="flex items-center justify-center w-full p-3 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-purple-600/30 border-purple-500/30 hover:bg-purple-600/50 hover:-translate-y-1"
                    >
                      <Download className="w-4 h-4 mr-2" />Ślad
                    </button>
                      {/* Podgląd */}
                    <button 
                      //onClick={() => handlePreview(road)}
                      className="flex items-center justify-center w-full p-3 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-blue-600/30 border-blue-500/30 hover:bg-blue-600/50 hover:-translate-y-1"
                    >
                      <Eye className="w-5 h-5 mr-0" />  Podgląd
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Dekoracyjny element na dole */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent opacity-40"></div>
    </div>
  );
};

export default RoadPage;