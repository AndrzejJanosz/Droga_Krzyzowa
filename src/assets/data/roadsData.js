// src/data/roadsData.js
import PDF1 from '../Roads/1.pdf';
import KML1 from '../Roads/1.kml';
import PDF2 from '../Roads/2.pdf';
import KML2 from '../Roads/2.kml';
import PDF3 from '../Roads/3.pdf';
import KML3 from '../Roads/3.kml';
import PDF4 from '../Roads/4.pdf';
import KML4 from '../Roads/4.kml';
import PDF5 from '../Roads/5.pdf';
import KML5 from '../Roads/5.kml';
import PDF6 from '../Roads/6.pdf';
import KML6 from '../Roads/6.kml';
import PDF7 from '../Roads/7.pdf';
import KML7 from '../Roads/7.kml';
import PDF8 from '../Roads/8.pdf';
import KML8 from '../Roads/8.kml';
import PDF9 from '../Roads/9.pdf';
import KML9 from '../Roads/9.kml';
import PDF10 from '../Roads/10.pdf';
import KML10 from '../Roads/10.kml';
import PDF11 from '../Roads/11.pdf';
import KML11 from '../Roads/11.kml';
import PDF12 from '../Roads/12.pdf';
import KML12 from '../Roads/12.kml';
import PDF13 from '../Roads/13.pdf';
import KML13 from '../Roads/13.kml';
//import PDF14 from '../Roads/14.pdf';
//import KML14 from '../Roads/14.kml';
import PDF15 from '../Roads/15.pdf';
import KML15 from '../Roads/15.kml';
import PDF16 from '../Roads/16.pdf';
import KML16 from '../Roads/16.kml';

const roads = [
    { id: 1, name: "Św. Macieja", description: PDF1, track: KML1, shortdescription: "Andrychów / Wieprz / Radocza / Wysoka / Kalwaria", KM: 42, destination: "Kalwaria", loop: false },
    { id: 2, name: "Zielona", description: PDF2, track: KML2, shortdescription: "Andrychów / Zagórnik / Łękawica / Kalwaria", KM: 32, destination: "Kalwaria", loop: false },
    { id: 3, name: "Św. Franciszka", description: PDF3, track: KML3, shortdescription: "Andrychów / Targoszów / Ślemień / Rychwałd", KM: 38, destination: "Rychwałd", loop: false },
    { id: 4, name: "JP II", description: PDF4, track: KML4, shortdescription: "Andrychów / Zagórnik / Zembrzyce / Kalwaria", KM: 46, destination: "Kalwaria", loop: false },
    { id: 5, name: "MB Różańcowej", description: PDF5, track: KML5, shortdescription: "Andrychów / Wieprz / Wadowice / Andrychów", KM: 43, destination: "Andrychów", loop: true },
    { id: 6, name: "Św. Faustyny", description: PDF6, track: KML6, shortdescription: "Andrychów / Kaczyna / Wadowice / Andrychów", KM: 43, destination: "Andrychów", loop: true },
    { id: 7, name: "Św. Józefa", description: PDF7, track: KML7, shortdescription: "Andrychów / Roczyny / Zawadka / Wadowice", KM: 31, destination: "Wadowice", loop: false },
    { id: 8, name: "Św. Stanisława", description: PDF8, track: KML8, shortdescription: "Andrychów / Żar / Zagórnik / Andrychów ", KM: 50, destination: "Andrychów", loop: true },
    { id: 9, name: "Św. Klary", description: PDF9, track: KML9, shortdescription: "Andrychów / Ślemień / Pewel Mała / Rychwałd", KM: 46, destination: "Rychwałd", loop: false },
    { id: 10, name: "Wszystkich Świętych", description: PDF10, track: KML10, shortdescription: "Andrychów / Bulowice / Frydrychowice / Andrychów", KM: 52, destination: "Andrychów", loop: true },
    { id: 11, name: "Św. Krzysztof", description: PDF11, track: KML11, shortdescription: "Andrychów / Zator / Piekary / Kraków", KM: 82, destination: "Kraków", loop: false },
    { id: 12, name: "Św. Rafała", description: PDF12, track: KML12, shortdescription: "Andrychów / Zagórnik / Kaczyna / Wadowice", KM: 20, destination: "Wadowice", loop: false },
    { id: 13, name: "Św. Teresy", description: PDF13, track: KML13, shortdescription: "Andrychów / Wieprz / Tomice / Wadowice", KM: 23, destination: "Wadowice", loop: false },
    { id: 14, name: "Św. Alberta", description: 'PDF14', track: 'KML14', shortdescription: "W trakcie weryfikacji", KM: 0, destination: "Wadowice", loop: false },
    { id: 15, name: "Św. Urbana", description: PDF15, track: KML15, shortdescription: "Roczyny / Żar / Kocierz / Roczyny", KM: 39, destination: "Roczyny", loop: true },
    { id: 16, name: "Św. Pawła", description: PDF16, track: KML16, shortdescription: "Roczyny / Malec / Kęty / Roczyny", KM: 45, destination: "Roczyny", loop: true }
];


export default roads;