import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { KML } from 'ol/format';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style';
import 'ol/ol.css';
import { MdMyLocation, MdClose, MdArrowBack, MdHome } from "react-icons/md";

// Import KML files
import roadKML1 from '../assets/Roads/road1.kml';
import roadKML2 from '../assets/Roads/road2.kml';
import roadKML3 from '../assets/Roads/road3.kml';
import roadKML4 from '../assets/Roads/road4.kml';
import roadKML5 from '../assets/Roads/road5.kml';
import roadKML6 from '../assets/Roads/road6.kml';
import roadKML7 from '../assets/Roads/road7.kml';
import roadKML8 from '../assets/Roads/road8.kml';
import roadKML9 from '../assets/Roads/road9.kml';
import roadKML10 from '../assets/Roads/road10.kml';
import roadKML11 from '../assets/Roads/road11.kml';

const NavigationPage = () => {
  // Routes data
  const roads = [
    { id: 1, name: "Droga na Pańską Górę", track: roadKML1 },
    { id: 2, name: "Trasa przez Inwałd", track: roadKML2 },
    { id: 3, name: "Szlak pod Czarny Groń", track: roadKML3 },
    { id: 4, name: "Droga leśna w Targanicach", track: roadKML4 },
    { id: 5, name: "Ścieżka przez Zagórnik", track: roadKML5 },
    { id: 6, name: "Trasa przez Rzyki", track: roadKML6 },
    { id: 7, name: "Szlak Roczyn-Brzezinka", track: roadKML7 },
    { id: 8, name: "Droga przez Sułkowice", track: roadKML8 },
    { id: 9, name: "Ścieżka w dolinie Wieprzówki", track: roadKML9 },
    { id: 10, name: "Trasa Kaczyna-Chocznię", track: roadKML10 },
    { id: 11, name: "Droga przez stary Andrychów", track: roadKML11 }
  ];

  // States
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [isRouteListOpen, setIsRouteListOpen] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(false);
  const [map, setMap] = useState(null);
  const [centerOnUser, setCenterOnUser] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // References
  const mapRef = useRef(null);
  const userLocationLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const watchIdRef = useRef(null);

  // On component mount
  useEffect(() => {
    // Try to load previously selected route from localStorage
    const savedRouteId = localStorage.getItem('selectedRouteId');
    if (savedRouteId) {
      setSelectedRouteId(parseInt(savedRouteId));
      setIsRouteListOpen(false);
    }

    // Initialize map
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM({
            attributions: []  // Remove attribution to prevent empty string src error
          })
        })
      ],
      view: new View({
        center: fromLonLat([19.3440, 49.8537]), // Andrychów area
        zoom: 13
      }),
      controls: [] // Remove default controls to avoid img src errors
    });
    
    setMap(initialMap);

    // Create user location layer with SVG-based style to avoid image loading errors
    const userLocationSource = new VectorSource();
    const userLocationLayer = new VectorLayer({
      source: userLocationSource,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: '#4338ca'
          }),
          stroke: new Stroke({
            color: '#ffffff',
            width: 2
          })
        })
      }),
      zIndex: 2 // Ensure user location is above the route
    });
    
    initialMap.addLayer(userLocationLayer);
    userLocationLayerRef.current = userLocationSource;

    // Create route layer
    const routeSource = new VectorSource();
    const routeLayer = new VectorLayer({
      source: routeSource,
      zIndex: 1
    });
    
    initialMap.addLayer(routeLayer);
    routeLayerRef.current = routeSource;

    return () => {
      // Clean up
      if (initialMap) {
        initialMap.setTarget(null);
      }
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Effect for handling route selection
  useEffect(() => {
    if (!selectedRouteId || !map) return;

    // Save selection to localStorage
    localStorage.setItem('selectedRouteId', selectedRouteId.toString());

    // Load KML track
    const selectedRoute = roads.find(road => road.id === selectedRouteId);
    if (selectedRoute && routeLayerRef.current) {
      setIsLoading(true);
      routeLayerRef.current.clear();
      
      fetch(selectedRoute.track)
        .then(response => response.text())
        .then(kmlText => {
          const features = new KML({
            extractStyles: true,
            showPointNames: false // Prevent text labels that might cause issues
          }).readFeatures(kmlText, {
            featureProjection: 'EPSG:3857'
          });
          
          routeLayerRef.current.addFeatures(features);
          
          // Zoom to route extent with a slight delay to ensure features are loaded
          setTimeout(() => {
            const extent = routeLayerRef.current.getExtent();
            if (extent.some(val => isFinite(val))) { // Check if extent is valid
              map.getView().fit(extent, {
                padding: [60, 60, 60, 60],
                maxZoom: 16
              });
            }
            setIsLoading(false);
          }, 300);
        })
        .catch(error => {
          console.error("Error loading KML:", error);
          setIsLoading(false);
        });
    }
  }, [selectedRouteId, map, roads]);

  // Handle location tracking
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert("Twoja przeglądarka nie obsługuje geolokalizacji.");
      return;
    }

    setLocationTrackingEnabled(true);
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = fromLonLat([longitude, latitude]);
        
        setUserLocation(location);
        
        // Update user location marker
        if (userLocationLayerRef.current) {
          userLocationLayerRef.current.clear();
          const locationFeature = new Feature({
            geometry: new Point(location)
          });
          userLocationLayerRef.current.addFeature(locationFeature);
          
          // Center map on user if enabled
          if (centerOnUser && map) {
            map.getView().animate({
              center: location,
              duration: 500
            });
          }
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationTrackingEnabled(false);
        alert("Nie można uzyskać dostępu do lokalizacji. Sprawdź ustawienia i spróbuj ponownie.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLocationTrackingEnabled(false);
  };

  const handleRouteSelect = (routeId) => {
    setSelectedRouteId(routeId);
    setIsRouteListOpen(false);
    
    // Start location tracking if not already active
    if (!locationTrackingEnabled) {
      startLocationTracking();
    }
  };

  const toggleRouteList = () => {
    setIsRouteListOpen(!isRouteListOpen);
  };

  const centerMapOnUser = () => {
    if (userLocation && map) {
      map.getView().animate({
        center: userLocation,
        duration: 500
      });
      setCenterOnUser(true);
    }
  };

  const navigateToHome = () => {
    // Navigation to home page - integrate with your routing system
    window.location.href = "/";
  };

  // Disable auto-centering when user manually pans the map
  useEffect(() => {
    if (!map) return;
    
    const moveEndListener = () => {
      // Only disable auto-centering if the move was initiated by user
      // and not by the centering function itself
      if (!centerOnUser) return;
      
      const mapCenter = map.getView().getCenter();
      if (userLocation && 
         (Math.abs(mapCenter[0] - userLocation[0]) > 10 || 
          Math.abs(mapCenter[1] - userLocation[1]) > 10)) {
        setCenterOnUser(false);
      }
    };
    
    map.on('moveend', moveEndListener);
    
    return () => {
      map.un('moveend', moveEndListener);
    };
  }, [map, userLocation, centerOnUser]);

  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-gray-900">
      {/* Map container */}
      <div 
        ref={mapRef} 
        className="absolute inset-0 z-0"
        style={{ touchAction: 'manipulation' }}
      />

      {/* Route selection overlay */}
      <div 
        className={`absolute inset-x-0 z-20 transition-all duration-300 bg-gray-900/95 overflow-y-auto ${
          isRouteListOpen ? 'top-0 bottom-0' : 'top-0 -translate-y-full h-0'
        }`}
      >
        <div className="px-4 py-6 pb-24">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Wybierz trasę</h1>
            <button 
              onClick={toggleRouteList} 
              className="flex items-center justify-center w-10 h-10 text-white transition-all rounded-full bg-purple-600/30 hover:bg-purple-600/50"
              aria-label="Zamknij"
            >
              <MdClose size={24} />
            </button>
          </div>
          
          <div className="grid gap-3">
            {roads.map((road) => (
              <button
                key={road.id}
                onClick={() => handleRouteSelect(road.id)}
                className={`p-4 text-left rounded-lg transition-all ${
                  selectedRouteId === road.id 
                    ? 'bg-purple-600/50 border-purple-500' 
                    : 'bg-gray-800/70 hover:bg-gray-800'
                } border border-purple-500/20`}
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 mr-3 text-lg font-bold text-white rounded-full bg-purple-600/30 border-purple-500/30">
                    {road.id}
                  </div>
                  <h3 className="text-lg font-medium text-white">{road.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls when map is showing */}
      {!isRouteListOpen && (
        <>
          {/* Top bar with safe spacing for all buttons */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 bg-gray-900/80 backdrop-blur-md h-14">
            <div className="flex items-center">
              <button 
                onClick={toggleRouteList}
                className="flex items-center justify-center w-10 h-10 mr-2 text-white transition-all rounded-full bg-purple-600/30 hover:bg-purple-600/50"
                aria-label="Powrót do listy tras"
              >
                <MdArrowBack size={22} />
              </button>
              <h2 className="max-w-xs text-lg font-medium text-white truncate">
                {selectedRouteId ? roads.find(r => r.id === selectedRouteId)?.name : "Wybierz trasę"}
              </h2>
            </div>
            <button 
              onClick={navigateToHome}
              className="flex items-center justify-center w-10 h-10 text-white transition-all rounded-full bg-purple-600/30 hover:bg-purple-600/50"
              aria-label="Powrót do strony głównej"
            >
              <MdHome size={22} />
            </button>
          </div>
          
          {/* Bottom navigation bar - elevated to avoid overlap */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-around py-3 bg-gray-900/80 backdrop-blur-md">
            <button
              className="flex flex-col items-center justify-center px-4 py-2 text-white"
              onClick={toggleRouteList}
            >
              <span className="text-xs">Trasy</span>
            </button>
            <button
              className={`flex flex-col items-center justify-center px-4 py-2 ${
                locationTrackingEnabled ? 'text-purple-400' : 'text-white'
              }`}
              onClick={locationTrackingEnabled ? stopLocationTracking : startLocationTracking}
            >
              <div className={`flex items-center justify-center w-12 h-12 mb-1 rounded-full ${
                locationTrackingEnabled ? 'bg-purple-600' : 'bg-purple-600/30'
              }`}>
                <MdMyLocation size={24} />
              </div>
              <span className="text-xs">Nawigacja</span>
            </button>
            <button
              className="flex flex-col items-center justify-center px-4 py-2 text-white"
              onClick={centerMapOnUser}
              disabled={!userLocation}
            >
              <span className="text-xs">Rozwiązanie</span>
            </button>
          </div>
          
          {/* Right side controls - moved higher to avoid bottom nav overlap */}
          <div className="absolute bottom-20 right-4 z-10 flex flex-col gap-3">
            <button
              onClick={centerMapOnUser}
              disabled={!userLocation}
              className={`flex items-center justify-center w-12 h-12 text-white rounded-full shadow-lg transition-all ${
                centerOnUser && userLocation 
                  ? 'bg-purple-600' 
                  : 'bg-gray-700/80 backdrop-blur-md'
              }`}
              aria-label="Centruj na mojej lokalizacji"
            >
              <MdMyLocation size={24} />
            </button>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="p-4 bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg">
                <div className="w-8 h-8 border-4 border-t-purple-600 border-gray-200 rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NavigationPage;