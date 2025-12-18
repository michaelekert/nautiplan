import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { tests, getRandomQuestions } from "@/data/Study/tests"
import type { Test, Question } from "@/types/Study/study"

interface TestSelectionProps {
  onSelectTest: (test: Test, questions: Question[]) => void
}

export function TestSelection({ onSelectTest }: TestSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl justify-items-center">
        {tests.map((test, index) => {
          const isLastOdd = tests.length % 2 === 1 && index === tests.length - 1
          const isSample = test.id === "sample_test"

          return (
            <Card
              key={test.id}
              className={`flex flex-col justify-between transition hover:shadow-lg w-full max-w-sm min-h-[200px] ${
                isLastOdd ? "md:col-start-1 md:col-end-3 mb-20" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <CardDescription>{test.description}</CardDescription>

                {isSample && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {test.questions.length} pytań
                  </p>
                )}
              </CardHeader>

              <CardContent className="flex flex-col gap-2">
                {isSample ? (
                  <Button
                    className="cursor-pointer mt-2"
                    onClick={() => onSelectTest(test, test.questions.slice(0, 15))}
                  >
                    Rozpocznij
                  </Button>
                ) : (
                  <div className="flex gap-2 mt-2">
                    {[5, 10, 15].map((count) => (
                      <Button
                        key={count}
                        onClick={() => onSelectTest(test, getRandomQuestions(test.questions, count))}
                        className="cursor-pointer"
                      >
                        {count} pytań
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}