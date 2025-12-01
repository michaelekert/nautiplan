import { useState, useEffect, useRef } from "react"
import { BottomNavbar } from "@/components/BottomNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Confetti } from "@/components/Confetti"
import { ArrowLeft } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Question = {
  id: number
  text: string
  options: { id: string; text: string; correct: boolean }[]
}

type Test = {
  id: string
  title: string
  description: string
  questions: Question[]
}

const tests: Test[] = [
{
  id: "sample_test",
  title: "Przykładowy test",
  description: "Sprawdź swoją wiedzę ogólną z żeglarstwa i motorowodniactwa.",
  questions: [
    { "id": 1, "text": "Jak nazywa się przednia część jachtu?", "options": [ { "id": "a", "text": "Rufa", "correct": false }, { "id": "b", "text": "Bakburta", "correct": false }, { "id": "c", "text": "Dziób", "correct": true }, { "id": "d", "text": "Ster", "correct": false } ] },
    { "id": 2, "text": "Co oznacza komenda 'klar na żagle'?", "options": [ { "id": "a", "text": "Zwinąć żagle", "correct": false }, { "id": "b", "text": "Przygotować żagle do postawienia", "correct": true }, { "id": "c", "text": "Podnieść kotwicę", "correct": false }, { "id": "d", "text": "Zrzucić żagle", "correct": false } ] },
    { "id": 3, "text": "Jak nazywa się lina służąca do podnoszenia żagla?", "options": [ { "id": "a", "text": "Fał", "correct": true }, { "id": "b", "text": "Szot", "correct": false }, { "id": "c", "text": "Cumka", "correct": false }, { "id": "d", "text": "Odbijacz", "correct": false } ] },
    { "id": 4, "text": "Jakie światło pokazuje jacht żaglowy w nocy?", "options": [ { "id": "a", "text": "Zielone i czerwone z przodu oraz białe z tyłu", "correct": true }, { "id": "b", "text": "Tylko białe", "correct": false }, { "id": "c", "text": "Czerwone i niebieskie", "correct": false }, { "id": "d", "text": "Pomarańczowe i białe", "correct": false } ] },
    { "id": 5, "text": "Z której strony należy wyprzedzać inny jacht?", "options": [ { "id": "a", "text": "Od strony zawietrznej", "correct": true }, { "id": "b", "text": "Od strony nawietrznej", "correct": false }, { "id": "c", "text": "Od dziobu", "correct": false }, { "id": "d", "text": "Od rufy", "correct": false } ] },
    { "id": 6, "text": "Co oznacza sygnał jeden długi dźwięk na wodzie?", "options": [ { "id": "a", "text": "Niebezpieczeństwo", "correct": true }, { "id": "b", "text": "Wyprzedzanie", "correct": false }, { "id": "c", "text": "Zmiana kursu", "correct": false }, { "id": "d", "text": "Kotwiczenie", "correct": false } ] },
    { "id": 7, "text": "Jak nazywa się tylna część jachtu?", "options": [ { "id": "a", "text": "Dziób", "correct": false }, { "id": "b", "text": "Rufa", "correct": true }, { "id": "c", "text": "Bakburta", "correct": false }, { "id": "d", "text": "Ster", "correct": false } ] },
    { "id": 8, "text": "Co to jest hals?", "options": [ { "id": "a", "text": "Rodzaj węzła", "correct": false }, { "id": "b", "text": "Skręt łodzi pod wiatr", "correct": true }, { "id": "c", "text": "Sztywna część żagla", "correct": false }, { "id": "d", "text": "Element kotwicy", "correct": false } ] },
    { "id": 9, "text": "Jak nazywa się linia do sterowania żaglem?", "options": [ { "id": "a", "text": "Szot", "correct": true }, { "id": "b", "text": "Fał", "correct": false }, { "id": "c", "text": "Cumka", "correct": false }, { "id": "d", "text": "Odbijacz", "correct": false } ] },
    { "id": 10, "text": "Co oznacza komenda 'odpadamy'?", "options": [ { "id": "a", "text": "Zmieniamy kurs od wiatru", "correct": true }, { "id": "b", "text": "Zbliżamy się do wiatru", "correct": false }, { "id": "c", "text": "Zatrzymujemy jacht", "correct": false }, { "id": "d", "text": "Zrzucamy żagle", "correct": false } ] },
    { "id": 11, "text": "Jak należy trzymać kurs podczas silnego wiatru?", "options": [ { "id": "a", "text": "Prosto w wiatr", "correct": false }, { "id": "b", "text": "Nieco od wiatru", "correct": true }, { "id": "c", "text": "Dowolnie", "correct": false }, { "id": "d", "text": "Zawsze od wiatru", "correct": false } ] },
    { "id": 12, "text": "Co to jest szkwał?", "options": [ { "id": "a", "text": "Nagły silny podmuch wiatru", "correct": true }, { "id": "b", "text": "Rodzaj węzła", "correct": false }, { "id": "c", "text": "Typ żagla", "correct": false }, { "id": "d", "text": "Manewr skrętu", "correct": false } ] },
    { "id": 13, "text": "Jak oznacza się miejsce kotwiczenia w dzień?", "options": [ { "id": "a", "text": "Flaga biało-czerwona", "correct": false }, { "id": "b", "text": "Boja lub znacznik", "correct": true }, { "id": "c", "text": "Światło czerwone", "correct": false }, { "id": "d", "text": "Nie wymaga oznaczenia", "correct": false } ] },
    { "id": 14, "text": "Co należy sprawdzić przed wypłynięciem?", "options": [ { "id": "a", "text": "Stan techniczny jachtu i sprzętu ratunkowego", "correct": true }, { "id": "b", "text": "Kolor żagli", "correct": false }, { "id": "c", "text": "Ilość pasażerów na lądzie", "correct": false }, { "id": "d", "text": "Rodzaj wody w basenie", "correct": false } ] },
    { "id": 15, "text": "Jak nazywa się kierunek wiatru wzdłuż jachtu?", "options": [ { "id": "a", "text": "Prosto w wiatr", "correct": true }, { "id": "b", "text": "Od rufy", "correct": false }, { "id": "c", "text": "Od burt", "correct": false }, { "id": "d", "text": "Od dziobu", "correct": false } ] }
  ]
},
{
  id: "zeglarz_jachtowy",
  title: "Żeglarz Jachtowy",
  description: "Sprawdź wiedzę potrzebną do zdobycia patentu żeglarza jachtowego.",
  questions: [
    { "id": 1, "text": "Co oznacza komenda 'szot w lewo'?", "options": [ { "id": "a", "text": "Przesunąć żagiel w lewo", "correct": true }, { "id": "b", "text": "Obrócić ster w lewo", "correct": false }, { "id": "c", "text": "Zwinąć żagiel", "correct": false }, { "id": "d", "text": "Zrzucić kotwicę", "correct": false } ] },
    { "id": 2, "text": "Jak nazywa się manewr skrętu jachtu przez rufę?", "options": [ { "id": "a", "text": "Półwiatr", "correct": false }, { "id": "b", "text": "Odpadanie", "correct": false }, { "id": "c", "text": "Odwrót przez rufę", "correct": true }, { "id": "d", "text": "Zwrot przez sztag", "correct": false } ] },
    { "id": 3, "text": "Jaka jest podstawowa zasada przy wyprzedzaniu jachtu?", "options": [ { "id": "a", "text": "Ustępuje jacht z prawej burty", "correct": true }, { "id": "b", "text": "Ustępuje jacht z lewej burty", "correct": false }, { "id": "c", "text": "Ustępuje większy jacht", "correct": false }, { "id": "d", "text": "Ustępuje mniejszy jacht", "correct": false } ] },
    { "id": 4, "text": "Jakie jest maksymalne zanurzenie typowego jachtu kabinowego?", "options": [ { "id": "a", "text": "0,5 m", "correct": false }, { "id": "b", "text": "1,5 m", "correct": true }, { "id": "c", "text": "3 m", "correct": false }, { "id": "d", "text": "5 m", "correct": false } ] },
    { "id": 5, "text": "Jak oznacza się miejsce kotwiczenia jachtów w nocy?", "options": [ { "id": "a", "text": "Tylko światło czerwone", "correct": false }, { "id": "b", "text": "Światło białe z rufy", "correct": true }, { "id": "c", "text": "Zielone i czerwone światła", "correct": false }, { "id": "d", "text": "Żadne światło nie jest wymagane", "correct": false } ] },
    { "id": 6, "text": "Co to jest refowanie żagla?", "options": [ { "id": "a", "text": "Zmniejszenie powierzchni żagla", "correct": true }, { "id": "b", "text": "Zwiększenie powierzchni żagla", "correct": false }, { "id": "c", "text": "Zmiana koloru żagla", "correct": false }, { "id": "d", "text": "Zrzucanie kotwicy", "correct": false } ] },
    { "id": 7, "text": "Co to jest hals?", "options": [ { "id": "a", "text": "Skręt jachtu pod wiatr", "correct": true }, { "id": "b", "text": "Węzeł", "correct": false }, { "id": "c", "text": "Część żagla", "correct": false }, { "id": "d", "text": "Manewr kotwiczenia", "correct": false } ] },
    { "id": 8, "text": "Co oznacza komenda 'przybór'? ", "options": [ { "id": "a", "text": "Zbliżamy się do wiatru", "correct": true }, { "id": "b", "text": "Odpadamy od wiatru", "correct": false }, { "id": "c", "text": "Zrzucamy żagle", "correct": false }, { "id": "d", "text": "Zmiana kursu o 180°", "correct": false } ] },
    { "id": 9, "text": "Jak nazywa się linia sterująca żaglem grotowym?", "options": [ { "id": "a", "text": "Szot", "correct": true }, { "id": "b", "text": "Fał", "correct": false }, { "id": "c", "text": "Cumka", "correct": false }, { "id": "d", "text": "Odbijacz", "correct": false } ] },
    { "id": 10, "text": "Co należy zrobić przed wejściem na silny wiatr?", "options": [ { "id": "a", "text": "Zredukować żagle", "correct": true }, { "id": "b", "text": "Podnieść pełne żagle", "correct": false }, { "id": "c", "text": "Zrzucić kotwicę", "correct": false }, { "id": "d", "text": "Zmienić kurs na odległy", "correct": false } ] },
    { "id": 11, "text": "Co to jest odpadanie?", "options": [ { "id": "a", "text": "Zmiana kursu od wiatru", "correct": true }, { "id": "b", "text": "Skręt przez dziób", "correct": false }, { "id": "c", "text": "Zwiększenie prędkości", "correct": false }, { "id": "d", "text": "Zatrzymanie jachtu", "correct": false } ] },
    { "id": 12, "text": "Jakie światła ma żaglowy jacht na morzu w nocy?", "options": [ { "id": "a", "text": "Zielone i czerwone z przodu, białe z tyłu", "correct": true }, { "id": "b", "text": "Czerwone z przodu, zielone z tyłu", "correct": false }, { "id": "c", "text": "Tylko białe", "correct": false }, { "id": "d", "text": "Żadne", "correct": false } ] },
    { "id": 13, "text": "Jaką funkcję pełni ster?", "options": [ { "id": "a", "text": "Zmienia kierunek jachtu", "correct": true }, { "id": "b", "text": "Podtrzymuje maszt", "correct": false }, { "id": "c", "text": "Reguluje żagle", "correct": false }, { "id": "d", "text": "Zabezpiecza cumy", "correct": false } ] },
    { "id": 14, "text": "Co to jest sztag?", "options": [ { "id": "a", "text": "Lina podtrzymująca maszt", "correct": true }, { "id": "b", "text": "Rodzaj żagla", "correct": false }, { "id": "c", "text": "Manewr skrętu", "correct": false }, { "id": "d", "text": "Typ kotwicy", "correct": false } ] },
    { "id": 15, "text": "Jak nazywa się manewr skrętu jachtu przez dziób?", "options": [ { "id": "a", "text": "Zwrot przez sztag", "correct": true }, { "id": "b", "text": "Odwrót przez rufę", "correct": false }, { "id": "c", "text": "Odpadanie", "correct": false }, { "id": "d", "text": "Halsowanie", "correct": false } ] }
  ]
},
{
  id: "jachtowy_sternik_morski",
  title: "Jachtowy Sternik Morski",
  description: "Test wiedzy wymaganej do zdobycia patentu jachtowego sternika morskiego.",
  questions: [
    { "id": 1, "text": "Co oznacza komenda 'stój w miejscu'?", "options": [ { "id": "a", "text": "Nie ruszaj się z miejsca", "correct": true }, { "id": "b", "text": "Podnieś żagle", "correct": false }, { "id": "c", "text": "Zejdź z kursu", "correct": false }, { "id": "d", "text": "Zwolnij silnik", "correct": false } ] },
    { "id": 2, "text": "Jakie światło powinien pokazywać jacht motorowo-żaglowy w nocy?", "options": [ { "id": "a", "text": "Zielone i czerwone z przodu, białe z tyłu", "correct": true }, { "id": "b", "text": "Tylko czerwone z przodu", "correct": false }, { "id": "c", "text": "Żółte i niebieskie", "correct": false }, { "id": "d", "text": "Nie jest wymagane", "correct": false } ] },
    { "id": 3, "text": "Co to jest refowanie żagla?", "options": [ { "id": "a", "text": "Zmiana koloru żagla", "correct": false }, { "id": "b", "text": "Zmniejszenie powierzchni żagla", "correct": true }, { "id": "c", "text": "Rozwijanie żagla", "correct": false }, { "id": "d", "text": "Zrzucanie kotwicy", "correct": false } ] },
    { "id": 4, "text": "Jak nazywa się manewr obrotu jachtu przez dziób?", "options": [ { "id": "a", "text": "Zwrot przez rufę", "correct": false }, { "id": "b", "text": "Zwrot przez sztag", "correct": true }, { "id": "c", "text": "Odpadanie", "correct": false }, { "id": "d", "text": "Półwiatr", "correct": false } ] },
    { "id": 5, "text": "Jaki dokument należy mieć podczas rejsu po wodach morskich?", "options": [ { "id": "a", "text": "Dowód osobisty", "correct": false }, { "id": "b", "text": "Patent żeglarza", "correct": true }, { "id": "c", "text": "Prawo jazdy kat. B", "correct": false }, { "id": "d", "text": "Legitymację szkolną", "correct": false } ] },
    { "id": 6, "text": "Co to jest sztorm?", "options": [ { "id": "a", "text": "Silny wiatr i wysoka fala", "correct": true }, { "id": "b", "text": "Mały wiatr", "correct": false }, { "id": "c", "text": "Rodzaj manewru", "correct": false }, { "id": "d", "text": "Rodzaj kotwicy", "correct": false } ] },
    { "id": 7, "text": "Jak nazywa się element sterujący jachtem?", "options": [ { "id": "a", "text": "Ster", "correct": true }, { "id": "b", "text": "Szot", "correct": false }, { "id": "c", "text": "Fał", "correct": false }, { "id": "d", "text": "Cumka", "correct": false } ] },
    { "id": 8, "text": "Co oznacza komenda 'baksztag'?", "options": [ { "id": "a", "text": "Kurs z wiatrem od tyłu pod kątem 45°", "correct": true }, { "id": "b", "text": "Kurs pod wiatr", "correct": false }, { "id": "c", "text": "Zatrzymanie jachtu", "correct": false }, { "id": "d", "text": "Zmiana kursu o 180°", "correct": false } ] },
    { "id": 9, "text": "Co oznacza sygnał mgłowy?", "options": [ { "id": "a", "text": "Zmniejszyć prędkość i włączyć sygnały dźwiękowe", "correct": true }, { "id": "b", "text": "Przyspieszyć", "correct": false }, { "id": "c", "text": "Zrzucić żagle", "correct": false }, { "id": "d", "text": "Zatrzymać silnik", "correct": false } ] },
    { "id": 10, "text": "Co to jest boja?", "options": [ { "id": "a", "text": "Znacznik w wodzie służący do oznaczania toru lub kotwiczenia", "correct": true }, { "id": "b", "text": "Rodzaj żagla", "correct": false }, { "id": "c", "text": "Typ węzła", "correct": false }, { "id": "d", "text": "Rodzaj łodzi", "correct": false } ] },
    { "id": 11, "text": "Jak nazywa się lina podtrzymująca maszt?", "options": [ { "id": "a", "text": "Sztag", "correct": true }, { "id": "b", "text": "Szot", "correct": false }, { "id": "c", "text": "Cumka", "correct": false }, { "id": "d", "text": "Fał", "correct": false } ] },
    { "id": 12, "text": "Co należy zrobić przy wejściu na mieliznę?", "options": [ { "id": "a", "text": "Natychmiast zmienić kurs lub wycofać się", "correct": true }, { "id": "b", "text": "Kontynuować kurs", "correct": false }, { "id": "c", "text": "Zrzucić kotwicę", "correct": false }, { "id": "d", "text": "Przyspieszyć", "correct": false } ] },
    { "id": 13, "text": "Co oznacza komenda 'zwrot przez sztag'?", "options": [ { "id": "a", "text": "Obrót jachtu przez dziób", "correct": true }, { "id": "b", "text": "Obrót przez rufę", "correct": false }, { "id": "c", "text": "Zmiana kursu od wiatru", "correct": false }, { "id": "d", "text": "Zrzucenie żagli", "correct": false } ] },
    { "id": 14, "text": "Jak nazywa się przednia burta jachtu?", "options": [ { "id": "a", "text": "Bakburta", "correct": false }, { "id": "b", "text": "Prawe burta", "correct": false }, { "id": "c", "text": "Lewe burta", "correct": false }, { "id": "d", "text": "Burta", "correct": true } ] },
    { "id": 15, "text": "Jak nazywa się linia służąca do opuszczania żagla?", "options": [ { "id": "a", "text": "Fał", "correct": true }, { "id": "b", "text": "Szot", "correct": false }, { "id": "c", "text": "Cumka", "correct": false }, { "id": "d", "text": "Odbijacz", "correct": false } ] }
  ]
},
{
  id: "sternik_motorowodny",
  title: "Sternik Motorowodny",
  description: "Test wiedzy potrzebnej do zdobycia patentu sternika motorowodnego.",
  questions: [
    { "id": 1, "text": "Jakie dokumenty powinien posiadać sternik motorowodny?", "options": [ { "id": "a", "text": "Patent sternika motorowodnego", "correct": true }, { "id": "b", "text": "Prawo jazdy kat. B", "correct": false }, { "id": "c", "text": "Dowód osobisty", "correct": false }, { "id": "d", "text": "Legitymację szkolną", "correct": false } ] },
    { "id": 2, "text": "Co oznacza sygnał jeden długi dźwięk silnika?", "options": [ { "id": "a", "text": "Niebezpieczeństwo lub ostrzeżenie", "correct": true }, { "id": "b", "text": "Zatrzymanie łodzi", "correct": false }, { "id": "c", "text": "Przyspieszenie", "correct": false }, { "id": "d", "text": "Zmiana kursu", "correct": false } ] },
    { "id": 3, "text": "Jaki jest minimalny wiek do uzyskania patentu sternika motorowodnego?", "options": [ { "id": "a", "text": "14 lat", "correct": false }, { "id": "b", "text": "16 lat", "correct": true }, { "id": "c", "text": "18 lat", "correct": false }, { "id": "d", "text": "21 lat", "correct": false } ] },
    { "id": 4, "text": "Co należy sprawdzić przed wypłynięciem motorówką?", "options": [ { "id": "a", "text": "Stan silnika, paliwo i sprzęt ratunkowy", "correct": true }, { "id": "b", "text": "Kolor kadłuba", "correct": false }, { "id": "c", "text": "Ilość pasażerów na lądzie", "correct": false }, { "id": "d", "text": "Rodzaj wody w basenie", "correct": false } ] },
    { "id": 5, "text": "Co to jest baksztag w motorówce?", "options": [ { "id": "a", "text": "Kurs z wiatrem pod kątem 45°", "correct": true }, { "id": "b", "text": "Rodzaj węzła", "correct": false }, { "id": "c", "text": "Element silnika", "correct": false }, { "id": "d", "text": "Manewr kotwiczenia", "correct": false } ] },
    { "id": 6, "text": "Jakie światła powinien pokazywać jacht motorowy w nocy?", "options": [ { "id": "a", "text": "Czerwone z lewej, zielone z prawej, białe z tyłu", "correct": true }, { "id": "b", "text": "Tylko czerwone", "correct": false }, { "id": "c", "text": "Żółte i niebieskie", "correct": false }, { "id": "d", "text": "Nie pokazuje świateł", "correct": false } ] },
    { "id": 7, "text": "Co to jest awaryjne odcięcie silnika?", "options": [ { "id": "a", "text": "Mechanizm zatrzymujący silnik w nagłym przypadku", "correct": true }, { "id": "b", "text": "Zmiana biegu", "correct": false }, { "id": "c", "text": "Rodzaj kotwicy", "correct": false }, { "id": "d", "text": "Manewr skrętu", "correct": false } ] },
    { "id": 8, "text": "Jakie urządzenie służy do komunikacji między łodziami w porcie?", "options": [ { "id": "a", "text": "Radio VHF", "correct": true }, { "id": "b", "text": "Telefon komórkowy", "correct": false }, { "id": "c", "text": "Latarka", "correct": false }, { "id": "d", "text": "Fajerwerki", "correct": false } ] },
    { "id": 9, "text": "Jaką odległość od brzegu należy zachować w rejonach kąpielisk?", "options": [ { "id": "a", "text": "50 m", "correct": false }, { "id": "b", "text": "100 m", "correct": true }, { "id": "c", "text": "200 m", "correct": false }, { "id": "d", "text": "10 m", "correct": false } ] },
    { "id": 10, "text": "Co to jest mielizna?", "options": [ { "id": "a", "text": "Płytka część akwenu zagrażająca jednostce", "correct": true }, { "id": "b", "text": "Rodzaj węzła", "correct": false }, { "id": "c", "text": "Typ kotwicy", "correct": false }, { "id": "d", "text": "Rodzaj silnika", "correct": false } ] },
    { "id": 11, "text": "Jak należy wyprzedzać inną jednostkę motorową?", "options": [ { "id": "a", "text": "Od strony zawietrznej", "correct": false }, { "id": "b", "text": "Od strony prawej burty", "correct": true }, { "id": "c", "text": "Od rufy", "correct": false }, { "id": "d", "text": "Od dziobu", "correct": false } ] },
    { "id": 12, "text": "Co to jest kąpiel ratunkowa?", "options": [ { "id": "a", "text": "Ćwiczenie ewakuacji lub ratowania osoby z wody", "correct": true }, { "id": "b", "text": "Rodzaj kąpieli w basenie", "correct": false }, { "id": "c", "text": "Manewr przy kei", "correct": false }, { "id": "d", "text": "Sposób cumowania", "correct": false } ] },
    { "id": 13, "text": "Jak nazywa się manewr zmiany kursu o 180° w motorówce?", "options": [ { "id": "a", "text": "Odwrót", "correct": true }, { "id": "b", "text": "Halsowanie", "correct": false }, { "id": "c", "text": "Zwrot przez sztag", "correct": false }, { "id": "d", "text": "Baksztag", "correct": false } ] },
    { "id": 14, "text": "Co należy zrobić w przypadku awarii silnika na wodzie?", "options": [ { "id": "a", "text": "Uruchomić radio i włączyć sygnały awaryjne", "correct": true }, { "id": "b", "text": "Przyspieszyć", "correct": false }, { "id": "c", "text": "Zrzucić kotwicę", "correct": false }, { "id": "d", "text": "Zignorować sytuację", "correct": false } ] },
    { "id": 15, "text": "Jak należy cumować motorówkę przy kei?", "options": [ { "id": "a", "text": "Cumy przodem i rufą, dobrze zabezpieczone", "correct": true }, { "id": "b", "text": "Tylko przodem", "correct": false }, { "id": "c", "text": "Tylko rufą", "correct": false }, { "id": "d", "text": "Nie jest wymagane", "correct": false } ] }
  ]
},
{
  id: "motorowodny_sternik_morski",
  title: "Motorowodny Sternik Morski",
  description: "Test wiedzy wymaganej do zdobycia patentu motorowodnego sternika morskiego.",
  questions: [
    { "id": 1, "text": "Jakie są obowiązkowe dokumenty na jednostce motorowej na morzu?", "options": [ { "id": "a", "text": "Patent sternika, dowód rejestracyjny jednostki, ubezpieczenie", "correct": true }, { "id": "b", "text": "Prawo jazdy kat. B", "correct": false }, { "id": "c", "text": "Dowód osobisty", "correct": false }, { "id": "d", "text": "Legitymacja szkolna", "correct": false } ] },
    { "id": 2, "text": "Co to jest nawigacja morska?", "options": [ { "id": "a", "text": "Planowanie i prowadzenie jednostki na wodach morskich", "correct": true }, { "id": "b", "text": "Manewry portowe", "correct": false }, { "id": "c", "text": "Rodzaj cumowania", "correct": false }, { "id": "d", "text": "Sposób węzłów", "correct": false } ] },
    { "id": 3, "text": "Co to jest boja kardynalna?", "options": [ { "id": "a", "text": "Oznaczenie przeszkody wodnej i wskazanie kierunku bezpieczeństwa", "correct": true }, { "id": "b", "text": "Rodzaj światła w porcie", "correct": false }, { "id": "c", "text": "Manewr silnikowy", "correct": false }, { "id": "d", "text": "Rodzaj kotwicy", "correct": false } ] },
    { "id": 4, "text": "Jakie światła na morzu wskazują statek zakotwiczony?", "options": [ { "id": "a", "text": "Białe 360°", "correct": true }, { "id": "b", "text": "Czerwone i zielone", "correct": false }, { "id": "c", "text": "Żółte", "correct": false }, { "id": "d", "text": "Nie świeci", "correct": false } ] },
    { "id": 5, "text": "Co to jest mielizna?", "options": [ { "id": "a", "text": "Płytka część akwenu zagrażająca jednostce", "correct": true }, { "id": "b", "text": "Rodzaj kotwicy", "correct": false }, { "id": "c", "text": "Manewr skrętu", "correct": false }, { "id": "d", "text": "Rodzaj silnika", "correct": false } ] },
    { "id": 6, "text": "Co oznacza sygnał mgłowy na morzu?", "options": [ { "id": "a", "text": "Zmniejszyć prędkość i włączyć sygnały dźwiękowe", "correct": true }, { "id": "b", "text": "Przyspieszyć", "correct": false }, { "id": "c", "text": "Zrzucić kotwicę", "correct": false }, { "id": "d", "text": "Zatrzymać silnik", "correct": false } ] },
    { "id": 7, "text": "Jak należy wyprzedzać jednostkę motorową na morzu?", "options": [ { "id": "a", "text": "Od strony prawej burty", "correct": true }, { "id": "b", "text": "Od strony lewej burty", "correct": false }, { "id": "c", "text": "Od rufy", "correct": false }, { "id": "d", "text": "Od dziobu", "correct": false } ] },
    { "id": 8, "text": "Co to jest awaryjne odcięcie silnika?", "options": [ { "id": "a", "text": "Mechanizm zatrzymujący silnik w nagłym przypadku", "correct": true }, { "id": "b", "text": "Zmiana biegu", "correct": false }, { "id": "c", "text": "Rodzaj kotwicy", "correct": false }, { "id": "d", "text": "Manewr skrętu", "correct": false } ] },
    { "id": 9, "text": "Co należy zrobić w przypadku awarii silnika na morzu?", "options": [ { "id": "a", "text": "Uruchomić radio i włączyć sygnały awaryjne", "correct": true }, { "id": "b", "text": "Przyspieszyć", "correct": false }, { "id": "c", "text": "Zrzucić kotwicę", "correct": false }, { "id": "d", "text": "Zignorować sytuację", "correct": false } ] },
    { "id": 10, "text": "Jak należy cumować jednostkę motorową przy kei?", "options": [ { "id": "a", "text": "Cumy przodem i rufą, dobrze zabezpieczone", "correct": true }, { "id": "b", "text": "Tylko przodem", "correct": false }, { "id": "c", "text": "Tylko rufą", "correct": false }, { "id": "d", "text": "Nie jest wymagane", "correct": false } ] },
    { "id": 11, "text": "Co to jest kąpiel ratunkowa?", "options": [ { "id": "a", "text": "Ćwiczenie ewakuacji lub ratowania osoby z wody", "correct": true }, { "id": "b", "text": "Rodzaj kąpieli w basenie", "correct": false }, { "id": "c", "text": "Manewr przy kei", "correct": false }, { "id": "d", "text": "Sposób cumowania", "correct": false } ] },
    { "id": 12, "text": "Co to jest baksztag?", "options": [ { "id": "a", "text": "Kurs z wiatrem pod kątem 45°", "correct": true }, { "id": "b", "text": "Rodzaj węzła", "correct": false }, { "id": "c", "text": "Element silnika", "correct": false }, { "id": "d", "text": "Manewr kotwiczenia", "correct": false } ] },
    { "id": 13, "text": "Jakie urządzenie służy do komunikacji między jednostkami na morzu?", "options": [ { "id": "a", "text": "Radio VHF", "correct": true }, { "id": "b", "text": "Telefon komórkowy", "correct": false }, { "id": "c", "text": "Latarka", "correct": false }, { "id": "d", "text": "Fajerwerki", "correct": false } ] },
    { "id": 14, "text": "Co to jest nautyka morska?", "options": [ { "id": "a", "text": "Nauka o prowadzeniu jednostek na morzu", "correct": true }, { "id": "b", "text": "Rodzaj węzła", "correct": false }, { "id": "c", "text": "Typ kotwicy", "correct": false }, { "id": "d", "text": "Manewr skrętu", "correct": false } ] },
    { "id": 15, "text": "Jak należy zachować się podczas mgły na morzu?", "options": [ { "id": "a", "text": "Zmniejszyć prędkość i włączyć sygnały dźwiękowe", "correct": true }, { "id": "b", "text": "Przyspieszyć", "correct": false }, { "id": "c", "text": "Zrzucić kotwicę", "correct": false }, { "id": "d", "text": "Zignorować sytuację", "correct": false } ] }
  ]
}


]

