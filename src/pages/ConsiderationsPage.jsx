import React, { useState, useEffect, useRef } from 'react';
import { SiYoutubemusic } from "react-icons/si";
import { MdFileDownload, MdPlayArrow, MdPause, MdHeadphones, MdMenuBook } from "react-icons/md";


import rozwazania from '../assets/Considerations/rozwazania.pdf';
import rozwazaniaMP3 from '../assets/Considerations/Rozwazania.rar';
import stacja0 from '../assets/Considerations/00.mp3';
import stacja1 from '../assets/Considerations/01.mp3';
import stacja2 from '../assets/Considerations/02.mp3';
import stacja3 from '../assets/Considerations/03.mp3';
import stacja4 from '../assets/Considerations/04.mp3';
import stacja5 from '../assets/Considerations/05.mp3';
import stacja6 from '../assets/Considerations/06.mp3';
import stacja7 from '../assets/Considerations/07.mp3';
import stacja8 from '../assets/Considerations/08.mp3';
import stacja9 from '../assets/Considerations/09.mp3';
import stacja10 from '../assets/Considerations/10.mp3';
import stacja11 from '../assets/Considerations/11.mp3';
import stacja12 from '../assets/Considerations/12.mp3';
import stacja13 from '../assets/Considerations/13.mp3';
import stacja14 from '../assets/Considerations/14.mp3';
import stacja99 from '../assets/Considerations/99.mp3';


