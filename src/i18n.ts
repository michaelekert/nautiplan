import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      Home: "Home",
      "Passage Plan": "Passage Plan",
      Study: "Study",
      Skipper: "Skipper",
      "Departure date and time": "Departure date and time",
      "Default speed (knots)": "Default speed (knots)",
      "Press Enter to add a stop or continue clicking": "Press Enter to add a stop or continue clicking",
      "Click to add points • Esc cancels": "Click to add points • Esc cancels",
      "Undo last": "Undo last",
      "Clear all": "Clear all",
      "Draw route": "Draw route",
      "Start route": "Start route",
      "Continue route": "Continue route",
      "Add point": "Add point",
      "Cancel": "Cancel",
      "Add stop": "Add stop",
      "Open planning panel": "Open Planning Panel",
      "Route settings": "Route Settings",
      "Start point": "Start point",
      "End point": "End point",
      "Speed (knots)": "Speed (knots)",
      "Stop (hours)": "Stop (hours)",
      "Estimated arrival time": "Estimated arrival time",
      "Main menu": "Main menu",
      "Checklists": "Checklists",
      "Regulations": "Regulations",
      "Faults": "Faults",
      "Tips": "Tips",
      "Documents": "Documents",
      "Faults section placeholder": "Faults section placeholder",
      "Tips section placeholder": "Tips section placeholder",
      "Documents section placeholder": "Documents section placeholder",
      "Click on the map to add a route": "Click on the map to add a route"
    },
  },
  pl: {
    translation: {
      Home: "Strona główna",
      "Passage Plan": "Plan trasy",
      Study: "Nauka",
      Skipper: "Sternik",
      "Departure date and time": "Data i godzina wypłynięcia",
      "Default speed (knots)": "Domyślna prędkość (węzły)",
      "Press Enter to add a stop or continue clicking": "✓ Naciśnij Enter, aby dodać postój lub klikaj dalej",
      "Click to add points • Esc cancels": "Kliknij, aby dodać punkty • Esc anuluje",
      "Undo last": "Cofnij ostatni",
      "Clear all": "Usuń wszystko",
      "Draw route": "Rysuj trasę",
      "Start route": "Zacznij trasę",
      "Continue route": "Kontynuuj trasę",
      "Add point": "Dodaj punkt",
      "Cancel": "Anuluj",
      "Add stop": "Dodaj postój",
      "Open planning panel": "Otwórz panel planowania",
      "Route settings": "Ustawienia trasy",
      "Start point": "Punkt startowy",
      "End point": "Punkt końcowy",
      "Speed (knots)": "Prędkość (węzły)",
      "Stop (hours)": "Postój (h)",
      "Estimated arrival time": "Przewidywany czas dopłynięcia",
      "Main menu": "Menu główne",
      "Checklists": "Checklisty",
      "Regulations": "Przepisy",
      "Faults": "Usterki",
      "Tips": "Porady",
      "Documents": "Dokumenty",
      "Faults section placeholder": "Tu będą usterki",
      "Tips section placeholder": "Tu będą porady",
      "Documents section placeholder": "Tu będą dokumenty",
      "Click on the map to add a route": "Kliknij na mapę, aby dodać trasę"
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default lang
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
