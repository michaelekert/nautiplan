import { useState } from "react"
import { BottomNavbar } from "@/components/BottomNavbar"
import { useAccurateTimer } from "@/hooks/Study/useAccurateTimer"
import { TestSelection } from "@/components/Study/TestSelection"
import { QuizQuestion } from "@/components/Study/QuizQuestion"
import { QuizResult } from "@/components/Study/QuizResult"
import type { Test, Question } from "@/types/Study/study"

export default function StudyView() {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [resetTimer, setResetTimer] = useState(false)

  const time = useAccurateTimer(timerActive, resetTimer)
  const currentQuestion = questions[currentQuestionIndex]

  const handleSelectTest = (test: Test, selectedQuestions: Question[]) => {
    setSelectedTest(test)
    setQuestions(selectedQuestions)
    setTimerActive(true)
    setResetTimer(true)
  }

  const handleAnswer = (_optionId: string, isCorrect: boolean) => {
    if (isCorrect) {
      setScore((s) => s + 1)
    }

    const isLastQuestion = currentQuestionIndex + 1 === questions.length
    
    setTimeout(() => {
      if (isLastQuestion) {
        setFinished(true)
        setTimerActive(false)
      } else {
        setCurrentQuestionIndex((prev) => prev + 1)
      }
    }, 1000)
  }

  const handleRestart = () => {
    setSelectedTest(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setScore(0)
    setFinished(false)
    setTimerActive(false)
    setResetTimer(true)
  }

  if (!selectedTest) {
    return (
      <>
        <TestSelection onSelectTest={handleSelectTest} />
        <BottomNavbar />
      </>
    )
  }

  if (finished) {
    return (
      <>
        <QuizResult
          score={score}
          totalQuestions={questions.length}
          time={time}
          onRestart={handleRestart}
        />
        <BottomNavbar />
      </>
    )
  }

  return (
    <>
      <QuizQuestion
        question={currentQuestion}
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        time={time}
        onAnswer={handleAnswer}
        onExit={handleRestart}
      />
      <BottomNavbar />
    </>
  )
}