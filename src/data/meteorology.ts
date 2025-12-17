import type { BeaufortScale, DouglasScale, CloudType, WeatherFront } from "@/types/meteorology"

export const beaufortScale: BeaufortScale[] = [
  { force: 0, description: "Calm", windKt: "<1", windMph: 1, windKmh: 1, wavesM: 0, wavesFt: 0 },
  { force: 1, description: "Light air", windKt: "1-3", windMph: 4, windKmh: 6, wavesM: 0.1, wavesFt: 0.3 },
  { force: 2, description: "Light breeze", windKt: "4-6", windMph: 7, windKmh: 11, wavesM: 0.2, wavesFt: 0.6 },
  { force: 3, description: "Gentle breeze", windKt: "7-10", windMph: 12, windKmh: 19, wavesM: 0.6, wavesFt: 2 },
  { force: 4, description: "Moderate breeze", windKt: "11-16", windMph: 18, windKmh: 29, wavesM: 1.2, wavesFt: 4 },
  { force: 5, description: "Fresh breeze", windKt: "17-21", windMph: 24, windKmh: 39, wavesM: 2, wavesFt: 6.5 },
  { force: 6, description: "Strong breeze", windKt: "22-27", windMph: 31, windKmh: 50, wavesM: 3, wavesFt: 10 },
  { force: 7, description: "Near gale", windKt: "28-33", windMph: 38, windKmh: 61, wavesM: 4, wavesFt: 13 },
  { force: 8, description: "Gale", windKt: "34-40", windMph: 46, windKmh: 74, wavesM: 5.5, wavesFt: 18 },
  { force: 9, description: "Severe gale", windKt: "41-47", windMph: 54, windKmh: 87, wavesM: 7, wavesFt: 23 },
  { force: 10, description: "Storm", windKt: "48-55", windMph: 63, windKmh: 101, wavesM: 9, wavesFt: 30 },
  { force: 11, description: "Violent storm", windKt: "56-63", windMph: 72, windKmh: 117, wavesM: 12, wavesFt: 39 },
  { force: 12, description: "Hurricane", windKt: "64 <", windMph: 83, windKmh: 133, wavesM: 14, wavesFt: 46 },
]

export const douglasScale: DouglasScale[] = [
  { degree: 0, description: "Calm (glassy)", heightM: "0", heightFt: "0", characteristics: "Morze jak lustro" },
  { degree: 1, description: "Calm (rippled)", heightM: "0-0.1", heightFt: "0-0.3", characteristics: "Lekkie zmarszczki, bez piany" },
  { degree: 2, description: "Smooth", heightM: "0.1-0.5", heightFt: "0.3-1.6", characteristics: "Małe fale, grzebienie nie pienią się" },
  { degree: 3, description: "Slight", heightM: "0.5-1.25", heightFt: "1.6-4", characteristics: "Fale wyraźne, niektóre białe grzebienie" },
  { degree: 4, description: "Moderate", heightM: "1.25-2.5", heightFt: "4-8", characteristics: "Liczne białe grzebienie, możliwe rozpryski" },
  { degree: 5, description: "Rough", heightM: "2.5-4", heightFt: "8-13", characteristics: "Umiarkowane fale, wszędzie białe grzebienie" },
  { degree: 6, description: "Very rough", heightM: "4-6", heightFt: "13-20", characteristics: "Duże fale, białe pianiste grzebienie" },
  { degree: 7, description: "High", heightM: "6-9", heightFt: "20-30", characteristics: "Fale piętrzą się, piana zdmuchiwana przez wiatr" },
  { degree: 8, description: "Very high", heightM: "9-14", heightFt: "30-46", characteristics: "Bardzo wysokie fale, gęsta piana, widoczność ograniczona" },
  { degree: 9, description: "Phenomenal", heightM: ">14", heightFt: ">46", characteristics: "Wyjątkowo wysokie fale, morze całkowicie białe od piany" },
]