function useAccurateTimer(active: boolean, resetSignal: boolean) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (resetSignal) setElapsed(0)
    if (active) {
      startRef.current = performance.now() - elapsed * 1000
      const update = () => {
        const now = performance.now()
        if (startRef.current != null) setElapsed(Math.floor((now - startRef.current) / 1000))
        frameRef.current = requestAnimationFrame(update)
      }
      frameRef.current = requestAnimationFrame(update)
      return () => cancelAnimationFrame(frameRef.current!)
    } else if (!active && frameRef.current) {
      cancelAnimationFrame(frameRef.current)
    }
  }, [active, resetSignal])

  return elapsed
}

function AnimatedCircle({ percentage }: { percentage: number }) {
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const circleColor = percentage >= 80 ? "#22c55e" : "#ef4444"
  const [animatedPercent, setAnimatedPercent] = useState(0)
  const [animatedOffset, setAnimatedOffset] = useState(circumference)

  useEffect(() => {
    let start: number | null = null
    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / 1500, 1)
      setAnimatedPercent(Math.round(progress * percentage))
      setAnimatedOffset(circumference - (progress * percentage) / 100 * circumference)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [percentage, circumference])

  return (
    <div className="relative w-[150px] h-[150px] mb-4">
      <svg width={150} height={150}>
        <circle cx={75} cy={75} r={radius} stroke="#e5e7eb" strokeWidth={12} fill="transparent" />
        <circle
          cx={75}
          cy={75}
          r={radius}
          stroke={circleColor}
          strokeWidth={12}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
          transform="rotate(-90 75 75)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold" style={{ color: circleColor }}>
        {animatedPercent}%
      </div>
    </div>
  )
}

