import React, { useState, useEffect, useRef } from 'react';
import { MdMyLocation, MdLocationOn, MdRefresh } from "react-icons/md";

const NavigationPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(true);
  const [locationHistory, setLocationHistory] = useState([]);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const watchIdRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Funkcja do inicjalizacji efektu pojawiania się elementów
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('active');
      }, 50 * index);
    });

    // Funkcja do pobierania lokalizacji użytkownika
    const startLocationTracking = () => {
      if (!navigator.geolocation) {
        setError('Geolokalizacja nie jest wspierana przez twoją przeglądarkę');
        setLoading(false);
        return;
      }

      // Pobierz początkową lokalizację
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toLocaleTimeString(),
            altitude: position.coords.altitude,
            speed: position.coords.speed
          };
          
          setUserLocation(newLocation);
          setLocationHistory(prev => [...prev, newLocation]);
          setLoading(false);
        },
        (err) => {
          setError(`Nie udało się pobrać lokalizacji: ${err.message}`);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Rozpocznij ciągłe śledzenie lokalizacji
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toLocaleTimeString(),
            altitude: position.coords.altitude,
            speed: position.coords.speed
          };

          setUserLocation(newLocation);
          setLocationHistory(prev => {
            // Ogranicz historię do ostatnich 10 pozycji
            const newHistory = [...prev, newLocation];
            if (newHistory.length > 10) return newHistory.slice(-10);
            return newHistory;
          });
          setLoading(false);
        },
        (err) => {
          setError(`Nie udało się śledzić lokalizacji: ${err.message}`);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    if (tracking) {
      startLocationTracking();
    }

    // Czyszczenie watchPosition przy odmontowaniu komponentu
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [tracking]);

  // Funkcja do ponownego uruchomienia śledzenia
  const restartTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    setLoading(true);
    setError(null);
    setTracking(true);
  };

  // Funkcja do zatrzymania śledzenia
  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTracking(false);
  };

  // Funkcja do przełączania rozwinięcia informacji
  const toggleInfoExpand = () => {
    setExpandedInfo(!expandedInfo);
  };

  // Renderowanie mapy z OpenStreetMap
  const renderMap = () => {
    if (!userLocation) return null;
    
    const { latitude, longitude } = userLocation;
    return (
      <div className="relative overflow-hidden border rounded-lg shadow-lg opacity-0 border-purple-500/20 h-96 fade-in">
        <iframe
          ref={mapRef}
          title="Mapa lokalizacji"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`}
          className="z-10"
        />
        <div className="absolute z-20 flex space-x-2 bottom-4 right-4">
          <a 
            href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-purple-600/50 border-purple-500/30 hover:bg-purple-600/70 backdrop-blur-sm"
          >
            Pełna mapa
          </a>
        </div>
      </div>
    );
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
          <span className="block mb-1">TWOJA LOKALIZACJA</span>
        </h1>
        
        {/* Podtytuł */}
        <p className="max-w-lg mb-8 text-center text-gray-300 transition-all duration-700 delay-100 opacity-0 fade-in">
          Poniżej znajdziesz mapę z Twoją aktualną pozycją. 
          Aplikacja śledzi Twoją lokalizację w czasie rzeczywistym.
        </p>
        
        {/* Panel kontrolny */}
        <div className="w-full mb-6 transition-all duration-700 delay-200 opacity-0 fade-in">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
              onClick={restartTracking} 
              className={`flex items-center justify-center w-full p-4 text-sm font-medium text-white transition-all duration-300 border shadow-lg rounded-xl ${tracking ? 'bg-green-600/30 border-green-500/30' : 'bg-purple-600/30 border-purple-500/30'} hover:bg-purple-600/50 hover:-translate-y-1`}
              disabled={loading}
            >
              <MdRefresh className="mr-2 text-xl" />
              {loading ? 'Ładowanie...' : 'Odśwież lokalizację'}
            </button>
            <button 
              onClick={tracking ? stopTracking : restartTracking} 
              className={`flex items-center justify-center w-full p-4 text-sm font-medium text-white transition-all duration-300 border shadow-lg rounded-xl ${tracking ? 'bg-red-600/30 border-red-500/30' : 'bg-green-600/30 border-green-500/30'} hover:bg-purple-600/50 hover:-translate-y-1`}
            >
              <MdMyLocation className="mr-2 text-xl" />
              {tracking ? 'Zatrzymaj śledzenie' : 'Wznów śledzenie'}
            </button>
          </div>
        </div>
        
        {/* Widok mapy */}
        <div className="w-full mb-6 transition-all duration-700 delay-300 opacity-0 fade-in">
          {loading && (
            <div className="flex flex-col items-center justify-center w-full p-12 mb-6 text-center border rounded-lg shadow-lg bg-gray-800/50 backdrop-blur-md border-purple-500/10">
              <div className="w-16 h-16 mb-4 border-4 border-t-4 rounded-full border-purple-500/30 border-t-purple-600 animate-spin"></div>
              <p className="text-white">Lokalizowanie...</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 mb-6 border rounded-lg shadow-lg bg-red-900/30 backdrop-blur-md border-red-500/20">
              <p className="text-red-200">{error}</p>
              <button 
                onClick={restartTracking}
                className="px-4 py-2 mt-4 text-sm font-medium text-white transition-all duration-300 border rounded-lg bg-red-600/30 border-red-500/30 hover:bg-red-600/50"
              >
                Spróbuj ponownie
              </button>
            </div>
          )}
          
          {userLocation && !loading && !error && renderMap()}
        </div>
        
        {/* Informacje o lokalizacji */}
        {userLocation && !loading && !error && (
          <div className="w-full mb-20 transition-all duration-700 opacity-0 delay-400 fade-in">
            <div className="relative overflow-hidden border shadow-lg bg-gray-800/50 backdrop-blur-md rounded-xl border-purple-500/10">
              {/* Główny kafelek z danymi lokalizacji */}
              <div className="flex items-center justify-between p-4 border-b border-purple-500/10">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 mr-4 text-lg font-bold text-white border rounded-full bg-purple-600/20 backdrop-blur-sm border-purple-500/20">
                    <MdLocationOn />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-white">Aktualna pozycja</h2>
                    <p className="text-sm text-gray-300">{userLocation.timestamp}</p>
                  </div>
                </div>
                <button 
                  onClick={toggleInfoExpand}
                  className="flex items-center justify-center w-10 h-10 text-xl text-white transition-transform duration-300 rounded-full hover:bg-purple-600/20"
                  style={{ transform: expandedInfo ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <span className="transform rotate-90">➜</span>
                </button>
              </div>
              
              {/* Podstawowe informacje - zawsze widoczne */}
              <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
                <div className="p-3 border rounded-lg bg-gray-700/30 border-purple-500/10">
                  <p className="text-sm text-gray-400">Szerokość</p>
                  <p className="text-lg font-semibold text-white">{userLocation.latitude.toFixed(6)}°</p>
                </div>
                <div className="p-3 border rounded-lg bg-gray-700/30 border-purple-500/10">
                  <p className="text-sm text-gray-400">Długość</p>
                  <p className="text-lg font-semibold text-white">{userLocation.longitude.toFixed(6)}°</p>
                </div>
                <div className="col-span-2 p-3 border rounded-lg md:col-span-1 bg-gray-700/30 border-purple-500/10">
                  <p className="text-sm text-gray-400">Dokładność</p>
                  <p className="text-lg font-semibold text-white">{userLocation.accuracy ? `${userLocation.accuracy.toFixed(1)} m` : 'N/A'}</p>
                </div>
              </div>
              
              {/* Rozszerzone informacje */}
              <div 
                className="transition-all duration-500 border-t bg-gray-700/30 border-purple-500/10"
                style={{ 
                  maxHeight: expandedInfo ? '500px' : '0',
                  opacity: expandedInfo ? 1 : 0,
                  overflow: 'hidden',
                  padding: expandedInfo ? '16px' : '0 16px'
                }}
              >
                <h3 className="mb-3 text-lg font-medium text-white">Dodatkowe informacje</h3>
                
                {/* Rozszerzone dane */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 border rounded-lg bg-gray-800/50 border-purple-500/10">
                    <p className="text-sm text-gray-400">Wysokość</p>
                    <p className="text-lg font-semibold text-white">{userLocation.altitude ? `${userLocation.altitude.toFixed(1)} m` : 'N/A'}</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-gray-800/50 border-purple-500/10">
                    <p className="text-sm text-gray-400">Prędkość</p>
                    <p className="text-lg font-semibold text-white">{userLocation.speed ? `${(userLocation.speed * 3.6).toFixed(1)} km/h` : 'N/A'}</p>
                  </div>
                </div>
                
                {/* Historia lokalizacji */}
                <h3 className="mb-3 text-lg font-medium text-white">Historia lokalizacji</h3>
                <div className="overflow-y-auto border rounded-lg max-h-48 bg-gray-800/30 border-purple-500/10">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="sticky top-0 text-xs text-white uppercase bg-gray-800">
                      <tr>
                        <th scope="col" className="px-4 py-2">Czas</th>
                        <th scope="col" className="px-4 py-2">Szer. geo.</th>
                        <th scope="col" className="px-4 py-2">Dł. geo.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locationHistory.slice().reverse().map((loc, index) => (
                        <tr key={index} className="border-b bg-gray-800/20 border-gray-700/30">
                          <td className="px-4 py-2">{loc.timestamp}</td>
                          <td className="px-4 py-2">{loc.latitude.toFixed(6)}</td>
                          <td className="px-4 py-2">{loc.longitude.toFixed(6)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Dekoracyjny element na dole */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent opacity-40"></div>
    </div>
  );
};

export default NavigationPage;