import React, { useState, useEffect, useRef } from 'react';
import roads from '../assets/data/roadsData';
import { MapContainer, TileLayer, useMap, Polyline, Marker, Popup, Circle } from 'react-leaflet';
import { ArrowLeft, MapPin, Navigation, List, Map as MapIcon } from "lucide-react";
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import toGeoJSON from '@mapbox/togeojson';

// Import default icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Custom icons for different point types
let StartIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

let EndIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

let StationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

let LocationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Set default icon
L.Marker.prototype.options.icon = DefaultIcon;

const NavigationPage = () => {
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [trackData, setTrackData] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);
  
  // Refs
  const mapRef = useRef(null);
  
  // Effect for fade-in animations
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('active');
      }, 50 * index);
    });
  }, [showList]);
  
  // Start watching user location when component mounts
  useEffect(() => {
    startWatchingLocation();
    
    // Cleanup function to stop watching when component unmounts
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);
  
  // Function to start watching user location
  const startWatchingLocation = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserLocation({
            position: [latitude, longitude],
            accuracy: accuracy
          });
          setError(null);
        },
        (err) => {
          setError(`Błąd lokalizacji: ${err.message}`);
          console.error('Błąd lokalizacji:', err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
      
      setWatchId(id);
    } else {
      setError('Twoja przeglądarka nie obsługuje geolokalizacji');
    }
  };
  
  // Function to center map on user location
  const centerOnUserLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo(userLocation.position, 16);
    } else if (!userLocation) {
      setError('Lokalizacja użytkownika niedostępna');
    }
  };
  
  // Function to parse KML file
  const parseKmlTrack = async (kmlFile) => {
    setLoading(true);
    try {
      // Fetch KML file
      const response = await fetch(kmlFile);
      const kmlText = await response.text();
      
      // Parse KML
      const parser = new DOMParser();
      const kml = parser.parseFromString(kmlText, 'text/xml');
      const geojson = toGeoJSON.kml(kml);
      
      // Extract coordinates and waypoints
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
        
        // Extract point features (Placemarks)
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
      
      // If no waypoints were found, create them from the line
      if (extractedWaypoints.length === 0 && coordinates.length > 0) {
        // Add start point
        extractedWaypoints.push({
          position: coordinates[0],
          name: 'Start',
          description: 'Punkt początkowy drogi',
          type: 'start'
        });
        
        // Add stations along the way
        for (let i = 1; i < coordinates.length - 1; i++) {
          if (i % Math.ceil(coordinates.length / 15) === 0) {
            extractedWaypoints.push({
              position: coordinates[i],
              name: `Stacja ${Math.ceil(i / (coordinates.length / 14))}`,
              description: 'Stacja drogi krzyżowej',
              type: 'station'
            });
          }
        }
        
        // Add end point
        extractedWaypoints.push({
          position: coordinates[coordinates.length - 1],
          name: 'Koniec',
          description: 'Punkt końcowy drogi',
          type: 'end'
        });
      }
      
      setTrackData(coordinates);
      setWaypoints(extractedWaypoints);
      setLoading(false);
    } catch (error) {
      console.error('Błąd parsowania KML:', error);
      setError('Nie udało się wczytać śladu KML');
      
      // Fallback track in case of error
      const fallbackTrack = [
        [49.8546, 19.3438], 
        [49.8776, 19.3092], 
        [49.8658, 19.6753]
      ];
      
      setTrackData(fallbackTrack);
      setWaypoints([
        { position: fallbackTrack[0], name: 'Start', description: 'Punkt początkowy', type: 'start' },
        { position: fallbackTrack[1], name: 'Stacja 7', description: 'Stacja drogi krzyżowej', type: 'station' },
        { position: fallbackTrack[2], name: 'Koniec', description: 'Punkt końcowy', type: 'end' }
      ]);
      
      setLoading(false);
    }
  };
  
  // Function to determine point type based on name
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
  
  // Handle selecting a road
  const handleSelectRoad = (road) => {
    setSelectedRoad(road);
    parseKmlTrack(road.track);
    setShowList(false);
  };
  
  // Return to list view
  const handleBackToList = () => {
    setShowList(true);
    setSelectedRoad(null);
    setTrackData(null);
    setWaypoints([]);
  };
  
  // Component to display KML track and user location on map
  const TrackLayer = ({ trackData, waypoints, userLocation }) => {
    const map = useMap();
    
    // Store map instance in ref
    useEffect(() => {
      mapRef.current = map;
    }, [map]);
    
    // Center map on track when it loads
    useEffect(() => {
      if (trackData && trackData.length > 0) {
        const bounds = trackData.reduce(
          (bounds, point) => bounds.extend(point),
          L.latLngBounds(trackData[0], trackData[0])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map, trackData]);
    
    // Get appropriate icon based on waypoint type
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
        {/* Track polyline */}
        {trackData && trackData.length > 0 && (
          <Polyline 
            positions={trackData} 
            color="#8b5cf6" 
            weight={5} 
            opacity={0.8}
          />
        )}
        
        {/* Waypoints */}
        {waypoints && waypoints.map((waypoint, index) => (
          <Marker 
            key={`waypoint-${index}`}
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
        
        {/* User location marker with accuracy circle */}
        {userLocation && (
          <>
            <Marker 
              position={userLocation.position}
              icon={LocationIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">Twoja lokalizacja</h3>
                  <p>Dokładność: {Math.round(userLocation.accuracy)} m</p>
                </div>
              </Popup>
            </Marker>
            <Circle 
              center={userLocation.position}
              radius={userLocation.accuracy}
              pathOptions={{ color: '#10B981', fillColor: '#10B981', fillOpacity: 0.2 }}
            />
          </>
        )}
      </>
    );
  };
  
  return (
    <div className="relative flex flex-col items-center min-h-screen px-4 py-16 overflow-hidden pb-36 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-950">
      {/* Background effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 right-0 h-40 transform -translate-y-1/2 bg-purple-600/5 blur-3xl"></div>
      
      {/* Content with animation */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        {/* Page header */}
        <h1 className="mb-8 text-2xl font-bold tracking-wide text-center text-white transition-all duration-700 opacity-0 md:text-3xl lg:text-4xl fade-in">
          <span className="block mb-1">NAWIGACJA DRÓG KRZYŻOWYCH</span>
        </h1>
        
        {showList ? (
          <>
            {/* List view subtitle */}
            <p className="max-w-lg mb-8 text-center text-gray-300 transition-all duration-700 delay-100 opacity-0 fade-in">
              Wybierz trasę, aby rozpocząć nawigację. Mapa pokaże Twoją aktualną lokalizację względem wybranej trasy.
            </p>
            
            {/* Road list */}
            <div className="w-full mb-20 transition-all duration-700 delay-200 opacity-0 fade-in">
              <div className="grid grid-cols-1 gap-4">
                {roads.map((road, index) => (
                  <div 
                    key={road.id}
                    className={`relative transition-all duration-300 border shadow-lg bg-gray-800/50 backdrop-blur-md rounded-xl border-purple-500/10 hover:border-purple-500/30 hover:shadow-purple-500/10 opacity-0 fade-in overflow-hidden cursor-pointer`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleSelectRoad(road)}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 mr-4 text-lg font-bold text-white border rounded-full bg-purple-600/20 backdrop-blur-sm border-purple-500/20">
                          {road.id}
                        </div>
                        <div className="flex flex-col">
                          <h2 className="text-lg font-medium text-white">{road.name}</h2>
                          <div className="mt-0.5 px-1 py-0.5 text-xs text-white/80 bg-purple-600/20 backdrop-blur-sm rounded-md border border-purple-500/20 max-w-fit">
                            <span className="text-2xs">{road.parish}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 text-white transition-transform duration-300 rounded-full hover:bg-purple-600/20">
                        <MapPin className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Map view
          <div className="w-full transition-all duration-700 opacity-0 fade-in">
            {/* Map controls */}
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
                    onClick={centerOnUserLocation}
                    className="flex items-center justify-center w-10 h-10 transition-all bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    <Navigation className="w-6 h-6 text-white" />
                  </button>
                  <div className="px-4 py-2 text-white rounded-lg bg-gray-800/70 backdrop-blur-sm">
                    <span className="font-medium">{selectedRoad.name}</span>
                  </div>
                </div>
              )}
            </div>
  
            {/* Loading indicator */}
            {loading && (
              <div className="absolute z-20 flex items-center justify-center w-full h-full">
                <div className="p-4 text-white rounded-lg bg-gray-800/80 backdrop-blur-sm">
                  Wczytywanie trasy...
                </div>
              </div>
            )}
  
            {/* Error message */}
            {error && (
              <div className="p-3 mb-4 text-white rounded-lg bg-red-500/80 backdrop-blur-sm">
                {error}
              </div>
            )}
  
            {/* Map container */}
            <div className="relative w-full h-[75vh] rounded-xl overflow-hidden border border-purple-500/20 shadow-lg">
              <MapContainer 
                center={[49.8546, 19.3438]} // Default view on Andrychów
                zoom={12} 
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <TrackLayer trackData={trackData} waypoints={waypoints} userLocation={userLocation} />
              </MapContainer>
              
              {/* Floating action buttons */}
              <div className="absolute flex flex-col space-y-2 bottom-4 right-4">
                <button 
                  onClick={centerOnUserLocation}
                  className="flex items-center justify-center w-12 h-12 text-white transition-all bg-purple-600 rounded-full shadow-lg hover:bg-purple-700"
                >
                  <Navigation className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleBackToList}
                  className="flex items-center justify-center w-12 h-12 text-white transition-all bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
                >
                  <List className="w-6 h-6" />
                </button>
              </div>
            </div>
  
            {/* Route information panel */}
            {selectedRoad && (
              <div className="p-4 mt-4 border bg-gray-800/50 backdrop-blur-md rounded-xl border-purple-500/10">
                <h2 className="mb-2 text-xl font-medium text-white">Informacje o drodze</h2>
                <div>
                  <p className="text-gray-300"><span className="font-medium text-white">Nazwa:</span> {selectedRoad.name}</p>
                  <p className="text-gray-300"><span className="font-medium text-white">Przebieg:</span> {selectedRoad.shortdescription}</p>
                  <p className="text-gray-300"><span className="font-medium text-white">Dystans:</span> {selectedRoad.KM} km</p>
                  {userLocation && (
                    <p className="text-gray-300">
                      <span className="font-medium text-white">Twoja pozycja:</span> 
                      {userLocation.position[0].toFixed(5)}, {userLocation.position[1].toFixed(5)}
                      <span className="ml-2 text-sm text-green-400">(dokładność: {Math.round(userLocation.accuracy)} m)</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent opacity-40"></div>
      </div>
    </div>
  );

};

export default NavigationPage;