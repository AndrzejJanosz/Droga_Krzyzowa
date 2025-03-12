import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from "react-icons/md";
import roads from '../assets/data/roadsData';
import { Eye, Map, Download, Filter, Search, MapPin, RotateCw, RefreshCw, ArrowRight, CheckCircle, X, Sliders } from "lucide-react";

const Test = () => {
  // Stan przechowujący ID otwartej/rozwiniętej drogi
  const [expandedRoadId, setExpandedRoadId] = useState(null);
  
  // Stan dla filtrów
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    destination: '',
    returnToStart: null,
    minDistance: 0,
    maxDistance: 100
  });
  
  // Stan dla przefiltrowanych dróg
  const [filteredRoads, setFilteredRoads] = useState(roads);

  // Lista unikalnych miejsc docelowych dla selecta
  const uniqueDestinations = [...new Set(roads.map(road => road.destination))];

  // Efekt do animacji pojawiania się elementów
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('active');
      }, 50 * index);
    });
  }, []);

  // Efekt do filtrowania dróg
  useEffect(() => {
    applyFilters();
  }, [filters]); 

  // Funkcja do przełączania rozwinięcia opcji pobierania
  const toggleRoadExpand = (roadId) => {
    setExpandedRoadId(prevId => prevId === roadId ? null : roadId);
  };

  // Funkcja do przełączania widoczności filtrów
  const toggleFilters = () => {
    setIsFilterOpen(prev => !prev);
  };

  // Funkcja do aktualizacji filtrów
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Funkcja do resetowania filtrów
  const resetFilters = () => {
    setFilters({
      name: '',
      destination: '',
      returnToStart: null,
      minDistance: 0,
      maxDistance: 100
    });
    setFilteredRoads(roads);
  };

  // Funkcja do aplikowania filtrów
  const applyFilters = () => {
    let results = roads;
    
    // Filtrowanie po nazwie
    if (filters.name) {
      results = results.filter(road => 
        road.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    // Filtrowanie po miejscu docelowym
    if (filters.destination) {
      results = results.filter(road => 
        road.destination === filters.destination
      );
    }
    
    // Filtrowanie po powrocie do punktu startowego
    if (filters.returnToStart !== null) {
      results = results.filter(road => 
        road.loop === filters.returnToStart
      );
    }
    
    // Filtrowanie po dystansie
    results = results.filter(road => 
      road.KM >= filters.minDistance && road.KM <= filters.maxDistance
    );
    
    setFilteredRoads(results);
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
        
        {/* Panel filtrów */}
        <div className="w-full mb-6 transition-all duration-700 delay-150 opacity-0 fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button 
                onClick={toggleFilters}
                className="flex items-center justify-center p-3 mr-2 text-white transition-all duration-300 border rounded-lg shadow-lg bg-purple-600/30 border-purple-500/30 hover:bg-purple-600/50"
              >
                <Filter className="w-5 h-5 mr-2" />
                <span>Filtry</span>
              </button>
              <span className="text-sm text-gray-400">
                {filteredRoads.length} z {roads.length} tras
              </span>
            </div>
          </div>
          
          {/* Panel filtrów wysuwany */}
          <div 
            className={`w-full mb-6 p-4 rounded-xl transition-all duration-300 bg-gray-800/70 backdrop-blur-md border border-purple-500/20 shadow-lg ${
              isFilterOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden p-0 border-0'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Opcje filtrowania</h3>
              <button 
                onClick={toggleFilters}
                className="p-1 text-gray-400 transition-colors duration-200 rounded-full hover:text-white hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Wyszukiwanie po nazwie */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <Search className="w-4 h-4 mr-2" />
                  Nazwa trasy
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Wpisz nazwę trasy..."
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    className="w-full p-2 pl-3 text-white transition-colors duration-200 border rounded-lg bg-gray-700/50 border-purple-500/20 focus:border-purple-500/50 focus:outline-none"
                  />
                  {filters.name && (
                    <button 
                      onClick={() => handleFilterChange('name', '')}
                      className="absolute p-1 text-gray-400 transition-colors duration-200 rounded-full right-2 top-2 hover:text-white hover:bg-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filtrowanie po miejscu docelowym */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  Miejsce docelowe
                </label>
                <select
                  value={filters.destination}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="w-full p-2 text-white transition-colors duration-200 border rounded-lg bg-gray-700/50 border-purple-500/20 focus:border-purple-500/50 focus:outline-none"
                >
                  <option value="">Wszystkie miejsca</option>
                  {uniqueDestinations.map((dest) => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>
              
              {/* Powrót do punktu startowego */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Powrót do punktu startowego
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleFilterChange('returnToStart', true)}
                    className={`flex-1 flex items-center justify-center p-2 text-sm rounded-lg transition-colors duration-200 border ${
                      filters.returnToStart === true 
                        ? 'bg-purple-600/40 border-purple-500/50 text-white' 
                        : 'bg-gray-700/30 border-gray-600/30 text-gray-300'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Tak
                  </button>
                  <button
                    onClick={() => handleFilterChange('returnToStart', false)}
                    className={`flex-1 flex items-center justify-center p-2 text-sm rounded-lg transition-colors duration-200 border ${
                      filters.returnToStart === false 
                        ? 'bg-purple-600/40 border-purple-500/50 text-white' 
                        : 'bg-gray-700/30 border-gray-600/30 text-gray-300'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Nie
                  </button>
                  <button
                    onClick={() => handleFilterChange('returnToStart', null)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 border ${
                      filters.returnToStart === null 
                        ? 'bg-purple-600/40 border-purple-500/50 text-white' 
                        : 'bg-gray-700/30 border-gray-600/30 text-gray-300'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Filtrowanie po dystansie */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                  <div className="flex items-center">
                    <Sliders className="w-4 h-4 mr-2" />
                    Dystans trasy
                  </div>
                  <span className="text-gray-400">
                    {filters.minDistance} - {filters.maxDistance} km
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs text-gray-400">Minimum</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.minDistance}
                      onChange={(e) => handleFilterChange('minDistance', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-400">Maximum</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.maxDistance}
                      onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-gray-300 transition-colors duration-200 border rounded-lg border-gray-600/50 hover:bg-gray-700/50"
              >
                Resetuj filtry
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 border rounded-lg bg-purple-600/40 border-purple-500/50 hover:bg-purple-600/60"
              >
                Zastosuj
              </button>
            </div>
          </div>
        </div>
        
{/* Lista dróg */}
<div className="w-full mb-20 transition-all duration-700 delay-200 opacity-0 fade-in">
  {filteredRoads.length === 0 ? (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-gray-800/40 border-purple-500/10">
      <Search className="w-12 h-12 mb-4 text-gray-400" />
      <h3 className="mb-2 text-xl font-medium text-white">Brak wyników</h3>
      <p className="text-gray-400">Nie znaleziono tras spełniających kryteria filtrowania.</p>
      <button
        onClick={resetFilters}
        className="flex items-center px-4 py-2 mt-4 text-sm font-medium text-white transition-colors duration-200 border rounded-lg bg-purple-600/40 border-purple-500/50 hover:bg-purple-600/60"
      >
        <RotateCw className="w-4 h-4 mr-2" /> 
        Resetuj filtry
      </button>
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredRoads.map((road, index) => (
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
  )}
</div>
</div>
      
      {/* Dekoracyjny element na dole */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent opacity-40"></div>
    </div>
  );
};

export default Test;