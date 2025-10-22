export type ChecklistItem = { id: number; name: string; checked: boolean }
export type Regulation = { id: number; title: string; description: string }
export type Fault = { id: number; title: string; advice: string }
export type Tip = { id: number; title: string; description: string }
export type Document = { id: number; title: string; description: string }

export async function fetchChecklists(): Promise<ChecklistItem[]> {
  await new Promise((r) => setTimeout(r, 500))
  return [
    { id: 1, name: "Sprawdzenie silnika", checked: false },
    { id: 2, name: "Sprawdzenie żagli", checked: false },
    { id: 3, name: "Kontrola lin cumowniczych", checked: false },
    { id: 4, name: "Sprawdzenie kamizelki ratunkowej", checked: false },
  ]
}

export async function fetchRegulations(): Promise<Regulation[]> {
  await new Promise((r) => setTimeout(r, 500))
  return [
    { id: 1, title: "Prawo drogi na wodzie", description: "Zasady pierwszeństwa przejazdu." },
    { id: 2, title: "Procedury bezpieczeństwa", description: "Obowiązkowe zasady bezpieczeństwa." },
    { id: 3, title: "Sygnały dźwiękowe i świetlne", description: "Międzynarodowe przepisy sygnalizacji." },
  ]
}

export async function fetchFaults(): Promise<Fault[]> {
  await new Promise((r) => setTimeout(r, 500))
  return [
    { id: 1, title: "Silnik nie odpala", advice: "Sprawdź paliwo, akumulator i układ zapłonowy." },
    { id: 2, title: "Problem z radio", advice: "Sprawdź połączenia antenowe i zasilanie." },
  ]
}

export async function fetchTips(): Promise<Tip[]> {
  await new Promise((r) => setTimeout(r, 500))
  return [
    { id: 1, title: "Zawsze sprawdzaj pogodę", description: "Sprawdź prognozę na najbliższe 48 godzin." },
    { id: 2, title: "Nie przeciążaj jachtu", description: "Zachowaj odpowiedni rozkład ciężaru." },
  ]
}

export async function fetchDocuments(): Promise<Document[]> {
  await new Promise((r) => setTimeout(r, 500))
  return [
    { id: 1, title: "Licencja żeglarska", description: "Patent żeglarski wymagany do prowadzenia jachtów." },
    { id: 2, title: "Ubezpieczenie jachtu", description: "Polisa OC i AC dla jednostki pływającej." },
  ]
}