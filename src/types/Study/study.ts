export type Question = {
  id: number
  text: string
  options: { id: string; text: string; correct: boolean }[]
}

export type Test = {
  id: string
  title: string
  description: string
  questions: Question[]
}