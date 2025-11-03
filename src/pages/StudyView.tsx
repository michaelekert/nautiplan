import { useState } from "react"
import { BottomNavbar } from "@/components/BottomNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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
    id: "basics",
    title: "Podstawy żeglarstwa",
    description: "Sprawdź swoją wiedzę z podstawowych zasad żeglowania.",
    questions: [
      {
        id: 1,
        text: "Jak nazywa się przednia część jachtu?",
        options: [
          { id: "a", text: "Rufa", correct: false },
          { id: "b", text: "Bakburta", correct: false },
          { id: "c", text: "Dziób", correct: true },
          { id: "d", text: "Ster", correct: false },
        ],
      },
      {
        id: 2,
        text: "Co oznacza komenda 'klar na żagle'?",
        options: [
          { id: "a", text: "Zwinąć żagle", correct: false },
          { id: "b", text: "Przygotować żagle do postawienia", correct: true },
          { id: "c", text: "Podnieść kotwicę", correct: false },
          { id: "d", text: "Zrzucić żagle", correct: false },
        ],
      },
      {
        id: 3,
        text: "Jak nazywa się lina służąca do podnoszenia żagla?",
        options: [
          { id: "a", text: "Fał", correct: true },
          { id: "b", text: "Szot", correct: false },
          { id: "c", text: "Cumka", correct: false },
          { id: "d", text: "Odbijacz", correct: false },
        ],
      },
      {
        id: 4,
        text: "Jakie światło pokazuje jacht żaglowy w nocy?",
        options: [
          { id: "a", text: "Zielone i czerwone z przodu oraz białe z tyłu", correct: true },
          { id: "b", text: "Tylko białe", correct: false },
          { id: "c", text: "Czerwone i niebieskie", correct: false },
          { id: "d", text: "Pomarańczowe i białe", correct: false },
        ],
      },
      {
        id: 5,
        text: "Z której strony należy wyprzedzać inny jacht?",
        options: [
          { id: "a", text: "Od strony zawietrznej", correct: true },
          { id: "b", text: "Od strony nawietrznej", correct: false },
          { id: "c", text: "Od dziobu", correct: false },
          { id: "d", text: "Od rufy", correct: false },
        ],
      },
    ],
  },
  {
    id: "rules",
    title: "Przepisy i bezpieczeństwo na wodzie",
    description: "Test z zasad pierwszeństwa i zachowania bezpieczeństwa na akwenie.",
    questions: [
      {
        id: 1,
        text: "Który jacht ma pierwszeństwo – na lewym czy prawym halsie?",
        options: [
          { id: "a", text: "Na lewym halsie", correct: false },
          { id: "b", text: "Na prawym halsie", correct: true },
          { id: "c", text: "Ten większy", correct: false },
          { id: "d", text: "Ten szybszy", correct: false },
        ],
      },
      {
        id: 2,
        text: "Co należy zrobić, gdy jacht się wywróci?",
        options: [
          { id: "a", text: "Zostać przy jachcie i wzywać pomoc", correct: true },
          { id: "b", text: "Płynąć do brzegu", correct: false },
          { id: "c", text: "Odpłynąć od jachtu", correct: false },
          { id: "d", text: "Zanurkować pod jachtem", correct: false },
        ],
      },
      {
        id: 3,
        text: "Jakie sygnały oznaczają człowieka za burtą?",
        options: [
          { id: "a", text: "Krzyk 'Człowiek za burtą!' i wskazanie ręką", correct: true },
          { id: "b", text: "Trzy krótkie gwizdki", correct: false },
          { id: "c", text: "Podniesienie czerwonej flagi", correct: false },
          { id: "d", text: "Włączenie świateł pozycyjnych", correct: false },
        ],
      },
      {
        id: 4,
        text: "Jakie elementy obowiązkowo muszą być na pokładzie jachtu?",
        options: [
          { id: "a", text: "Kamizelki ratunkowe, apteczka, gaśnica", correct: true },
          { id: "b", text: "Tylko wiosło i lina", correct: false },
          { id: "c", text: "Radio i flaga", correct: false },
          { id: "d", text: "Zapasowe żagle", correct: false },
        ],
      },
      {
        id: 5,
        text: "Kiedy jacht musi ustąpić jednostce napędzanej silnikiem?",
        options: [
          { id: "a", text: "Gdy jednostka nie może manewrować", correct: true },
          { id: "b", text: "Zawsze", correct: false },
          { id: "c", text: "Nigdy", correct: false },
          { id: "d", text: "Tylko na jeziorze", correct: false },
        ],
      },
    ],
  },
]

export default function StudyView() {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  if (!selectedTest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {tests.map((test) => (
            <Card
              key={test.id}
              className="flex flex-col justify-between cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedTest(test)}
            >
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Liczba pytań: {test.questions.length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <BottomNavbar />
      </div>
    )
  }

  const questions = selectedTest.questions
  const currentQuestion = questions[currentQuestionIndex]

  const handleOptionClick = (optionId: string) => {
    if (selectedOptionId) return
    setSelectedOptionId(optionId)
    const option = currentQuestion.options.find((o) => o.id === optionId)
    if (option?.correct) setScore((s) => s + 1)
  }

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setSelectedOptionId(null)
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setFinished(true)
    }
  }

  const handleRestart = () => {
    setSelectedTest(null)
    setCurrentQuestionIndex(0)
    setSelectedOptionId(null)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-3xl font-bold mb-4">Twój wynik</h2>
        <p className="text-xl mb-6">
          Odpowiedziałeś poprawnie na {score} z {questions.length} pytań (
          {Math.round((score / questions.length) * 100)}%)
        </p>
        <Button onClick={handleRestart}>Wróć do wyboru testu</Button>
        <BottomNavbar />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl text-center space-y-6">
        <h2 className="text-2xl font-semibold">
          Pytanie {currentQuestionIndex + 1} z {questions.length}
        </h2>
        <Progress
          value={((currentQuestionIndex + 1) / questions.length) * 100}
        />
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

        {selectedOptionId && (
          <Button className="mt-4" onClick={handleNext}>
            {currentQuestionIndex + 1 === questions.length
              ? "Zakończ test"
              : "Następne pytanie"}
          </Button>
        )}
      </div>
      <BottomNavbar />
    </div>
  )
}
