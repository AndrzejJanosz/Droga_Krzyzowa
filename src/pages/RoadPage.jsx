import React, { useState, useEffect,useRef } from 'react';
import { MdDownloadForOffline } from "react-icons/md";
import roads from '../assets/data/roadsData';
import { ArrowDownCircle } from "lucide-react";
import { Eye, Map, Download, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Import map components
import { MapContainer, TileLayer, useMap, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import toGeoJSON from '@mapbox/togeojson';

// DODANO: Rozwiązanie problemu z ikonami Leaflet w React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// DODANO: Ikony dla początku, końca i stacji
let StartIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

let EndIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

let StationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// DODANO: Ustawienie domyślnej ikony
L.Marker.prototype.options.icon = DefaultIcon;


const RoadPage = () => {
  // Stan przechowujący ID otwartej/rozwiniętej drogi
  const [expandedRoadId, setExpandedRoadId] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [trackData, setTrackData] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  // Efekt do animacji pojawiania się elementów
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('active');
      }, 50 * index);
    });
  }, [showMap]);

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

  // Funkcja do parsowania KML
  const parseKmlTrack = async (kmlFile) => {
    try {
      // Pobierz plik KML
      const response = await fetch(kmlFile);
      const kmlText = await response.text();
      
      
      
      // Parsuj KML
      const parser = new DOMParser();
      const kml = parser.parseFromString(kmlText, 'text/xml');
      const geojson = toGeoJSON.kml(kml);
      
      // Wyciągnij współrzędne trasy (zamień [długość, szerokość] na [szerokość, długość] dla Leaflet)
      // Szukamy placemarków z liniami
      let coordinates = [];
      let extractedWaypoints = [];
      
      geojson.features.forEach(feature => {
        if (feature.geometry && (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString')) {
          if (feature.geometry.type === 'LineString') {
            coordinates = feature.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          } else if (feature.geometry.type === 'MultiLineString') {
            coordinates = feature.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
          }
        }

                // DODANO: Dla punktów (Placemarks)
                if (feature.geometry && feature.geometry.type === 'Point') {
                  const coord = feature.geometry.coordinates;
                  extractedWaypoints.push({
                    position: [coord[1], coord[0]],
                    name: feature.properties.name || 'Punkt',
                    description: feature.properties.description || '',
                    type: determinePointType(feature.properties.name || '')
                  });
                }
      });
      
            // DODANO: Jeśli nie znaleziono punktów, utwórz je z linii
            if (extractedWaypoints.length === 0 && coordinates.length > 0) {
              // Dodaj punkt startu
              extractedWaypoints.push({
                position: coordinates[0],
                name: 'Start',
                description: 'Punkt początkowy trasy',
                type: 'start'
              });
              
              // Dodaj stacje drogi
              for (let i = 1; i < coordinates.length - 1; i++) {
                // Dodaj tylko co n-ty punkt jako stację - można dostosować
                if (i % Math.ceil(coordinates.length / 15) === 0) {
                  extractedWaypoints.push({
                    position: coordinates[i],
                    name: `Stacja ${Math.ceil(i / (coordinates.length / 14))}`,
                    description: `Stacja drogi krzyżowej`,
                    type: 'station'
                  });
                }
              }
              
              // Dodaj punkt końcowy
              extractedWaypoints.push({
                position: coordinates[coordinates.length - 1],
                name: 'Koniec',
                description: 'Punkt końcowy trasy',
                type: 'end'
              });
            }
            
      setTrackData(coordinates);
      setWaypoints(extractedWaypoints);
    } catch (error) {
      console.error('Błąd parsowania KML:', error);
      // ZMODYFIKOWANO: W przypadku błędu, dodaj też przykładowe punkty
      const fallbackTrack = [
        [49.8546, 19.3438], // Andrychów
        [49.8776, 19.3092], // przykładowe punkty
        [49.8658, 19.6753]
      ];
      
      setTrackData(fallbackTrack);
      // DODANO: Ustaw przykładowe punkty
      setWaypoints([
        { position: fallbackTrack[0], name: 'Start', description: 'Punkt początkowy', type: 'start' },
        { position: fallbackTrack[1], name: 'Stacja 7', description: 'Stacja drogi krzyżowej', type: 'station' },
        { position: fallbackTrack[2], name: 'Koniec', description: 'Punkt końcowy', type: 'end' }
      ]);
    }
  };

    // DODANO: Funkcja do określania typu punktu na podstawie nazwy
    const determinePointType = (name) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('start') || lowerName.includes('początek')) {
        return 'start';
      } else if (lowerName.includes('koniec') || lowerName.includes('meta')) {
        return 'end';
      } else {
        return 'station';
      }
    };
  
    const scrollToBottom = () => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

  // Funkcja do podglądu trasy na mapie
  const handlePreview = (road) => {
    setSelectedRoad(road);
    parseKmlTrack(road.track);
    setShowMap(true);
  };

  // Funkcja do powrotu z widoku mapy do listy
  const handleBackToList = () => {
    setShowMap(false);
    setSelectedRoad(null);
    setTrackData(null);
    setWaypoints([]);
  };

  // Komponent KmlTrack do wyświetlania śladu KML na mapie
  const KmlTrack = ({ trackData, waypoints }) => {
    const map = useMap();
    
    useEffect(() => {
      if (trackData && trackData.length > 0) {
        // Centrowanie mapy na trasie
        const bounds = trackData.reduce(
          (bounds, point) => bounds.extend(point),
          L.latLngBounds(trackData[0], trackData[0])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, trackData]);

    const getMarkerIcon = (type) => {
      switch (type) {
        case 'start':
          return StartIcon;
        case 'end':
          return EndIcon;
        case 'station':
          return StationIcon;
        default:
          return DefaultIcon;
      }
    };

    return (
      <>
        {trackData && trackData.length > 0 && (
          <Polyline 
            positions={trackData} 
            color="#8b5cf6" 
            weight={5} 
            opacity={0.8}
          />
        )}
        
        {/* DODANO: Wyświetlanie punktów/markerów */}
        {waypoints && waypoints.map((waypoint, index) => (
          <Marker 
            key={index}
            position={waypoint.position}
            icon={getMarkerIcon(waypoint.type)}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{waypoint.name}</h3>
                <p>{waypoint.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </>
    );
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen px-4 py-16 overflow-hidden pb-36 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-950">
      {/* Subtelne tło z efektem */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 right-0 h-40 transform -translate-y-1/2 bg-purple-600/5 blur-3xl"></div>
      
      {/* Zawartość strony z animacją */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        {/* Tytuł z efektem pojawiania się */}
        <h1 className="mb-8 text-2xl font-bold tracking-wide text-center text-white transition-all duration-700 opacity-0 md:text-3xl lg:text-4xl fade-in">
          <span className="block mb-1">TERENOWE DROGI KRZYŻOWE</span>
        </h1>
        
        {!showMap ? (
          <>
            {/* Podtytuł */}
            <p className="max-w-lg mb-8 text-center text-gray-300 transition-all duration-700 delay-100 opacity-0 fade-in">
            Poniżej znajdziesz listę parafialnych terenowych dróg krzyżowych. 
            <span className="font-semibold text-purple-500"> Kliknij na ikonę pobierania </span>, aby zobaczyć opcje pobrania opisu i śladu dróg.
            
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
                    
                    {/* Informacje o trasie */}
                    <div className="px-6 mb-3 text-sm text-gray-200">
                      <p className="mb-1"><span className="font-medium">Przebieg trasy:</span> {road.shortdescription}</p>
                      <p><span className="font-medium">Dystans:</span> {road.KM}<> km</></p>
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
                          onClick={() => handlePreview(road)}
                          className="flex items-center justify-center w-full p-3 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-blue-600/30 border-blue-500/30 hover:bg-blue-600/50 hover:-translate-y-1"
                        >
                          <Eye className="w-5 h-5 mr-0" /> Podgląd
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Widok mapy po kliknięciu Podgląd
          <div className="w-full transition-all duration-700 opacity-0 fade-in">
            
            {/* Przycisk powrotu */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={handleBackToList}
                className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-purple-600/30 border-purple-500/30 hover:bg-purple-600/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Powrót do listy
              </button>
              {selectedRoad && (
          <div className="flex items-center space-x-2">
            <button
              onClick={scrollToBottom}
              className="flex items-center justify-center w-10 h-10 transition-all bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              <ArrowDownCircle className="w-6 h-6 text-white" />
            </button>
            <div className="px-4 py-2 text-white rounded-lg bg-gray-800/70 backdrop-blur-sm">
              <span className="font-medium">{selectedRoad.name}</span>
            </div>
          </div>
        )}
            </div>
            
            {/* Mapa z trasą */}
            <div className="w-full h-[70vh] rounded-xl overflow-hidden border border-purple-500/20 shadow-lg">
              <MapContainer 
                center={[49.8546, 19.3438]} // Domyślny widok na Andrychów
                zoom={12} 
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {trackData && <KmlTrack trackData={trackData} />}
                {trackData && <KmlTrack trackData={trackData} waypoints={waypoints} />}
              </MapContainer>
            </div>
            
            {/* Informacje o trasie */}
            {selectedRoad && (
              <div className="p-4 mt-4 border bg-gray-800/50 backdrop-blur-md rounded-xl border-purple-500/10">
                <h2 className="mb-2 text-xl font-medium text-white">Informacje o trasie</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-gray-300"><span className="font-medium text-white">Nazwa:</span> {selectedRoad.name}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Przebieg:</span> {selectedRoad.shortdescription}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Dystans:</span> {selectedRoad.KM} km</p>
                  </div>
                  <div>
                    <p className="text-gray-300"><span className="font-medium text-white">Cel:</span> {selectedRoad.destination}</p>
                    <p className="text-gray-300"><span className="font-medium text-white">Pętla:</span> {selectedRoad.loop ? 'Tak' : 'Nie'}</p>
                  </div>
                </div>
                <div className="flex mt-4 space-x-3">
                  <button 
                    onClick={() => handleDownload(selectedRoad.description, `road${selectedRoad.id}.pdf`)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-purple-600/30 border-purple-500/30 hover:bg-purple-600/50"
                  >
                    <Download className="w-4 h-4 mr-2" /> Pobierz opis
                  </button>
                  <button 
                    onClick={() => handleDownload(selectedRoad.track, `road${selectedRoad.id}.kml`)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-purple-600/30 border-purple-500/30 hover:bg-purple-600/50"
                  >
                    <Download className="w-4 h-4 mr-2" /> Pobierz ślad
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <button 
                onClick={handleBackToList}
                className="flex items-center px-4 py-2 mt-4 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-purple-600/30 border-purple-500/30 hover:bg-purple-600/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Powrót do listy
              </button>
        <div ref={bottomRef}></div>
      </div>
      
      
      {/* Dekoracyjny element na dole */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent opacity-40"></div>
    </div>
  );
};

export default RoadPage;