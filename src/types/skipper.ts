export type Section = "checklisty" | "przepisy" | "słownik żeglarski" | "moje trasy" | "dokumenty"

export interface ChecklistItem {
  text: string
  checked: boolean
}

export interface Checklist {
  title: string
  items: ChecklistItem[]
}

export interface ChecklistCategory {
  name: string
  icon: string
  checklists: Checklist[]
}

export interface SignalList {
  letter: string
  flag?: string
  name: string
  meaning: string
}