function getRandomQuestions(questions: Question[], count: number) {
  const shuffled = [...questions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export default function StudyView() {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [resetTimer, setResetTimer] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const time = useAccurateTimer(timerActive, resetTimer)
  const currentQuestion = questions[currentQuestionIndex]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  const handleOptionClick = (optionId: string) => {
    if (selectedOptionId) return
    setSelectedOptionId(optionId)
    const option = currentQuestion.options.find((o) => o.id === optionId)
    if (option?.correct) setScore((s) => s + 1)

    if (currentQuestionIndex + 1 < questions.length) {
      setTimeout(() => {
        setSelectedOptionId(null)
        setCurrentQuestionIndex((prev) => prev + 1)
      }, 3000)
    }
  }

  const handleFinishTest = () => {
    setFinished(true)
    setTimerActive(false)
  }

  const handleRestart = () => {
    setSelectedTest(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setSelectedOptionId(null)
    setScore(0)
    setFinished(false)
    setTimerActive(false)
    setResetTimer(true)
    setShowConfirm(false)
  }

  if (!selectedTest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl justify-items-center">
        {tests.map((test, index) => {
          const isLastOdd =
            tests.length % 2 === 1 && index === tests.length - 1;
          return (
            <Card
              key={test.id}
              className={`flex flex-col justify-between transition hover:shadow-lg w-full max-w-sm ${isLastOdd ? "md:col-start-1 md:col-end-3 mb-20" : ""}`}
            >
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex gap-2 mt-2">
                  {[5, 10, 15].map((count) => (
                    <Button
                      key={count}
                      onClick={() => {
                        setSelectedTest(test)
                        setQuestions(getRandomQuestions(test.questions, count))
                        setTimerActive(true)
                        setResetTimer(true)
                      }}
                      variant="outline"
                    >
                      {count} pytań
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

        <BottomNavbar />
      </div>
    )
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 space-y-6">
        <h2 className="text-3xl font-bold">Twój wynik</h2>
        <AnimatedCircle percentage={percentage} />
        <p className="text-xl">Poprawne odpowiedzi: {score} / {questions.length}</p>
        <p className="text-lg">Czas rozwiązania: {formatTime(time)}</p>
        <Button onClick={handleRestart}>Wróć do wyboru testu</Button>
        {percentage >= 80 && <Confetti />}
        <BottomNavbar />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl text-center space-y-6">
        <div className="flex justify-between items-center w-full">
          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Na pewno chcesz wyjść?</AlertDialogTitle>
                <AlertDialogDescription>
                  Jeśli wrócisz, Twój postęp w teście zostanie utracony.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction onClick={handleRestart}>Tak, wyjdź</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <span className="text-lg font-mono">{formatTime(time)}</span>
        </div>

        <h2 className="text-2xl font-semibold">
          Pytanie {currentQuestionIndex + 1} z {questions.length}
        </h2>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2 rounded-full" />
        <div className="text-xl font-bold">{currentQuestion.text}</div>

        <div className="flex flex-col gap-2 mt-4">
          {currentQuestion.options.map((option) => {
            let bgColor = "bg-gray-100"
            if (selectedOptionId) {
              if (option.id === selectedOptionId) {
                bgColor = option.correct ? "bg-green-300" : "bg-red-300"
              } else if (option.correct) {
                bgColor = "bg-green-300"
              }
            }

            return (
              <Button
                key={option.id}
                variant="outline"
                className={`${bgColor} text-black`}
                onClick={() => handleOptionClick(option.id)}
              >
                {option.text}
              </Button>
            )
          })}
        </div>

        {selectedOptionId && currentQuestionIndex + 1 === questions.length && (
          <Button className="mt-4" onClick={handleFinishTest}>
            Zakończ test
          </Button>
        )}
      </div>
      <BottomNavbar />
    </div>
  )
}
