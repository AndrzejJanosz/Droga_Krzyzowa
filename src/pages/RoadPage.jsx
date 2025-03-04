import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from "react-icons/md";
import roadPDF1 from '../assets/Roads/road1.pdf';
//import roadKML1 from '../assets/road1.kml';

const RoadPage = () => {
  // Przykładowe dane dróg krzyżowych
  const [roads, setRoads] = useState([
    { id: 1, name: "Droga na Pańską Górę", description: roadPDF1, track: "road1.kml" },
    { id: 2, name: "Trasa przez Inwałd", description: "road2.pdf", track: "road2.kml" },
    { id: 3, name: "Szlak pod Czarny Groń", description: "road3.pdf", track: "road3.kml" },
    { id: 4, name: "Droga leśna w Targanicach", description: "road4.pdf", track: "road4.kml" },
    { id: 5, name: "Ścieżka przez Zagórnik", description: "road5.pdf", track: "road5.kml" },
    { id: 6, name: "Trasa przez Rzyki", description: "road6.pdf", track: "road6.kml" },
    { id: 7, name: "Szlak Roczyn-Brzezinka", description: "road7.pdf", track: "road7.kml" },
    { id: 8, name: "Droga przez Sułkowice", description: "road8.pdf", track: "road8.kml" },
    { id: 9, name: "Ścieżka w dolinie Wieprzówki", description: "road9.pdf", track: "road9.kml" },
    { id: 10, name: "Trasa Kaczyna-Chocznię", description: "road10.pdf", track: "road10.kml" },
    { id: 11, name: "Droga przez stary Andrychów", description: "road11.pdf", track: "road11.kml" },
  ]);

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
    if (expandedRoadId === roadId) {
      setExpandedRoadId(null);
    } else {
      setExpandedRoadId(roadId);
    }
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
                  className="grid grid-cols-2 gap-2 p-3 transition-all duration-300 border-t bg-gray-700/30 border-purple-500/10"
                  style={{ 
                    maxHeight: expandedRoadId === road.id ? '100px' : '0',
                    opacity: expandedRoadId === road.id ? 1 : 0,
                    overflow: 'hidden',
                    padding: expandedRoadId === road.id ? '12px' : '0 12px'
                  }}
                >
                  <a 
                    href={`/assets/${road.description}`}
                    download
                    className="flex items-center justify-center w-full p-3 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-purple-600/30 border-purple-500/30 hover:bg-purple-600/50 hover:-translate-y-1"
                  >
                    Opis
                  </a>
                  <a 
                    href={`/assets/${road.track}`}
                    download
                    className="flex items-center justify-center w-full p-3 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-purple-600/30 border-purple-500/30 hover:bg-purple-600/50 hover:-translate-y-1"
                  >
                    Ślad
                  </a>
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