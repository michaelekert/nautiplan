import { useState } from "react"
import { BottomNavbar } from "@/components/BottomNavbar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type Question = {
  id: number
  text: string
  options: { id: string; text: string; correct: boolean }[]
}

// Definicja testów żeglarskich
const tests = {
  test1: {
    title: "Podstawy żeglarstwa",
    description: "Sprawdź swoją wiedzę na temat podstaw żeglowania i zasad bezpieczeństwa.",
    questions: [
      { id: 1, text: "Jaki jest stolic Polski?", options: [
        { id: "a", text: "Warszawa", correct: true },
        { id: "b", text: "Kraków", correct: false },
        { id: "c", text: "Gdańsk", correct: false },
        { id: "d", text: "Poznań", correct: false },
      ]},
      { id: 2, text: "2 + 2 = ?", options: [
        { id: "a", text: "3", correct: false },
        { id: "b", text: "4", correct: true },
        { id: "c", text: "5", correct: false },
        { id: "d", text: "22", correct: false },
      ]},
      { id: 3, text: "Kolor nieba?", options: [
        { id: "a", text: "Niebieski", correct: true },
        { id: "b", text: "Zielony", correct: false },
        { id: "c", text: "Czerwony", correct: false },
        { id: "d", text: "Żółty", correct: false },
      ]},
      { id: 4, text: "Liczba dni w tygodniu?", options: [
        { id: "a", text: "5", correct: false },
        { id: "b", text: "7", correct: true },
        { id: "c", text: "6", correct: false },
        { id: "d", text: "8", correct: false },
      ]},
      { id: 5, text: "Największe morze na świecie?", options: [
        { id: "a", text: "Morze Śródziemne", correct: false },
        { id: "b", text: "Morze Karaibskie", correct: false },
        { id: "c", text: "Morze Filipińskie", correct: true },
        { id: "d", text: "Morze Północne", correct: false },
      ]},
    ],
  },
  test2: {
    title: "Znaki i nawigacja",
    description: "Test wiedzy o znakach żeglarskich, kierunkach i podstawowej nawigacji.",
    questions: [
      { id: 1, text: "Jaka jest flaga Polski?", options: [
        { id: "a", text: "Czerwono-biała", correct: true },
        { id: "b", text: "Niebiesko-żółta", correct: false },
        { id: "c", text: "Zielono-czarna", correct: false },
        { id: "d", text: "Czarna", correct: false },
      ]},
      { id: 2, text: "Najwyższy szczyt w Polsce?", options: [
        { id: "a", text: "Rysy", correct: true },
        { id: "b", text: "Śnieżka", correct: false },
        { id: "c", text: "Giewont", correct: false },
        { id: "d", text: "Kasprowy", correct: false },
      ]},
      { id: 3, text: "Ile kontynentów jest na świecie?", options: [
        { id: "a", text: "5", correct: false },
        { id: "b", text: "6", correct: false },
        { id: "c", text: "7", correct: true },
        { id: "d", text: "8", correct: false },
      ]},
      { id: 4, text: "Kolor trawy?", options: [
        { id: "a", text: "Zielony", correct: true },
        { id: "b", text: "Czerwony", correct: false },
        { id: "c", text: "Niebieski", correct: false },
        { id: "d", text: "Żółty", correct: false },
      ]},
      { id: 5, text: "Ile minut w godzinie?", options: [
        { id: "a", text: "60", correct: true },
        { id: "b", text: "100", correct: false },
        { id: "c", text: "50", correct: false },
        { id: "d", text: "120", correct: false },
      ]},
    ],
  },
}

export default function StudyView() {
  const [selectedTest, setSelectedTest] = useState<null | "test1" | "test2">(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  if (!selectedTest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Wybierz test żeglarski</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {Object.entries(tests).map(([key, test]) => (
            <Card
              key={key}
              className="w-72 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedTest(key as "test1" | "test2")}
            >
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Ilość pytań: {test.questions.length}</p>
                <Button className="w-full mt-2" onClick={() => setSelectedTest(key as "test1" | "test2")}>
                  Rozpocznij
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <BottomNavbar />
      </div>
    )
  }

  const questions = tests[selectedTest].questions
  const currentQuestion = questions[currentQuestionIndex]

  const handleOptionClick = (optionId: string, correct: boolean) => {
    if (selectedOptionId) return
    setSelectedOptionId(optionId)
    if (correct) setScore((prev) => prev + 1)
  }

  const handleNext = () => {
    setSelectedOptionId(null)
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setCompleted(true)
    }
  }

  if (completed) {
    const percent = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 text-center">
        <h2 className="text-3xl font-bold">Koniec testu!</h2>
        <p className="text-xl">Twój wynik: {score} / {questions.length}</p>
        <p className="text-xl">Procent poprawnych odpowiedzi: {percent}%</p>
        <Button onClick={() => {
          setSelectedTest(null)
          setCurrentQuestionIndex(0)
          setSelectedOptionId(null)
          setScore(0)
          setCompleted(false)
        }}>Wróć do wyboru testu</Button>
        <BottomNavbar />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <div className="w-full max-w-md flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
        <div className="text-xl font-semibold">
          Pytanie {currentQuestionIndex + 1} z {questions.length}
        </div>

        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />

        <div className="mt-4 text-2xl font-bold">{currentQuestion.text}</div>

        <div className="mt-4 flex flex-col gap-2">
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
                onClick={() => handleOptionClick(option.id, option.correct)}
              >
                {option.text}
              </Button>
            )
          })}
        </div>

        {selectedOptionId && (
          <Button className="mt-4" onClick={handleNext}>
            {currentQuestionIndex + 1 < questions.length ? "Następne pytanie" : "Zakończ test"}
          </Button>
        )}
      </div>

      <BottomNavbar />
    </div>
  )
}
