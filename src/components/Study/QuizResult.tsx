import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/Confetti"
import { AnimatedCircle } from "../Study/ui/AnimatedCircle"
import { formatTime } from "@/hooks/Study/useAccurateTimer"

interface QuizResultProps {
  score: number
  totalQuestions: number
  time: number
  onRestart: () => void
}

export function QuizResult({ score, totalQuestions, time, onRestart }: QuizResultProps) {
  const percentage = Math.round((score / totalQuestions) * 100)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 space-y-6">
      <h2 className="text-3xl font-bold">Twój wynik</h2>
      <AnimatedCircle percentage={percentage} />
      <p className="text-xl">Poprawne odpowiedzi: {score} / {totalQuestions}</p>
      <p className="text-lg">Czas rozwiązania: {formatTime(time)}</p>
      <Button onClick={onRestart}>Wróć do wyboru testu</Button>
      {percentage >= 80 && <Confetti />}
    </div>
  )
}