export const cloudTypes: CloudType[] = [
  {
    name: "Chmury piętrowe",
    latinName: "Cumulus (Cu)",
    altitude: "600-2000 m",
    description: "Białe, puszyste chmury o wyraźnych konturach",
    weather: "Pogoda zmienna, możliwe przelotne opady"
  },
  {
    name: "Chmury burzowe",
    latinName: "Cumulonimbus (Cb)",
    altitude: "600-12000 m",
    description: "Ogromne chmury w kształcie kowadła",
    weather: "Burze, intensywne opady, możliwy grad"
  },
  {
    name: "Chmury warstwowe",
    latinName: "Stratus (St)",
    altitude: "0-600 m",
    description: "Jednolita szara warstwa chmur",
    weather: "Mżawka lub słabe opady, pochmurno"
  },
  {
    name: "Chmury warstwowo-pierzaste",
    latinName: "Cirrostratus (Cs)",
    altitude: "6000-12000 m",
    description: "Cienka, mlecznobiała zasłona",
    weather: "Zapowiedź nadciągającego frontu"
  },
  {
    name: "Chmury pierzaste",
    latinName: "Cirrus (Ci)",
    altitude: "6000-12000 m",
    description: "Delikatne, białe smugi lub włókna",
    weather: "Zazwyczaj ładna pogoda"
  },
  {
    name: "Chmury deszczowe",
    latinName: "Nimbostratus (Ns)",
    altitude: "900-3000 m",
    description: "Ciemnoszare, zwarte warstwy",
    weather: "Długotrwałe, ciągłe opady"
  },
  {
    name: "Chmury warstwowo-piętrowe",
    latinName: "Stratocumulus (Sc)",
    altitude: "600-2000 m",
    description: "Szare lub białawe kłęby lub warstwy",
    weather: "Bez opadów lub słabe opady"
  },
  {
    name: "Chmury piętrowo-pierzaste",
    latinName: "Cirrocumulus (Cc)",
    altitude: "6000-12000 m",
    description: "Drobne białe kłębki (\"baranki\")",
    weather: "Zazwyczaj bez opadów"
  },
  {
    name: "Chmury średnie piętrowe",
    latinName: "Altocumulus (Ac)",
    altitude: "2000-6000 m",
    description: "Białe lub szare kłęby i warstwy",
    weather: "Możliwe opady, zapowiedź pogorszenia"
  },
  {
    name: "Chmury średnie warstwowe",
    latinName: "Altostratus (As)",
    altitude: "2000-6000 m",
    description: "Jednolita szaroniebieska lub szara warstwa",
    weather: "Zapowiedź opadów, słońce słabo przebija"
  }
]

export const weatherFronts: WeatherFront[] = [
  {
    type: "Cold Front",
    symbol: "▼▼▼",
    description: "Chłodne powietrze wypiera ciepłe",
    characteristics: [
      "Gwałtowny spadek temperatury",
      "Intensywne opady na linii frontu",
      "Chmury Cb, Cu",
      "Możliwe burze i silne wiatry"
    ],
    weather: "Krótkie, intensywne opady i burze"
  },
  {
    type: "Warm Front",
    symbol: "▲▲▲",
    description: "Ciepłe powietrze wypiera chłodne",
    characteristics: [
      "Stopniowy wzrost temperatury",
      "Długotrwałe opady przed frontem",
      "Chmury Ns, Cs, Ci",
      "Szeroka strefa opadów"
    ],
    weather: "Długie, równomierne opady"
  },
  {
    type: "Stationary Front",
    symbol: "▲▼ ▲▼",
    description: "Granica między masami bez ruchu",
    characteristics: [
      "Brak przemieszczania się",
      "Długotrwała pochmurna pogoda",
      "Możliwe mgły",
      "Słabe wiatry wzdłuż frontu"
    ],
    weather: "Utrzymująca się pogoda"
  },
  {
    type: "Occluded Front",
    symbol: "▲▼▲▼",
    description: "Front chłodny dogania front ciepły",
    characteristics: [
      "Złożona struktura pogodowa",
      "Połączenie cech obu frontów",
      "Różne rodzaje chmur",
      "Stopniowe osłabianie"
    ],
    weather: "Zmienne opady, możliwe burze"
  },
  {
    type: "Surface Trough",
    symbol: "〰️",
    description: "Wydłużony obszar niskiego ciśnienia",
    characteristics: [
      "Konwergencja wiatrów",
      "Możliwe chmury konwekcyjne",
      "Często w obszarach tropikalnych",
      "Niestabilność atmosferyczna"
    ],
    weather: "Przelotne opady i burze"
  },
  {
    type: "Squall Line",
    symbol: "⚡⚡⚡",
    description: "Linia burz poprzedzająca front chłodny",
    characteristics: [
      "Gwałtowne burze w linii",
      "Silne porywy wiatru",
      "Intensywne opady i grzmoty",
      "Może wystąpić grad"
    ],
    weather: "Gwałtowne burze i silny wiatr"
  },
  {
    type: "Dry Line",
    symbol: "─ ─ ─",
    description: "Granica między suchym a wilgotnym powietrzem",
    characteristics: [
      "Gwałtowna zmiana wilgotności",
      "Częsta w regionach kontynentalnych",
      "Inicjacja konwekcji",
      "Brak opadów na linii"
    ],
    weather: "Możliwe burze po stronie wilgotnej"
  },
  {
    type: "Tropical Wave",
    symbol: "〜〜〜",
    description: "Zaburzenie w obszarach tropikalnych",
    characteristics: [
      "Fala niskiego ciśnienia",
      "Porusza się ze wschodu na zachód",
      "Może rozwinąć się w cyklon",
      "Deszcze i burze"
    ],
    weather: "Intensywne opady tropikalne"
  }
]