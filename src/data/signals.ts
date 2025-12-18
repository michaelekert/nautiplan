import type { SignalList } from "@/types/skipper"

export const flagImages = import.meta.glob<string>('../assets/flags/*.png', { 
  eager: true, 
  query: '?url',
  import: 'default'
})

export const initialSignals: SignalList[] = [
  {
    letter: "A",
    flag: flagImages['../assets/flags/A.png'],
    name: "Alfa",
    meaning: "Mam nurka pod wodą; trzymaj się z daleka i jedź z małą prędkością",
  },
  {
    letter: "B",
    flag: flagImages['../assets/flags/B.png'],
    name: "Bravo",
    meaning: "Ładuję, wyładowuję lub przewożę materiały niebezpieczne",
  },
  {
    letter: "C",
    flag: flagImages['../assets/flags/C.png'],
    name: "Charlie",
    meaning: "Tak (potwierdzenie)",
  },
  {
    letter: "D",
    flag: flagImages['../assets/flags/D.png'],
    name: "Delta",
    meaning: "Trzymaj się z daleka ode mnie; mam trudności w manewrowaniu",
  },
  {
    letter: "E",
    flag: flagImages['../assets/flags/E.png'],
    name: "Echo",
    meaning: "Zmieniam kurs w prawo",
  },
  {
    letter: "F",
    flag: flagImages['../assets/flags/F.png'],
    name: "Foxtrot",
    meaning: "Jestem niezdolny do manewrowania; nawiąż ze mną łączność",
  },
  {
    letter: "G",
    flag: flagImages['../assets/flags/G.png'],
    name: "Golf",
    meaning: "Potrzebuję pilota / Wyciągam sieci",
  },
  {
    letter: "H",
    flag: flagImages['../assets/flags/H.png'],
    name: "Hotel",
    meaning: "Mam pilota na pokładzie",
  },
  {
    letter: "I",
    flag: flagImages['../assets/flags/I.png'],
    name: "India",
    meaning: "Zmieniam kurs w lewo",
  },
  {
    letter: "J",
    flag: flagImages['../assets/flags/J.png'],
    name: "Juliett",
    meaning: "Mam pożar i przewożę materiały niebezpieczne; trzymaj się z daleka",
  },
  {
    letter: "K",
    flag: flagImages['../assets/flags/K.png'],
    name: "Kilo",
    meaning: "Chcę nawiązać z tobą łączność",
  },
  {
    letter: "L",
    flag: flagImages['../assets/flags/L.png'],
    name: "Lima",
    meaning: "Zatrzymaj swój statek natychmiast",
  },
  {
    letter: "M",
    flag: flagImages['../assets/flags/M.png'],
    name: "Mike",
    meaning: "Mój statek jest zatrzymany i nie porusza się",
  },
  {
    letter: "N",
    flag: flagImages['../assets/flags/N.png'],
    name: "November",
    meaning: "Nie (zaprzeczenie)",
  },
  {
    letter: "O",
    flag: flagImages['../assets/flags/O.png'],
    name: "Oscar",
    meaning: "Człowiek za burtą",
  },
  {
    letter: "P",
    flag: flagImages['../assets/flags/P.png'],
    name: "Papa",
    meaning: "W porcie: wszyscy mają stawić się na pokładzie, statek wychodzi w morze",
  },
  {
    letter: "Q",
    flag: flagImages['../assets/flags/Q.png'],
    name: "Quebec",
    meaning: "Mój statek jest zdrowy, proszę o pozwolenie na wejście do portu",
  },
  {
    letter: "R",
    flag: flagImages['../assets/flags/R.png'],
    name: "Romeo",
    meaning: "Otrzymałem twój sygnał",
  },
  {
    letter: "S",
    flag: flagImages['../assets/flags/S.png'],
    name: "Sierra",
    meaning: "Pracuję wstecz",
  },
  {
    letter: "T",
    flag: flagImages['../assets/flags/T.png'],
    name: "Tango",
    meaning: "Trzymaj się z daleka ode mnie; prowadzę trałowanie parami",
  },
  {
    letter: "U",
    flag: flagImages['../assets/flags/U.png'],
    name: "Uniform",
    meaning: "Kierujesz się ku niebezpieczeństwu",
  },
  {
    letter: "V",
    flag: flagImages['../assets/flags/V.png'],
    name: "Victor",
    meaning: "Potrzebuję pomocy",
  },
  {
    letter: "W",
    flag: flagImages['../assets/flags/W.png'],
    name: "Whiskey",
    meaning: "Potrzebuję pomocy medycznej",
  },
  {
    letter: "X",
    flag: flagImages['../assets/flags/X.png'],
    name: "X-ray",
    meaning: "Przerwij wykonywanie swoich zamiarów i obserwuj moje sygnały",
  },
  {
    letter: "Y",
    flag: flagImages['../assets/flags/Y.png'],
    name: "Yankee",
    meaning: "Zrywam kotwicę",
  },
  {
    letter: "Z",
    flag: flagImages['../assets/flags/Z.png'],
    name: "Zulu",
    meaning: "Potrzebuję holownika / Zarzucam sieci",
  }
]