const ConsiderationsPage = () => {
  // Przykładowe dane stacji
  const [stations, setStations] = useState([
    { id: '☩', name: "Rozpoczęcie", audioSrc: stacja0, duration: 89 },
    { id: 1, name: "Stacja I - Pan Jezus na śmierć skazany", audioSrc: stacja1, duration: 114 },
    { id: 2, name: "Stacja II - Pan Jezus bierze krzyż na swoje ramiona", audioSrc: stacja2, duration: 112 },
    { id: 3, name: "Stacja III - Pan Jezus upada po raz pierwszy", audioSrc: stacja3, duration: 94 },
    { id: 4, name: "Stacja IV - Pan Jezus spotyka swoją Matkę", audioSrc: stacja4, duration: 128 },
    { id: 5, name: "Stacja V - Szymon z Cyreny pomaga nieść krzyż Jezusowi", audioSrc: stacja5, duration: 109 },
    { id: 6, name: "Stacja VI - Weronika ociera twarz Pana Jezusa", audioSrc: stacja6, duration: 122 },
    { id: 7, name: "Stacja VII - Pan Jezus upada po raz drugi", audioSrc: stacja7, duration: 111 },
    { id: 8, name: "Stacja VIII - Pan Jezus pociesza płaczące niewiasty", audioSrc: stacja8, duration: 133 },
    { id: 9, name: "Stacja IX - Pan Jezus upada po raz trzeci", audioSrc: stacja9, duration: 138 },
    { id: 10, name: "Stacja X - Pan Jezus z szat obnażony", audioSrc: stacja10, duration: 119 },
    { id: 11, name: "Stacja XI - Pan Jezus przybity do krzyża", audioSrc: stacja11, duration: 137 },
    { id: 12, name: "Stacja XII - Pan Jezus umiera na krzyżu", audioSrc: stacja12, duration: 117 },
    { id: 13, name: "Stacja XIII - Pan Jezus zdjęty z krzyża", audioSrc: stacja13, duration: 134 },
    { id: 14, name: "Stacja XIV - Pan Jezus złożony do grobu", audioSrc: stacja14, duration: 136 },
    { id: '✠', name: "Zakończenie", audioSrc: stacja99, duration: 71 },
  ]);

  
  // Stan przechowujący ID otwartej/rozwiniętej stacji
  const [expandedStationId, setExpandedStationId] = useState(null);
  
  // Stan dla obecnie odtwarzanego audio
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Stan dla modalu z treścią rozważań
  const [showPdfModal, setShowPdfModal] = useState(false);
  
  // Referencja do elementu audio
  const audioRef = useRef(null);

  // Efekt do animacji pojawiania się elementów
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('active');
      }, 50 * index);
    });
  }, []);
  
  // Efekt do aktualizacji czasu odtwarzania
  useEffect(() => {
    if (audioRef.current) {
      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [currentlyPlaying]);

  // Funkcja do przełączania rozwinięcia odtwarzacza
  const toggleStationExpand = (stationId) => {
    if (expandedStationId === stationId) {
      setExpandedStationId(null);
    } else {
      setExpandedStationId(stationId);
      if (currentlyPlaying !== stationId) {
        // Zatrzymaj aktualnie odtwarzane audio jeśli istnieje
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setCurrentlyPlaying(stationId);
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }
  };
  
  // Funkcja do odtwarzania/pauzowania audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Funkcja do zmiany czasu odtwarzania
  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = (e.target.value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  // Funkcja do formatowania czasu (sekundy -> MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pobierz stację po ID
  const getCurrentStation = () => {
    return stations.find(station => station.id === currentlyPlaying);
  };

  // Funkcja do pobierania pliku PDF
  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = rozwazania; 
    link.download = 'rozwazania.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funkcja do pobierania plików MP3 w archiwum RAR
  const handleDownloadMP3 = () => {
    const link = document.createElement('a');
    link.href = rozwazaniaMP3; 
    link.download = 'rozwazania.rar';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funkcja do otwierania modalu z treścią rozważań
  const togglePdfModal = () => {
    setShowPdfModal(!showPdfModal);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen px-4 py-16 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-950">
      {/* Subtelne tło z efektem */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 right-0 h-40 transform -translate-y-1/2 bg-purple-600/5 blur-3xl"></div>
      
      {/* Element audio (ukryty) */}
      <audio 
        ref={audioRef} 
        src={currentlyPlaying ? getCurrentStation()?.audioSrc : ''} 
        preload="metadata"
      />
      
      {/* Zawartość strony z animacją */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        {/* Tytuł z efektem pojawiania się */}
        <h1 className="mb-8 text-2xl font-bold tracking-wide text-center text-white transition-all duration-700 opacity-0 md:text-3xl lg:text-4xl fade-in">
          <span className="block mb-1">ROZWAŻANIA DROGI KRZYŻOWEJ</span>
        </h1>
        
        {/* Podtytuł i przyciski pobierania */}
        <div className="w-full mb-8 text-center transition-all duration-700 delay-100 opacity-0 fade-in">
          <p className="max-w-lg mx-auto mb-6 text-gray-300">
            Poniżej znajdziesz rozważania drogi krzyżowej do samodzielnego odtworzenia lub pobrania.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 mb-5 md:flex-row">
            <button 
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-6 py-3 font-medium text-white transition-all duration-300 transform bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg shadow-purple-500/20 hover:-translate-y-1"
            >
              <MdFileDownload className="mr-2 text-xl" /> Pobierz rozważania PDF
            </button>
            
            <button 
              onClick={handleDownloadMP3}
              className="inline-flex items-center px-6 py-3 font-medium text-white transition-all duration-300 transform bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg shadow-indigo-500/20 hover:-translate-y-1"
            >
              <MdHeadphones className="mr-2 text-xl" /> Pobierz rozważania MP3
            </button>
            
            <button 
              onClick={togglePdfModal}
              className="inline-flex items-center px-6 py-3 font-medium text-white transition-all duration-300 transform bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 hover:shadow-lg shadow-teal-500/20 hover:-translate-y-1"
            >
              <MdMenuBook className="mr-2 text-xl" /> Czytaj rozważania
            </button>
          </div>
        </div>
        
        {/* Lista stacji */}
        <div className="w-full mb-20 transition-all duration-700 delay-200 opacity-0 fade-in">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {stations.map((station, index) => (
              <div 
                key={station.id}
                className={`relative transition-all duration-300 border shadow-lg bg-gray-800/50 backdrop-blur-md rounded-xl border-purple-500/10 hover:border-purple-500/30 hover:shadow-purple-500/10 opacity-0 fade-in overflow-hidden`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Główny kafelek z nazwą stacji */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 mr-4 text-lg font-bold text-white border rounded-full bg-purple-600/20 backdrop-blur-sm border-purple-500/20">
                      {station.id}
                    </div>
                    <h2 className="text-lg font-medium text-white">{station.name}</h2>
                  </div>
                  <button 
                    onClick={() => toggleStationExpand(station.id)}
                    className="flex items-center justify-center w-10 h-10 text-xl text-white transition-transform duration-300 rounded-full hover:bg-purple-600/20"
                    style={{ transform: expandedStationId === station.id ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  >
                    <SiYoutubemusic />
                  </button>
                </div>
                
                {/* Rozwijany odtwarzacz audio */}
                <div 
                  className="flex flex-col p-3 transition-all duration-300 border-t bg-gray-700/30 border-purple-500/10"
                  style={{ 
                    maxHeight: expandedStationId === station.id ? '120px' : '0',
                    opacity: expandedStationId === station.id ? 1 : 0,
                    overflow: 'hidden',
                    padding: expandedStationId === station.id ? '12px' : '0 12px'
                  }}
                >
                  {/* Kontrolki odtwarzacza */}
                  <div className="flex items-center mb-3">
                    <button 
                      onClick={togglePlayPause}
                      className="flex items-center justify-center w-10 h-10 mr-3 text-2xl text-white transition-all duration-300 border rounded-full bg-purple-600/30 border-purple-500/30 hover:bg-purple-600/50"
                    >
                      {isPlaying && currentlyPlaying === station.id ? <MdPause /> : <MdPlayArrow />}
                    </button>
                    
                    <div className="text-sm font-medium text-white">
                      {formatTime(currentlyPlaying === station.id ? currentTime : 0)} / {formatTime(station.duration)}
                    </div>
                  </div>
                  
                  {/* Pasek postępu */}
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={currentlyPlaying === station.id ? (currentTime / station.duration * 100) || 0 : 0} 
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-600 rounded-full appearance-none cursor-pointer accent-purple-600 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
{/* Modal z treścią rozważań */}
{showPdfModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="relative w-full max-w-full md:max-w-4xl p-2 md:p-4 mx-2 md:mx-4 bg-gray-800 rounded-lg shadow-xl h-[90vh] md:h-3/4">
      <button 
        onClick={togglePdfModal}
        className="absolute flex items-center justify-center w-8 h-8 text-gray-300 bg-gray-700 rounded-full -top-3 -right-3 hover:bg-gray-600"
      >
        ✕
      </button>
      <h2 className="mb-2 text-lg font-bold text-white md:mb-4 md:text-xl">Rozważania Drogi Krzyżowej</h2>
      <div className="h-[calc(100%-40px)] overflow-y-auto">
        <iframe
          src={rozwazania}
          className="w-full h-full min-h-[300px] md:min-h-[500px] border-0 rounded"
          title="Rozważania Drogi Krzyżowej PDF"
          style={{ maxWidth: '100%', height: '100%' }}
        />
      </div>
    </div>
  </div>
)}
      
      {/* Dekoracyjny element na dole */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent opacity-40"></div>
    </div>
  );

};

export default ConsiderationsPage;