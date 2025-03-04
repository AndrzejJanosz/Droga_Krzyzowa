import React, { useState, useEffect } from 'react';
import maciej_logo from '../assets/maciej_logo.jpg';

const HomePage = () => {
  // Stan przechowujący czas pozostały do wydarzenia
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Funkcja obliczająca czas pozostały do wyznaczonej daty
  const calculateTimeLeft = () => {
    const targetDate = new Date('2025-04-11T00:00:00').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now + ( 60 * 60 * 1000);
    
    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }

    console.log("Aktualny czas:", new Date());
    console.log("Czas docelowy:", new Date(targetDate));
    console.log("Różnica (ms):", difference);
  };

  // Efekt do animacji pojawiania się elementów
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('active');
      }, 100 * index);
    });
  }, []);

  // Efekt do aktualizacji licznika co sekundę
  useEffect(() => {
    // Inicjalne obliczenie czasu
    calculateTimeLeft();
    
    // Ustawienie interwału
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Czyszczenie interwału przy odmontowaniu komponentu
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center min-h-screen px-4 py-16 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-950">
      {/* Subtelne tło z efektem */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 right-0 h-40 transform -translate-y-1/2 bg-purple-600/5 blur-3xl"></div>
      
      {/* Zawartość strony z animacją */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {/* Logo z cieniem i subtelną poświatą */}
        <div className="mb-3 overflow-hidden transition-all duration-700 border rounded-full shadow-2xl opacity-0 w-36 h-36 md:w-40 md:h-40 shadow-purple-700/20 border-purple-500/20 fade-in">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-purple-600/10 mix-blend-overlay"></div>
            <img 
              src={maciej_logo} 
              alt="Logo parafii św. Macieja w Andrychowie" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        {/* Dodany mały tekst pod logo */}
        <p className="mb-8 text-xs text-center text-gray-400 transition-all duration-700 delay-100 opacity-0 fade-in">
          Parafia Rzymskokatolicka imienia Świętego Macieja w Andrychowie
        </p>
        
        {/* Tytuł z efektem pojawiania się */}
        <h1 className="mb-8 text-2xl font-bold tracking-wide text-center text-white transition-all duration-700 delay-200 opacity-0 md:text-3xl lg:text-4xl fade-in">
          <span className="block mb-1">PARAFIALNE TERENOWE</span>
          <span className="block">DROGI KRZYŻOWE</span>
        </h1>
        
        {/* Odliczanie - animowany licznik */}
        <div className="w-full max-w-xs p-4 mb-8 transition-all duration-700 delay-300 border shadow-lg opacity-0 bg-gray-800/50 backdrop-blur-md rounded-xl border-purple-500/10 fade-in">
          <div className="flex justify-center gap-4">
            {/* Dni */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-1 border rounded-lg bg-purple-600/20 backdrop-blur-sm border-purple-500/20">
                <span className="text-3xl font-bold text-white">{timeLeft.days}</span>
              </div>
              <span className="text-xs text-gray-300">Dni</span>
            </div>
            
            {/* Godziny */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-1 border rounded-lg bg-purple-600/20 backdrop-blur-sm border-purple-500/20">
                <span className="text-3xl font-bold text-white">{timeLeft.hours}</span>
              </div>
              <span className="text-xs text-gray-300">Godziny</span>
            </div>
            
            {/* Minuty */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-1 border rounded-lg bg-purple-600/20 backdrop-blur-sm border-purple-500/20">
                <span className="text-3xl font-bold text-white">{timeLeft.minutes}</span>
              </div>
              <span className="text-xs text-gray-300">Minuty</span>
            </div>
          </div>
          
          {/* Data wydarzenia */}
          <div className="mt-3 text-sm font-medium text-center text-gray-300">
            do 11.04.2025
          </div>
        </div>
        
        {/* Przycisk z efektem pojawiania się i animacją hover */}
        <a 
          href="https://swmaciej.org.pl/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-8 py-3 font-medium text-white transition-all duration-300 duration-700 transform bg-purple-600 rounded-lg shadow-md opacity-0 hover:bg-purple-700 hover:shadow-lg shadow-purple-500/20 hover:-translate-y-1 fade-in delay-400"
        >
          Szczegółowe informacje
        </a>
      </div>
      
      {/* Dekoracyjny element na dole */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent opacity-40"></div>
    </div>
  );
};

// Dodanie globalnych stylów dla efektów
const injectGlobalStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .bg-grid-pattern {
      background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
      background-size: 20px 20px;
    }

    .fade-in {
      transform: translateY(20px);
    }

    .fade-in.active {
      opacity: 1 !important;
      transform: translateY(0);
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `;
  document.head.appendChild(style);
};

// Wywołujemy funkcję przy montowaniu komponentu
if (typeof window !== 'undefined') {
  injectGlobalStyles();
}


export default HomePage;