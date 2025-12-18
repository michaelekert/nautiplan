import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
import { formatTime } from "@/hooks/Study/useAccurateTimer"
import type { Question } from "@/types/Study/study"

interface QuizQuestionProps {
  question: Question
  currentIndex: number
  totalQuestions: number
  time: number
  onAnswer: (optionId: string, isCorrect: boolean) => void
  onFinish: () => void
  onExit: () => void
  isLastQuestion: boolean
}

export function QuizQuestion({
  question,
  currentIndex,
  totalQuestions,
  time,
  onAnswer,
  onFinish,
  onExit,
  isLastQuestion,
}: QuizQuestionProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer?: string } | null>(null)

  const handleOptionClick = (optionId: string) => {
    if (selectedOptionId) return
    setSelectedOptionId(optionId)
    
    const option = question.options.find((o) => o.id === optionId)
    const isCorrect = option?.correct ?? false
    const correctOption = question.options.find((o) => o.correct)
    
    setFeedback({
      isCorrect,
      correctAnswer: !isCorrect ? correctOption?.text : undefined
    })
    
    onAnswer(optionId, isCorrect)
  }

  useEffect(() => {
    setSelectedOptionId(null)
    setFeedback(null)
  }, [question.id])

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
                <AlertDialogAction onClick={onExit}>Tak, wyjdź</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <span className="text-lg font-mono">{formatTime(time)}</span>
        </div>

        <h2 className="text-2xl font-semibold">
          Pytanie {currentIndex + 1} z {totalQuestions}
        </h2>
        <Progress 
          value={((currentIndex + 1) / totalQuestions) * 100} 
          className="h-2 rounded-full" 
        />
        <div className="text-xl font-bold">{question.text}</div>
        
        <div className="flex flex-col gap-2 mt-4 mb-4">
          {question.options.map((option) => {
            let bgColor = "bg-gray-100 hover:bg-gray-200"
            let textColor = "text-black"

            if (selectedOptionId) {
              if (option.id === selectedOptionId) {
                bgColor = option.correct ? "!bg-green-300" : "!bg-red-300"
              } else if (option.correct) {
                bgColor = "!bg-green-300"
              }
              textColor = "text-black"
            }

            return (
              <Button
                key={option.id}
                variant="outline"
                className={`${bgColor} ${textColor} cursor-pointer`}
                onClick={() => handleOptionClick(option.id)}
              >
                {option.text}
              </Button>
            )
          })}
        </div>

        <div className="h-20 mb-6">
          {feedback && (
            <div className={`p-4 rounded-lg ${feedback.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {feedback.isCorrect ? (
                <p className="font-semibold">✓ Dobrze!</p>
              ) : (
                <div>
                  <p className="font-semibold">✗ Źle!</p>
                  <p className="mt-1">Poprawna odpowiedź: {feedback.correctAnswer}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedOptionId && isLastQuestion && (
          <Button className="mt-4" onClick={onFinish}>
            Zakończ test
          </Button>
        )}
      </div>
    </div>
  )
}